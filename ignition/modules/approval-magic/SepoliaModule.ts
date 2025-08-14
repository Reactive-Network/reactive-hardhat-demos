import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SepoliaModule = buildModule("SepoliaModule", (m) => {
    const callbackProxy = "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA";
    const subscriptionFee = 123n;
    const gasCoefficient = 2n;
    const extraGas = 35000n;

    const approvalService = m.contract(
        "ApprovalService",
        [callbackProxy, subscriptionFee, gasCoefficient, extraGas],
        {
            value: 20000000000000000n, // 0.02 ether
        }
    );

    const exchangeToken = m.contract(
        "ApprovalDemoToken",
        ["FTW", "FTW"],
        { id: "ExchangeToken" });

    const swapToken1 = m.contract(
        "ApprovalDemoToken",
        ["TK1", "TK1"],
        { id: "SwapToken1" });

    const swapToken2 = m.contract(
        "ApprovalDemoToken",
        ["TK2", "TK2"],
        { id: "SwapToken2" });

    const exchangeContract = m.contract(
        "ApprovalEthExch",
        [approvalService, exchangeToken],
        { value: 10000000000000000n } // 0.01 ether
    );

    const swapContract = m.contract(
        "ApprovalMagicSwap",
        [approvalService, swapToken1, swapToken2],
        { value: 10000000000000000n } // 0.01 ether
    );

    return { approvalService, exchangeToken, swapToken1, swapToken2, exchangeContract, swapContract };
});

export default SepoliaModule;
