require('dotenv').config({ override: true });
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
    const l1 = state["TokenTurnoverL1Module#TokenTurnoverL1"];
    if (!l1) throw new Error("❌ Could not find TokenTurnoverL1 address");
    return l1;
}

function extractLasnaAddress() {
    const state = JSON.parse(fs.readFileSync(LASNA_STATE_PATH, "utf8"));
    const reactive = state["TokenTurnoverReactiveModule#TokenTurnoverReactive"];
    if (!reactive) throw new Error("❌ Could not find TokenTurnoverReactive address");
    return reactive;
}

async function callTurnoverRequest() {
    const turnoverL1Address = process.env.TURNOVER_L1_ADDR;
    const usdtAddress = process.env.USDT_ADDR;
    const rpc = process.env.DESTINATION_RPC;
    const key = process.env.DESTINATION_PRIVATE_KEY;

    if (!turnoverL1Address || !usdtAddress || !rpc || !key) {
        throw new Error("Missing TURNOVER_L1_ADDR, USDT_ADDR, DESTINATION_RPC, or DESTINATION_PRIVATE_KEY in .env");
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(key, provider);

    const abi = ["function request(address token) external"];
    const contract = new ethers.Contract(turnoverL1Address, abi, wallet);

    console.log(`🟢 Sending request for token ${usdtAddress}...`);
    const tx = await contract.request(usdtAddress);
    await tx.wait();

    console.log(`✅ Request sent. Tx hash: ${tx.hash}`);
}

async function pauseReactiveContract() {
    const contractAddress = process.env.TURNOVER_REACTIVE_ADDR;
    const rpc = process.env.LASNA_RPC;
    const key = process.env.LASNA_PRIVATE_KEY;

    if (!contractAddress || !rpc || !key) {
        throw new Error("Missing TURNOVER_REACTIVE_ADDR, LASNA_RPC, or LASNA_PRIVATE_KEY in .env");
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
    console.log("🚀 Step 1: Deploying TokenTurnoverL1 to Sepolia...");
    execSync("npx hardhat ignition deploy ignition/modules/erc20-turnovers/TokenTurnoverL1Module.js --network sepolia", {
        stdio: "inherit"
    });

    const TURNOVER_L1_ADDR = extractSepoliaAddress();
    updateEnv({ TURNOVER_L1_ADDR });
    process.env.TURNOVER_L1_ADDR = TURNOVER_L1_ADDR;
    console.log("→ TURNOVER_L1_ADDR:", TURNOVER_L1_ADDR);

    console.log("\n🚀 Step 2: Deploying TokenTurnoverReactive to Lasna...");
    execSync("npx hardhat ignition deploy ignition/modules/erc20-turnovers/TokenTurnoverReactiveModule.js --network lasna", {
        stdio: "inherit"
    });

    const TURNOVER_REACTIVE_ADDR = extractLasnaAddress();
    updateEnv({ TURNOVER_REACTIVE_ADDR });
    process.env.TURNOVER_REACTIVE_ADDR = TURNOVER_REACTIVE_ADDR;
    console.log("→ TURNOVER_REACTIVE_ADDR:", TURNOVER_REACTIVE_ADDR);

    console.log("\n🚀 Step 3: Calling request() on L1 with USDT_ADDR...");
    await callTurnoverRequest();

    console.log("\n🚀 Step 4: Pausing Reactive contract...");
    await pauseReactiveContract();

    console.log("\n✅ All steps completed successfully.");
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
