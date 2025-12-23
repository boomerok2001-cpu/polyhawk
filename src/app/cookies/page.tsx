'use client';

import { useState, useEffect } from 'react';

export default function CookiesPage() {
    const [cookies, setCookies] = useState(0);
    const [lastClaim, setLastClaim] = useState<string | null>(null);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        // Load from local storage
        const storedCookies = localStorage.getItem('poly_cookies');
        const storedClaim = localStorage.getItem('poly_last_claim');
        const storedStreak = localStorage.getItem('poly_streak');

        if (storedCookies) setCookies(parseInt(storedCookies));
        if (storedClaim) setLastClaim(storedClaim);
        if (storedStreak) setStreak(parseInt(storedStreak));
    }, []);

    const handleClaim = () => {
        const today = new Date().toDateString();

        if (lastClaim === today) {
            alert("You've already claimed your daily cookies!");
            return;
        }

        const newCookies = cookies + 100 + (streak * 10);
        const newStreak = streak + 1;

        setCookies(newCookies);
        setLastClaim(today);
        setStreak(newStreak);

        localStorage.setItem('poly_cookies', newCookies.toString());
        localStorage.setItem('poly_last_claim', today);
        localStorage.setItem('poly_streak', newStreak.toString());
    };

    const canClaim = lastClaim !== new Date().toDateString();

    return (
        <main className="container" style={{ paddingBottom: '4rem', textAlign: 'center' }}>
            <div style={{ margin: '4rem 0 2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍪 Daily Cookies</h1>
                <p className="text-secondary" style={{ fontSize: '1.2rem' }}>
                    Collect cookies daily to unlock premium features and analytics!
                </p>
            </div>

            <div style={{ background: 'var(--surface)', padding: '3rem', borderRadius: '24px', maxWidth: '500px', margin: '0 auto', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {cookies} 🍪
                </div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Current Balance
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{streak} 🔥</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Day Streak</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>+{(100 + (streak * 10))}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Next Reward</div>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        fontSize: '1.2rem',
                        padding: '1rem',
                        opacity: canClaim ? 1 : 0.5,
                        cursor: canClaim ? 'pointer' : 'not-allowed'
                    }}
                    onClick={handleClaim}
                    disabled={!canClaim}
                >
                    {canClaim ? 'Claim Daily Cookies' : 'Come back tomorrow!'}
                </button>
            </div>

            <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                    <h3>Pro Analytics</h3>
                    <p className="text-secondary">Unlock advanced charts</p>
                    <button className="btn btn-outline" style={{ marginTop: '1rem' }} disabled>5000 🍪</button>
                </div>
                <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔔</div>
                    <h3>Whale Alerts</h3>
                    <p className="text-secondary">Instant SMS notifications</p>
                    <button className="btn btn-outline" style={{ marginTop: '1rem' }} disabled>2000 🍪</button>
                </div>
                <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧢</div>
                    <h3>Poly Merch</h3>
                    <p className="text-secondary">Real world swag</p>
                    <button className="btn btn-outline" style={{ marginTop: '1rem' }} disabled>Coming Soon</button>
                </div>
            </div>
        </main>
    );
}
