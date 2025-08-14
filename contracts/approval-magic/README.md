
```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/SepoliaModule.ts --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ApprovalServiceTokensModule.ts --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ApprovalListenerModule.ts --network lasna
```

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ExchangeModule.ts --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/SwapModule.ts --network sepolia
```




```bash
npx hardhat run scripts/approval-magic/subscribeApproveExchange.ts --network sepolia
```

```bash
npx hardhat run scripts/approval-magic/subscribeApproveSwap.ts --network sepolia
```




```bash
rm -rf ignition/deployments/chain-11155111
rm -rf ignition/deployments/chain-5318007
```




