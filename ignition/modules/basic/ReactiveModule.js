const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const fs = require("fs");
const path = require("path");

const addressesPath = path.resolve(__dirname, "../../deployments/chain-11155111/deployed_addresses.json");

let deployedAddresses = {};
try {
    const jsonRaw = fs.readFileSync(addressesPath, "utf8");
    deployedAddresses = JSON.parse(jsonRaw);
} catch (e) {
    console.warn(`⚠️ Could not load deployed addresses from ${addressesPath}: ${e.message}`);
}

const ReactiveModule = buildModule("ReactiveModule", (m) => {
    const systemContract = "0x0000000000000000000000000000000000fffFfF";
    const originChainId = 11155111;
    const destinationChainId = 11155111;
    const topic_0 = "0x8cabf31d2b1b11ba52dbb302817a3c9c83e4b2a5194d35121ab1354d69f6a4cb"
    const originContract = deployedAddresses["OriginCallbackModule#BasicDemoL1Contract"];
    const callbackContract = deployedAddresses["OriginCallbackModule#BasicDemoL1Callback"];

    if (!originContract || !callbackContract) {
        throw new Error("Required deployed contract addresses not found in deployed-addresses.json");
    }

    const reactiveContract = m.contract("BasicDemoReactiveContract", [
        systemContract,
        originChainId,
        destinationChainId,
        originContract,
        topic_0,
        callbackContract,
    ], {
        value: 100000000000000000n, // 0.1 ETH
    });

    return { reactiveContract };
});

module.exports = ReactiveModule;
