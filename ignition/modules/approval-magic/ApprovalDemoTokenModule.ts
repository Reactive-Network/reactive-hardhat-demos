import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ApprovalDemoTokenModule = buildModule("ApprovalDemoTokenModule", (m) => {
    const token = m.contract("ApprovalDemoToken", ["FTW", "FTW"]);

    return { token };
});

export default ApprovalDemoTokenModule;
