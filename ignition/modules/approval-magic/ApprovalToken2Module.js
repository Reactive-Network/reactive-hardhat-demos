const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ApprovalToken2Module", (m) => {
    const token2 = m.contract("ApprovalDemoToken", ["TK2", "TK2"], { id: "ApprovalDemoToken2" });
    return { token2 };
});
