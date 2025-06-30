require("dotenv").config({ override: true });
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ApprovalTokensModule = buildModule("ApprovalTokensModule", (m) => {
    const token1 = m.contract("ApprovalDemoToken", ["TK1", "TK1"], { id: "ApprovalDemoToken1" });
    const token2 = m.contract("ApprovalDemoToken", ["TK2", "TK2"], { id: "ApprovalDemoToken2" });

    return { token1, token2 };
});

module.exports = ApprovalTokensModule;
