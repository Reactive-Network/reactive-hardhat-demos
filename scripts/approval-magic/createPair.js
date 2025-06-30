require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const factoryAddress = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
    const token1 = process.env.TOKEN1_ADDR;
    const token2 = process.env.TOKEN2_ADDR;

    if (!token1 || !token2) {
        throw new Error("Missing TOKEN1_ADDR or TOKEN2_ADDR in .env");
    }

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const signer = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const abi = ["function createPair(address,address) external returns (address)"];
    const contract = new ethers.Contract(factoryAddress, abi, signer);

    const tx = await contract.createPair(token1, token2);
    console.log("📨 createPair transaction sent:", tx.hash);

    await tx.wait();
    console.log("✅ Pair created successfully.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
