require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const StopOrderReactiveModule = buildModule("StopOrderReactiveModule", (m) => {
    const pair = process.env.UNISWAP_V2_PAIR_ADDR;
    const callback = process.env.CALLBACK_ADDR;
    const client = process.env.CLIENT_WALLET;
    const direction = true;
    const denominator = 1000;
    const numerator = 1234;

    if (!pair || !callback || !client) {
        throw new Error("Missing one of: UNISWAP_V2_PAIR_ADDR, CALLBACK_ADDR, CLIENT_WALLET in .env");
    }

    const stopOrder = m.contract("UniswapDemoStopOrderReactive", [
        pair,
        callback,
        client,
        direction,
        denominator,
        numerator,
    ], {
        value: 1000000000000000n // 0.1 ether
    });

    return { stopOrder };
});

module.exports = StopOrderReactiveModule;
