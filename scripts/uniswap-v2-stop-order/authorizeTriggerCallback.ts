import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import "dotenv/config";

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

    const callback = addresses["StopOrderSepoliaModule#Callback"];
    const token0 = addresses["StopOrderSepoliaModule#Token0"];
    const uniswapPair = addresses["StopOrderSepoliaModule#UniswapV2Pair"];

    if (!callback || !token0 || !uniswapPair) {
        throw new Error("Required contract addresses are missing");
    }

    const [signer] = await ethers.getSigners();
    console.log(`Using signer: ${await signer.getAddress()}`);

    const eoaWallet = process.env.EOA_WALLET;
    const wallet = eoaWallet ?? (await signer.getAddress());
    if (!ethers.isAddress(wallet)) {
        throw new Error(`Invalid recipient address: ${wallet}`);
    }
    console.log(`Recipient (swap 'to'): ${wallet}`);

    const erc20Abi = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function transfer(address to, uint256 amount) external returns (bool)"
    ];

    const pairAbi = [
        "function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external"
    ];

    const token0Contract = new ethers.Contract(token0, erc20Abi, signer);
    const pairContract = new ethers.Contract(uniswapPair, pairAbi, signer);

    const approveAmount = ethers.parseEther("1");
    console.log(`Approving ${approveAmount} Token0 to Callback`);
    await (await token0Contract.approve(callback, approveAmount)).wait();

    const transferAmount = ethers.parseUnits("0.02", 18);
    console.log(`Transferring ${transferAmount} Token0 to Pair`);
    await (await token0Contract.transfer(uniswapPair, transferAmount)).wait();

    const amount0Out = 0n;
    const amount1Out = ethers.parseUnits("0.005", 18);
    console.log(`Swapping: amount0Out=${amount0Out}, amount1Out=${amount1Out}...`);
    const swapTx = await pairContract.swap(amount0Out, amount1Out, wallet, "0x");
    await swapTx.wait();
    console.log("Swap complete");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
