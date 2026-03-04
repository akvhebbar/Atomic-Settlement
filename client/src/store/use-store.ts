import { create } from 'zustand';

export type TxStep = 'idle' | 'initiating' | 'locked' | 'verifying' | 'success' | 'error';

interface AppState {
  isWalletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  
  txStep: TxStep;
  txId: string | null;
  setTxStep: (step: TxStep, id?: string) => void;
  resetTx: () => void;
}

// Generate a mock wallet address
const generateMockAddress = () => 
  `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

export const useStore = create<AppState>((set) => ({
  isWalletConnected: false,
  walletAddress: null,
  connectWallet: () => set({ isWalletConnected: true, walletAddress: generateMockAddress() }),
  disconnectWallet: () => set({ isWalletConnected: false, walletAddress: null, txStep: 'idle', txId: null }),
  
  txStep: 'idle',
  txId: null,
  setTxStep: (step, id) => set((state) => ({ 
    txStep: step, 
    txId: id !== undefined ? id : state.txId 
  })),
  resetTx: () => set({ txStep: 'idle', txId: null }),
}));
