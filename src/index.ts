import MetadataChecker from './checker/metadata-checker';
import RugCheckResult from './model/result/rug-check';
import RugCheckConfig from './model/config/rug-check';
import HoldersChecker from './checker/holders-checker';
import LiquidityChecker from './checker/liquidity-checker';
import WebsiteChecker from './checker/website-checker';
import MetadataCheckConfig from './model/config/metadata-check';
import HoldersCheckConfig from './model/config/holders-check';
import LiquidityCheckConfig from './model/config/liquidity-check';
import MarketdataChecker from './checker/marketdata-checker';
import MarketdataCheckConfig from './model/config/marketdata-check';

export default class SPLRugchecker {
    private holdersChecker: HoldersChecker;
    private liquidityChecker: LiquidityChecker;
    private metadataChecker: MetadataChecker;
    private marketdataChecker: MarketdataChecker;

    public constructor({ solanaRpcEndpoint, poolFilePath, poolAddress, heliusApiKey }: RugCheckConfig) {
        const metadataCheckConfig = { solanaRpcEndpoint: solanaRpcEndpoint, heliusApiKey: heliusApiKey };
        this.metadataChecker = new MetadataChecker(metadataCheckConfig);
        const holdersCheckConfig = { solanaRpcEndpoint: solanaRpcEndpoint };
        this.holdersChecker = new HoldersChecker(holdersCheckConfig);
        const liquidityCheckConfig = { solanaRpcEndpoint: solanaRpcEndpoint, poolFilePath: poolFilePath, poolAddress: poolAddress };
        this.liquidityChecker = new LiquidityChecker(liquidityCheckConfig);
        const marketdataCheckConfig = {};
        this.marketdataChecker = new MarketdataChecker(marketdataCheckConfig);
    }

    async check(tokenAddress: string): Promise<RugCheckResult> {
        const [metadataCheckResult, holdersCheckResult, liquidityCheckResult, marketdataCheckResult] = await Promise.all([
            this.metadataChecker.check(tokenAddress),
            this.holdersChecker.check(tokenAddress),
            this.liquidityChecker.check(tokenAddress),
            this.marketdataChecker.check(tokenAddress)
        ]);

        const rugCheckResult = new RugCheckResult();
        rugCheckResult.metadata = metadataCheckResult;
        rugCheckResult.holders = holdersCheckResult;
        rugCheckResult.liquidity = liquidityCheckResult;
        rugCheckResult.marketdata = marketdataCheckResult;
        return rugCheckResult;
    }

    rugScore(rugCheckResult: RugCheckResult): number {
        let rugScore = 0;

        // Metadata checks
        if (rugCheckResult.metadata.isMintable === true) {
            rugScore += 100;
            console.log('Mintable: +100 points');
        }
        if (rugCheckResult.metadata.isOwnershipRevoked === false) {
            rugScore += 100;
            console.log('Ownership not revoked: +100 points');
        }
        if (rugCheckResult.metadata.isFreezable === true) {
            rugScore += 80;
            console.log('Freezable: +80 points');
        }
        if (rugCheckResult.metadata.isMutable === true) {
            rugScore += 50;
            console.log('Mutable: +50 points');
        }
        if (rugCheckResult.metadata.isPumpFun === true) {
            rugScore += 400;
            console.log('Pump fun website: +400 points');
        }

        // Holders checks
        if (!isNaN(rugCheckResult.holders.topHoldersPercentage) && rugCheckResult.holders.topHoldersPercentage !== undefined) {
            if (rugCheckResult.holders.topHoldersPercentage >= 90) {
                rugScore += 300;
                console.log('Top Holders >= 90%: +300 points');
            } else if (rugCheckResult.holders.topHoldersPercentage >= 70) {
                rugScore += 200;
                console.log('Top Holders >= 70%: +200 points');
            } else if (rugCheckResult.holders.topHoldersPercentage >= 50) {
                rugScore += 100;
                console.log('Top Holders >= 50%: +100 points');
            } else if (rugCheckResult.holders.topHoldersPercentage >= 35) {
                rugScore += 50;
                console.log('Top Holders >= 35%: +50 points');
            } else if (rugCheckResult.holders.topHoldersPercentage >= 20) {
                rugScore += 20;
                console.log('Top Holders >= 20%: +20 points');
            }
        }

        if (Array.isArray(rugCheckResult.holders.topHolders)) {
            for (const holder of rugCheckResult.holders.topHolders) {
                if (!isNaN(holder.percentage) && holder.percentage !== undefined) {
                    if (holder.percentage >= 10) {
                        rugScore += 100;
                        console.log(`Holder ${holder.address} >= 10%: +100 points`);
                    } else if (holder.percentage >= 7) {
                        rugScore += 70;
                        console.log(`Holder ${holder.address} >= 7%: +70 points`);
                    } else if (holder.percentage >= 5) {
                        rugScore += 30;
                        console.log(`Holder ${holder.address} >= 5%: +30 points`);
                    } else if (holder.percentage >= 3) {
                        rugScore += 15;
                        console.log(`Holder ${holder.address} >= 3%: +15 points`);
                    } else if (holder.percentage >= 2) {
                        rugScore += 5;
                        console.log(`Holder ${holder.address} >= 2%: +5 points`);
                    }
                }
            }
        }

        // Liquidity checks
        if (rugCheckResult.liquidity.isLiquidityLocked === false) {
            rugScore += 100;
            console.log('Liquidity Not Locked: +100 points');
        }

        console.log(`Total Rug Score: ${rugScore}`);
        return rugScore;
    }

    isRug(rugCheckResult: RugCheckResult): boolean {
        const rugScore = this.rugScore(rugCheckResult);
        if (rugScore >= 400) {
            console.log('Token is a potential rug pull.');
            return true;
        }

        console.log('Token is not a rug pull.');
        return false;
    }
}

export { WebsiteChecker };
export { MetadataChecker };
export { HoldersChecker };
export { LiquidityChecker };
export { MarketdataChecker };

export { RugCheckConfig };
export { MetadataCheckConfig };
export { LiquidityCheckConfig };
export { HoldersCheckConfig };
export { MarketdataCheckConfig };
