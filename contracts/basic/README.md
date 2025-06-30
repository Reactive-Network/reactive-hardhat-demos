## Deployment & Testing

### Environment Variables

Before proceeding further, configure these environment variables in the `.env`:

```env
DESTINATION_RPC=https://ethereum-sepolia-rpc.publicnode.com
DESTINATION_PRIVATE_KEY=<insert private key>
DESTINATION_CALLBACK_PROXY_ADDR=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
REACTIVE_RPC=https://kopli-rpc.rnk.dev/
REACTIVE_PRIVATE_KEY=<insert private key>
REACTIVE_CHAIN_ID=5318008
SYSTEM_CONTRACT=0x0000000000000000000000000000000000fffFfF
ORIGIN_CHAIN_ID=11155111
DESTINATION_CHAIN_ID=11155111
ORIGIN_CONTRACT=<from Step 1>
TOPIC_0=0x8cabf31d2b1b11ba52dbb302817a3c9c83e4b2a5194d35121ab1354d69f6a4cb
CALLBACK_CONTRACT=<from Step 2>
```

> ℹ️ **Reactive Faucet on Sepolia**
>
> To receive testnet REACT, send SepETH to the Reactive faucet contract on Ethereum Sepolia: `0x9b9BB25f1A81078C544C829c5EB7822d747Cf434`. The factor is 1/5, meaning you get 5 REACT for every 1 SepETH sent.
>
> **Important**: Do not send more than 10 SepETH per request, as doing so will cause you to lose the excess amount without receiving any additional REACT. The maximum that should be sent in a single transaction is 10 SepETH, which will yield 50 REACT.

### Step 1 — Origin Contract

Deploy `BasicDemoL1Contract` and add its value as `ORIGIN_CONTRACT` to the `.env` file.

```bash
npx hardhat ignition deploy ./ignition/modules/basic/L1OriginModule.js --network sepolia
```

### Step 2 — Destination Contract

Deploy `BasicDemoL1Callback` and add its value as `CALLBACK_CONTRACT` to the `.env` file.

```bash
npx hardhat ignition deploy ./ignition/modules/basic/L1CallbackModule.js --network sepolia
```

### Step 3 — Reactive Contract

Deploy `BasicDemoReactiveContract`. Make sure `ORIGIN_CONTRACT` and `CALLBACK_CONTRACT` are in `.env`.

```bash
npx hardhat ignition deploy ./ignition/modules/basic/ReactiveModule.js --network reactive
```

### Step 4 — Test Reactive Callback

Run the `sendEther.js` script to test the Reactive callback:

```bash
npx hardhat run scripts/basic/sendEther.js --network sepolia
```
