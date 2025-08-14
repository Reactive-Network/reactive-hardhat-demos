import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import fs from "fs";
import path from "path";

const addressesPath = path.resolve(
    __dirname,
    "../../deployments/chain-11155111/deployed_addresses.json"
);

interface DeployedAddresses {
    [key: string]: string;
}

let deployedAddresses: DeployedAddresses = {};
try {
    const jsonRaw = fs.readFileSync(addressesPath, "utf8");
    deployedAddresses = JSON.parse(jsonRaw) as DeployedAddresses;
} catch (e) {
    console.warn(`⚠️ Could not load deployed addresses: ${(e as Error).message}`);
}

const SepoliaModule = buildModule("SepoliaModule", (m) => {
    const tokenExchange = m.contract("ApprovalDemoToken", ["FTW", "FTW"], { id: "TokenExchange" });
    const tokenSwap1    = m.contract("ApprovalDemoToken", ["TK1", "TK1"], { id: "TokenSwap1" });
    const tokenSwap2    = m.contract("ApprovalDemoToken", ["TK2", "TK2"], { id: "TokenSwap2" });

    const approvalService = m.contract(
        "ApprovalService",
        [
            "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA",
            123n,
            2n,
            35000n
        ],
        { value: 200000000000000n }
    );

    const approvalEthExch = m.contract(
        "ApprovalEthExch",
        [approvalService, tokenExchange],
        { value: 100000000000000n }
    );

    const approvalMagicSwap = m.contract(
        "ApprovalMagicSwap",
        [approvalService, tokenSwap1, tokenSwap2],
        { value: 100000000000000n }
    );

    return {
        tokenExchange,
        tokenSwap1,
        tokenSwap2,
        approvalService,
        approvalEthExch,
        approvalMagicSwap
    };
});

export default SepoliaModule;
