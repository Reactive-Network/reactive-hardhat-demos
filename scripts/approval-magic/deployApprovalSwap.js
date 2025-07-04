require("dotenv").config({ override: true });
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

    return {
        TOKEN1_ADDR: state["ApprovalToken1Module#ApprovalDemoToken1"],
        TOKEN2_ADDR: state["ApprovalToken2Module#ApprovalDemoToken2"],
        SWAP_ADDR: state["ApprovalMagicSwapModule#ApprovalMagicSwap"],
    };
}

async function subscribe(contractAddr) {
    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const wallet = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);
    const abi = ["function subscribe() external payable"];
    const contract = new ethers.Contract(contractAddr, abi, wallet);

    console.log("📨 Sending subscribe transaction...");
    try {
        const tx = await contract.subscribe();
        console.log("➡️ Sent:", tx.hash);
        await tx.wait();
        console.log("✅ Subscribed successfully.");
    } catch (err) {
        const alreadySubscribed =
            err.reason?.includes("Already subscribed") ||
            err.shortMessage?.includes("Already subscribed") ||
            err.message?.includes("Already subscribed");

        if (alreadySubscribed) {
            console.warn("⚠️ Already subscribed. Skipping...");
        } else {
            throw err;
        }
    }
}

async function approve(tokenAddr, spenderAddr) {
    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const wallet = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);
    const abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
    const contract = new ethers.Contract(tokenAddr, abi, wallet);

    const amount = ethers.parseEther("0.1");
    console.log("📨 Approving token transfer...");
    const tx = await contract.approve(spenderAddr, amount);
    await tx.wait();
    console.log("✅ Approval complete.");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkEnvVars(required) {
    const missing = required.filter(k => !process.env[k]);
    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }
}

async function main() {
    checkEnvVars(["APPROVAL_SRV_ADDR", "DESTINATION_RPC", "DESTINATION_PRIVATE_KEY"]);

    console.log("🚀 Step 1a: Deploy TOKEN1...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalToken1Module.js --network sepolia", { stdio: "inherit" });

    console.log("🚀 Step 1b: Deploy TOKEN2...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalToken2Module.js --network sepolia", { stdio: "inherit" });

    const { TOKEN1_ADDR, TOKEN2_ADDR } = extractSepoliaAddresses();
    updateEnv({ TOKEN1_ADDR, TOKEN2_ADDR });

    console.log("🚀 Step 2: Deploy Swap contract...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalMagicSwapModule.js --network sepolia", { stdio: "inherit" });

    const { SWAP_ADDR } = extractSepoliaAddresses();
    updateEnv({ SWAP_ADDR });

    console.log("🚀 Step 3: Subscribe Swap contract...");
    await subscribe(SWAP_ADDR);

    console.log("⏳ Waiting 30 seconds for subscription propagation...");
    await sleep(30000);

    console.log("🚀 Step 4: Approving TOKEN1 for Swap contract...");
    await approve(TOKEN1_ADDR, SWAP_ADDR);

    console.log("\n🎉 Swap deployment complete.");
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
