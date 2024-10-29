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

  // Mint MockPYUSD to deployer for testing (e.g., 1000 tokens)
  const mintAmount = 1000 * 10 ** 6; // Equivalent to 1000.000000 PYUSD
  await mockPYUSD.mint(deployer.address, mintAmount);
  console.log(`Minted ${mintAmount.toString()} MockPYUSD to deployer account`);

  // Approve HelloPYUSD to spend deployer's MockPYUSD tokens
  const approveTx = await mockPYUSD.approve(helloPYUSD.target, MINT_PRICE);
  await approveTx.wait();
  console.log(
    `Approved HelloPYUSD to spend ${MINT_PRICE.toString()} MockPYUSD`
  );

  // Mint NFT by calling HelloPYUSD's mint function
  const mintTx = await helloPYUSD.mint("https://example.com/nft-metadata");
  await mintTx.wait();
  console.log("Minted NFT with HelloPYUSD");

  // Verify balances after minting
  const deployerMockPYUSDBalance = await mockPYUSD.balanceOf(deployer.address);
  console.log(
    "Deployer's MockPYUSD balance after minting:",
    deployerMockPYUSDBalance.toString()
  );

  const contractMockPYUSDBalance = await mockPYUSD.balanceOf(helloPYUSD.target);
  console.log(
    "HelloPYUSD contract's MockPYUSD balance after minting:",
    contractMockPYUSDBalance.toString()
  );

  const nftBalance = await helloPYUSD.balanceOf(deployer.address);
  console.log("Deployer's NFT balance after minting:", nftBalance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
// MockPYUSD deployed to: 0xE3cfc35657847542FFa634eECDE25586ECF0FB74
// HelloPYUSD deployed to: 0x9c252EB3103E7c0d560E83224E78FaAd5177b11c
// Minted 1000000000 MockPYUSD to deployer account
// Approved HelloPYUSD to spend 100000000 MockPYUSD
// Minted NFT with HelloPYUSD
// Deployer's MockPYUSD balance after minting: 900000000
// HelloPYUSD contract's MockPYUSD balance after minting: 100000000
// Deployer's NFT balance after minting: 1
