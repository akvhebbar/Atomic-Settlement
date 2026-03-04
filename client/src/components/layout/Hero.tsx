import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function Hero() {
  return (
    <div className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 font-mono text-xs uppercase tracking-widest">
          <Zap className="w-3 h-3" />
          <span>Next-Gen Settlement Infrastructure</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 leading-tight">
          Experience Real-Time <br />
          <span className="text-primary text-glow font-extrabold">Atomic Settlement.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Eliminating the 14-day reconciliation lag. Our trustless oracle network verifies off-chain events instantly and executes smart contracts with mathematical certainty.
        </p>
      </motion.div>
    </div>
  );
}
