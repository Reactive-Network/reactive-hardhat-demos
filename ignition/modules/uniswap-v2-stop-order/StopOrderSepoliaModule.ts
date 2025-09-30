import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StopOrderSepoliaModule = buildModule("StopOrderSepoliaModule", (m) => {

    const token0 = m.contract(
        "UniswapDemoToken",
        ["TK0", "TK0"],
        { id: "Token0" }
    );

    const token1 = m.contract(
        "UniswapDemoToken",
        ["TK1", "TK1"],
        {
            id: "Token1",
            after: [token0],
        }
    );

    const callbackProxy = "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA";
    const uniswapV2Router = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";

    const stopOrderCallback = m.contract(
        "UniswapDemoStopOrderCallback",
        [callbackProxy, uniswapV2Router],
        {
            id: "Callback",
            value: 20000000000000000n, // 0.02 ether
            after: [token1],
        }
    );

    return { token0, token1, stopOrderCallback };
});

export default StopOrderSepoliaModule;
