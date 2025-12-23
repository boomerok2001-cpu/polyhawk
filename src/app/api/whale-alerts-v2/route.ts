import { NextResponse } from 'next/server';
import { fetchWhaleAlertsV2 } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const whaleAlerts = await fetchWhaleAlertsV2();
        return NextResponse.json(whaleAlerts);
    } catch (error) {
        console.error('Error in whale alerts V2 API:', error);
        return NextResponse.json({ error: 'Failed to fetch whale alerts V2' }, { status: 500 });
    }
}
