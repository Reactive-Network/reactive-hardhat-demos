require("dotenv").config({ override: true });
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { ethers } = require("ethers");

const ENV_PATH = path.resolve(__dirname, "../../.env");
const SEPOLIA_STATE_PATH = path.resolve(__dirname, "../../ignition/deployments/chain-11155111/deployed_addresses.json");
const LASNA_STATE_PATH = path.resolve(__dirname, "../../ignition/deployments/chain-5318007/deployed_addresses.json");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateEnv(vars) {
    let env = fs.readFileSync(ENV_PATH, "utf8");

    for (const [key, value] of Object.entries(vars)) {
        const regex = new RegExp(`^${key}=.*$`, "m");
        if (regex.test(env)) {
            env = env.replace(regex, `${key}=${value}`);
        } else {
            env += `\n${key}=${value}`;
        }
    }

    fs.writeFileSync(ENV_PATH, env);
    console.log("✅ .env updated with deployed addresses");
}

function extractSepoliaAddresses() {
    const state = JSON.parse(fs.readFileSync(SEPOLIA_STATE_PATH, "utf8"));
    const addr1 = state["UniswapToken1Module#TokenTK1"];
    const addr2 = state["UniswapToken2Module#TokenTK2"];

    if (!addr1 || !addr2) {
        throw new Error("❌ One or both token addresses not found in Sepolia state.");
    }

    const [token0, token1] = (BigInt(addr1) < BigInt(addr2))
        ? [addr1, addr2]
        : [addr2, addr1];

    return {
        TOKEN0_ADDR: token0,
        TOKEN1_ADDR: token1,
        CALLBACK_ADDR: state["StopOrderCallbackModule#UniswapStopOrderCallback"] || "",
    };
}

function extractLasnaAddress() {
    const state = JSON.parse(fs.readFileSync(LASNA_STATE_PATH, "utf8"));
    return {
        REACTIVE_ADDR: state["StopOrderReactiveModule#UniswapDemoStopOrderReactive"]
    };
}

async function main() {
    const requiredVars = ["DESTINATION_RPC", "DESTINATION_PRIVATE_KEY", "CLIENT_WALLET"];
    const missing = requiredVars.filter(k => !process.env[k]);
    if (missing.length > 0) throw new Error(`Missing env vars: ${missing.join(", ")}`);

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const wallet = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    console.log("🚀 Step 1: Deploy tokens to Sepolia...");
    execSync("npx hardhat ignition deploy ignition/modules/uniswap-v2-stop-order/UniswapToken1Module.js --network sepolia", { stdio: "inherit" });
    execSync("npx hardhat ignition deploy ignition/modules/uniswap-v2-stop-order/UniswapToken2Module.js --network sepolia", { stdio: "inherit" });

    const { TOKEN0_ADDR, TOKEN1_ADDR } = extractSepoliaAddresses();

    console.log("🏭 Step 2: Create Uniswap V2 pair...");
    const factoryAddr = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
    const factoryAbi = [
        "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
        "function getPair(address,address) view returns (address)",
        "function createPair(address,address) returns (address)"
    ];
    const factory = new ethers.Contract(factoryAddr, factoryAbi, wallet);
    let pairAddr = await factory.getPair(TOKEN0_ADDR, TOKEN1_ADDR);

    if (pairAddr === ethers.ZeroAddress) {
        const tx = await factory.createPair(TOKEN0_ADDR, TOKEN1_ADDR);
        const receipt = await tx.wait();
        const iface = new ethers.Interface(factoryAbi);
        const log = receipt.logs.find(l => {
            try { return iface.parseLog(l).name === "PairCreated"; }
            catch { return false; }
        });
        pairAddr = iface.parseLog(log).args.pair;
        console.log("✅ Pair created:", pairAddr);
    } else {
        console.log("✅ Pair already exists:", pairAddr);
    }

    console.log("🕒 Waiting 60 seconds for confirmations before deploying callback...");
    await sleep(60000);

    console.log("🔁 Step 4: Deploy callback on Sepolia...");
    execSync("npx hardhat ignition deploy ignition/modules/uniswap-v2-stop-order/StopOrderCallbackModule.js --network sepolia", { stdio: "inherit" });
    await sleep(5000);

    const { CALLBACK_ADDR } = extractSepoliaAddresses();
    updateEnv({ TOKEN0_ADDR, TOKEN1_ADDR, CALLBACK_ADDR, UNISWAP_V2_PAIR_ADDR: pairAddr });

    console.log("💰 Step 5: Fund pair and mint LP tokens...");
    const erc20Abi = ["function transfer(address to, uint256 amount) returns (bool)"];
    const pairAbi = ["function mint(address to) returns (uint liquidity)"];
    const token0 = new ethers.Contract(TOKEN0_ADDR, erc20Abi, wallet);
    const token1 = new ethers.Contract(TOKEN1_ADDR, erc20Abi, wallet);
    const pair = new ethers.Contract(pairAddr, pairAbi, wallet);

    const amt = ethers.parseEther("10");
    await (await token0.transfer(pairAddr, amt)).wait();
    await (await token1.transfer(pairAddr, amt)).wait();
    await (await pair.mint(process.env.CLIENT_WALLET)).wait();
    console.log("✅ LP tokens minted");

    console.log("🚀 Step 6: Deploy StopOrderReactive on Lasna...");
    execSync("npx hardhat ignition deploy ignition/modules/uniswap-v2-stop-order/StopOrderReactiveModule.js --network lasna", { stdio: "inherit" });

    const { REACTIVE_ADDR } = extractLasnaAddress();
    updateEnv({ REACTIVE_ADDR });

    console.log("🔐 Step 7: Authorize CALLBACK to spend TOKEN1 and execute swap...");

    const approveAbi = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function transfer(address to, uint256 amount) external returns (bool)"
    ];
    const swapAbi = [
        "function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external"
    ];

    const token1Contract = new ethers.Contract(TOKEN1_ADDR, approveAbi, wallet);
    const pairContract = new ethers.Contract(pairAddr, swapAbi, wallet);

    const approveAmount = ethers.parseUnits("1", 18); // 1 TOKEN1
    let tx = await token1Contract.approve(CALLBACK_ADDR, approveAmount);
    await tx.wait();
    console.log("✅ Approved CALLBACK contract to spend TOKEN1");

    const transferAmount = ethers.parseUnits("0.02", 18); // 0.02 TOKEN1
    tx = await token1Contract.transfer(pairAddr, transferAmount);
    await tx.wait();
    console.log("✅ Transferred TOKEN1 to UniswapV2 Pair");

    const amount0Out = ethers.parseUnits("0.005", 18);
    const amount1Out = 0;
    const data = "0x";

    tx = await pairContract.swap(amount0Out, amount1Out, process.env.CLIENT_WALLET, data);
    await tx.wait();
    console.log("✅ Swap executed: TOKEN1 → TOKEN0 sent to client");

    console.log("✅ StopOrderDemo deployment and interaction complete!");
    console.log("\n--- Addresses ---");
    console.log("TOKEN0_ADDR =", TOKEN0_ADDR);
    console.log("TOKEN1_ADDR =", TOKEN1_ADDR);
    console.log("CALLBACK_ADDR =", CALLBACK_ADDR);
    console.log("UNISWAP_V2_PAIR_ADDR =", pairAddr);
    console.log("REACTIVE_ADDR =", REACTIVE_ADDR);
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
