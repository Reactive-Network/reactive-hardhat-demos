require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ApprovalListenerModule = buildModule("ApprovalListenerModule", (m) => {
    const approvalServiceAddr = process.env.APPROVAL_SRV_ADDR;
    const destinationChainId = process.env.DESTINATION_CHAIN_ID;

    if (!approvalServiceAddr || !destinationChainId) {
        throw new Error("Missing APPROVAL_SRV_ADDR or DESTINATION_CHAIN_ID in .env");
    }

    const approvalListener = m.contract(
        "ApprovalListener",
        [BigInt(destinationChainId), approvalServiceAddr],
        {
            value: 1000000000000000000n, // 1 ether
        }
    );

    return { approvalListener };
});

module.exports = ApprovalListenerModule;
