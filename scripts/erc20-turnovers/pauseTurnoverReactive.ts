import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

interface DeployedAddresses {
    [key: string]: string;
}

async function main(): Promise<void> {
    const addressesPath = path.resolve(
        __dirname,
        "../../ignition/deployments/chain-5318007/deployed_addresses.json"
    );

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
        process.exit(1);
    }

    const contractAddress = deployedAddresses["ReactiveModule#TokenTurnoverReactive"];
    if (!contractAddress) {
        throw new Error(`❌ ReactiveModule#TokenTurnoverReactive not found in deployed_addresses.json`);
    }

    const abi = ["function pause() external"];
    const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.pause({ gasLimit: 1000000 });
    console.log(`Pause transaction sent: ${tx.hash}`);

    await tx.wait();
    console.log("✅ Contract paused.");
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
