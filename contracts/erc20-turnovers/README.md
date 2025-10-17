## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
PRIVATE_KEY=<insert private key>
```

### Step 1 — Deploy to Sepolia

Deploy the callback contract to Ethereum Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverL1Module.ts --network sepolia
```

### Step 2 — Deploy to Reactive

Deploy the reactive contract to Reactive Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverReactiveModule.ts --network lasna
```

### Step 3 — Request Turnovers

Request the USDT turnovers. This should result in a callback to Ethereum Sepolia:

```bash
npx hardhat run scripts/erc20-turnovers/requestTurnovers.ts --network sepolia
```

### Step 4 — Reactive Contract Pause

Pause the reactive contract:

```bash
npx hardhat run scripts/erc20-turnovers/pauseTurnoverReactive.ts --network lasna
```

Resume the reactive contract if needed:

```bash
npx hardhat run scripts/erc20-turnovers/resumeTurnoverReactive.ts --network lasna
```

### Hardhat Reset

To run the demo anew, add a `--reset` flag when run a module to Ethereum Sepolia or Reactive Lasna:

```bash
npx hardhat ignition deploy $PATH --network $NETWORK --reset
```