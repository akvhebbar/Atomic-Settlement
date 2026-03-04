import { useSetSimulationStatus } from "@/hooks/use-simulation";
import { useStore } from "@/store/use-store";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Settings2 } from "lucide-react";
import { useState } from "react";
import type { SimulationStatus } from "@shared/schema";

export function SimulationPanel() {
  const { resetTx, txStep } = useStore();
  const simMutation = useSetSimulationStatus();
  const [activeSim, setActiveSim] = useState<SimulationStatus>('success');

  const handleSetSim = (status: SimulationStatus) => {
    setActiveSim(status);
    simMutation.mutate(status);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col h-full"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        Developer Control
      </h2>

      <div className="flex-1 space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Control the backend oracle response to test different settlement paths.
        </p>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Oracle Response</div>
          
          <button
            onClick={() => handleSetSim('success')}
            className={`
              w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300
              ${activeSim === 'success' 
                ? 'bg-success/10 border-success text-success glow-success' 
                : 'bg-background/50 border-white/5 text-white/70 hover:border-white/20'}
            `}
          >
            <span className="font-bold">Simulate Success</span>
            <div className={`w-3 h-3 rounded-full ${activeSim === 'success' ? 'bg-success shadow-[0_0_10px_#00FF66]' : 'bg-white/20'}`} />
          </button>

          <button
            onClick={() => handleSetSim('error')}
            className={`
              w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300
              ${activeSim === 'error' 
                ? 'bg-destructive/10 border-destructive text-destructive glow-destructive' 
                : 'bg-background/50 border-white/5 text-white/70 hover:border-white/20'}
            `}
          >
            <span className="font-bold">Simulate Failure</span>
            <div className={`w-3 h-3 rounded-full ${activeSim === 'error' ? 'bg-destructive shadow-[0_0_10px_#FF003C]' : 'bg-white/20'}`} />
          </button>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex gap-3 text-sm mt-8">
          <AlertCircle className="w-5 h-5 text-primary shrink-0" />
          <p className="text-primary/80">
            In a production environment, this outcome is determined by decentralized consensus across multiple independent nodes.
          </p>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <button
          onClick={resetTx}
          disabled={txStep === 'idle'}
          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-secondary text-white hover:bg-secondary/80 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" />
          RESET PIPELINE
        </button>
      </div>
    </motion.div>
  );
}
