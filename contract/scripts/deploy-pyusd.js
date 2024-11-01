const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Define the mint price (example: 100 PYUSD with 6 decimals)
  const MINT_PRICE = 100 * 10 ** 6; // 100.000000 PYUSD

  // Deploy MockPYUSD contract
  const MockPYUSD = await ethers.getContractFactory("MockPYUSD");
  const mockPYUSD = await MockPYUSD.deploy();
  console.log("MockPYUSD deployed to:", mockPYUSD.target);

  // Deploy HelloPYUSD contract with MockPYUSD address and mint price
  const HelloPYUSD = await ethers.getContractFactory("HelloPYUSD");
  const helloPYUSD = await HelloPYUSD.deploy(mockPYUSD.target, MINT_PRICE);
  console.log("HelloPYUSD deployed to:", helloPYUSD.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// ❯ npx hardhat run ./scripts/deploy-pyusd.js --network skale
// Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
// MockPYUSD deployed to: 0x943005462B9FE506EAb2e01d6023448c1C103814
// HelloPYUSD deployed to: 0xfa87F29f47B8372B961994BFA44F18ba4E764645
