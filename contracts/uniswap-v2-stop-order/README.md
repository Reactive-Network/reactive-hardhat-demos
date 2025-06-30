```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-stop-order/UniswapDemoTokensModule.js --network sepolia
```

```bash
npx hardhat run scripts/uniswap-v2-stop-order/createPair.js --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-stop-order/StopOrderCallbackModule.js --network sepolia
```

```bash
npx hardhat run scripts/uniswap-v2-stop-order/addLiquidityAndMint.js --network sepolia
```

```bash
npx hardhat ignition deploy ./ignition/modules/uniswap-v2-stop-order/StopOrderReactiveModule.js --network reactive
```

```bash
npx hardhat run scripts/uniswap-v2-stop-order/approve-transfer-swap.js --network sepolia
```