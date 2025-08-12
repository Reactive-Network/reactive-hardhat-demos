import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

interface DeployedAddresses {
    [key: string]: string;
}

async function main(): Promise<void> {
    const addressesPath: string = path.resolve(
        __dirname,
        "../../ignition/deployments/chain-11155111/deployed_addresses.json"
    );

    if (!fs.existsSync(addressesPath)) {
        throw new Error(`Addresses file not found: ${addressesPath}`);
    }

    const addresses: DeployedAddresses = JSON.parse(
        fs.readFileSync(addressesPath, "utf8")
    );

    const uniswapHistoryL1: string = addresses["UniswapHistoryL1Module#UniswapHistoryDemoL1"];
    if (!uniswapHistoryL1) {
        throw new Error(`UniswapHistoryL1 address not found in deployed_addresses.json`);
    }

    const pair: string = "0x85b6E66594C2DfAf7DC83b1a25D8FAE1091AF063";
    const blockNumber: number = 6843582;
    const abi: string[] = ["function request(address pair, uint256 blockNumber) external"];
    const [signer] = await ethers.getSigners();
    const historyL1 = new ethers.Contract(uniswapHistoryL1, abi, signer);

    const tx = await historyL1.request(pair, blockNumber, {
        gasLimit: 1000000n,
    });
    console.log(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    if (!receipt) {
        throw new Error("No receipt returned for transaction");
    }
    console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
}

main().catch((error: unknown) => {
    console.error("❌ Script failed:", error);
    process.exitCode = 1;
});
