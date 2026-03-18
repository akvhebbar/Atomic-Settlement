import type { SimulationStatus } from "@shared/schema";
import mongoose, { Schema, Document } from "mongoose";

interface ISimulationDoc extends Document {
  status: SimulationStatus;
  updatedAt: Date;
}

const simulationSchema = new Schema<ISimulationDoc>({
  status: {
    type: String,
    enum: ["success", "error", "timeout", "pending"],
    default: "success",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Singleton pattern for simulation document
let SimulationModel: mongoose.Model<ISimulationDoc>;

async function getSimulationModel(): Promise<mongoose.Model<ISimulationDoc>> {
  if (!SimulationModel) {
    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState === 0) {
      const mongoUrl =
        process.env.MONGODB_URL ||
        "mongodb://localhost:27017/atomic-settlement";
      await mongoose.connect(mongoUrl);
      console.log("Connected to MongoDB");
    }

    SimulationModel = mongoose.model<ISimulationDoc>(
      "Simulation",
      simulationSchema,
    );
  }
  return SimulationModel;
}

export interface IStorage {
  getSimulationStatus(): Promise<SimulationStatus>;
  setSimulationStatus(status: SimulationStatus): Promise<SimulationStatus>;
}

export class MongoStorage implements IStorage {
  async getSimulationStatus(): Promise<SimulationStatus> {
    try {
      const Simulation = await getSimulationModel();

      // Get or create the simulation document (we'll use a fixed ID)
      let simulation = await Simulation.findOne();
      if (!simulation) {
        simulation = await Simulation.create({ status: "success" });
      }

      return simulation.status;
    } catch (error) {
      console.error("Error getting simulation status:", error);
      return "success"; // Default fallback
    }
  }

  async setSimulationStatus(
    status: SimulationStatus,
  ): Promise<SimulationStatus> {
    try {
      const Simulation = await getSimulationModel();

      // Update or create the simulation document
      const simulation = await Simulation.findOneAndUpdate(
        {}, // Empty filter to match any document
        { status, updatedAt: new Date() },
        { upsert: true, new: true },
      );

      return simulation.status;
    } catch (error) {
      console.error("Error setting simulation status:", error);
      throw error;
    }
  }
}

// Fallback to memory storage if MongoDB is not available
export class MemStorage implements IStorage {
  private status: SimulationStatus;

  constructor() {
    this.status = "success"; // Default simulation behavior
  }

  async getSimulationStatus(): Promise<SimulationStatus> {
    return this.status;
  }

  async setSimulationStatus(
    status: SimulationStatus,
  ): Promise<SimulationStatus> {
    this.status = status;
    return this.status;
  }
}

// Use MongoDB storage
export const storage = new MongoStorage();
