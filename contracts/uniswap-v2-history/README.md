## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
EOA_WALLET=<insert EOA wallet address>
PRIVATE_KEY=<insert private key>
```

### Step 1 — Deploy to Sepolia

Deploy the callback contract to Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-history/UniswapHistoryL1Module.ts --network sepolia
```

### Step 2 — Deploy to Reactive

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-history/UniswapHistoryReactiveModule.ts --network lasna
```

### Step 3 — Request Uniswawp History

Request the Uniswap pair history (should result in a callback to Sepolia):

```bash
npx hardhat run scripts/uniswap-v2-history/requestUniswapHistory.ts --network sepolia
```

### Step 4 — Reactive Contract Pause

Pause the reactive contract:

```bash
npx hardhat run scripts/uniswap-v2-history/pauseUniswapReactive.ts --network lasna
```

Resume the reactive contract if needed:

```bash
npx hardhat run scripts/uniswap-v2-history/resumeUniswapReactive.ts --network lasna
```

### Hardhat Reset

To run the demo anew, add a `--reset` flag when run a module to Sepolia or Lasna:

```bash
npx hardhat ignition deploy $PATH --network $NETWORK --reset
```