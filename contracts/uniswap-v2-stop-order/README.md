## Deployment & Testing

### Step 1 — Deploy to Sepolia

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-stop-order/StopOrderSepoliaModule.ts --network sepolia
```

### Step 2 — Create Uniswap v2 Pair

Make sure `EOA_WALLET` is present in `reactive-hardhat-demos/.env`

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