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

    const token0 = addresses["StopOrderSepoliaModule#Token0"];
    const token1 = addresses["StopOrderSepoliaModule#Token1"];
    const uniswapFactory = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";

    if (!token0 || !token1) {
        throw new Error("Required token addresses are missing");
    }

    const [signer] = await ethers.getSigners();
    const eoaWallet = process.env.EOA_WALLET;
    const wallet = eoaWallet ?? await signer.getAddress();

    if (!ethers.isAddress(wallet)) {
        throw new Error(`Invalid recipient address for minting: ${wallet}`);
    }

    console.log(`LP recipient: ${wallet}`);

    const factoryAbi = [
        "function createPair(address tokenA, address tokenB) external returns (address pair)",
        "function getPair(address tokenA, address tokenB) external view returns (address pair)"
    ];

    const erc20Abi = [
        "function transfer(address to, uint256 amount) external returns (bool)"
    ];

    const pairAbi = [
        "function mint(address to) external returns (uint liquidity)"
    ];

    const factory = new ethers.Contract(
        uniswapFactory, factoryAbi, signer);

    const token0Contract = new ethers.Contract(
        token0, erc20Abi, signer);

    const token1Contract = new ethers.Contract(
        token1, erc20Abi, signer);

    let pairAddress = await factory.getPair(token0, token1);
    if (pairAddress === ethers.ZeroAddress) {
        console.log("Creating pair...");
        const tx = await factory.createPair(token0, token1);
        const receipt = await tx.wait();
        console.log("Pair created, tx:", receipt?.hash);

        pairAddress = await factory.getPair(token0, token1);
    }
    console.log(`Pair address: ${pairAddress}`);

    addresses["StopOrderSepoliaModule#UniswapV2Pair"] = pairAddress;
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
    console.log(`Saved pair address to deployed_addresses.json: ${pairAddress}`);

    const amount = ethers.parseEther("10");

    console.log(`Transferring ${amount} Token0 to pair`);
    await (await token0Contract.transfer(pairAddress, amount)).wait();

    console.log(`Transferring ${amount} Token1 to pair...`);
    await (await token1Contract.transfer(pairAddress, amount)).wait();

    const pair = new ethers.Contract(pairAddress, pairAbi, signer);
    console.log(`Minting LP tokens to ${wallet}...`);
    const mintTx = await pair.mint(wallet);
    const mintReceipt = await mintTx.wait();

    console.log("Mint complete, tx:", mintReceipt?.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});