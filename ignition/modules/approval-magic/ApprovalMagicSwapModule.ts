require("dotenv").config({ override: true });
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ApprovalMagicSwapModule = buildModule("ApprovalMagicSwapModule", (m) => {
    const approvalServiceAddr = process.env.APPROVAL_SRV_ADDR;
    const token1Addr = process.env.TOKEN1_ADDR;
    const token2Addr = process.env.TOKEN2_ADDR;

    if (!approvalServiceAddr || !token1Addr || !token2Addr) {
        throw new Error("Missing APPROVAL_SRV_ADDR, TOKEN1_ADDR, or TOKEN2_ADDR in .env");
    }

    const approvalMagicSwap = m.contract(
        "ApprovalMagicSwap",
        [approvalServiceAddr, token1Addr, token2Addr],
        {
            value: 10000000000000000n // 0.01 ether
        }
    );

    return { approvalMagicSwap };
});

module.exports = ApprovalMagicSwapModule;
