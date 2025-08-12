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

    const nftOwnershipL1: string = addresses["NftOwnershipL1Module#NftOwnershipL1"];
    if (!nftOwnershipL1) {
        throw new Error(`NftOwnershipL1 address not found in deployed_addresses.json`);
    }

    const nftContract: string = "0x92eFBC2F5208b8610E57c52b9E49F7189048900F";
    const nftId: number = 129492;
    const abi: string[] = ["function request(address token, uint256 tokenId) external"];
    const [signer] = await ethers.getSigners();
    const ownershipL1 = new ethers.Contract(nftOwnershipL1, abi, signer);

    const tx = await ownershipL1.request(nftContract, nftId, {
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
