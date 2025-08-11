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
USDT_ADDR=0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0
```

### Deploy ERC-20 Turnovers Demo

```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverL1Module.ts --network sepolia
```



```bash
npx hardhat ignition deploy ./ignition/modules/erc20-turnovers/TokenTurnoverReactiveModule.ts --network lasna
```




The reactive contract will be paused at the end of the script. Should you need to resume it, run:

```bash
npx hardhat run scripts/erc20-turnovers/resumeTurnoverReactive.ts --network lasna
```

To pause the reactive contract again:

```bash
npx hardhat run scripts/erc20-turnovers/pauseTurnoverReactive.ts --network lasna
```