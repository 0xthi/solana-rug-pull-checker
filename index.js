const readline = require('readline');
const SPLRugchecker = require('./dist/index.js').default;
const WebsiteChecker = require('./dist/index.js').WebsiteChecker;

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the token address: ', async (tokenAddress) => {
        const rugCheckConfig = {
            solanaRpcEndpoint: process.env.SOLANA_RPC_ENDPOINT,
            heliusApiKey: process.env.HELIUS_API_KEY,
            // poolFilePath: 'https://api-v3.raydium.io/pools/line/liquidity?id=HWsaQKHEQFdD2WAsaEYxTtZKVFD51RnenFpciK4oUXHe',
            // poolAddress: "HWsaQKHEQFdD2WAsaEYxTtZKVFD51RnenFpciK4oUXHe"
        };

        const rugChecker = new SPLRugchecker(rugCheckConfig);
        try {
            const result = await rugChecker.check(tokenAddress);
            const score = rugChecker.rugScore(result);
            const isRug = rugChecker.isRug(result);
            console.log(result);
            console.log("score", score);
            console.log("isRug", isRug);
        } catch (error) {
            console.error('Error checking the token address:', error);
        } finally {
            rl.close();
        }
    });
}

async function website() {
    const website = 'patriotsmonth.xyz';
    const websiteCheck = new WebsiteChecker();
    try {
        const result = await websiteCheck.check(website);
        console.log(result);
    } catch (error) {
        console.error('Error checking the website:', error);
    }
}

main();
