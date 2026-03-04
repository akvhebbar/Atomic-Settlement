import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
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
      const currentStatus = await storage.getSimulationStatus();

      // Simulate a small network delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (currentStatus === "success") {
        return res.json({ status: "success", message: "Service Confirmed. Funds Released." });
      } else if (currentStatus === "error") {
        return res.status(500).json({ message: "Timeout/Error Detected. Instant Refund Executed." });
      } else if (currentStatus === "timeout") {
        // Simulate a timeout that takes a long time and then fails
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return res.status(500).json({ message: "Timeout/Error Detected. Instant Refund Executed." });
      }

      res.json({ status: "success", message: "Service Confirmed." });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
