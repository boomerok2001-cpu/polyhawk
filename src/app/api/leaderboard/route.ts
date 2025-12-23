import { NextResponse } from 'next/server';
import { fetchLeaderboardV2 } from '@/lib/api';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const timePeriod = searchParams.get('timePeriod') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category') || 'All';

    try {
        // Validating timePeriod for Data API
        const validPeriod = ['day', 'week', 'month', 'all'].includes(timePeriod)
            ? timePeriod as 'day' | 'week' | 'month' | 'all'
            : 'all';

        const leaderboard = await fetchLeaderboardV2(validPeriod, limit, category);
        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error('Error in leaderboard API:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
