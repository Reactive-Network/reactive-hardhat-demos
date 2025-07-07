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

function extractSepoliaAddresses() {
    const state = JSON.parse(fs.readFileSync(SEPOLIA_STATE_PATH, "utf8"));

    return {
        APPROVAL_SRV_ADDR: state["ApprovalServiceModule#ApprovalService"],
        TOKEN_ADDR: state["ApprovalDemoTokenModule#ApprovalDemoToken"],
        EXCH_ADDR: state["ApprovalEthExchModule#ApprovalEthExch"],
    };
}

function extractLasnaAddress() {
    const state = JSON.parse(fs.readFileSync(LASNA_STATE_PATH, "utf8"));
    return {
        LISTENER_ADDR: state["ApprovalListenerModule#ApprovalListener"]
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

    const amount = 1000n; // 1000 wei

    console.log("📨 Approving token transfer...");
    try {
        const tx = await contract.approve(spenderAddr, amount);
        console.log("➡️ Sent:", tx.hash);
        await tx.wait();
        console.log("✅ Approval complete.");
    } catch (err) {
        console.error("❌ Approval failed:", err);
        throw err;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("🚀 Step 1: Deploy ApprovalService...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalServiceModule.js --network sepolia", { stdio: "inherit" });

    console.log("🚀 Step 2: Deploy Demo Token...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalDemoTokenModule.js --network sepolia", { stdio: "inherit" });

    const { APPROVAL_SRV_ADDR, TOKEN_ADDR } = extractSepoliaAddresses();
    updateEnv({ APPROVAL_SRV_ADDR, TOKEN_ADDR });

    console.log("🚀 Step 3: Deploy Listener to Lasna...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalListenerModule.js --network lasna", { stdio: "inherit" });

    const { LISTENER_ADDR } = extractLasnaAddress();
    updateEnv({ LISTENER_ADDR });

    console.log("🚀 Step 4: Deploy Exchange to Sepolia...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalEthExchModule.js --network sepolia", { stdio: "inherit" });

    const { EXCH_ADDR } = extractSepoliaAddresses();
    updateEnv({ EXCH_ADDR });

    console.log("🚀 Step 5: Subscribe Exchange...");
    await subscribe(EXCH_ADDR);

    console.log("⏳ Waiting 40 seconds for subscription propagation...");
    await sleep(40000);

    console.log("🚀 Step 6: Approve Token for Exchange...");
    await approve(TOKEN_ADDR, EXCH_ADDR);

    console.log("\n🎉 Approval Exchange deployment complete.");
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
