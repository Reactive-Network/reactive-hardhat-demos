require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const factoryAddress = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
    const token0 = process.env.TOKEN0_ADDR;
    const token1 = process.env.TOKEN1_ADDR;

    if (!token0 || !token1) {
        throw new Error("Missing TOKEN0_ADDR or TOKEN1_ADDR in .env");
    }

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const signer = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const abi = ["function createPair(address tokenA, address tokenB) external returns (address pair)"];
    const factoryContract = new ethers.Contract(factoryAddress, abi, signer);

    const tx = await factoryContract.createPair(token0, token1);
    console.log("📨 createPair transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("✅ Pair created in tx:", receipt.transactionHash);
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
