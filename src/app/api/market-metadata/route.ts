import { NextResponse } from 'next/server';
import { fetchPolymarketTrending } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const markets = await fetchPolymarketTrending();

        // Create a map of Slug/ID -> Category & Image
        const metadata: Record<string, { category: string, image: string }> = {};

        markets.forEach(m => {
            // Map ID
            if (m.id) {
                metadata[m.id] = { category: m.category, image: m.image || '' };
            }
            // Map slug from URL if possible
            // url format: https://polymarket.com/event/slug
            const urlParts = m.url.split('/');
            const slug = urlParts[urlParts.length - 1];
            if (slug && slug !== m.id) {
                metadata[slug] = { category: m.category, image: m.image || '' };
            }
        });

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Error fetching market metadata:', error);
        return NextResponse.json({ error: 'Failed to fetch market metadata' }, { status: 500 });
    }
}
