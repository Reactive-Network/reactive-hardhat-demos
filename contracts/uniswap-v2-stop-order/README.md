```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-stop-order/StopOrderSepoliaModule.ts --network sepolia
```

### Step 2 — 


```bash
npx hardhat run scripts/uniswap-v2-stop-order/createPair.ts --network sepolia
```


### Step 3 — Deploy to Reactive

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-stop-order/StopOrderReactiveModule.ts --network lasna
```

### Step 4 — ...

:

```bash
npx hardhat run scripts/uniswap-v2-stop-order/authorizeTriggerCallback.ts --network sepolia
```