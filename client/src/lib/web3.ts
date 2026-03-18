import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";

// Define Ganache chain
const ganache = {
  id: 1337,
  name: "Ganache",
  network: "ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:7545"] },
  },
  blockExplorers: {
    default: { name: "Ganache", url: "http://127.0.0.1:7545" },
  },
} as const;

export const config = getDefaultConfig({
  appName: "Atomic Settlement",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "your-project-id",
  chains: [sepolia, hardhat, ganache],
  ssr: false,
});
