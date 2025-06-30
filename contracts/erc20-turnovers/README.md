
```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverL1Module.js --network sepolia
```


```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverReactiveModule.js --network reactive
```


```bash
npx hardhat run scripts/erc20-turnovers/sendTurnoverRequest.js --network sepolia
```

```bash
npx hardhat run scripts/erc20-turnovers/pauseTurnoverReactive.js --network reactive
```

```bash
npx hardhat run scripts/erc20-turnovers/resumeTurnoverReactive.js --network reactive
```