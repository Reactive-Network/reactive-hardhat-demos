const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UniswapToken1Module", (m) => {
    const token1 = m.contract("UniswapDemoToken", ["TK1", "TK1"], { id: "TokenTK1" });
    return { token1 };
});
