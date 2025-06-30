## Deployment & Testing

### Environment Variables

Before proceeding further, configure these environment variables:

```env
REACTIVE_RPC=https://kopli-rpc.rnk.dev/
REACTIVE_PRIVATE_KEY=<insert private key>
REACTIVE_CHAIN_ID=5318008
SYSTEM_CONTRACT=0x0000000000000000000000000000000000fffFfF
CRON10=0x04463f7c1651e6b9774d7f85c85bb94654e3c46ca79b0c16fb16d4183307b687
CRON_REACTIVE_ADDR=<from Step 1>
```

### Step 1 — Reactive Contract

Deploy `BasicCronContract`. In our module, we subscribe to `Cron10`.

```bash
npx hardhat ignition deploy ./ignition/modules/cron/CronDemoModule.js --network reactive
```

### Step 2 — Cron Pause (Optional)

To pause the cron subscription, run this command:

```bash
npx hardhat run scripts/cron/pauseCron.js --network reactive
```

To resume the cron subscription, run this command:

```bash
npx hardhat run scripts/cron/resumeCron.js --network reactive
```