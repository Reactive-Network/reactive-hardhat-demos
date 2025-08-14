import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ApprovalToken1Module = buildModule("ApprovalToken1Module", (m) => {
    const token1 = m.contract("ApprovalDemoToken", ["TK1", "TK1"], { id: "ApprovalDemoToken1" });

    return { token1 };
});

export default ApprovalToken1Module;

