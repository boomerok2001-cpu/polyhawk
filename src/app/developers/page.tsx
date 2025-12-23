import Link from 'next/link';

export const metadata = {
    title: 'Developers API | Poly Scope',
    description: 'Build the next generation of prediction market tools.',
};

export default function DevelopersPage() {
    return (
        <main className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ margin: '4rem 0 3rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>Poly Hawk API</h1>
                <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                    Build powerful prediction market applications with the Poly Hawk API. Access real-time data, aggregated markets, and arbitrage opportunities.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Authentication</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                        Requests are currently open for beta testing. In production, you will need to pass an API key in the header.
                    </p>
                    <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        Authorization: Bearer YOUR_API_KEY
                    </div>
                </div>

                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Endpoints</h2>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ background: 'var(--primary)', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem' }}>GET</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>/v1/markets</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>Retrieve a list of active markets across all supported platforms.</p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ background: 'var(--primary)', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem' }}>GET</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>/v1/arbitrage</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>Get live arbitrage opportunities with spread calculations.</p>
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ background: 'var(--primary)', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem' }}>GET</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>/v1/signals</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>Stream whale alerts and volatility events.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
