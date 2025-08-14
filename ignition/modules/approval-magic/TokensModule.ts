import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokensModule = buildModule("TokensModule", (m) => {
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

    return { exchangeToken, swapToken1, swapToken2 };
});

export default TokensModule;
