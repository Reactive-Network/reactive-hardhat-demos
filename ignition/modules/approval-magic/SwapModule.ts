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

const SwapModule = buildModule("SwapModule", (m) => {
    const approvalService = deployedAddresses["ApprovalServiceTokensModule#ApprovalService"];
    const token1 = deployedAddresses["ApprovalServiceTokensModule#SwapToken1"];
    const token2 = deployedAddresses["ApprovalServiceTokensModule#SwapToken2"];

    if (!approvalService || !token1 || !token2) {
        throw new Error(
            "Required deployed contract addresses not found in deployed_addresses.json"
        );
    }

    const swapContract = m.contract(
        "ApprovalMagicSwap",
        [approvalService, token1, token2],
        {
            value: 100000000000000n // 0.0001 ether
        }
    );

    return { swapContract };
});

export default SwapModule;
