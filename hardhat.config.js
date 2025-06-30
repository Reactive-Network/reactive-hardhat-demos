require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require('dotenv').config({ override: true });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.DESTINATION_RPC,
      accounts: [process.env.DESTINATION_PRIVATE_KEY],
      chainId: parseInt(process.env.DESTINATION_CHAIN_ID)
    },
    reactive: {
      url: process.env.REACTIVE_RPC,
      accounts: [process.env.REACTIVE_PRIVATE_KEY],
      chainId: parseInt(process.env.REACTIVE_CHAIN_ID)
    }
  }
};
