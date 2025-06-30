## Deployment & Testing

### Environment Variables

Before proceeding further, configure these environment variables in the `.env`:

```env
DESTINATION_RPC=https://ethereum-sepolia-rpc.publicnode.com
DESTINATION_PRIVATE_KEY=<insert private key>
DESTINATION_CHAIN_ID=11155111
DESTINATION_CALLBACK_PROXY_ADDR=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
REACTIVE_RPC=https://kopli-rpc.rnk.dev/
REACTIVE_PRIVATE_KEY=<insert private key>
REACTIVE_CHAIN_ID=5318008
SYSTEM_CONTRACT=0x0000000000000000000000000000000000fffFfF
TURNOVER_L1_ADDR=<from Step 1>
TURNOVER_REACTIVE_ADDR=<from Step 2>
```

### Step 1 — Destination Contract

Deploy `TokenTurnoverL1` and add its value as `TURNOVER_L1_ADDR` to the `.env` file.

```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverL1Module.js --network sepolia
```

### Step 2 — Reactive Contract

Deploy `TokenTurnoverReactive` and add its value as `TURNOVER_REACTIVE_ADDR` to the `.env` file.

```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverReactiveModule.js --network reactive
```

### Step 3 — Monitor Token Turnover

In this demo, the monitored token is the USDT contract at `0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0` on Sepolia. Send a request to `TURNOVER_L1_ADDR` to monitor its turnover with the command below. The contract will emit a log with the turnover data for the specified token shortly after the request.

```bash
npx hardhat run scripts/erc20-turnovers/sendTurnoverRequest.js --network sepolia
```

### Step 4 — Reactive Contract State

To pause the reactive contract:

```bash
npx hardhat run scripts/erc20-turnovers/pauseTurnoverReactive.js --network reactive
```

To resume the reactive contract:

```bash
npx hardhat run scripts/erc20-turnovers/resumeTurnoverReactive.js --network reactive
```