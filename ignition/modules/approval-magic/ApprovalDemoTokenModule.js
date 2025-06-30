const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ApprovalDemoTokenModule = buildModule("ApprovalDemoTokenModule", (m) => {
    const token = m.contract("ApprovalDemoToken", ["FTW", "FTW"]);

    return { token };
});

module.exports = ApprovalDemoTokenModule;
