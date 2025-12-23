'use client';

import { useState } from 'react';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thanks for subscribing! 🎉');
        setEmail('');
    };

    return (
        <div style={{ marginTop: '6rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))', padding: '4rem 3rem', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Stay <span className="text-primary">Ahead</span> of the Market
                </h2>
                <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Get daily insights, arbitrage alerts, and exclusive market analysis delivered to your inbox.
                </p>
                <form style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            flex: 1,
                            padding: '1rem 1.5rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--text-main)',
                            fontSize: '1rem'
                        }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                        Subscribe
                    </button>
                </form>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    📧 Join 10,000+ traders • Unsubscribe anytime
                </div>
            </div>
        </div>
    );
}
