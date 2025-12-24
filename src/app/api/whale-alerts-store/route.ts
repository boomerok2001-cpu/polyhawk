import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { WhaleAlert } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const WHALE_ALERTS_KEY = 'whale_alerts';
const MAX_ALERTS = 1000; // Store last 1000 alerts
const RETENTION_DAYS = 7; // Keep alerts for 7 days

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Check if KV is configured
        if (!process.env.KV_REST_API_URL) {
            console.warn('Vercel KV not configured');
            return NextResponse.json({
                alerts: [],
                total: 0,
                hasMore: false
            });
        }

        // Retrieve all alerts from KV
        const alerts: WhaleAlert[] = await kv.get(WHALE_ALERTS_KEY) || [];

        // Filter out old alerts (older than RETENTION_DAYS)
        const cutoffTime = Date.now() / 1000 - (RETENTION_DAYS * 24 * 60 * 60);
        const validAlerts = alerts.filter(alert => alert.timestamp >= cutoffTime);

        // Sort by timestamp (newest first)
        validAlerts.sort((a, b) => b.timestamp - a.timestamp);

        // Paginate
        const paginatedAlerts = validAlerts.slice(offset, offset + limit);

        return NextResponse.json({
            alerts: paginatedAlerts,
            total: validAlerts.length,
            hasMore: offset + limit < validAlerts.length
        });
    } catch (error) {
        console.error('Error retrieving whale alerts from KV:', error);
        // Return empty instead of error to prevent client failures
        return NextResponse.json({
            alerts: [],
            total: 0,
            hasMore: false
        });
    }
}

export async function POST(request: Request) {
    try {
        // Check if KV is configured
        if (!process.env.KV_REST_API_URL) {
            console.warn('Vercel KV not configured, skipping storage');
            return NextResponse.json({
                message: 'Storage not configured',
                added: 0,
                total: 0
            });
        }

        const newAlerts: WhaleAlert[] = await request.json();

        if (!Array.isArray(newAlerts)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Get existing alerts
        const existingAlerts: WhaleAlert[] = await kv.get(WHALE_ALERTS_KEY) || [];

        // Create a set of existing IDs for deduplication
        const existingIds = new Set(existingAlerts.map(a => a.id));

        // Filter out duplicates and add new alerts
        const uniqueNewAlerts = newAlerts.filter(alert => !existingIds.has(alert.id));

        if (uniqueNewAlerts.length === 0) {
            return NextResponse.json({
                message: 'No new alerts to add',
                added: 0
            });
        }

        // Combine and sort
        const combined = [...uniqueNewAlerts, ...existingAlerts]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, MAX_ALERTS); // Keep only the most recent MAX_ALERTS

        // Store back to KV
        await kv.set(WHALE_ALERTS_KEY, combined);

        return NextResponse.json({
            message: 'Alerts stored successfully',
            added: uniqueNewAlerts.length,
            total: combined.length
        });
    } catch (error) {
        console.error('Error storing whale alerts to KV:', error);
        // Return success with 0 added instead of error
        return NextResponse.json({
            message: 'Storage failed, continuing without persistence',
            added: 0,
            total: 0
        });
    }
}
