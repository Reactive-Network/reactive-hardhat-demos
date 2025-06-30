require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const token0 = process.env.TOKEN0_ADDR;
    const token1 = process.env.TOKEN1_ADDR;
    const pairAddress = process.env.UNISWAP_V2_PAIR_ADDR;
    const clientWallet = process.env.CLIENT_WALLET;

    if (!token0 || !token1 || !pairAddress || !clientWallet) {
        throw new Error("Missing required .env variables");
    }

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const signer = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const erc20Abi = ["function transfer(address,uint256) external returns (bool)"];
    const pairAbi = ["function mint(address) external returns (uint256)"];

    const token0Contract = new ethers.Contract(token0, erc20Abi, signer);
    const token1Contract = new ethers.Contract(token1, erc20Abi, signer);
    const pairContract = new ethers.Contract(pairAddress, pairAbi, signer);

    const amount = ethers.parseUnits("10", 18); // 10 tokens (assuming 18 decimals)

    // Transfer TOKEN0
    let tx = await token0Contract.transfer(pairAddress, amount);
    await tx.wait();
    console.log("✅ Transferred 10 TOKEN0 to pair");

    // Transfer TOKEN1
    tx = await token1Contract.transfer(pairAddress, amount);
    await tx.wait();
    console.log("✅ Transferred 10 TOKEN1 to pair");

    // Mint LP tokens to client wallet
    tx = await pairContract.mint(clientWallet);
    await tx.wait();
    console.log("✅ Minted LP tokens to client wallet");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
