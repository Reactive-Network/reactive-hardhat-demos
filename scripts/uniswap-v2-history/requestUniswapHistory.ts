require("dotenv").config({ override: true });
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { ethers } = require("ethers");

const ENV_PATH = path.resolve(__dirname, "../../.env");
const SEPOLIA_STATE_PATH = path.resolve(__dirname, "../../ignition/deployments/chain-11155111/deployed_addresses.json");
const LASNA_STATE_PATH = path.resolve(__dirname, "../../ignition/deployments/chain-5318007/deployed_addresses.json");

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

function extractSepoliaAddress() {
    const state = JSON.parse(fs.readFileSync(SEPOLIA_STATE_PATH, "utf8"));
    const l1 = state["UniswapHistoryDemoL1Module#UniswapHistoryDemoL1"];
    if (!l1) throw new Error("❌ Could not find UniswapHistoryDemoL1 address");
    return l1;
}

function extractLasnaAddress() {
    const state = JSON.parse(fs.readFileSync(LASNA_STATE_PATH, "utf8"));
    const reactive = state["UniswapHistoryDemoReactiveModule#UniswapHistoryDemoReactive"];
    if (!reactive) throw new Error("❌ Could not find UniswapHistoryDemoReactive address");
    return reactive;
}

async function callUniswapRequest() {
    const contractAddress = process.env.UNISWAP_L1_ADDR;
    const pairAddress = process.env.ACTIVE_PAIR_ADDR;
    const blockNumber = process.env.BLOCK_NUMBER;
    const rpc = process.env.DESTINATION_RPC;
    const key = process.env.DESTINATION_PRIVATE_KEY;

    if (!contractAddress || !pairAddress || !blockNumber || !rpc || !key) {
        throw new Error("Missing required .env variables for request()");
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(key, provider);

    const abi = ["function request(address pair, uint256 block_number) external"];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log(`📤 Sending request for pair ${pairAddress} at block ${blockNumber}...`);
    const tx = await contract.request(pairAddress, blockNumber);
    await tx.wait();
    console.log(`✅ Request sent. Tx hash: ${tx.hash}`);
}

async function pauseReactiveContract() {
    const contractAddress = process.env.UNISWAP_REACTIVE_ADDR;
    const rpc = process.env.LASNA_RPC;
    const key = process.env.LASNA_PRIVATE_KEY;

    if (!contractAddress || !rpc || !key) {
        throw new Error("Missing UNISWAP_REACTIVE_ADDR, LASNA_RPC, or LASNA_PRIVATE_KEY in .env");
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(key, provider);

    const abi = ["function pause() external"];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const tx = await contract.pause({ gasLimit: 1000000 });
    console.log(`⏸️ Pause transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("✅ Contract paused.");
}

async function main() {
    console.log("🚀 Step 1: Deploying UniswapHistoryDemoL1 to Sepolia...");
    execSync("npx hardhat ignition deploy ignition/modules/uniswap-v2-history/UniswapHistoryL1Module.ts --network sepolia", {
        stdio: "inherit"
    });

    const UNISWAP_L1_ADDR = extractSepoliaAddress();
    updateEnv({ UNISWAP_L1_ADDR });
    require("dotenv").config({ override: true });
    console.log("→ UNISWAP_L1_ADDR:", UNISWAP_L1_ADDR);

    console.log("\n🚀 Step 2: Deploying UniswapHistoryDemoReactive to Lasna...");
    execSync("npx hardhat ignition deploy ignition/modules/uniswap-v2-history/UniswapHistoryReactiveModule.ts --network lasna", {
        stdio: "inherit"
    });

    const UNISWAP_REACTIVE_ADDR = extractLasnaAddress();
    updateEnv({ UNISWAP_REACTIVE_ADDR });
    require("dotenv").config({ override: true });
    console.log("→ UNISWAP_REACTIVE_ADDR:", UNISWAP_REACTIVE_ADDR);

    console.log("\n🚀 Step 3: Calling request() on L1...");
    await callUniswapRequest();

    console.log("\n🚀 Step 4: Pausing Reactive contract...");
    await pauseReactiveContract();

    console.log("\n✅ All steps completed successfully.");
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
