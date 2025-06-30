## Deployment & Testing

### Environment Variables

Before proceeding further, configure these environment variables in the `.env` file:

```env
DESTINATION_RPC=https://ethereum-sepolia-rpc.publicnode.com
DESTINATION_PRIVATE_KEY=<insert private key>
DESTINATION_CHAIN_ID=11155111
DESTINATION_CALLBACK_PROXY_ADDR=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
REACTIVE_RPC=https://kopli-rpc.rnk.dev/
REACTIVE_PRIVATE_KEY=<insert private key>
REACTIVE_CHAIN_ID=5318008
SYSTEM_CONTRACT=0x0000000000000000000000000000000000fffFfF

ACTIVE_PAIR_ADDR=0x85b6E66594C2DfAf7DC83b1a25D8FAE1091AF063
BLOCK_NUMBER=6843582
UNISWAP_L1_ADDR=<from Step 1>
UNISWAP_REACTIVE_ADDR=<from Step 2>
```

### Step 1 — Destination Contract

Deploy `UniswapHistoryDemoL1` and add its value as `UNISWAP_L1_ADDR` to the `.env` file.

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-history/UniswapHistoryDemoL1Module.js --network sepolia
```

### Step 2 — Reactive Contract

Deploy `UniswapHistoryDemoReactive` and add its value as `UNISWAP_REACTIVE_ADDR` to the `.env` file.

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-history/UniswapHistoryDemoReactiveModule.js --network reactive
```

### Step 3 — Monitor Token Pair Activity

In this demo, the chosen active pair address is `0x85b6E66594C2DfAf7DC83b1a25D8FAE1091AF063` with its block number `6843582`. Send the data request to `UniswapHistoryDemoL1`. The contract will emit a log with the activity data shortly after.

```bash
npx hardhat run scripts/uniswap-v2-history/sendReSyncRequest.js --network sepolia
```

### Step 4 — Reactive Contract State

To stop the reactive contract:

```bash
npx hardhat run scripts/uniswap-v2-history/pauseUniswapReactive.js --network reactive
```

To resume the reactive contract:

```bash
npx hardhat run scripts/uniswap-v2-history/resumeUniswapReactive.js --network reactive
```