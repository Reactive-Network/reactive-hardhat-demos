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

    const exchangeContract = addresses["ApprovalEthExchModule#ApprovalEthExch"];
    const demoToken = addresses["ApprovalDemoTokenModule#ApprovalDemoToken"];

    if (!exchangeContract || !demoToken) {
        throw new Error(`Exchange or token contract address not found`);
    }

    const [signer] = await ethers.getSigners();

    console.log(`Subscribing exchange at ${exchangeContract}`);
    const exchange = await ethers.getContractAt("ApprovalEthExch", exchangeContract, signer);
    const subscribeTx = await exchange.subscribe();
    console.log(`subscribe() tx sent: ${subscribeTx.hash}`);
    await subscribeTx.wait();
    console.log(`Exchange subscribed`);

    console.log(`Waiting 40 seconds for block confirmation`);
    await new Promise((resolve) => setTimeout(resolve, 40000));

    console.log(`Approving 1000 tokens (in Wei) to ${exchangeContract}`);
    const token = await ethers.getContractAt("ApprovalDemoToken", demoToken, signer);
    const approveTx = await token.approve(exchangeContract, 1000n);
    console.log(`approve() tx sent: ${approveTx.hash}`);
    await approveTx.wait();
    console.log(`Approval confirmed`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
