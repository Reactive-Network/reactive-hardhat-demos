const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const addressesPath = path.resolve(
        __dirname,
        "../../ignition/deployments/chain-11155111/deployed_addresses.json"
    );

    if (!fs.existsSync(addressesPath)) {
        throw new Error(`Addresses file not found: ${addressesPath}`);
    }

    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
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
    console.log("Transaction confirmed in block", receipt.blockNumber);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
