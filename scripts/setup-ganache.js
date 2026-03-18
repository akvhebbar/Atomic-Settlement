#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Setting up Atomic Settlement Project with Ganache...\n");

// Check if Ganache CLI is installed
try {
  execSync("ganache --version", { stdio: "pipe" });
  console.log("✅ Ganache CLI is installed");
} catch (error) {
  console.log("❌ Ganache CLI not found. Installing globally...");
  execSync("npm install -g ganache", { stdio: "inherit" });
  console.log("✅ Ganache CLI installed");
}

// Check if dependencies are installed
if (!fs.existsSync("node_modules")) {
  console.log("📦 Installing dependencies...");
  execSync("npm install", { stdio: "inherit" });
  console.log("✅ Dependencies installed");
}

// Check MongoDB setup (optional for basic functionality)
console.log("ℹ️  Note: Make sure MongoDB is running for full functionality");
console.log("   Windows: Start MongoDB service or run mongod");
console.log("   Or use MongoDB Atlas for cloud database\n");

console.log("🎯 Setup complete! Next steps:");
console.log("1. Start Ganache: ./scripts/start-ganache.bat");
console.log(
  "2. Deploy contracts: npx hardhat run scripts/deploy.ts --network ganache",
);
console.log("3. Update CONTRACT_ADDRESS in client/src/lib/contract.ts");
console.log("4. Configure MetaMask to connect to Ganache (localhost:7545)");
console.log("5. Start the app: npm run dev\n");

console.log("📋 Ganache Default Accounts:");
console.log(
  "Account 0: 0xc87509a1c067bbde78beb793e6fa76530b6382a4c059091344dd1ae10a3f3e2f5",
);
console.log("Account 1: 0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b (Merchant)");
console.log("Each account has 100 ETH for testing\n");
