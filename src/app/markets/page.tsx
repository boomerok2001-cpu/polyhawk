'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchPolymarketTrending, fetchMarketsByCategory, fetchNewMarkets, Market } from '@/lib/api';
import { formatCurrency } from '@/data/markets';
import styles from './markets.module.css';

function MarketsContent() {
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter') || 'live';

    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('Live Events');
    const [subtitle, setSubtitle] = useState('Currently active prediction events on Polymarket');

    useEffect(() => {
        const loadMarkets = async () => {
            setLoading(true);
            try {
                let data: Market[] = [];
                let newTitle = 'Live Events';
                let newSubtitle = 'Currently active prediction events on Polymarket';

                if (filter === 'new') {
                    data = await fetchNewMarkets();
                    newTitle = 'New Markets';
                    newSubtitle = 'Recently created markets';
                } else if (filter === 'resolved') {
                    data = [];
                    newTitle = 'Resolved Markets';
                    newSubtitle = 'Markets that have ended';
                } else if (['politics', 'crypto', 'sports', 'business', 'science', 'pop-culture'].includes(filter)) {
                    const displayLabel = filter === 'pop-culture' ? 'Pop Culture' : filter.charAt(0).toUpperCase() + filter.slice(1);
                    data = await fetchMarketsByCategory(displayLabel);
                    newTitle = displayLabel;
                    newSubtitle = `${displayLabel} prediction markets`;
                } else {
                    data = await fetchPolymarketTrending();
                }

                setMarkets(data);
                setTitle(newTitle);
                setSubtitle(newSubtitle);
            } catch (err) {
                console.error("Failed to load markets", err);
            } finally {
                setLoading(false);
            }
        };

        loadMarkets();
    }, [filter]);

    return (
        <main className={`container ${styles.marketsPageContainer}`}>
            {/* Sidebar Navigation */}
            <aside className={styles.marketsSidebar}>
                <div className={styles.sidebarSticky}>
                    <h3 className={styles.sidebarHeader}>Filters</h3>

                    <nav className={styles.sidebarNav}>
                        {[
                            { id: 'live', label: '⚡ Live' },
                            { id: 'new', label: '🆕 New' },
                        ].map(cat => (
                            <Link
                                key={cat.id}
                                href={`/markets?filter=${cat.id}`}
                                className={`${styles.sidebarLink} ${filter === cat.id ? styles.sidebarLinkActive : ''}`}
                            >
                                <span className={styles.emoji}>{cat.label.split(' ')[0]}</span>
                                <span className={styles.labelText}>{cat.label.split(' ').slice(1).join(' ')}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className={styles.sidebarDivider}></div>
                    <div className={styles.sidebarHeaderSm}>Topics</div>
                    <nav className={styles.sidebarNav}>
                        {[
                            { id: 'politics', label: '⚖️ Politics' },
                            { id: 'crypto', label: '₿ Crypto' },
                            { id: 'sports', label: '⚽ Sports' },
                            { id: 'business', label: '💼 Business' },
                            { id: 'science', label: '🧬 Science' },
                            { id: 'pop-culture', label: '🎭 Pop Culture' },
                        ].map(cat => (
                            <Link
                                key={cat.id}
                                href={`/markets?filter=${cat.id}`}
                                className={`${styles.sidebarLink} ${filter === cat.id ? styles.sidebarLinkActive : ''}`}
                            >
                                <span className={styles.emoji}>{cat.label.split(' ')[0]}</span>
                                <span className={styles.labelText}>{cat.label.split(' ').slice(1).join(' ')}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className={styles.sidebarDivider}></div>
                    <div className={styles.sidebarHeaderSm}>Status</div>
                    <nav className={styles.sidebarNav}>
                        <Link
                            href="/markets?filter=resolved"
                            className={`${styles.sidebarLink} ${filter === 'resolved' ? styles.sidebarLinkActive : ''}`}
                        >
                            <span className={styles.emoji}>🏁</span>
                            <span className={styles.labelText}>Resolved</span>
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={styles.marketsContent}>
                <div className={styles.contentHeader}>
                    <h1>{title}</h1>
                    <p className="text-secondary">{subtitle}</p>
                </div>

                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading markets...</div>
                ) : (
                    <div className={styles.tableResponsiveWrapper}>
                        {/* Desktop Table */}
                        <div className="desktop-only">
                            <table className={styles.marketTableV2Full}>
                                <thead>
                                    <tr>
                                        <th>Market</th>
                                        <th>Price</th>
                                        <th>Liquidity</th>
                                        <th>Volume</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {markets.map((market, i) => (
                                        <tr key={market.id}>
                                            <td>
                                                <div className={styles.marketCell}>
                                                    <span className={styles.marketIndex}>{i + 1}</span>
                                                    {market.image && (
                                                        <img src={market.image} alt="" className={styles.marketThumb} />
                                                    )}
                                                    <a href={market.url} target="_blank" className={styles.marketLinkMain}>
                                                        {market.title}
                                                    </a>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.priceStack}>
                                                    <span className="price-indicator price-yes">{(market.yesPrice * 100).toFixed(1)}%</span>
                                                    <span className="price-indicator price-no">{(market.noPrice * 100).toFixed(1)}%</span>
                                                </div>
                                            </td>
                                            <td className={styles.fontNumeric}>{formatCurrency(market.liquidity)}</td>
                                            <td className={styles.fontNumeric}>{formatCurrency(market.volume)}</td>
                                            <td>
                                                <a href={market.url} target="_blank" className="btn btn-secondary btn-sm">
                                                    Polymarket
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="mobile-only">
                            <div className={styles.mobileCardStack}>
                                {markets.map((market, i) => (
                                    <a href={market.url} target="_blank" key={market.id} className={styles.marketMobileCard}>
                                        <div className={styles.mCardHeader}>
                                            <span className={styles.mCardRank}>#{i + 1}</span>
                                            <div className={styles.mCardTitle}>{market.title}</div>
                                        </div>
                                        <div className={styles.mCardBody}>
                                            <div className={styles.mPriceRow}>
                                                <div className={`${styles.mPriceBox} ${styles.mPriceBoxYes}`}>
                                                    <span className={styles.mLabel}>YES</span>
                                                    <span className={styles.mValue}>{(market.yesPrice * 100).toFixed(0)}¢</span>
                                                </div>
                                                <div className={`${styles.mPriceBox} ${styles.mPriceBoxNo}`}>
                                                    <span className={styles.mLabel}>NO</span>
                                                    <span className={styles.mValue}>{(market.noPrice * 100).toFixed(0)}¢</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.mCardFooter}>
                                            <span>Vol: {formatCurrency(market.volume)}</span>
                                            <span className="btn btn-secondary btn-xs">Details</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {markets.length === 0 && (
                            <div className={styles.emptyState}>
                                No markets found in this category currently.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

export default function MarketsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarketsContent />
        </Suspense>
    );
}
