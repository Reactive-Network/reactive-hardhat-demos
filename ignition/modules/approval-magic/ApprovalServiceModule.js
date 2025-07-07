require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ApprovalServiceModule = buildModule("ApprovalServiceModule", (m) => {
    const callbackSenderAddr = process.env.DESTINATION_CALLBACK_PROXY_ADDR;

    if (!callbackSenderAddr) {
        throw new Error("Missing DESTINATION_CALLBACK_PROXY_ADDR in .env");
    }

    const subscriptionFee = 123n;
    const gasCoefficient = 2n;
    const extraGas = 35000n;

    const approvalService = m.contract(
        "ApprovalService",
        [callbackSenderAddr, subscriptionFee, gasCoefficient, extraGas],
        {
            value: 20000000000000000n, // 0.02 ether
        }
    );

    return { approvalService };
});

module.exports = ApprovalServiceModule;
