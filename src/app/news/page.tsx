'use client';

import { useState, useEffect } from 'react';
import { fetchNews } from '@/lib/api';
import Link from 'next/link';
import styles from './news.module.css';

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await fetchNews();
                setNews(data);
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, []);

    return (
        <main className="container" style={{ paddingBottom: '6rem' }}>
            <div style={{ margin: '4rem 0 3.5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '0.5rem 1.25rem', borderRadius: '30px', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Intelligence
                </div>
                <h1 className={styles.pageTitle} style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                    Search The <span style={{ background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Horizon</span>
                </h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading news...</div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                    {news.map((item) => (
                        <a href={item.url} key={item.id} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                            <div className={`card-hover ${styles.newsCard}`} style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '24px',
                                padding: '1.5rem',
                                display: 'flex',
                                gap: '2rem',
                                alignItems: 'start',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}>
                                <div className={styles.imageContainer} style={{
                                    width: '160px',
                                    height: '160px',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    border: '1px solid var(--border)'
                                }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.source}</span>
                                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }}></span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.time}</span>
                                        </div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            color: 'var(--text-secondary)',
                                            border: '1px solid var(--border)',
                                            fontWeight: 600,
                                            textTransform: 'uppercase'
                                        }}>
                                            {item.category}
                                        </div>
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                                        {item.title}
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                        {item.snippet}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                    {news.length === 0 && <div style={{ textAlign: 'center', padding: '2rem' }}>No news available at the moment.</div>}
                </div>
            )}
        </main>
    );
}
