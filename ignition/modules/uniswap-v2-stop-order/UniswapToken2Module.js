const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UniswapToken2Module", (m) => {
    const token2 = m.contract("UniswapDemoToken", ["TK2", "TK2"], { id: "TokenTK2" });
    return { token2 };
});
