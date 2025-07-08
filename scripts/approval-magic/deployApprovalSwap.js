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
        TOKEN1_ADDR: state["ApprovalToken1Module#ApprovalDemoToken1"],
        TOKEN2_ADDR: state["ApprovalToken2Module#ApprovalDemoToken2"],
        SWAP_ADDR: state["ApprovalMagicSwapModule#ApprovalMagicSwap"],
        APPROVAL_SRV_ADDR: state["ApprovalServiceModule#ApprovalService"],
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

function checkEnvVars(required) {
    const missing = required.filter(k => !process.env[k]);
    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }
}

async function main() {
    checkEnvVars(["DESTINATION_RPC", "DESTINATION_PRIVATE_KEY"]);

    const provider = new ethers.JsonRpcProvider(process.env.DESTINATION_RPC);
    const wallet = new ethers.Wallet(process.env.DESTINATION_PRIVATE_KEY, provider);

    console.log("🚀 Step 1a: Deploy TOKEN1...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalToken1Module.js --network sepolia", { stdio: "inherit" });

    console.log("🚀 Step 1b: Deploy TOKEN2...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalToken2Module.js --network sepolia", { stdio: "inherit" });

    console.log("🚀 Step 2: Deploy ApprovalService on Sepolia...");
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalServiceModule.js --network sepolia", { stdio: "inherit" });

    const { TOKEN1_ADDR, TOKEN2_ADDR, APPROVAL_SRV_ADDR } = extractSepoliaAddresses();
    updateEnv({ TOKEN1_ADDR, TOKEN2_ADDR, APPROVAL_SRV_ADDR });

    console.log("🚀 Step 3: Deploy ApprovalListener on Lasna...");
    require("dotenv").config({ override: true });
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalListenerModule.js --network lasna", { stdio: "inherit" });

    const { LISTENER_ADDR } = extractLasnaAddress();
    updateEnv({ LISTENER_ADDR });

    console.log("🚀 Step 4: Creating or fetching Uniswap pair...");

    const factoryAddress = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
    const factoryAbi = [
        "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
        "function getPair(address,address) external view returns (address)",
        "function createPair(address,address) external returns (address)"
    ];

    const factory = new ethers.Contract(factoryAddress, factoryAbi, wallet);
    let pairAddr = await factory.getPair(TOKEN1_ADDR, TOKEN2_ADDR);

    if (pairAddr === ethers.ZeroAddress) {
        console.log("🔨 No pair found. Creating new pair...");
        const tx = await factory.createPair(TOKEN1_ADDR, TOKEN2_ADDR);
        const receipt = await tx.wait();

        const iface = new ethers.Interface(factoryAbi);
        const log = receipt.logs.find(log => {
            try {
                return iface.parseLog(log).name === "PairCreated";
            } catch {
                return false;
            }
        });

        if (!log) throw new Error("❌ PairCreated event not found");

        const parsed = iface.parseLog(log);
        pairAddr = parsed.args.pair;
        console.log(`✅ Pair created at ${pairAddr}`);
    } else {
        console.log(`✅ Pair already exists at ${pairAddr}`);
    }

    console.log("💰 Transferring tokens to pair...");
    const erc20Abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
    const token1 = new ethers.Contract(TOKEN1_ADDR, erc20Abi, wallet);
    const token2 = new ethers.Contract(TOKEN2_ADDR, erc20Abi, wallet);

    const tx1 = await token1.transfer(pairAddr, ethers.parseEther("0.5"));
    await tx1.wait();

    const tx2 = await token2.transfer(pairAddr, ethers.parseEther("0.5"));
    await tx2.wait();

    console.log("🧪 Minting LP tokens...");
    const pairAbi = ["function mint(address to) external returns (uint liquidity)"];
    const pair = new ethers.Contract(pairAddr, pairAbi, wallet);

    const mintTx = await pair.mint(wallet.address);
    await mintTx.wait();

    console.log("✅ LP tokens minted successfully.");
    updateEnv({ UNISWAP_PAIR_ADDR: pairAddr });

    console.log("⏳ Waiting 30 seconds for LP to clear");
    await sleep(30000);

    console.log("🚀 Step 5: Deploy Swap contract...");
    require("dotenv").config({ override: true });
    execSync("npx hardhat ignition deploy ignition/modules/approval-magic/ApprovalMagicSwapModule.js --network sepolia", { stdio: "inherit" });

    const { SWAP_ADDR } = extractSepoliaAddresses();
    updateEnv({ SWAP_ADDR });

    console.log("🚀 Step 6: Subscribe Swap contract...");
    await subscribe(SWAP_ADDR);

    console.log("⏳ Waiting 40 seconds for subscription propagation...");
    await sleep(40000);

    console.log("🚀 Step 7: Approving TOKEN1 for Swap contract...");
    await approve(TOKEN1_ADDR, SWAP_ADDR);

    console.log("\n🎉 Approval Swap deployment complete.");
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
