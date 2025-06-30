require('dotenv').config({ override: true });
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ReactiveModule = buildModule("ReactiveModule", (m) => {
    const service = process.env.SYSTEM_CONTRACT;
    const originChainId = parseInt(process.env.ORIGIN_CHAIN_ID);
    const destinationChainId = parseInt(process.env.DESTINATION_CHAIN_ID);
    const contract = process.env.ORIGIN_CONTRACT;
    const topic_0 = process.env.TOPIC_0;
    const callback = process.env.CALLBACK_CONTRACT;

    if (!service || !contract || !callback || !topic_0) {
        throw new Error("Missing one or more .env values for ReactiveModule.");
    }

    const reactiveContract = m.contract("BasicDemoReactiveContract", [
        service,
        originChainId,
        destinationChainId,
        contract,
        topic_0,
        callback,
    ], {
        value: 100000000000000000n, // 0.1 ether
    });

    return { reactiveContract };
});

module.exports = ReactiveModule;
