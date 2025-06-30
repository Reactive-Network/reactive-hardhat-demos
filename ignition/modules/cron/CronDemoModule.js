require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const CronDemoModule = buildModule("CronDemoModule", (m) => {
    const service = process.env.SYSTEM_CONTRACT;
    const cronTopic = process.env.CRON10;

    if (!service || !cronTopic) {
        throw new Error("Missing .env values: SYSTEM_CONTRACT or CRON10");
    }

    const cronContract = m.contract("BasicCronContract", [
        service,
        BigInt(cronTopic)
    ], {
        value: 1000000000000000000n // 1 ether
    });

    return { cronContract };
});

module.exports = CronDemoModule;
