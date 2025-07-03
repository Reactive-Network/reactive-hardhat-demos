## Deployment & Testing

### Environment Variables

Before proceeding further, configure these environment variables in the `.env` file:

```env
DESTINATION_RPC=https://ethereum-sepolia-rpc.publicnode.com
DESTINATION_PRIVATE_KEY=<insert private key>
DESTINATION_CHAIN_ID=11155111
DESTINATION_CALLBACK_PROXY_ADDR=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
LASNA_RPC=
LASNA_PRIVATE_KEY=<insert private key>
LASNA_CHAIN_ID=5318007
SYSTEM_CONTRACT=0x0000000000000000000000000000000000fffFfF
ACTIVE_PAIR_ADDR=0x85b6E66594C2DfAf7DC83b1a25D8FAE1091AF063
BLOCK_NUMBER=6843582
```

### Deploy Uniswap History Demo

```bash
node scripts/uniswap-v2-history/deployUniswapHistory.js
````

The reactive contract will be paused at the end of the script. Should you need to resume it, run:

```bash
npx hardhat run scripts/uniswap-v2-history/resumeUniswapReactive.js --network lasna
```

To pause the reactive contract again:

```bash
npx hardhat run scripts/uniswap-v2-history/pauseUniswapReactive.js --network lasna
```
