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
    const tokenTurnoverL1 = deployedAddresses["TokenTurnoverL1Module#TokenTurnonverL1"];

    if (!tokenTurnoverL1) {
        throw new Error(
            "Required deployed contract address not found in deployed_addresses.json"
        );
    }

    const reactiveContract = m.contract(
        "TokenTurnoverReactive",
        [
            tokenTurnoverL1
        ],
        {
            value: 100000000000000000n, // 0.1 REACT
        }
    );

    return { reactiveContract };
});

export default ReactiveModule;

