
import { fetchNewMarkets } from '../src/lib/api';

async function test() {
    console.log("Fetching New Markets...");
    const markets = await fetchNewMarkets();
    console.log(`Found ${markets.length} new markets.`);
    if (markets.length > 0) {
        console.log("Sample:", markets[0].title);
    }
}

test();
