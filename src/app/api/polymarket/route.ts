import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'gamma'; // 'gamma', 'data', or 'positions'

    // Construct query string without 'type' and 'path'
    const filteredParams = new URLSearchParams();
    searchParams.forEach((val, key) => {
        if (key !== 'type' && key !== 'path') {
            filteredParams.append(key, val);
        }
    });
    const queryString = filteredParams.toString();

    let targetUrl = '';

    if (type === 'data') {
        const path = searchParams.get('path') || 'leaderboard';
        targetUrl = `https://data-api.polymarket.com/v1/${path}?${queryString}`;
    } else if (type === 'positions') {
        targetUrl = `https://data-api.polymarket.com/positions?${queryString}`;
    } else {
        // Default to Gamma
        targetUrl = queryString
            ? `https://gamma-api.polymarket.com/events?${queryString}`
            : 'https://gamma-api.polymarket.com/events?limit=100&active=true&closed=false&order=volume24hr&ascending=false';
    }

    try {
        const response = await fetch(targetUrl);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error fetching Polymarket ${type}:`, error);
        return NextResponse.json({ error: `Failed to fetch from ${type}` }, { status: 500 });
    }
}
