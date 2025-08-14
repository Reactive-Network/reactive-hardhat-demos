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

    const exchangeContract = addresses["SepoliaModule#ApprovalEthExch"];
    const exchangeToken = addresses["SepoliaModule#ExchangeToken"];
    const swapContract = addresses["SepoliaModule#ApprovalMagicSwap"];
    const swapToken1 = addresses["SepoliaModule#SwapToken1"];
    const swapToken2 = addresses["SepoliaModule#SwapToken2"];

    if (!exchangeContract || !exchangeToken || !swapContract || !swapToken1 || !swapToken2) {
        throw new Error("Required contract addresses are missing");
    }

    const [signer] = await ethers.getSigners();

    const exchange = await ethers.getContractAt("ApprovalEthExch", exchangeContract, signer);
    try {
        console.log(`Subscribing Exchange at ${exchangeContract}`);
        const subscribeTx = await exchange.subscribe();
        console.log(`subscribe() tx sent: ${subscribeTx.hash}`);
        await subscribeTx.wait();
        console.log(`Exchange subscribed`);
    } catch (err: any) {
        if (err.message.includes("Already subscribed")) {
            console.log("Exchange already subscribed");
        } else {
            throw err;
        }
    }

    const swap = await ethers.getContractAt("ApprovalMagicSwap", swapContract, signer);
    try {
        console.log(`Subscribing Swap at ${swapContract}`);
        const subscribeTx = await swap.subscribe();
        console.log(`subscribe() tx sent: ${subscribeTx.hash}`);
        await subscribeTx.wait();
        console.log(`Swap subscribed`);
    } catch (err: any) {
        if (err.message.includes("Already subscribed")) {
            console.log("Swap already subscribed");
        } else {
            throw err;
        }
    }

    console.log(`Waiting 40 seconds for block confirmation`);
    await new Promise((resolve) => setTimeout(resolve, 40000));

    const exchangeTokenContract = await ethers.getContractAt("ApprovalDemoToken", exchangeToken, signer);
    const approveExchangeTx = await exchangeTokenContract.approve(exchangeContract, 1000n);
    console.log(`approve() tx sent to Exchange: ${approveExchangeTx.hash}`);
    await approveExchangeTx.wait();
    console.log(`Exchange approval confirmed`);

    const swapToken1Contract = await ethers.getContractAt("ApprovalDemoToken", swapToken1, signer);
    const approveSwapTx = await swapToken1Contract.approve(swapContract, 1000n);
    console.log(`approve() tx sent to Swap: ${approveSwapTx.hash}`);
    await approveSwapTx.wait();
    console.log(`Swap approval confirmed`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
