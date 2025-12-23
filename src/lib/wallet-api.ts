import { polymarketClient } from '@/lib/polymarket';

// Fetch real wallet statistics from Polymarket CLOB API
export async function fetchWalletStats(walletAddress: string) {
    try {
        // Use authenticated client
        const positions = await polymarketClient.getPositions(walletAddress);

        // Process positions (same logic as before but simpler source)
        let totalPnL = 0;
        let realizedPnL = 0;
        let unrealizedPnL = 0;
        let totalVolume = 0;
        let openPositions = 0;
        let closedPositions = 0;
        const uniqueMarkets = new Set();
        let totalPositionsValue = 0;
        let wins = 0;
        let totalTrades = 0;

        const processedPositions = positions.map((pos: any) => {
            const size = parseFloat(pos.size || '0');
            const entryPrice = parseFloat(pos.entry_price || '0');
            const currentPrice = parseFloat(pos.current_price || entryPrice);
            const value = size * currentPrice;
            const costBasis = size * entryPrice;
            const pnl = value - costBasis;
            const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

            totalVolume += costBasis;
            uniqueMarkets.add(pos.market);

            if (pos.is_closed) {
                closedPositions++;
                realizedPnL += pnl;
                totalTrades++;
                if (pnl > 0) wins++;
            } else {
                openPositions++;
                unrealizedPnL += pnl;
                totalPositionsValue += value;
            }

            totalPnL += pnl;

            return {
                id: pos.id || `${pos.market}-${pos.outcome}`,
                marketTitle: pos.market_title || pos.market || 'Unknown Market',
                outcome: pos.outcome === 'YES' ? 'YES' : 'NO',
                shares: size,
                entryPrice: entryPrice,
                currentPrice: currentPrice,
                value: value,
                pnl: pnl,
                pnlPercent: pnlPercent,
                status: pos.is_closed ? 'closed' : 'open',
                marketId: pos.market,
                assetId: pos.asset_id,
                marketUrl: `https://polymarket.com/event/${pos.market}`,
                betSize: costBasis,
                winChance: currentPrice * 100,
                image: pos.image
            };
        });

        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        const avgBetSize = totalTrades > 0 ? totalVolume / totalTrades : 0;

        return {
            stats: {
                address: walletAddress,
                totalPnL,
                realizedPnL,
                unrealizedPnL,
                winRate,
                totalVolume,
                avgBetSize,
                openPositions,
                closedPositions,
                uniqueMarkets: uniqueMarkets.size,
                totalPositionsValue,
                totalBuyOrders: positions.length,
                totalSellOrders: closedPositions
            },
            positions: processedPositions
        };
    } catch (error) {
        console.error('Error fetching wallet stats:', error);
        throw error;
    }
}

export async function fetchLeaderboardWithPositions(limit: number = 10) {
    try {
        const leaderboard = await polymarketClient.getLeaderboard(limit);
        // For each top trader, fetch their active positions
        // We'll limit this to top 5 to avoid rate limits
        const topTraders = await Promise.all(leaderboard.slice(0, 5).map(async (trader: any) => {
            try {
                const positions = await polymarketClient.getPositions(trader.address || trader.user);
                // Filter for active/open users
                const activePositions = positions.filter((p: any) => !p.is_closed && parseFloat(p.size) > 0);
                return { ...trader, activePositions };
            } catch (e) {
                return { ...trader, activePositions: [] };
            }
        }));
        return topTraders;
    } catch (e) {
        console.error('Error fetching leaderboard with positions', e);
        return [];
    }
}

// Generate PnL history from position data
export function generatePnLHistory(positions: any[]) {
    // Group positions by month and calculate cumulative PnL
    const monthlyPnL: { [key: string]: number } = {};

    positions.forEach(pos => {
        if (pos.timestamp) {
            const date = new Date(pos.timestamp);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            if (!monthlyPnL[monthKey]) monthlyPnL[monthKey] = 0;
            monthlyPnL[monthKey] += pos.pnl;
        }
    });

    // Convert to cumulative timeline
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cumulative = 0;

    return months.map(month => {
        cumulative += monthlyPnL[month] || 0;
        return {
            date: month,
            value: cumulative
        };
    });
}
