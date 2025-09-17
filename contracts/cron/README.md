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

### Step 2 — Cron Pause

To pause the contract:

```bash
npx hardhat run scripts/cron/pauseCron.ts --network lasna
```

To resume the contract:

```bash
npx hardhat run scripts/cron/resumeCron.ts --network lasna
```