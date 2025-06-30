require("dotenv").config();
const hre = require("hardhat");

async function main() {
    // Use ethers from Hardhat runtime environment
    const { ethers } = hre;

    // No need to create JsonRpcProvider manually, just use provider from hre.network
    const signer = (await ethers.getSigners())[0]; // get first signer

    const UNISWAP_L1_ADDR = process.env.UNISWAP_L1_ADDR;
    const pairAddress = process.env.ACTIVE_PAIR_ADDR;
    const blockNumber = process.env.BLOCK_NUMBER;

    const abi = [
        "function request(address pair, uint256 block_number) external"
    ];

    const contract = new ethers.Contract(UNISWAP_L1_ADDR, abi, signer);

    const tx = await contract.request(pairAddress, blockNumber);
    console.log("Transaction sent:", tx.hash);

    await tx.wait();
    console.log("Transaction confirmed");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
