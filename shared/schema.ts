import { z } from "zod";

export const simulationStatusSchema = z.enum(["success", "error", "timeout", "pending"]);
export type SimulationStatus = z.infer<typeof simulationStatusSchema>;

export const verifyRequestSchema = z.object({
  transactionId: z.string().optional(),
});
export type VerifyRequest = z.infer<typeof verifyRequestSchema>;
