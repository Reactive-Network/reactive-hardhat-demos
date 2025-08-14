import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ApprovalToken2Module = buildModule("ApprovalToken2Module", (m) => {
    const token2 = m.contract("ApprovalDemoToken", ["TK2", "TK2"], { id: "ApprovalDemoToken2" });

    return { token2 };
});

export default ApprovalToken2Module;
