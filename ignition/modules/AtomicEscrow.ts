import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AtomicEscrowModule", (m) => {
  const atomicEscrow = m.contract("AtomicEscrow");

  return { atomicEscrow };
});
