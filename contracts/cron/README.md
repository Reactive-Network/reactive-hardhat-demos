## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
PRIVATE_KEY=<insert private key>
```

### Step 1 — Reactive Contract

Deploy `BasicCronContract`. In our module, we subscribe to `Cron10`.

```bash
npx hardhat ignition deploy ./ignition/modules/cron/CronDemoModule.ts --network lasna
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

### Step 2 — Cron Pause

To pause the contract:

```bash
npx hardhat run scripts/cron/pauseCron.ts --network lasna
```

To resume the contract:

```bash
npx hardhat run scripts/cron/resumeCron.ts --network lasna
```