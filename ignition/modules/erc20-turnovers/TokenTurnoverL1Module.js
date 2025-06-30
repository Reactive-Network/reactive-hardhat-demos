require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenTurnoverL1Module = buildModule("TokenTurnoverL1Module", (m) => {
    const callbackSender = process.env.DESTINATION_CALLBACK_PROXY_ADDR;

    if (!callbackSender) {
        throw new Error("Missing DESTINATION_CALLBACK_PROXY_ADDR in .env file");
    }

    const turnoverContract = m.contract("TokenTurnoverL1", [callbackSender], {
        value: 10000000000000000n, // 0.01 ether
    });

    return { turnoverContract };
});

module.exports = TokenTurnoverL1Module;