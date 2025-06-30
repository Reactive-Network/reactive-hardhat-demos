require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const token1 = process.env.TOKEN1_ADDR;
    const token2 = process.env.TOKEN2_ADDR;
    const pairAddress = process.env.UNISWAP_PAIR_ADDR;
    const clientWallet = process.env.CLIENT_WALLET;

    if (!token1 || !token2 || !pairAddress || !clientWallet) {
        throw new Error("Missing some .env variables");
    }

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const signer = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const erc20Abi = ["function transfer(address,uint256) external returns (bool)"];

    const token1Contract = new ethers.Contract(token1, erc20Abi, signer);
    const token2Contract = new ethers.Contract(token2, erc20Abi, signer);
    const pairAbi = ["function mint(address) external returns (uint256)"];
    const pairContract = new ethers.Contract(pairAddress, pairAbi, signer);

    const amount = ethers.parseEther("0.5"); // v6 syntax

    // Transfer tokens to pair contract
    let tx = await token1Contract.transfer(pairAddress, amount);
    await tx.wait();
    console.log("✅ Transferred 0.5 TOKEN1 to pair");

    tx = await token2Contract.transfer(pairAddress, amount);
    await tx.wait();
    console.log("✅ Transferred 0.5 TOKEN2 to pair");

    // Mint liquidity tokens to client wallet
    tx = await pairContract.mint(clientWallet);
    await tx.wait();
    console.log("✅ Minted liquidity tokens to client wallet");
}

main().catch(console.error);
