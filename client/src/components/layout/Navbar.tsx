import { Activity, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
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
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
