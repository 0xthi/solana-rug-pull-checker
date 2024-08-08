const SPLRugchecker = require('./dist/index.js').default;
const WebsiteChecker = require('./dist/index.js').WebsiteChecker;

async function main() {
    const rugCheckConfig = {
        solanaRpcEndpoint: process.env.SOLANA_RPC_ENDPOINT,
        heliusApiKey: process.env.HELIUS_API_KEY,
        // poolFilePath: 'https://api-v3.raydium.io/pools/line/liquidity?id=HWsaQKHEQFdD2WAsaEYxTtZKVFD51RnenFpciK4oUXHe',
        // poolAddress: "HWsaQKHEQFdD2WAsaEYxTtZKVFD51RnenFpciK4oUXHe"
    };
    
    const rugChecker = new SPLRugchecker(rugCheckConfig);
    const result = await rugChecker.check('8qv1Uc5juiMKnRnL6t2JX42nJVLyeEPm4bJit5KDpump');
    const score = rugChecker.rugScore(result);
    const isRug = rugChecker.isRug(result);
    console.log(result);
    console.log("score", score);
    console.log("isRug", isRug);
}

    async function website() {
    const website = 'patriotsmonth.xyz';
    const websiteCheck = new WebsiteChecker();
    const result = await websiteCheck.check(website);
    console.log(result);
}

main();
