## Deployment & Testing

Before proceeding further, add the private key to the `.env` file:

```env
PRIVATE_KEY=<insert private key>
```

Deploy the origin and callback contracts to Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/basic/OriginCallbackModule.ts --network sepolia
```

Deploy the reactive contract to Lasna:

```bash
npx hardhat ignition deploy ./ignition/modules/basic/ReactiveModule.ts --network lasna
```

Send 0.001 sepEth to the origin contract:

```bash
npx hardhat run scripts/basic/sendEthToOrigin.ts --network sepolia
```