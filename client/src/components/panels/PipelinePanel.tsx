import { useStore, type TxStep } from "@/store/use-store";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, CircleDashed, Cpu, Database, Fingerprint, Lock, XCircle } from "lucide-react";

const steps = [
  { id: 'initiating', title: 'Payment Initiated', icon: Fingerprint, desc: 'Signing transaction' },
  { id: 'locked', title: 'Funds Locked', icon: Lock, desc: 'Smart contract escrow' },
  { id: 'verifying', title: 'Oracle Verification', icon: Cpu, desc: 'Awaiting off-chain event' },
];

export function PipelinePanel() {
  const { txStep, txId } = useStore();

  const getStepStatus = (stepId: string, currentIndex: number, targetId: string) => {
    const stepOrder = ['idle', 'initiating', 'locked', 'verifying', 'success', 'error'];
    const currentOrder = stepOrder.indexOf(txStep);
    
    // Normalize target for comparison (treat error/success as past everything)
    const targetOrder = stepOrder.indexOf(targetId);
    
    if (currentOrder > targetOrder) return 'complete';
    if (currentOrder === targetOrder) return 'active';
    if (txStep === 'success' || txStep === 'error') return 'complete'; // if terminal state, all steps are done (except maybe the last one failed)
    return 'pending';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel p-6 lg:p-8 rounded-3xl relative border-primary/20 bg-card/80 flex flex-col h-[500px] lg:h-auto"
    >
      {/* Scanning laser line effect when active */}
      <AnimatePresence>
        {txStep !== 'idle' && txStep !== 'success' && txStep !== 'error' && (
          <motion.div
            initial={{ top: 0, opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-primary/50 glow-primary z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Live Pipeline
        </h2>

        <div className="flex-1 flex flex-col justify-center gap-6 lg:gap-8 px-2">
          {steps.map((step, idx) => {
            const status = getStepStatus(txStep, idx, step.id);
            const isActive = status === 'active';
            const isComplete = status === 'complete' || (txStep === 'success') || (txStep === 'error' && idx < 2);
            const isFailed = txStep === 'error' && idx === 2;

            const Icon = isComplete && !isFailed ? CheckCircle2 : (isFailed ? XCircle : step.icon);

            return (
              <div key={step.id} className="relative">
                {/* Connector Line */}
                {idx !== steps.length - 1 && (
                  <div className={`absolute left-6 top-14 bottom-[-1.5rem] w-[2px] transition-colors duration-500 ${
                    isComplete ? 'bg-primary shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'bg-white/10'
                  }`} />
                )}

                <div className={`flex items-start gap-4 transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-105' : isComplete ? 'opacity-80' : 'opacity-30'
                }`}>
                  {/* Icon Container */}
                  <div className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background z-10 transition-all duration-500
                    ${isActive ? 'border-primary text-primary glow-primary' : ''}
                    ${isComplete && !isFailed ? 'border-success text-success glow-success' : ''}
                    ${isFailed ? 'border-destructive text-destructive glow-destructive' : ''}
                    ${!isActive && !isComplete && !isFailed ? 'border-white/20 text-white/50' : ''}
                  `}>
                    <Icon className="w-5 h-5" />
                    
                    {/* Radar animation for verification step */}
                    {isActive && step.id === 'verifying' && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-primary animate-radar"></div>
                        <div className="absolute inset-0 rounded-full border border-primary/50 animate-radar" style={{ animationDelay: '1s' }}></div>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-2 flex-1">
                    <h3 className={`font-bold tracking-wide ${isActive ? 'text-primary' : isComplete ? (isFailed ? 'text-destructive' : 'text-success') : 'text-white'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    
                    {/* Progress / Details injection */}
                    <AnimatePresence>
                      {isActive && step.id === 'verifying' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 bg-black/50 rounded-lg p-3 border border-primary/20 font-mono text-xs text-primary"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            Polling Node Matrix...
                          </div>
                          <div className="text-white/40 truncate">Tx: {txId}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Terminal State Result */}
        <AnimatePresence>
          {(txStep === 'success' || txStep === 'error') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`
                mt-6 p-4 rounded-xl border flex items-center justify-between
                ${txStep === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-destructive/10 border-destructive/30 text-destructive'}
              `}
            >
              <div className="flex items-center gap-3">
                {txStep === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                <span className="font-bold">
                  {txStep === 'success' ? 'SETTLEMENT COMPLETE' : 'VERIFICATION FAILED'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
