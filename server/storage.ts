import type { SimulationStatus } from "@shared/schema";

export interface IStorage {
  getSimulationStatus(): Promise<SimulationStatus>;
  setSimulationStatus(status: SimulationStatus): Promise<SimulationStatus>;
}

export class MemStorage implements IStorage {
  private status: SimulationStatus;

  constructor() {
    this.status = "success"; // Default simulation behavior
  }

  async getSimulationStatus(): Promise<SimulationStatus> {
    return this.status;
  }

  async setSimulationStatus(status: SimulationStatus): Promise<SimulationStatus> {
    this.status = status;
    return this.status;
  }
}

export const storage = new MemStorage();
