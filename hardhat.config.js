require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    lasna: {
      url: "https://lasna-rpc.rnk.dev/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5318007
    }
  }
};
