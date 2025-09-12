import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { ethers } from "ethers";

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

const StopOrderReactiveModule = buildModule("StopOrderReactiveModule", (m) => {
    const pair = deployedAddresses["StopOrderSepoliaModule#UniswapV2Pair"];
    const callback = deployedAddresses["StopOrderSepoliaModule#Callback"];

    const clientWallet = process.env.EOA_WALLET;

    if (!clientWallet) {
        throw new Error("EOA_WALLET is not set in the environment (.env)");
    }
    if (!ethers.isAddress(clientWallet)) {
        throw new Error(`EOA_WALLET is not a valid address: ${clientWallet}`);
    }

    const direction = true;
    const denominator = 1000;
    const numerator = 1234;

    if (!pair || !callback) {
        throw new Error("Missing Uniswap Pair and/or Callback contract");
    }

    const reactiveContract = m.contract(
        "UniswapDemoStopOrderReactive",
        [
            pair,
            callback,
            clientWallet,
            direction,
            denominator,
            numerator
        ],
        {
            value: 100000000000000000n, // 0.1 REACT
        }
    );

    return { reactiveContract };
});

export default StopOrderReactiveModule;