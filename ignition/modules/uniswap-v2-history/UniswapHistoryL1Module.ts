import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UniswapHistoryL1Module = buildModule("UniswapHistoryL1Module", (m) => {
    const callbackProxy: string = "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA";

    const uniswapHistoryL1 = m.contract("UniswapHistoryL1", [callbackProxy], {
        value: 20000000000000000n, // 0.02 ether
    });

    return { uniswapHistoryL1 };
});

export default UniswapHistoryL1Module;
