```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ApprovalServiceModule.js --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ApprovalListenerModule.js --network reactive
```

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ApprovalDemoTokenModule.js --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ApprovalEthExchModule.js --network sepolia
```

```bash
npx hardhat run scripts/approval-magic/subscribeExchange.js --network sepolia
```

```bash
npx hardhat run scripts/approval-magic/approveTokenTransfer.js --network sepolia
```

## Magic Swap

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ApprovalTokensModule.js --network sepolia
```

```bash
npx hardhat run scripts/approval-magic/createPair.js --network sepolia
```

```bash
npx hardhat run scripts/approval-magic/addLiquidityAndMint.js --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ApprovalMagicSwapModule.js --network sepolia
```


```bash
npx hardhat run scripts/approval-magic/subscribeSwap.js --network sepolia
```

```bash
npx hardhat run scripts/approval-magic/approveTokenToSwap.js --network sepolia
```