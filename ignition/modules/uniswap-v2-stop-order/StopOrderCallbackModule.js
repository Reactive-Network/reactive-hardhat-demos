require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const StopOrderCallbackModule = buildModule("StopOrderCallbackModule", (m) => {
    const callbackSender = process.env.DESTINATION_CALLBACK_PROXY_ADDR;
    const routerAddress = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008"; // Uniswap V2 Router on Sepolia

    if (!callbackSender) {
        throw new Error("Missing DESTINATION_CALLBACK_PROXY_ADDR in .env file");
    }

    const stopOrderCallback = m.contract(
        "UniswapDemoStopOrderCallback",
        [callbackSender, routerAddress],
        {
            id: "UniswapStopOrderCallback",
            value: 20000000000000000n // 0.02 ether
        }
    );

    return { stopOrderCallback };
});

module.exports = StopOrderCallbackModule;
