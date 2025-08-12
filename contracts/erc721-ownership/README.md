## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
PRIVATE_KEY=<insert private key>
```

Deploy the callback contract to Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/erc721-ownership/NftOwnershipL1Module.ts --network sepolia
```

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/erc721-ownership/NftOwnershipReactiveModule.ts --network lasna
```

Request the NFT ownership (should result in a callback to Sepolia):

```bash
npx hardhat run scripts/erc721-ownership/requestOwnership.ts --network sepolia
```

Pause the reactive contract:

```bash
npx hardhat run scripts/erc721-ownership/pauseOwnershipReactive.ts --network lasna
```

Resume the reactive contract if needed:

```bash
npx hardhat run scripts/erc721-ownership/resumeOwnershipReactive.ts --network lasna
```
