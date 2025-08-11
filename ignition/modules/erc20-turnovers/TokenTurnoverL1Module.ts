import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenTurnoverL1Module = buildModule("TokenTurnoverL1Module", (m) => {
    const callbackProxy: string = "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA";

    const turnoverContract = m.contract("TokenTurnoverL1", [callbackProxy], {
        value: 20000000000000000n, // 0.02 ether
    });

    return { turnoverContract };
});

export default TokenTurnoverL1Module;

