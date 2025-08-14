import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ApprovalServiceTokensModule = buildModule("ApprovalServiceTokensModule", (m) => {
    const callbackProxy = "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA";
    const subscriptionFee = 123n;
    const gasCoefficient = 2n;
    const extraGas = 35000n;

    const approvalService = m.contract(
        "ApprovalService",
        [callbackProxy, subscriptionFee, gasCoefficient, extraGas],
        {
            value: 200000000000000n, // 0.0002 ether
        }
    );

    const exchangeToken = m.contract(
        "ApprovalDemoToken",
        ["FTW", "FTW"],
        { id: "ExchangeToken" }
    );

    const swapToken1 = m.contract(
        "ApprovalDemoToken",
        ["TK1", "TK1"],
        { id: "SwapToken1" }
    );

    const swapToken2 = m.contract(
        "ApprovalDemoToken",
        ["TK2", "TK2"],
        { id: "SwapToken2" }
    );

    return { approvalService, exchangeToken, swapToken1, swapToken2 };
});

export default ApprovalServiceTokensModule;
