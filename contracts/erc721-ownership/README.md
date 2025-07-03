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
ACTIVE_TOKEN_ADDR=0x92eFBC2F5208b8610E57c52b9E49F7189048900F
ACTIVE_TOKEN_ID=129492
```

### Deploy ERC-721 Ownership Demo

```bash
node scripts/erc721-ownership/deployNftOwnership.js
````

The reactive contract will be paused at the end of the script. Should you need to resume it, run:

```bash
npx hardhat run scripts/erc721-ownership/resumeOwnershipReactive.js --network lasna
```

To pause the reactive contract again:

```bash
npx hardhat run scripts/erc721-ownership/pauseOwnershipReactive.js --network lasna
```
