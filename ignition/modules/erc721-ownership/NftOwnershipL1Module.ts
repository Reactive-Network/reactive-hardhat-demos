import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NftOwnershipL1Module = buildModule("NftOwnershipL1Module", (m) => {
    const callbackProxy: string = "0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA";

    const nftOwnershipL1 = m.contract("NftOwnershipL1", [callbackProxy], {
        value: 20000000000000000n, // 0.02 ether
    });

    return { nftOwnershipL1 };
});

export default NftOwnershipL1Module;
