import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type SimulationStatus, type VerifyRequest } from "@shared/schema";
import { toast } from "sonner";
import { z } from "zod";

export function useSetSimulationStatus() {
  return useMutation({
    mutationFn: async (status: SimulationStatus) => {
      const res = await fetch(api.simulation.setStatus.path, {
        method: api.simulation.setStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to set simulation status");
      }
      
      return api.simulation.setStatus.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      toast.success(`Simulation mode set to: ${data.status.toUpperCase()}`);
    },
    onError: () => {
      toast.error("Failed to update simulation configuration");
    }
  });
}

export function useVerifyTransaction() {
  return useMutation({
    mutationFn: async (data: VerifyRequest) => {
      const res = await fetch(api.simulation.verify.path, {
        method: api.simulation.verify.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        let errorMsg = "Verification failed";
        try {
          const errData = await res.json();
          errorMsg = errData.message || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      
      return api.simulation.verify.responses[200].parse(await res.json());
    }
  });
}
