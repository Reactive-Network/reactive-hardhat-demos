require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.OWNERSHIP_REACTIVE_ADDR;

    if (!contractAddress) {
        throw new Error("❌ OWNERSHIP_REACTIVE_ADDR not set in .env");
    }

    const abi = ["function resume() external"];
    const signer = (await ethers.getSigners())[0];
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.resume({ gasLimit: 1000000 });
    console.log(`▶️ Resume transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("✅ Contract resumed.");
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
