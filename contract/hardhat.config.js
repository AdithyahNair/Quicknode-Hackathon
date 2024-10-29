require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    skale: {
      url: "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet",
      accounts: [
        "70da3ff3da418eee005a376ea30fe469fb5e78b7c36b35a24f369b3adbfdc61c",
      ],
    },
  },
};
