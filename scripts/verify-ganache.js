import { ethers } from "ethers";

async function verifyGanacheSetup() {
  console.log("🔍 Verifying Ganache setup...\n");

  try {
    // Connect to Ganache
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    console.log("✅ Connected to Ganache at http://127.0.0.1:7545");

    // Check network
    const network = await provider.getNetwork();
    console.log(`✅ Network: ${network.name} (Chain ID: ${network.chainId})`);

    // Check accounts
    const accounts = await provider.listAccounts();
    console.log(`✅ Found ${accounts.length} accounts`);

    // Check first account balance
    const balance = await provider.getBalance(accounts[0]);
    console.log(`✅ Account 0 balance: ${ethers.formatEther(balance)} ETH`);

    console.log("\n🎉 Ganache is running correctly!");
    console.log("You can now deploy contracts and use the application.\n");
  } catch (error) {
    console.error("❌ Error connecting to Ganache:");
    console.error(error.message);
    console.log("\n💡 Make sure Ganache is running on port 7545");
    console.log("   Run: npm run start-ganache\n");
    process.exit(1);
  }
}

verifyGanacheSetup();
