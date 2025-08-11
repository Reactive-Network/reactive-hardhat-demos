import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

interface DeployedAddresses {
    [key: string]: string;
}

async function main(): Promise<void> {
    const addressesPath = path.resolve(
        __dirname,
        "../../ignition/deployments/chain-11155111/deployed_addresses.json"
    );

    if (!fs.existsSync(addressesPath)) {
        throw new Error(`Addresses file not found: ${addressesPath}`);
    }

    const addresses: DeployedAddresses = JSON.parse(
        fs.readFileSync(addressesPath, "utf8")
    );

    const originAddr = addresses["OriginCallbackModule#BasicDemoL1Contract"];
    if (!originAddr) {
        throw new Error(
            `OriginCallbackModule#BasicDemoL1Contract not found in deployed_addresses.json`
        );
    }

    const [signer] = await ethers.getSigners();

    console.log(`Sending 0.001 ETH to ${originAddr} from ${signer.address}...`);
    const tx = await signer.sendTransaction({
        to: originAddr,
        value: ethers.parseEther("0.001"),
    });

    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();

    if (receipt == null) {
        throw new Error("Transaction receipt not found");
    }

    console.log("Transaction confirmed in block", receipt.blockNumber);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
