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

    const turnoverL1Addr: string =
        addresses["TokenTurnoverL1Module#TokenTurnoverL1"];
    if (!turnoverL1Addr) {
        throw new Error(`TokenTurnoverL1 address not found in deployed_addresses.json`);
    }

    const usdtAddr: string = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";
    const abi: string[] = ["function request(address token) external"];
    const [signer] = await ethers.getSigners();
    const turnoverL1 = new ethers.Contract(turnoverL1Addr, abi, signer);

    const tx = await turnoverL1.request(usdtAddr, {
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
