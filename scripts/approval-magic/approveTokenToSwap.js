require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const tokenAddress = process.env.TOKEN1_ADDR;
    const swapAddress = process.env.SWAP_ADDR;

    if (!tokenAddress || !swapAddress) {
        throw new Error("Missing TOKEN1_ADDR or SWAP_ADDR in .env");
    }

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const signer = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

    const amount = ethers.parseEther("0.1");
    const tx = await tokenContract.approve(swapAddress, amount, { gasLimit: 100_000 });
    console.log("📨 Approve transaction sent:", tx.hash);

    await tx.wait();
    console.log("✅ Token approval granted.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
