## Deployment & Testing

### Environment Variables

Before proceeding further, configure these environment variables in the `.env` file:

```env
DESTINATION_RPC=https://ethereum-sepolia-rpc.publicnode.com
DESTINATION_PRIVATE_KEY=<insert private key>
DESTINATION_CALLBACK_PROXY_ADDR=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
LASNA_RPC=
LASNA_PRIVATE_KEY=<insert private key>
LASNA_CHAIN_ID=5318007
SYSTEM_CONTRACT=0x0000000000000000000000000000000000fffFfF
ORIGIN_CHAIN_ID=11155111
DESTINATION_CHAIN_ID=11155111
TOPIC_0=0x8cabf31d2b1b11ba52dbb302817a3c9c83e4b2a5194d35121ab1354d69f6a4cb
```

> ℹ️ **Reactive Faucet on Sepolia**
>
> To receive testnet REACT, send SepETH to the Reactive faucet contract on Ethereum Sepolia: `0x9b9BB25f1A81078C544C829c5EB7822d747Cf434`. The factor is 1/5, meaning you get 5 REACT for every 1 SepETH sent.
>
> **Important**: Do not send more than 10 SepETH per request, as doing so will cause you to lose the excess amount without receiving any additional REACT. The maximum that should be sent in a single transaction is 10 SepETH, which will yield 50 REACT.

### Deploy Basic Demo

```bash
node scripts/basic/deployBasic.js
```