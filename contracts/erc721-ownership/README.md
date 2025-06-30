```bash
npx hardhat ignition deploy ./ignition/modules/erc721-ownership/NftOwnershipL1Module.js --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/erc721-ownership/NftOwnershipReactiveModule.js --network reactive
```

```bash
npx hardhat run scripts/erc721-ownership/sendOwnershipRequest.js --network sepolia
```


```bash
npx hardhat run scripts/erc721-ownership/pauseOwnershipReactive.js --network reactive
```

```bash
npx hardhat run scripts/erc721-ownership/resumeOwnershipReactive.js --network reactive
```