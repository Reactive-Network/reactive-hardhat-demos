const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const OriginCallbackModule = buildModule("OriginCallbackModule", (m) => {
    const callbackSender = "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA";

    const originContract = m.contract("BasicDemoL1Contract");
    const callbackContract = m.contract("BasicDemoL1Callback", [callbackSender], {
        value: 20000000000000000n, // 0.02 ETH
    });

    return { originContract, callbackContract };
});

module.exports = OriginCallbackModule;
