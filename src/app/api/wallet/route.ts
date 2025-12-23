import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
        return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    try {
        // Use Polymarket's official Data API (same as predicts.guru)
        const [leaderboardRes, pnlRes, valueRes, positionsRes, closedRes] = await Promise.all([
            // 1. Summary statistics
            fetch(`https://data-api.polymarket.com/v1/leaderboard?timePeriod=all&user=${walletAddress}`),
            // 2. PnL timeline
            fetch(`https://user-pnl-api.polymarket.com/user-pnl?user_address=${walletAddress}&interval=all&fidelity=1d`),
            // 3. Portfolio value
            fetch(`https://data-api.polymarket.com/value?user=${walletAddress}`),
            // 4. Open positions
            fetch(`https://data-api.polymarket.com/positions?user=${walletAddress}&sortBy=CURRENT&sortDirection=DESC&sizeThreshold=.1&limit=500&offset=0`),
            // 5. Closed positions
            fetch(`https://data-api.polymarket.com/closed-positions?user=${walletAddress}&sortBy=realizedpnl&sortDirection=DESC&limit=100&offset=0`)
        ]);

        const [leaderboard, pnlData, valueData, openPositions, closedPositions] = await Promise.all([
            leaderboardRes.json(),
            pnlRes.json(),
            valueRes.json(),
            positionsRes.json(),
            closedRes.json()
        ]);

        console.log('API Response:', {
            leaderboard: leaderboard?.[0],
            pnlDataLength: pnlData?.length,
            valueData: valueData?.[0],
            openPositionsLength: openPositions?.length,
            closedPositionsLength: closedPositions?.length,
            sampleOpenPosition: openPositions?.[0],
            sampleClosedPosition: closedPositions?.[0]
        });

        // Combine all data
        const response = {
            stats: leaderboard[0] || {},
            pnlHistory: pnlData || [],
            portfolioValue: valueData[0]?.value || 0,
            openPositions: openPositions || [],
            closedPositions: closedPositions || []
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching wallet data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
