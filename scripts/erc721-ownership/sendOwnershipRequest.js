require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.OWNERSHIP_L1_ADDR;
    const tokenAddress = process.env.ACTIVE_TOKEN_ADDR;
    const tokenId = parseInt(process.env.ACTIVE_TOKEN_ID);

    if (!contractAddress || !tokenAddress || !tokenId) {
        throw new Error("Missing required environment variables.");
    }

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const wallet = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const abi = [
        "function request(address token, uint256 token_id) external"
    ];

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const tx = await contract.request(tokenAddress, tokenId);
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("✅ Request emitted successfully.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
