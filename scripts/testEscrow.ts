import hre from "hardhat";
import assert from "node:assert/strict";

async function main() {
  const { ethers } = hre;
  const [owner, user, merchant] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("AtomicEscrow", owner);
  const escrow = await Factory.deploy();
  await escrow.deployed();
  console.log("AtomicEscrow deployed at", escrow.address);

  const amount = ethers.utils.parseEther("1");
  const txId = ethers.utils.formatBytes32String("tx1");

  // deposit and finalize
  await escrow
    .connect(user)
    .depositFunds(merchant.address, txId, { value: amount });
  await escrow.connect(owner).finalizeTransaction(txId);
  const tx = await escrow.transactions(txId);
  assert.equal(tx.status, 1, "status should be COMPLETED");
  const bal = await ethers.provider.getBalance(merchant.address);
  assert.equal(
    bal.toString(),
    amount.toString(),
    "merchant should receive funds",
  );
  console.log("✔ finalize test passed");

  // deposit and refund (timeout path)
  const txId2 = ethers.utils.formatBytes32String("tx2");
  await escrow
    .connect(user)
    .depositFunds(merchant.address, txId2, { value: amount });
  await ethers.provider.send("evm_increaseTime", [61]);
  await ethers.provider.send("evm_mine", []);
  await escrow.connect(user).refundUser(txId2);
  const tx2 = await escrow.transactions(txId2);
  assert.equal(tx2.status, 2, "status should be REFUNDED");
  console.log("✔ refund test passed");
}

main().catch((err) => {
  console.error("test failed", err);
  process.exitCode = 1;
});
