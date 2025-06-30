require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const L1CallbackModule = buildModule("L1CallbackModule", (m) => {
    const callbackSender = process.env.DESTINATION_CALLBACK_PROXY_ADDR;
    if (!callbackSender) {
        throw new Error("Missing DESTINATION_CALLBACK_PROXY_ADDR in .env");
    }

    const callbackContract = m.contract("BasicDemoL1Callback", [callbackSender], {
        value: 20000000000000000n, // 0.02 ether
    });

    return { callbackContract };
});

module.exports = L1CallbackModule;
