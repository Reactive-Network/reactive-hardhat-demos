### Deploy Basic Demo

CLIENT_WALLET=<insert wallet address>


```bash
node scripts/approval-magic/deployApprovalExchange.js
```


```bash
node scripts/approval-magic/deployApprovalSwap.js
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