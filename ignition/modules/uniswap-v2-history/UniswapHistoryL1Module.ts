require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const UniswapHistoryL1Module = buildModule("UniswapHistoryL1Module", (m) => {
    const callbackSender = process.env.DESTINATION_CALLBACK_PROXY_ADDR;

    if (!callbackSender) {
        throw new Error("Missing DESTINATION_CALLBACK_PROXY_ADDR in .env file");
    }

    const contract = m.contract("UniswapHistoryDemoL1", [callbackSender], {
        value: 20000000000000000n, // 0.02 ether
    });

    return { contract };
});

module.exports = UniswapHistoryL1Module;
