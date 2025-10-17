## Deployment & Testing

Before proceeding further, add your EOA wallet address and private key to the `.env` file:

```env
EOA_WALLET=<insert EOA wallet address>
PRIVATE_KEY=<insert private key>
```

### Step 1 — Deploy to Sepolia

Deploy all necessary contracts to Ethereum Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/SepoliaModule.ts --network sepolia
```

### Step 2 — Deploy to Reactive

Deploy the reactive contract to Reactive Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/approval-magic/ReactiveModule.ts --network lasna
```

### Step 3 — Uniswap Pool

Create a Uniswap V2 Pair:

```bash
npx hardhat run scripts/approval-magic/createPair.ts --network sepolia
```

### Step 4 — Subscribe & Approve

Subscribe to the service contract and approve the transfers:

```bash
npx hardhat run scripts/approval-magic/subscribeApprove.ts --network sepolia
```

### Hardhat Reset

To run the demo anew, add a `--reset` flag when run a module to Ethereum Sepolia or Reactive Lasna:

```bash
npx hardhat ignition deploy $PATH --network $NETWORK --reset
```