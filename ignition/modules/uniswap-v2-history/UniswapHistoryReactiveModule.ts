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
    const uniswapHistoryL1: string  = deployedAddresses["UniswapHistoryL1Module#UniswapHistoryDemoL1"];

    if (!uniswapHistoryL1) {
        throw new Error(
            "Required deployed contract address not found in deployed_addresses.json"
        );
    }
    const reactiveContract = m.contract("UniswapHistoryDemoReactive", [uniswapHistoryL1], {
        value: 10000000000000000000n, // 10 REACT
    });

    return { reactiveContract };
});

export default ReactiveModule;