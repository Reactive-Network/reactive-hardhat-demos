require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const UniswapHistoryDemoReactiveModule = buildModule("UniswapHistoryDemoReactiveModule", (m) => {
    const l1Address = process.env.UNISWAP_L1_ADDR;

    if (!l1Address) {
        throw new Error("Missing UNISWAP_L1_ADDR in .env file");
    }

    const reactiveContract = m.contract("UniswapHistoryDemoReactive", [l1Address], {
        value: 1000000000000000000n, // 1 ether
    });

    return { reactiveContract };
});

module.exports = UniswapHistoryDemoReactiveModule;
