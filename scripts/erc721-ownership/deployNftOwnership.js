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
    const l1 = state["NftOwnershipL1Module#NftOwnershipL1"];
    if (!l1) throw new Error("❌ Could not find NftOwnershipL1 address");
    return l1;
}

function extractLasnaAddress() {
    const state = JSON.parse(fs.readFileSync(LASNA_STATE_PATH, "utf8"));
    const reactive = state["NftOwnershipReactiveModule#NftOwnershipReactive"];
    if (!reactive) throw new Error("❌ Could not find NftOwnershipReactive address");
    return reactive;
}

async function callNftRequest() {
    const contractAddress = process.env.OWNERSHIP_L1_ADDR;
    const tokenAddress = process.env.ACTIVE_TOKEN_ADDR;
    const tokenId = parseInt(process.env.ACTIVE_TOKEN_ID);
    const rpc = process.env.DESTINATION_RPC;
    const key = process.env.DESTINATION_PRIVATE_KEY;

    if (!contractAddress || !tokenAddress || !tokenId || !rpc || !key) {
        throw new Error("Missing required .env variables for request()");
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(key, provider);

    const abi = ["function request(address token, uint256 token_id) external"];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log(`📤 Sending NFT request for token ${tokenAddress}, ID ${tokenId}...`);
    const tx = await contract.request(tokenAddress, tokenId);
    await tx.wait();
    console.log(`✅ Request sent. Tx hash: ${tx.hash}`);
}

async function pauseReactiveContract() {
    const contractAddress = process.env.OWNERSHIP_REACTIVE_ADDR;
    const rpc = process.env.LASNA_RPC;
    const key = process.env.LASNA_PRIVATE_KEY;

    if (!contractAddress || !rpc || !key) {
        throw new Error("Missing OWNERSHIP_REACTIVE_ADDR, LASNA_RPC, or LASNA_PRIVATE_KEY in .env");
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
    console.log("🚀 Step 1: Deploying NftOwnershipL1 to Sepolia...");
    execSync("npx hardhat ignition deploy ignition/modules/erc721-ownership/NftOwnershipL1Module.js --network sepolia", {
        stdio: "inherit"
    });

    const OWNERSHIP_L1_ADDR = extractSepoliaAddress();
    updateEnv({ OWNERSHIP_L1_ADDR });
    require("dotenv").config({ override: true });
    console.log("→ OWNERSHIP_L1_ADDR:", OWNERSHIP_L1_ADDR);

    console.log("\n🚀 Step 2: Deploying NftOwnershipReactive to Lasna...");
    execSync("npx hardhat ignition deploy ignition/modules/erc721-ownership/NftOwnershipReactiveModule.js --network lasna", {
        stdio: "inherit"
    });

    const OWNERSHIP_REACTIVE_ADDR = extractLasnaAddress();
    updateEnv({ OWNERSHIP_REACTIVE_ADDR });
    require("dotenv").config({ override: true });
    console.log("→ OWNERSHIP_REACTIVE_ADDR:", OWNERSHIP_REACTIVE_ADDR);

    console.log("\n🚀 Step 3: Calling request() on L1...");
    await callNftRequest();

    console.log("\n🚀 Step 4: Pausing Reactive contract...");
    await pauseReactiveContract();

    console.log("\n✅ All steps completed successfully.");
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
