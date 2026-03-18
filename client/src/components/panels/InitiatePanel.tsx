import { formatEther } from "viem";
import { useStore } from "@/store/use-store";
import { useWallet } from "@/store/use-store";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useVerifyTransaction } from "@/hooks/use-simulation";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import {
  ATOMIC_ESCROW_ABI,
  CONTRACT_ADDRESS,
  MERCHANT_ADDRESS,
  PAYMENT_AMOUNT,
} from "@/lib/contract";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function InitiatePanel() {
  const { txStep, setTxStep } = useStore();
  const { isWalletConnected, walletAddress } = useWallet();
  const verifyMutation = useVerifyTransaction();

  // Balance display
  const { data: balance } = useBalance({
    address: walletAddress,
  });

  // Real contract interaction
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const isBusy =
    txStep !== "idle" && txStep !== "success" && txStep !== "error";

  const handlePayment = async () => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Step 1: Initiating - Write to contract
      setTxStep("initiating");
      toast.info("Broadcasting transaction to network...");

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ATOMIC_ESCROW_ABI,
        functionName: "depositFunds",
        args: [
          MERCHANT_ADDRESS,
          `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        ],
        value: PAYMENT_AMOUNT,
      });

      // Wait for transaction to be confirmed
      if (isPending) {
        toast.info("Waiting for transaction confirmation...");
      }

      if (isConfirmed) {
        // Step 2: Locked
        setTxStep("locked");
        toast.success("Funds securely locked in Escrow Contract");

        // Generate transaction ID from hash
        const transactionId =
          hash ||
          `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

        await new Promise((r) => setTimeout(r, 1200));

        // Step 3: Verifying (Oracle)
        setTxStep("verifying");

        try {
          // Step 4: Resolution via API
          const result = await verifyMutation.mutateAsync({ transactionId });

          if (result.status === "success") {
            setTxStep("success");
            toast.success("Settlement verified and executed!");
          } else {
            setTxStep("error");
            toast.error(`Verification failed: ${result.message}`);
          }
        } catch (error: any) {
          setTxStep("error");
          toast.error(error.message || "An unexpected error occurred");
        }
      }
    } catch (error: any) {
      setTxStep("error");
      toast.error(error.message || "Transaction failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel p-6 lg:p-8 rounded-3xl relative overflow-hidden flex flex-col h-full"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Initiate Contract
        </h2>

        <div className="space-y-6 flex-1">
          {/* Amount Box */}
          <div className="bg-background/50 rounded-2xl p-5 border border-white/5">
            <div className="text-sm text-muted-foreground mb-2">
              Amount to Lock
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-mono font-bold text-white">
                0.05
              </span>
              <span className="text-primary font-bold mb-1">ETH</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2 font-mono">
              ≈ $34.52 USD
            </div>
          </div>

          {/* Wallet Balance */}
          {isWalletConnected && balance && (
            <div className="bg-background/50 rounded-2xl p-5 border border-white/5">
              <div className="text-sm text-muted-foreground mb-2">
                Wallet Balance
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-mono font-bold text-white">
                  {balance
                    ? parseFloat(formatEther(balance.value)).toFixed(4)
                    : "0.0000"}
                </span>
                <span className="text-primary font-bold mb-1">ETH</span>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network</span>
              <span className="font-mono text-white flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                Hardhat Local
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Escrow Type</span>
              <span className="text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Atomic Trustless
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Est. Gas</span>
              <span className="font-mono text-white">0.0012 ETH</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 mt-auto">
          {!isWalletConnected ? (
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-primary text-primary-foreground hover:glow-primary hover:-translate-y-1 active:translate-y-0"
                          >
                            <Wallet className="w-5 h-5" />
                            CONNECT WALLET
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-destructive text-destructive-foreground"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div className="flex gap-2">
                          <button
                            onClick={openChainModal}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-sm"
                            type="button"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: "hidden",
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-sm"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ""}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          ) : (
            <button
              onClick={handlePayment}
              disabled={isBusy}
              className={`
                w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
                ${
                  isBusy
                    ? "bg-muted text-muted-foreground cursor-not-allowed border border-white/5"
                    : "bg-primary text-primary-foreground hover:glow-primary hover:-translate-y-1 active:translate-y-0"
                }
              `}
            >
              {isBusy ? (
                <span className="animate-pulse flex items-center gap-2">
                  Processing <span className="font-mono">...</span>
                </span>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  PAY 0.05 ETH & LOCK FUNDS
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
