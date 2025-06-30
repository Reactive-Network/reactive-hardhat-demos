const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const L1OriginModule = buildModule("L1OriginModule", (m) => {
    const originContract = m.contract("BasicDemoL1Contract");
    return { originContract };
});

module.exports = L1OriginModule;
