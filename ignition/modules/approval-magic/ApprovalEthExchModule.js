require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ApprovalEthExchModule = buildModule("ApprovalEthExchModule", (m) => {
    const approvalServiceAddr = process.env.APPROVAL_SRV_ADDR;
    const tokenAddr = process.env.TOKEN_ADDR;

    if (!approvalServiceAddr || !tokenAddr) {
        throw new Error("Missing APPROVAL_SRV_ADDR or TOKEN_ADDR in .env");
    }

    const contract = m.contract("ApprovalEthExch", [approvalServiceAddr, tokenAddr], {
        value: 10000000000000000n // 0.01 ether
    });

    return { contract };
});

module.exports = ApprovalEthExchModule;
