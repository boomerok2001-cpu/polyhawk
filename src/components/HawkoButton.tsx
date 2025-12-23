'use client';

import { useState } from 'react';
import EagleLogo from './EagleLogo';

export default function HawkoButton() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="btn btn-outline"
                style={{ fontSize: '1.1rem', padding: '0.8rem 2rem' }}
            >
                🦅 Hawko
            </button>

            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '24px',
                            padding: '3rem',
                            textAlign: 'center',
                            maxWidth: '400px',
                            width: '90%'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ marginBottom: '1.5rem' }}>
                            <EagleLogo size={80} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Hawko
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Coming soon.
                        </p>
                        <div style={{
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            padding: '0.75rem 2rem',
                            borderRadius: '12px',
                            display: 'inline-block',
                            fontWeight: 700,
                            fontSize: '1.1rem'
                        }}>
                            🚀 Coming Soon
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                display: 'block',
                                margin: '1.5rem auto 0',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
