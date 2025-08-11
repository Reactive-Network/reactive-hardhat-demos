import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CronDemoModule = buildModule("CronDemoModule", (m) => {
    const systemContract = "0x0000000000000000000000000000000000fffFfF";
    const cron10TopicHex = "0x04463f7c1651e6b9774d7f85c85bb94654e3c46ca79b0c16fb16d4183307b687";

    const cron10Topic = BigInt(cron10TopicHex);

    const cronContract = m.contract(
        "BasicCronContract",
        [systemContract, cron10Topic],
        {
            value: 1000000000000000000n, // 1 ether
        }
    );

    return { cronContract };
});

export default CronDemoModule;
