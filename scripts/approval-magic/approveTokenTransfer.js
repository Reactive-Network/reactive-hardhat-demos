require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const tokenAddress = process.env.TOKEN_ADDR;
    const exchangeAddress = process.env.EXCH_ADDR;

    const abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
    const signer = (await ethers.getSigners())[0];
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

    const amount = 1000; // 1000 tokens in Wei
    const tx = await tokenContract.approve(exchangeAddress, amount, { gasLimit: 100000 });
    console.log("✅ Approve transaction sent:", tx.hash);

    await tx.wait();
    console.log("🎉 Token allowance set successfully.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
