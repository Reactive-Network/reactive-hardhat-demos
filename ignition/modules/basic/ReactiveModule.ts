import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import fs from "fs";
import path from "path";

const addressesPath = path.resolve(
    __dirname,
    "../../deployments/chain-11155111/deployed_addresses.json"
);

interface DeployedAddresses {
    [key: string]: string;
}

let deployedAddresses: DeployedAddresses = {};
try {
    const jsonRaw = fs.readFileSync(addressesPath, "utf8");
    deployedAddresses = JSON.parse(jsonRaw) as DeployedAddresses;
} catch (e) {
    if (e instanceof Error) {
        console.warn(`⚠️ Could not load deployed addresses from ${addressesPath}: ${e.message}`);
    } else {
        console.warn(`⚠️ Could not load deployed addresses from ${addressesPath}: Unknown error`);
    }
}

const ReactiveModule = buildModule("ReactiveModule", (m) => {
    const systemContract: string = "0x0000000000000000000000000000000000fffFfF";
    const originChainId: number = 11155111;
    const destinationChainId: number = 11155111;
    const topic_0: string = "0x8cabf31d2b1b11ba52dbb302817a3c9c83e4b2a5194d35121ab1354d69f6a4cb";

    const originContract = deployedAddresses["OriginCallbackModule#BasicDemoL1Contract"];
    const callbackContract = deployedAddresses["OriginCallbackModule#BasicDemoL1Callback"];

    if (!originContract || !callbackContract) {
        throw new Error(
            "Required deployed contract addresses not found in deployed_addresses.json"
        );
    }

    const reactiveContract = m.contract(
        "BasicDemoReactiveContract",
        [
            systemContract,
            originChainId,
            destinationChainId,
            originContract,
            topic_0,
            callbackContract,
        ],
        {
            value: 100000000000000000n, // 0.1 ETH
        }
    );

    return { reactiveContract };
});

export default ReactiveModule;
