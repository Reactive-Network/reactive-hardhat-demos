require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const token1Addr = process.env.TOKEN1_ADDR;
    const token0Addr = process.env.TOKEN0_ADDR;
    const pairAddr = process.env.UNISWAP_V2_PAIR_ADDR;
    const callbackAddr = process.env.CALLBACK_ADDR;
    const clientWallet = process.env.CLIENT_WALLET;

    if (!token1Addr || !token0Addr || !pairAddr || !callbackAddr || !clientWallet) {
        throw new Error("❌ Missing required environment variables in .env");
    }

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const signer = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const erc20Abi = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function transfer(address to, uint256 amount) external returns (bool)"
    ];
    const pairAbi = [
        "function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external"
    ];

    const token1 = new ethers.Contract(token1Addr, erc20Abi, signer);
    const pair = new ethers.Contract(pairAddr, pairAbi, signer);

    // Approve CALLBACK_ADDR to spend TOKEN1
    const approveAmount = ethers.parseUnits("1", 18); // 1 TOKEN1
    let tx = await token1.approve(callbackAddr, approveAmount);
    await tx.wait();
    console.log("✅ Approved CALLBACK contract to spend TOKEN1");

    // Transfer 0.02 TOKEN1 to the pair contract
    const transferAmount = ethers.parseUnits("0.02", 18); // 0.02 TOKEN1
    tx = await token1.transfer(pairAddr, transferAmount);
    await tx.wait();
    console.log("✅ Transferred TOKEN1 to UniswapV2 Pair");

    // Call swap on pair contract (TOKEN1 -> TOKEN0)
    const amount0Out = 0;
    const amount1Out = ethers.parseUnits("0.005", 18); // 0.005 TOKEN0 out
    const data = "0x";

    tx = await pair.swap(amount0Out, amount1Out, clientWallet, data);
    await tx.wait();
    console.log("✅ Swap executed: TOKEN1 → TOKEN0 sent to client");
}

main().catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
});
