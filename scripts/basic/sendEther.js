const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const wallet = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
        to: process.env.ORIGIN_CONTRACT,
        value: ethers.parseEther("0.001"),
    });

    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("✅ Transaction confirmed");
}

main().catch(console.error);
