# Solana Rug pull checker SDK

Rug pull detection in Solana with score feature to determine a token's legitness. Used Solana web3.js, Raydiyum sdk, Helius API, Dexscreener API for marketdata. It has the following checking features

1. Top holders percentage
2. Individual holders percentage
3. Honeypot
4. Liqiuidity check
5. Minting functionality
6. Mutablity of metadata
7. Freezing of contract
8. Ownership revoke
9. Websites check
10. Pump.fun website check (This website supports creating rug tokens. If token is created in this website, it is rug)

## Steps to install SDK

1. Clone/fork the repo. `npm install` or use anyother package installer like `yarn install`
2. Setup `.env` with `SOLANA_RPC_SOLANA_RPC_ENDPOINT="https://solana-mainnet.core.chainstack.com/9106xxxxx"` and `HELIUS_API_KEY="123456-7890-xxxx"`.
3. To build Typescript files run the following command `npm run build`.
4. All set !! `node index.js` to run the script. Input the address of token and it will revert back with Metadata, rug score, marketdata(if available) etc...

### Rug Score

Rug score is determined by all checking features combined. If a token is below 400 score, it is safe from rug pull. 

### Note

This SDK determines most tokens and tokens that are listed in Raydium. It may fail sometimes as it is in development.
