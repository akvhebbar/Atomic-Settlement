import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { ethers } from "ethers";

// Contract configuration
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local Hardhat address
const ATOMIC_ESCROW_ABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_transactionId",
        type: "bytes32",
      },
    ],
    name: "finalizeTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_transactionId",
        type: "bytes32",
      },
    ],
    name: "refundUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Real contract interaction using ethers
const getContract = () => {
  // Connect to local Hardhat network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  // Use a signer (in production, this would be a relayer or oracle wallet)
  const signer = new ethers.Wallet(
    process.env.PRIVATE_KEY ||
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider,
  );
  return new ethers.Contract(CONTRACT_ADDRESS, ATOMIC_ESCROW_ABI, signer);
};

const executeContractCall = async (
  functionName: string,
  transactionId: string,
) => {
  try {
    const contract = getContract();
    console.log(`Executing ${functionName} for transaction ${transactionId}`);

    let tx;
    if (functionName === "finalizeTransaction") {
      tx = await contract.finalizeTransaction(transactionId);
    } else if (functionName === "refundUser") {
      tx = await contract.refundUser(transactionId);
    } else {
      throw new Error("Unknown function");
    }

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log(`${functionName} executed successfully. Hash: ${receipt.hash}`);

    return { hash: receipt.hash };
  } catch (error) {
    console.error(`Contract ${functionName} error:`, error);
    throw error;
  }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Update the simulation state (triggered by the Right Column controls)
  app.post(api.simulation.setStatus.path, async (req, res) => {
    try {
      const input = api.simulation.setStatus.input.parse(req.body);
      const newStatus = await storage.setSimulationStatus(input.status);
      res.json({ success: true, status: newStatus });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Verification endpoint representing the Oracle/Backend confirmation
  app.post(api.simulation.verify.path, async (req, res) => {
    try {
      const input = api.simulation.verify.input.parse(req.body);
      const currentStatus = await storage.getSimulationStatus();

      // Simulate a small network delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (currentStatus === "success") {
        // Real contract call: finalizeTransaction
        try {
          if (!input.transactionId) {
            return res
              .status(400)
              .json({ message: "Transaction ID is required" });
          }
          const result = await executeContractCall(
            "finalizeTransaction",
            input.transactionId,
          );
          return res.json({
            status: "success",
            message: "Service Confirmed. Funds Released.",
            txHash: result.hash,
          });
        } catch (error) {
          console.error("Contract finalize error:", error);
          return res.status(500).json({ message: "Contract execution failed" });
        }
      } else if (currentStatus === "error") {
        // Real contract call: refundUser
        try {
          if (!input.transactionId) {
            return res
              .status(400)
              .json({ message: "Transaction ID is required" });
          }
          const result = await executeContractCall(
            "refundUser",
            input.transactionId,
          );
          return res.status(500).json({
            message: "Timeout/Error Detected. Instant Refund Executed.",
            txHash: result.hash,
          });
        } catch (error) {
          console.error("Contract refund error:", error);
          return res.status(500).json({ message: "Contract execution failed" });
        }
      } else if (currentStatus === "timeout") {
        // Simulate a timeout that takes a long time and then fails/refunds
        await new Promise((resolve) => setTimeout(resolve, 3000));
        try {
          if (!input.transactionId) {
            return res
              .status(400)
              .json({ message: "Transaction ID is required" });
          }
          const result = await executeContractCall(
            "refundUser",
            input.transactionId,
          );
          return res.status(500).json({
            message: "Timeout/Error Detected. Instant Refund Executed.",
            txHash: result.hash,
          });
        } catch (error) {
          console.error("Contract refund error:", error);
          return res.status(500).json({ message: "Contract execution failed" });
        }
      }

      // Default success case
      try {
        if (!input.transactionId) {
          return res
            .status(400)
            .json({ message: "Transaction ID is required" });
        }
        const result = await executeContractCall(
          "finalizeTransaction",
          input.transactionId,
        );
        res.json({
          status: "success",
          message: "Service Confirmed.",
          txHash: result.hash,
        });
      } catch (error) {
        console.error("Contract finalize error:", error);
        return res.status(500).json({ message: "Contract execution failed" });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
