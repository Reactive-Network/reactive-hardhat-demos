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

ACTIVE_TOKEN_ADDR=0x92eFBC2F5208b8610E57c52b9E49F7189048900F
ACTIVE_TOKEN_ID=129492
OWNERSHIP_L1_ADDR=<from Step 1>
OWNERSHIP_REACTIVE_ADDR=<from Step 2>
```

### Step 1 — Destination Contract

Deploy `NftOwnershipL1` and add its value as `OWNERSHIP_L1_ADDR` to the `.env` file.

```bash
npx hardhat ignition deploy ./ignition/modules/erc721-ownership/NftOwnershipL1Module.js --network sepolia
```

### Step 2 — Reactive Contract

Deploy `NftOwnershipReactive` and add its value as `OWNERSHIP_REACTIVE_ADDR` to the `.env` file.

```bash
npx hardhat ignition deploy ./ignition/modules/erc721-ownership/NftOwnershipReactiveModule.js --network reactive
```

### Step 3 — Monitor Token Ownership

In this demo, the chosen active token address is `0x92eFBC2F5208b8610E57c52b9E49F7189048900F` with its token ID `129492` to ACTIVE_TOKEN_ID. Send a data request to `OWNERSHIP_L1_ADDR`. The contract will emit a log with the ownership data for the specified token shortly after the request.

```bash
npx hardhat run scripts/erc721-ownership/sendOwnershipRequest.js --network sepolia
```

### Step 4 — Reactive Contract State

To pause the reactive contract:

```bash
npx hardhat run scripts/erc721-ownership/pauseOwnershipReactive.js --network reactive
```

To resume the reactive contract:

```bash
npx hardhat run scripts/erc721-ownership/resumeOwnershipReactive.js --network reactive
```