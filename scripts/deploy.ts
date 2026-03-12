import hre from "hardhat";

// This script must live in the `scripts/` folder so that Hardhat's
// ts-node registration processes it and loads the plugins (including
// hardhat-ethers/viem). Running `npx hardhat run scripts/deploy.ts`
// will therefore provide a working `hre.ethers` object.

async function main() {
  console.log("Starting deployment...");
  console.log("hre keys:", Object.keys(hre));
  console.log("hre.network:", hre.network);
  console.log("hre.network.ethers:", hre.network.ethers);

  const connection = await hre.network.connect();
  console.log("connection keys:", Object.keys(connection));
  console.log("connection.provider:", connection.provider ? true : false);
  console.log("connection.ethers:", connection.ethers);

  const ethers = connection.ethers || require("ethers");
  console.log("using ethers:", ethers ? true : false);

  // compile is run automatically prior to execution but we can
  // optionally print the solidity version
  if (ethers && connection.provider) {
    const provider = ethers.providers
      ? new ethers.providers.Web3Provider(connection.provider)
      : null;
    if (provider) {
      console.log("network id:", (await provider.getNetwork()).chainId);
    }
  }

  const AtomicEscrow = await ethers.getContractFactory("AtomicEscrow");
  const escrow = await AtomicEscrow.deploy();
  await escrow.waitForDeployment();
  const address = await escrow.getAddress();
  console.log("AtomicEscrow deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
