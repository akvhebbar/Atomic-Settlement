import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// Simple deployment script using compiled artifact
async function main() {
  console.log("🚀 Deploying AtomicEscrow contract to Ganache...");

  try {
    // Load artifact
    const artifactPath = path.join(
      process.cwd(),
      "artifacts",
      "contracts",
      "AtomicEscrow.sol",
      "AtomicEscrow.json",
    );
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    // Connect to Ganache
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    const signer = await provider.getSigner();

    const deployerAddress = await signer.getAddress();
    console.log("📤 Deploying from account:", deployerAddress);

    // Check balance
    const balance = await provider.getBalance(deployerAddress);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

    // Deploy contract using artifact
    console.log("⚙️  Deploying contract...");
    const AtomicEscrow = new ethers.ContractFactory(
      artifact.abi,
      artifact.bytecode,
      signer,
    );

    const contract = await AtomicEscrow.deploy();
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract address:", contractAddress);

    console.log("\n📋 Next steps:");
    console.log(
      "1. Update CONTRACT_ADDRESS in client/src/lib/contract.ts with:",
      contractAddress,
    );
    console.log("2. Start your app with: npm run dev");
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main();
