require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { ethers } = require("ethers");

const ENV_PATH = path.resolve(__dirname, "../../.env");
const SEPOLIA_STATE_PATH = path.resolve(__dirname, "../../ignition/deployments/chain-11155111/deployed_addresses.json");

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

    const origin = state["OriginCallbackModule#BasicDemoL1Contract"];
    const callback = state["OriginCallbackModule#BasicDemoL1Callback"];

    if (!origin || !callback) {
        throw new Error("❌ Could not find Sepolia contract addresses in deployed_addresses.json");
    }

    return {
        ORIGIN_CONTRACT: origin,
        CALLBACK_CONTRACT: callback,
    };
}


async function sendFundingToOrigin(originAddress) {
    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const wallet = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
        to: originAddress,
        value: ethers.parseEther("0.001"),
    });

    console.log("📤 Funding transaction sent:", tx.hash);
    await tx.wait();
    console.log("✅ Origin contract funded with 0.001 ETH");
}

async function main() {
    console.log("🚀 Step 1: Deploying Origin & Callback to Sepolia...");
    execSync(
        "npx hardhat ignition deploy ignition/modules/basic/OriginCallbackModule.js --network sepolia",
        { stdio: "inherit" }
    );

    const { ORIGIN_CONTRACT, CALLBACK_CONTRACT } = extractSepoliaAddresses();
    console.log("📦 Extracted addresses:");
    console.log("→ ORIGIN_CONTRACT:", ORIGIN_CONTRACT);
    console.log("→ CALLBACK_CONTRACT:", CALLBACK_CONTRACT);

    updateEnv({ ORIGIN_CONTRACT, CALLBACK_CONTRACT });

    console.log("\n🚀 Step 2: Deploying Reactive contract");
    execSync(
        "npx hardhat ignition deploy ignition/modules/basic/ReactiveModule.js --network lasna",
        { stdio: "inherit" }
    );

    console.log("\n🚀 Step 3: Sending 0.001 ETH to Origin contract...");
    await sendFundingToOrigin(ORIGIN_CONTRACT);

    console.log("\n✅ All steps completed successfully.");
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
