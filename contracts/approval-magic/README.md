### Deploy Basic Demo

CLIENT_WALLET=<insert wallet address>


```bash
node scripts/approval-magic/deployApprovalExchange.js
```

```bash
rm -rf ignition/deployments/chain-11155111
rm -rf ignition/deployments/chain-5318007
```

```bash
node scripts/approval-magic/deployApprovalSwap.js
```


