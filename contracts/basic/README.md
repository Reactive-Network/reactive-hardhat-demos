## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
PRIVATE_KEY=<insert private key>
```

### Step 1 — Deploy to Sepolia

Deploy the origin and callback contracts to Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/basic/OriginCallbackModule.ts --network sepolia
```

### Step 2 — Deploy to Reactive

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/basic/ReactiveModule.ts --network lasna
```

### Step 3 — Trigger the Event/Callback

Send 0.001 sepEth to the origin contract:

```bash
npx hardhat run scripts/basic/sendEthToOrigin.ts --network sepolia
```

### Hardhat Reset

To run the demo anew, add a `--reset` flag when run a module to Sepolia or Lasna:

```bash
npx hardhat ignition deploy $PATH --network $NETWORK --reset
```