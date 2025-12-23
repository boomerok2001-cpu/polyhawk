
import { findArbitrageOpportunities } from '../src/lib/api';

async function main() {
    console.log("🔍 Scanning for REAL arbitrage opportunities (Strict Mode)...");
    const start = Date.now();
    try {
        const opportunities = await findArbitrageOpportunities('strict');

        console.log(`\n✅ Scan complete in ${(Date.now() - start) / 1000}s`);
        console.log(`Found ${opportunities.length} strict arbitrage opportunities.\n`);

        if (opportunities.length > 0) {
            opportunities.forEach((opp, i) => {
                console.log(`[${i + 1}] PROFIT: ${opp.spread.toFixed(2)}%`);
                console.log(`    Event: ${opp.event}`);
                console.log(`    Buy: ${opp.market1.source} (${opp.market1.yesPrice} / ${opp.market1.noPrice})`);
                console.log(`    Buy: ${opp.market2.source} (${opp.market2.yesPrice} / ${opp.market2.noPrice})`);
                console.log('---');
            });
        } else {
            console.log("No risk-free arbitrage found at this moment. Markets are efficient.");
        }
    } catch (error) {
        console.error("Error executing search:", error);
    }
}

main();
