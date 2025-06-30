require("dotenv").config();
const hre = require("hardhat");

async function main() {
    const turnoverL1Address = process.env.TURNOVER_L1_ADDR;
    const usdtAddress = process.env.USDT_ADDR;

    if (!turnoverL1Address || !usdtAddress) {
        throw new Error("Missing TURNOVER_L1_ADDR or USDT_ADDR in .env");
    }

    const [signer] = await hre.ethers.getSigners();

    const abi = [
        "function request(address token) external"
    ];

    const turnoverContract = new hre.ethers.Contract(turnoverL1Address, abi, signer);

    console.log(`Sending request for token ${usdtAddress}...`);
    const tx = await turnoverContract.request(usdtAddress);
    await tx.wait();

    console.log(`✅ Request sent. Tx hash: ${tx.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
