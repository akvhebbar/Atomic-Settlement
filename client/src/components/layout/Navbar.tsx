import { Activity, Wallet } from "lucide-react";
import { useStore } from "@/store/use-store";
import { motion } from "framer-motion";

export function Navbar() {
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet } = useStore();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-t-0 border-x-0 !rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/30">
              <Activity className="w-5 h-5 text-primary text-glow" />
              <div className="absolute inset-0 rounded-xl glow-primary opacity-50"></div>
            </div>
            <span className="font-display font-bold text-2xl tracking-wider text-foreground">
              ATOMIC<span className="text-primary">VERIFY</span>
            </span>
          </div>

          {/* Wallet Connection */}
          <div>
            {isWalletConnected ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={disconnectWallet}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-primary/30 text-primary-foreground font-mono text-sm hover:bg-secondary/80 transition-all duration-300"
              >
                <div className="w-2 h-2 rounded-full bg-success glow-success animate-pulse"></div>
                <span className="text-primary font-medium">{walletAddress ? formatAddress(walletAddress) : ''}</span>
              </motion.button>
            ) : (
              <button
                onClick={connectWallet}
                className="group relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 glow-primary"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <Wallet className="w-4 h-4 relative z-10" />
                <span className="relative z-10 uppercase tracking-wider text-sm">Connect Wallet</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
