require("dotenv").config();
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NftOwnershipL1Module = buildModule("NftOwnershipL1Module", (m) => {
    const callbackSender = process.env.DESTINATION_CALLBACK_PROXY_ADDR;

    if (!callbackSender) {
        throw new Error("Missing DESTINATION_CALLBACK_PROXY_ADDR in .env file");
    }

    const nftOwnershipL1 = m.contract("NftOwnershipL1", [callbackSender], {
        value: 20000000000000000n, // 0.02 ether
    });

    return { nftOwnershipL1 };
});

module.exports = NftOwnershipL1Module;
