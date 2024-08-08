import { config } from 'dotenv';
import axios from 'axios';
import MarketdataCheckConfig from '../model/config/marketdata-check';
import MarketdataCheckResult from '../model/result/marketdata-check';

config();

export default class MarketdataChecker {
    constructor({}: MarketdataCheckConfig) {}

    async check(tokenAddress: string): Promise<MarketdataCheckResult> {
        try {
            const marketdataResponse = await axios.get('https://api.dexscreener.com/latest/dex/tokens/' + tokenAddress, {
                timeout: 30000, // Reduced timeout for faster response handling
                responseType: 'json'
            });

            if (marketdataResponse.data && marketdataResponse.data.pairs && marketdataResponse.data.pairs.length > 0) {
                const marketdataResult = this.createMarketdataCheckResult(marketdataResponse.data.pairs[0]);
                marketdataResult.address = tokenAddress;
                return marketdataResult;
            } else {
                // No market data available, return default values
                return this.createDefaultMarketdataCheckResult(tokenAddress);
            }
        } catch (error) {
            // Handle error or timeout by returning default values
            console.error(`Failed to fetch market data for token ${tokenAddress}:`, (error as Error).message);
            return this.createDefaultMarketdataCheckResult(tokenAddress);
        }
    }

    private createMarketdataCheckResult(marketdata: any): MarketdataCheckResult {
        const marketdataCheckResult = new MarketdataCheckResult();
        marketdataCheckResult.priceSol = marketdata.priceNative || 0;
        marketdataCheckResult.priceUsd = marketdata.priceUsd || 0;
        marketdataCheckResult.liquidityUsd = marketdata.liquidity.usd || 0;
        marketdataCheckResult.fdv = marketdata.fdv || 0;
        marketdataCheckResult.volume24h = marketdata.volume.h24 || 0;
        marketdataCheckResult.volume6h = marketdata.volume.h6 || 0;
        marketdataCheckResult.volume1h = marketdata.volume.h1 || 0;
        marketdataCheckResult.volume5m = marketdata.volume.m5 || 0;
        marketdataCheckResult.priceChange24h = marketdata.priceChange.h24 || 0;
        marketdataCheckResult.priceChange6h = marketdata.priceChange.h6 || 0;
        marketdataCheckResult.priceChange1h = marketdata.priceChange.h1 || 0;
        marketdataCheckResult.priceChange5m = marketdata.priceChange.m5 || 0;
        marketdataCheckResult.buys24h = marketdata.txns.h24.buys || 0;
        marketdataCheckResult.buys6h = marketdata.txns.h6.buys || 0;
        marketdataCheckResult.buys1h = marketdata.txns.h1.buys || 0;
        marketdataCheckResult.buys5m = marketdata.txns.m5.buys || 0;
        marketdataCheckResult.sells24h = marketdata.txns.h24.sells || 0;
        marketdataCheckResult.sells6h = marketdata.txns.h6.sells || 0;
        marketdataCheckResult.sells1h = marketdata.txns.h1.sells || 0;
        marketdataCheckResult.sells5m = marketdata.txns.m5.sells || 0;
        return marketdataCheckResult;
    }

    private createDefaultMarketdataCheckResult(tokenAddress: string): MarketdataCheckResult {
        // Return default values (0) for all fields
        const defaultResult = new MarketdataCheckResult();
        defaultResult.address = tokenAddress;
        defaultResult.priceSol = 0;
        defaultResult.priceUsd = 0;
        defaultResult.liquidityUsd = 0;
        defaultResult.fdv = 0;
        defaultResult.volume24h = 0;
        defaultResult.volume6h = 0;
        defaultResult.volume1h = 0;
        defaultResult.volume5m = 0;
        defaultResult.priceChange24h = 0;
        defaultResult.priceChange6h = 0;
        defaultResult.priceChange1h = 0;
        defaultResult.priceChange5m = 0;
        defaultResult.buys24h = 0;
        defaultResult.buys6h = 0;
        defaultResult.buys1h = 0;
        defaultResult.buys5m = 0;
        defaultResult.sells24h = 0;
        defaultResult.sells6h = 0;
        defaultResult.sells1h = 0;
        defaultResult.sells5m = 0;
        return defaultResult;
    }
}
