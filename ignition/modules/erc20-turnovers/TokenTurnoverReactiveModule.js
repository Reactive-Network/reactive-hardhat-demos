require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenTurnoverReactiveModule = buildModule("TokenTurnoverReactiveModule", (m) => {
    const l1Address = process.env.TURNOVER_L1_ADDR;

    if (!l1Address) {
        throw new Error("TURNOVER_L1_ADDR is not set in .env file");
    }

    const reactive = m.contract("TokenTurnoverReactive", [l1Address], {
        value: 1000000000000000000n, // 1 ether
    });

    return { reactive };
});

module.exports = TokenTurnoverReactiveModule;
