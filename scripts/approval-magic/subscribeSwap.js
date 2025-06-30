require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const swapAddress = process.env.SWAP_ADDR;

    if (!swapAddress) {
        throw new Error("Missing SWAP_ADDR in .env");
    }

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const signer = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const abi = ["function subscribe() external payable"];
    const contract = new ethers.Contract(swapAddress, abi, signer);

    const tx = await contract.subscribe();
    console.log("📨 Subscribe transaction sent:", tx.hash);

    await tx.wait();
    console.log("✅ Subscribed successfully.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
