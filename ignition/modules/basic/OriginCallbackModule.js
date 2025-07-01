require("dotenv").config({ override: true });
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const OriginCallbackModule = buildModule("OriginCallbackModule", (m) => {
    const callbackSender = process.env.DESTINATION_CALLBACK_PROXY_ADDR;

    if (!callbackSender) {
        throw new Error("❌ DESTINATION_CALLBACK_PROXY_ADDR is missing in .env");
    }

    const originContract = m.contract("BasicDemoL1Contract");

    const callbackContract = m.contract("BasicDemoL1Callback", [callbackSender], {
        value: 20n * 10n ** 15n, // 0.02 ETH
    });

    return { originContract, callbackContract };
});

module.exports = OriginCallbackModule;
