'use client';

import Link from 'next/link';
import { Market } from '@/lib/api';
import { formatCurrency } from '@/data/markets';
import { useState } from 'react';

const CATEGORIES = ['All', 'Politics', 'Crypto', 'Sports', 'Pop Culture', 'Business', 'Science', 'Other'];

export default function MarketList({ initialMarkets }: { initialMarkets: Market[] }) {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredMarkets = activeCategory === 'All'
        ? initialMarkets
        : initialMarkets.filter(m => m.category.includes(activeCategory) || m.category === activeCategory);

    return (
        <div>
            <div className="category-tabs">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="market-table-container desktop-only">
                <table className="market-table">
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>Market</th>
                            <th>Source</th>
                            <th style={{ textAlign: 'right' }}>Yes</th>
                            <th style={{ textAlign: 'right' }}>No</th>
                            <th style={{ textAlign: 'right' }}>24h</th>
                            <th style={{ textAlign: 'right' }}>Volume</th>
                            <th style={{ textAlign: 'right' }}>Liquidity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMarkets.map((market, index) => (
                            <tr key={market.id}>
                                <td className="market-rank">{index + 1}</td>
                                <td>
                                    <Link href={`/market/${market.id}`} className="market-name">
                                        {market.title}
                                    </Link>
                                    <span className="market-category">{market.category}</span>
                                </td>
                                <td>
                                    <span
                                        style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            background: market.source === 'Polymarket' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                            color: market.source === 'Polymarket' ? '#60a5fa' : '#34d399',
                                            border: `1px solid ${market.source === 'Polymarket' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                                        }}
                                    >
                                        {market.source}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <span className="price-indicator price-yes">{(market.yesPrice * 100).toFixed(0)}¢</span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <span className="price-indicator price-no">{(market.noPrice * 100).toFixed(0)}¢</span>
                                </td>
                                <td style={{ textAlign: 'right' }} className={market.change24h >= 0 ? 'text-green' : 'text-red'}>
                                    {market.change24h > 0 ? '+' : ''}{market.change24h.toFixed(1)}%
                                </td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(market.volume)}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(market.liquidity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-only market-list-mobile">
                {filteredMarkets.map((market) => (
                    <Link href={`/market/${market.id}`} key={market.id} className="mobile-market-card">
                        <div className="mobile-card-header">
                            <div className="mobile-card-source">
                                <span style={{ color: market.source === 'Polymarket' ? '#60a5fa' : '#34d399' }}>●</span> {market.source}
                            </div>
                            <div className={market.change24h >= 0 ? 'text-green' : 'text-red'}>
                                {market.change24h > 0 ? '+' : ''}{market.change24h.toFixed(1)}%
                            </div>
                        </div>

                        <div className="mobile-card-title">{market.title}</div>

                        <div className="mobile-card-prices">
                            <div className="price-box yes">
                                <span className="label">YES</span>
                                <span className="value">{(market.yesPrice * 100).toFixed(0)}¢</span>
                            </div>
                            <div className="price-box no">
                                <span className="label">NO</span>
                                <span className="value">{(market.noPrice * 100).toFixed(0)}¢</span>
                            </div>
                        </div>

                        <div className="mobile-card-footer">
                            <span>Vol: {formatCurrency(market.volume)}</span>
                            <span className="market-category">{market.category}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredMarkets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No markets found for this category.
                </div>
            )}
        </div>
    );
}
