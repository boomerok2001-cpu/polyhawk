import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch('https://api.elections.kalshi.com/trade-api/v2/markets?limit=100&status=active');
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching Kalshi:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
