import { ethers } from "ethers";

async function main() {
  console.log("Deploying AtomicEscrow contract...");

  // Connect to Ganache (will use default account 0)
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const signer = await provider.getSigner();

  console.log("Deploying with account:", await signer.getAddress());

  // Get contract factory
  const AtomicEscrow = await ethers.getContractFactory("AtomicEscrow", signer);

  // Deploy contract
  const atomicEscrow = await AtomicEscrow.deploy();
  await atomicEscrow.waitForDeployment();

  const contractAddress = await atomicEscrow.getAddress();
  console.log("AtomicEscrow deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    network: "ganache",
    contractAddress,
    deployer: await signer.getAddress(),
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment completed!");
  console.log(
    "Update CONTRACT_ADDRESS in client/src/lib/contract.ts with:",
    contractAddress,
  );
  console.log(
    "Update MERCHANT_ADDRESS with a Ganache account address if needed",
  );
}
