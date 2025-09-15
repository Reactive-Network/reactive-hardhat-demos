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

    const token1 = addresses["SepoliaModule#SwapToken1"];
    const token2 = addresses["SepoliaModule#SwapToken2"];
    const uniswapFactory = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";

    if (!token1 || !token2) {
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

    const token1Contract = new ethers.Contract(
        token1, erc20Abi, signer);

    const token2Contract = new ethers.Contract(
        token2, erc20Abi, signer);

    let pairAddress = await factory.getPair(token1, token2);
    if (pairAddress === ethers.ZeroAddress) {
        console.log("Creating pair...");
        const tx = await factory.createPair(token1, token2);
        const receipt = await tx.wait();
        console.log("Pair created, tx:", receipt?.hash);

        pairAddress = await factory.getPair(token1, token2);
    }
    console.log(`Pair address: ${pairAddress}`);

    addresses["SepoliaModule#UniswapV2Pair"] = pairAddress;
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
    console.log(`Saved pair address to deployed_addresses.json: ${pairAddress}`);

    const amount = ethers.parseEther("0.5");

    console.log(`Transferring ${amount} Token1 to pair`);
    await (await token1Contract.transfer(pairAddress, amount)).wait();

    console.log(`Transferring ${amount} Token2 to pair...`);
    await (await token2Contract.transfer(pairAddress, amount)).wait();

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