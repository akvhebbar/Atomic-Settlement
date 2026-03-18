import { create } from "zustand";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export type TxStep =
  | "idle"
  | "initiating"
  | "locked"
  | "verifying"
  | "success"
  | "error";

interface AppState {
  txStep: TxStep;
  txId: string | null;
  setTxStep: (step: TxStep, id?: string) => void;
  resetTx: () => void;
}

export const useStore = create<AppState>((set) => ({
  txStep: "idle",
  txId: null,
  setTxStep: (step, id) =>
    set((state) => ({
      txStep: step,
      txId: id !== undefined ? id : state.txId,
    })),
  resetTx: () => set({ txStep: "idle", txId: null }),
}));

// Real wallet hooks using wagmi
export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = () => {
    connect({ connector: injected() });
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    isWalletConnected: isConnected,
    walletAddress: address,
    connectWallet,
    disconnectWallet,
  };
};
