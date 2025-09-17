## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
PRIVATE_KEY=<insert private key>
```

### Step 1 — Deploy to Sepolia

Deploy the callback contract to Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/erc721-ownership/NftOwnershipL1Module.ts --network sepolia
```

> ℹ️ **Nonce Issue**
>
> When encounter an error like:
>
> ```
> IGN405: The next nonce for <your wallet> should be X, but is X + 1
> ```
>
> wait 30 seconds and run the same deployment command again.

### Step 2 — Deploy to Reactive

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/erc721-ownership/NftOwnershipReactiveModule.ts --network lasna
```

### Step 3 — Request Ownership

Request the NFT ownership (should result in a callback to Sepolia):

```bash
npx hardhat run scripts/erc721-ownership/requestOwnership.ts --network sepolia
```

### Step 4 — Reactive Contract Pause

Pause the reactive contract:

```bash
npx hardhat run scripts/erc721-ownership/pauseOwnershipReactive.ts --network lasna
```

Resume the reactive contract if needed:

```bash
npx hardhat run scripts/erc721-ownership/resumeOwnershipReactive.ts --network lasna
```

### Hardhat Reset

Should you need to run the demo anew, remove the old deployment data before starting over:

```bash
rm -rf ignition/deployments/chain-{11155111,5318007}
```

or add a `--reset` flag when run a module to Sepolia or Lasna:

```bash
npx hardhat ignition deploy $PATH --network $NETWORK --reset
```