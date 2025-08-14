import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ApprovalServiceModule = buildModule("ApprovalServiceModule", (m) => {
    const callbackProxy: string = "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA";

    const subscriptionFee = 123n;
    const gasCoefficient = 2n;
    const extraGas = 35000n;

    const approvalService = m.contract(
        "ApprovalService",
        [callbackProxy, subscriptionFee, gasCoefficient, extraGas],
        {
            value: 200000000000000n, // 0.02 ether
        }
    );

    return { approvalService };
});

export default ApprovalServiceModule;

