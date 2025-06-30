```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-history/UniswapHistoryDemoL1Module.js --network sepolia
```


```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-history/UniswapHistoryDemoReactiveModule.js --network reactive
```


```bash
npx hardhat run scripts/uniswap-v2-history/sendReSyncRequest.js --network sepolia
```


```bash
npx hardhat run scripts/uniswap-v2-history/pauseUniswapReactive.js --network reactive
```

```bash
npx hardhat run scripts/uniswap-v2-history/resumeUniswapReactive.js --network reactive
```