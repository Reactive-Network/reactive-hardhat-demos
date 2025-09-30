## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
EOA_WALLET=<insert EOA wallet address>
PRIVATE_KEY=<insert private key>
```

### Step 1 — Deploy to Sepolia

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-stop-order/StopOrderSepoliaModule.ts --network sepolia
```

### Step 2 — Create Uniswap v2 Pair

```bash
npx hardhat run scripts/uniswap-v2-stop-order/createPair.ts --network sepolia
```

### Step 3 — Deploy to Reactive

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-stop-order/StopOrderReactiveModule.ts --network lasna
```

### Step 4 — Approve & Swap

```bash
npx hardhat run scripts/uniswap-v2-stop-order/authorizeTriggerCallback.ts --network sepolia
```

### Hardhat Reset

To run the demo anew, add a `--reset` flag when run a module to Sepolia or Lasna:

```bash
npx hardhat ignition deploy $PATH --network $NETWORK --reset
```