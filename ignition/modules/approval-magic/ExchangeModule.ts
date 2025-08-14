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

const ExchangeModule = buildModule("ExchangeModule", (m) => {
    const approvalService = deployedAddresses["ApprovalServiceModule#ApprovalService"];
    const token = deployedAddresses["ApprovalDemoTokenModule#ApprovalDemoToken"];

    if (!approvalService || !token) {
        throw new Error(
            "Required deployed contract addresses not found in deployed_addresses.json"
        );
    }

    const exchangeContract = m.contract(
        "ApprovalEthExch",
        [approvalService, token],
        {
            value: 200000000000000n // 0.0002 ether
        }
    );

    return { exchangeContract };
});

export default ExchangeModule;

