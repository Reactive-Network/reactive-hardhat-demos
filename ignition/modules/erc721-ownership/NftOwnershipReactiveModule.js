require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NftOwnershipReactiveModule = buildModule("NftOwnershipReactiveModule", (m) => {
    const l1Address = process.env.OWNERSHIP_L1_ADDR;

    if (!l1Address) {
        throw new Error("Missing OWNERSHIP_L1_ADDR in .env file");
    }

    const nftOwnershipReactive = m.contract("NftOwnershipReactive", [l1Address], {
        value: 1000000000000000000n, // 1 ether
    });

    return { nftOwnershipReactive };
});

module.exports = NftOwnershipReactiveModule;
