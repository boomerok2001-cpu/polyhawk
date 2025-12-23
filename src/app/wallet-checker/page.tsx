'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPolymarketUrl } from '@/lib/api';
import Link from 'next/link';
import Leaderboard from '@/components/Leaderboard';

interface WalletStats {
    address: string;
    totalPnL: number;
    realizedPnL: number;
    unrealizedPnL: number;
    winRate: number;
    totalVolume: number;
    avgBetSize: number;
    openPositions: number;
    closedPositions: number;
    uniqueMarkets: number;
    totalPositionsValue: number;
    totalBuyOrders: number;
    totalSellOrders: number;
    rank?: number;
    name?: string;
    profileImage?: string;
}

interface Position {
    id: string;
    marketTitle: string;
    outcome: 'YES' | 'NO';
    shares: number;
    entryPrice: number;
    currentPrice: number;
    value: number;
    pnl: number;
    pnlPercent: number;
    status: 'open' | 'closed';
    marketUrl: string;
    betSize: number;
    winChance: number;
    image?: string;
}

interface PnLPoint {
    date: string;
    value: number;
}

function WalletCheckerContent() {
    const [walletAddress, setWalletAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [positions, setPositions] = useState<Position[]>([]);
    const [pnlHistory, setPnlHistory] = useState<PnLPoint[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'strategy'>('overview');
    const [positionFilter, setPositionFilter] = useState<'all' | 'open' | 'closed'>('all');
    const searchParams = useSearchParams();

    const handleCheck = async (addressOverride?: string) => {
        const addressToUse = addressOverride || walletAddress;

        if (!addressToUse || addressToUse.length < 5) {
            alert('Please enter a valid wallet address');
            return;
        }

        if (addressOverride) {
            setWalletAddress(addressOverride);
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/wallet?address=${addressToUse}`);

            if (!response.ok) {
                throw new Error('Failed to fetch wallet data');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const { stats: apiStats, pnlHistory: apiPnl, portfolioValue, openPositions: apiOpen, closedPositions: apiClosed } = data;

            const totalPnL = parseFloat(apiStats.pnl || '0');
            const totalVolume = parseFloat(apiStats.vol || '0');
            const winRate = parseFloat(apiStats.winRate || '0') * 100;

            const taggedOpen = apiOpen.map((p: any) => ({ ...p, _isFromClosed: false }));
            const taggedClosed = apiClosed.map((p: any) => ({ ...p, _isFromClosed: true }));

            const allPositions = [...taggedOpen, ...taggedClosed];

            const processedPositions: Position[] = allPositions
                .filter(pos => pos && (pos.title || pos.market || pos.question || pos.conditionId))
                .map((pos: any, index: number) => {
                    const size = Math.abs(parseFloat(pos.size || pos.amount || '0'));
                    const entryPrice = parseFloat(pos.avgCost || pos.avgPrice || pos.entry_price || '0.5');
                    const currentPrice = parseFloat(pos.curPrice || pos.currentPrice || pos.price || entryPrice);
                    const value = size * currentPrice;
                    const costBasis = size * entryPrice;
                    const pnl = parseFloat(pos.realizedPnl || pos.pnl || pos.unrealizedPnl || (value - costBasis).toString());
                    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

                    const marketTitle = pos.title || pos.market || pos.question || pos.eventTitle || `Market ${pos.conditionId?.substring(0, 8) || index}`;
                    const isFromClosedArray = pos._isFromClosed === true;

                    const slug = pos.slug || pos.market_slug || pos.eventSlug || '';
                    const image = pos.image || pos.eventImage;

                    return {
                        id: pos.id || pos.conditionId || `pos-${index}-${Date.now()}`,
                        marketTitle: marketTitle.substring(0, 100),
                        outcome: (pos.outcome === 'Yes' || pos.outcome === 'YES' || pos.outcome === '1' || pos.side === 'Yes') ? 'YES' : 'NO',
                        shares: size,
                        entryPrice: entryPrice,
                        currentPrice: currentPrice,
                        value: value,
                        pnl: pnl,
                        pnlPercent: pnlPercent,
                        status: isFromClosedArray ? 'closed' : 'open',
                        marketUrl: getPolymarketUrl(`event/${slug}`),
                        betSize: costBasis,
                        winChance: Math.min(100, Math.max(0, currentPrice * 100)),
                        image: image
                    };
                });

            const realizedPnL = apiClosed.reduce((sum: number, p: any) => sum + parseFloat(p.pnl || '0'), 0);
            const unrealizedPnL = totalPnL - realizedPnL;
            const openCount = apiOpen.length;
            const closedCount = apiClosed.length;
            const totalTrades = openCount + closedCount;
            const uniqueMarkets = new Set(allPositions.map((p: any) => p.market || p.market_id));

            const calculatedStats: WalletStats = {
                address: addressToUse,
                totalPnL,
                realizedPnL,
                unrealizedPnL,
                winRate,
                totalVolume,
                avgBetSize: totalTrades > 0 ? totalVolume / totalTrades : 0,
                openPositions: openCount,
                closedPositions: closedCount,
                uniqueMarkets: uniqueMarkets.size,
                totalPositionsValue: portfolioValue,
                totalBuyOrders: totalTrades,
                totalSellOrders: closedCount,
                name: apiStats.name,
                profileImage: apiStats.profileImage
            };

            const history: PnLPoint[] = apiPnl.map((point: any) => ({
                date: new Date(point.t * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: parseFloat(point.p || '0')
            }));

            setStats(calculatedStats);
            setPositions(processedPositions);
            setPnlHistory(history.length > 0 ? history : [{ date: 'Now', value: totalPnL }]);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            alert('Failed to fetch wallet data. Please check the address and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const address = searchParams.get('address');
        if (address) {
            handleCheck(address);
        }
    }, [searchParams]);

    const filteredPositions = positions.filter(p => {
        if (positionFilter === 'all') return true;
        return p.status === positionFilter;
    });

    return (
        <main className="container" style={{ paddingBottom: '4rem', marginTop: '4rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Whales <span className="text-primary">Tracker</span>
                </h1>
                <p className="text-secondary" style={{ fontSize: '1.1rem' }}>
                    Analyze any prediction market portfolio
                </p>
            </div>

            {/* Search Input */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', maxWidth: '800px', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        placeholder="Enter wallet address (0x...) or ENS name"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
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
                    <button
                        onClick={() => handleCheck()}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ padding: '1rem 2.5rem', fontSize: '1rem', whiteSpace: 'nowrap' }}
                    >
                        {loading ? '⏳' : '🔍 Analyze'}
                    </button>
                </div>

                {/* Leaderboard - Show only when no stats loaded yet */}
                {!stats && !loading && (
                    <Leaderboard onSelectTrader={(addr) => handleCheck(addr)} />
                )}
            </div>

            {/* Results */}
            {stats && (
                <div>
                    {/* Wallet Header */}
                    <div style={{ marginBottom: '2rem', padding: '2rem', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-hover)', overflow: 'hidden', border: '2px solid var(--border)' }}>
                                {stats.profileImage ? (
                                    <img src={stats.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👤</div>
                                )}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{stats.name || 'Anonymous Trader'}</h2>
                                <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {stats.address}
                                    <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => navigator.clipboard.writeText(stats.address)}>COPY</button>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Profit</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: stats.totalPnL >= 0 ? '#22c55e' : '#ef4444' }}>
                                {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Win Rate</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.winRate.toFixed(1)}%</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Volume</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>${(stats.totalVolume / 1000).toFixed(0)}k</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Avg Bet</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>${stats.avgBetSize.toFixed(0)}</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Positions</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.openPositions}</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 1.5rem' }}>
                            {[
                                { id: 'overview', label: '📊 Overview' },
                                { id: 'positions', label: '📈 Positions' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontWeight: activeTab === tab.id ? 700 : 500,
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        padding: '1rem 1.5rem',
                                        borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div style={{ padding: '2rem' }}>
                            {activeTab === 'overview' && (
                                <div>
                                    {/* PnL Timeline Chart */}
                                    <div style={{ marginBottom: '3rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>📈 Cumulative PnL</h3>
                                        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', height: '350px', position: 'relative', overflow: 'hidden' }}>
                                            {(() => {
                                                const values = pnlHistory.map(p => p.value);
                                                if (values.length === 0) return <div>No Date</div>;
                                                const min = Math.min(...values, 0);
                                                const max = Math.max(...values, 0);
                                                const range = max - min || 1;
                                                const width = 800; const height = 250;
                                                const points = values.map((val, i) => {
                                                    const x = (i / (values.length - 1)) * width;
                                                    const y = height - ((val - min) / range) * height;
                                                    return `${x},${y}`;
                                                }).join(' ');
                                                const areaPath = `${points} ${width},${height} 0,${height}`;
                                                const zeroY = height - ((0 - min) / range) * height;

                                                return (
                                                    <div style={{ width: '100%', height: '100%' }}>
                                                        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                                            <defs>
                                                                <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                                                                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                                                </linearGradient>
                                                            </defs>
                                                            <line x1="0" y1={zeroY} x2={width} y2={zeroY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                                            <polyline points={points} fill="none" stroke="#22c55e" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                                                            <polygon points={areaPath} fill="url(#pnlGradient)" />
                                                        </svg>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Treemap Visualizer */}
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>🗺️ Portfolio Map</h3>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        height: '400px',
                                        width: '100%',
                                        background: 'var(--surface)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border)'
                                    }}>
                                        {(() => {
                                            const openPositions = positions.filter(p => p.status === 'open' && p.value > 1);
                                            const totalValue = openPositions.reduce((sum, p) => sum + p.value, 0);

                                            if (totalValue === 0) return <div style={{ padding: '2rem', width: '100%', textAlign: 'center', color: 'var(--text-secondary)' }}>No open positions or value is too small to map.</div>;

                                            return openPositions.sort((a, b) => b.value - a.value).map(pos => {
                                                const percent = (pos.value / totalValue) * 100;
                                                const isProfit = pos.pnlPercent >= 0;
                                                const intensity = Math.min(0.5, Math.abs(pos.pnlPercent) / 100) + 0.1;
                                                const bgColor = isProfit
                                                    ? `rgba(34, 197, 94, ${intensity})`
                                                    : `rgba(239, 68, 68, ${intensity})`;
                                                const textColor = isProfit ? '#4ade80' : '#f87171';

                                                return (
                                                    <Link
                                                        href={pos.marketUrl}
                                                        target="_blank"
                                                        key={pos.id}
                                                        style={{
                                                            flex: `1 1 ${percent}%`,
                                                            minWidth: percent > 20 ? '150px' : '80px',
                                                            minHeight: '80px',
                                                            background: bgColor,
                                                            border: '1px solid rgba(0,0,0,0.1)',
                                                            padding: '0.5rem',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            textAlign: 'center',
                                                            position: 'relative',
                                                            textDecoration: 'none',
                                                            overflow: 'hidden',
                                                            transition: 'transform 0.2s, z-index 0.2s',
                                                        }}
                                                        className="treemap-item"
                                                    >
                                                        <div style={{ fontSize: percent > 10 ? '0.85rem' : '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem', lineHeight: 1.2, maxHeight: '2.4em', overflow: 'hidden' }}>
                                                            {percent > 5 ? pos.marketTitle : ''}
                                                        </div>
                                                        <div style={{ fontSize: percent > 10 ? '1rem' : '0.85rem', fontWeight: 800, color: '#white', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                                            ${(pos.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600,
                                                            color: textColor,
                                                            background: 'rgba(0,0,0,0.4)',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            marginTop: '4px'
                                                        }}>
                                                            {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(1)}%
                                                        </div>
                                                    </Link>
                                                );
                                            });
                                        })()}
                                    </div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                        Size = Position Value • Color = PnL %
                                    </div>
                                </div>
                            )}

                            {activeTab === 'positions' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {['all', 'open', 'closed'].map(filter => (
                                                <button key={filter} onClick={() => setPositionFilter(filter as any)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: positionFilter === filter ? 'var(--primary)' : 'var(--surface)', border: '1px solid var(--border)', color: positionFilter === filter ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', textTransform: 'capitalize', fontWeight: 600 }}>
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                        {filteredPositions.map(pos => (
                                            <div key={pos.id} className="card-hover" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4, flex: 1, paddingRight: '1rem' }}>{pos.marketTitle}</div>
                                                    <div style={{ padding: '4px 8px', borderRadius: '6px', background: pos.outcome === 'YES' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: pos.outcome === 'YES' ? '#22c55e' : '#ef4444', fontWeight: 800, fontSize: '0.8rem' }}>{pos.outcome}</div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Value</div>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${pos.value.toFixed(0)}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PnL</div>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: pos.pnl >= 0 ? '#22c55e' : '#ef4444' }}>{pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(0)}</div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                                                    <span>{pos.shares.toFixed(0)} Shares @ {(pos.entryPrice * 100).toFixed(1)}¢</span>
                                                    <span style={{ color: pos.pnlPercent >= 0 ? '#22c55e' : '#ef4444' }}>{pos.pnlPercent.toFixed(1)}% ROI</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {filteredPositions.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                            No positions found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .treemap-item:hover {
                    z-index: 10;
                    transform: scale(1.02);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    border-color: rgba(255,255,255,0.2) !important;
                }
            `}</style>
        </main>
    );
}

export default function WalletCheckerPage() {
    return (
        <Suspense fallback={<div className="container" style={{ marginTop: '10rem', textAlign: 'center' }}>Loading Tracker...</div>}>
            <WalletCheckerContent />
        </Suspense>
    );
}
