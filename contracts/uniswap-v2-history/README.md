## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
PRIVATE_KEY=<insert private key>
```

Deploy the callback contract to Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-history/UniswapHistoryL1Module.ts --network sepolia
```

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-history/UniswapHistoryReactiveModule.ts --network lasna
```

Request the Uniswap pair history (should result in a callback to Sepolia):

```bash
npx hardhat run scripts/uniswap-v2-history/requestUniswapHistory.ts --network sepolia
```

Pause the reactive contract:

```bash
npx hardhat run scripts/uniswap-v2-history/pauseUniswapReactive.ts --network lasna
```

Resume the reactive contract if needed:

```bash
npx hardhat run scripts/uniswap-v2-history/resumeUniswapReactive.ts --network lasna
```