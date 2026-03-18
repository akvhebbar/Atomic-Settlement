const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get the signer from Hardhat
  const [signer] = await hre.ethers.getSigners();

  console.log("Connected to network");

  // We need to load the contract factory differently since we don't have hre
  // Let's use the compiled bytecode and ABI from artifacts
  const fs = await import("fs");
  const path = await import("path");

  const artifactPath = path.join(
    process.cwd(),
    "artifacts",
    "contracts",
    "AtomicEscrow.sol",
    "AtomicEscrow.json",
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new hre.ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    signer,
  );
  console.log("Got contract factory");

  const escrow = await factory.deploy();
  console.log("Deploying...");

  await escrow.waitForDeployment();
  const address = await escrow.getAddress();
  console.log("AtomicEscrow deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
