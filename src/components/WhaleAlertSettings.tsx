'use client';

import { useState } from 'react';
import styles from './whale-alert-settings.module.css';

interface AlertPreferences {
    enabled: boolean;
    minTradeValue: number;
    emailEnabled: boolean;
    email: string;
    telegramEnabled: boolean;
    telegramChatId: string;
}

const DEFAULT_PREFERENCES: AlertPreferences = {
    enabled: false,
    minTradeValue: 5000,
    emailEnabled: false,
    email: '',
    telegramEnabled: false,
    telegramChatId: ''
};

export default function WhaleAlertSettings() {
    const [preferences, setPreferences] = useState<AlertPreferences>(() => {
        if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
        const stored = localStorage.getItem('polyhawk_alert_preferences');
        return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
    });

    const [testing, setTesting] = useState<{ email: boolean, telegram: boolean }>({
        email: false,
        telegram: false
    });

    const savePreferences = () => {
        localStorage.setItem('polyhawk_alert_preferences', JSON.stringify(preferences));
        alert('Alert preferences saved!');
    };

    const sendTestNotification = async (channel: 'email' | 'telegram') => {
        setTesting(prev => ({ ...prev, [channel]: true }));

        const destination = channel === 'email' ? preferences.email : preferences.telegramChatId;

        try {
            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channel,
                    destination,
                    test: true,
                    alert: {
                        amount: 10000,
                        marketTitle: 'Test Market - Will Bitcoin reach $100k?',
                        side: 'YES',
                        price: 0.65,
                        marketUrl: 'https://polymarket.com',
                        timestamp: Date.now() / 1000
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                alert(`✅ Test ${channel} sent successfully! Check your ${channel}.`);
            } else {
                alert(`❌ Failed to send test: ${data.error}`);
            }
        } catch (error) {
            alert(`❌ Error sending test: ${error}`);
        } finally {
            setTesting(prev => ({ ...prev, [channel]: false }));
        }
    };

    return (
        <div className={styles.settingsPanel}>
            <div className={styles.header}>
                <h3>🔔 Alert Settings</h3>
                <p>Get notified when whale trades match your criteria</p>
            </div>

            {/* Alert Threshold */}
            <div className={styles.section}>
                <label className={styles.label}>
                    Minimum Trade Value: ${preferences.minTradeValue.toLocaleString()}
                </label>
                <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={preferences.minTradeValue}
                    onChange={(e) => setPreferences({ ...preferences, minTradeValue: parseInt(e.target.value) })}
                    className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                    <span>$1K</span>
                    <span>$100K</span>
                </div>
            </div>

            {/* Email Notifications */}
            <div className={styles.section}>
                <div className={styles.channelHeader}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={preferences.emailEnabled}
                            onChange={(e) => setPreferences({ ...preferences, emailEnabled: e.target.checked })}
                        />
                        <span>📧 Email Notifications</span>
                    </label>
                </div>
                {preferences.emailEnabled && (
                    <div className={styles.channelConfig}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={preferences.email}
                            onChange={(e) => setPreferences({ ...preferences, email: e.target.value })}
                            className={styles.input}
                        />
                        <button
                            onClick={() => sendTestNotification('email')}
                            disabled={!preferences.email || testing.email}
                            className={styles.testButton}
                        >
                            {testing.email ? 'Sending...' : 'Send Test'}
                        </button>
                    </div>
                )}
            </div>

            {/* Telegram Notifications */}
            <div className={styles.section}>
                <div className={styles.channelHeader}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={preferences.telegramEnabled}
                            onChange={(e) => setPreferences({ ...preferences, telegramEnabled: e.target.checked })}
                        />
                        <span>📱 Telegram Notifications</span>
                    </label>
                </div>
                {preferences.telegramEnabled && (
                    <div className={styles.channelConfig}>
                        <input
                            type="text"
                            placeholder="Your Telegram Chat ID"
                            value={preferences.telegramChatId}
                            onChange={(e) => setPreferences({ ...preferences, telegramChatId: e.target.value })}
                            className={styles.input}
                        />
                        <button
                            onClick={() => sendTestNotification('telegram')}
                            disabled={!preferences.telegramChatId || testing.telegram}
                            className={styles.testButton}
                        >
                            {testing.telegram ? 'Sending...' : 'Send Test'}
                        </button>
                        <a
                            href="https://t.me/userinfobot"
                            target="_blank"
                            className={styles.helpLink}
                        >
                            How to get your Chat ID →
                        </a>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className={styles.actions}>
                <button onClick={savePreferences} className={styles.saveButton}>
                    Save Preferences
                </button>
            </div>

            {/* Info */}
            <div className={styles.info}>
                <p>💡 <strong>Note:</strong> Alerts are triggered when you have the website open. For 24/7 notifications, a database would be required.</p>
            </div>
        </div>
    );
}
