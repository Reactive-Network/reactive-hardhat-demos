require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const L1CallbackModule = buildModule("L1CallbackModule", (m) => {
    const sender = process.env.DEV_DESTINATION_CALLBACK_PROXY_ADDR;
    if (!sender) {
        throw new Error("Missing DEV_DESTINATION_CALLBACK_PROXY_ADDR in .env");
    }
    console.log("DEV_DESTINATION_CALLBACK_PROXY_ADDR:", sender);

    const callbackContract = m.contract("BasicDemoL1Callback", [sender]);

    return { callbackContract };
});

module.exports = L1CallbackModule;
