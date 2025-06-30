require("dotenv").config({ override: true });
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const UniswapDemoTokensModule = buildModule("UniswapDemoTokensModule", (m) => {
    const token1 = m.contract("UniswapDemoToken", ["TK1", "TK1"], {
        id: "TokenTK1",
    });

    const token2 = m.contract("UniswapDemoToken", ["TK2", "TK2"], {
        id: "TokenTK2",
    });

    return { token1, token2 };
});

module.exports = UniswapDemoTokensModule;
