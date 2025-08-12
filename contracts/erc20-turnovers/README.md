## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
PRIVATE_KEY=<insert private key>
```

Deploy the callback contract to Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverL1Module.ts --network sepolia
```

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverReactiveModule.ts --network lasna
```

Request the USDT turnovers (should result in a callback to Sepolia):

```bash
npx hardhat run scripts/erc20-turnovers/requestTurnovers.ts --network sepolia
```

Pause the reactive contract:

```bash
npx hardhat run scripts/erc20-turnovers/pauseTurnoverReactive.ts --network lasna
```

Resume the reactive contract if needed:

```bash
npx hardhat run scripts/erc20-turnovers/resumeTurnoverReactive.ts --network lasna
```
