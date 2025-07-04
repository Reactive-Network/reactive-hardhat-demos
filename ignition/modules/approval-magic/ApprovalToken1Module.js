const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ApprovalToken1Module", (m) => {
    const token1 = m.contract("ApprovalDemoToken", ["TK1", "TK1"], { id: "ApprovalDemoToken1" });
    return { token1 };
});
