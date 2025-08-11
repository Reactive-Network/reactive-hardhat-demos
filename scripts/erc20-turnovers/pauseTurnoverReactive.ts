require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.TURNOVER_REACTIVE_ADDR;

    if (!contractAddress) {
        throw new Error("❌ TURNOVER_REACTIVE_ADDR not set in .env");
    }

    const abi = ["function pause() external"];
    const signer = (await ethers.getSigners())[0];
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.pause({ gasLimit: 1000000 });
    console.log(`⏸️ Pause transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("✅ Contract paused.");
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
