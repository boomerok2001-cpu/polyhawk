import { Metadata } from 'next';
import { fetchWhaleAlertsV2 } from '@/lib/api';
import WhaleAlertsClient from './WhaleAlertsClient';
import styles from './whale-alerts.module.css';

export const metadata: Metadata = {
    title: 'Whale Alerts | Real-Time Prediction Market Tracker | Poly Hawk',
    description: 'Track high-value trades and "whale" activity on Polymarket and Kalshi. Real-time monitoring of capital flow in prediction markets.',
    openGraph: {
        title: 'Real-Time Whale Alerts for Prediction Markets',
        description: 'See where the smart money is moving on Poly Hawk.',
        images: ['https://images.unsplash.com/photo-1551288049-bbbda536339a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80']
    }
};

export default async function WhaleAlertsPage() {
    const initialAlerts = await fetchWhaleAlertsV2();

    return (
        <main className={`container ${styles.whalePageContainer}`}>
            <div className={styles.whaleHeader}>
                <h1 className={styles.whaleTitle}>
                    Whale Alerts
                </h1>
                <p className={styles.whaleDescription}>
                    Monitoring high-value trade execution across prediction markets. Tracking capital flow for smarter signals.
                </p>

                <WhaleAlertsClient initialAlerts={initialAlerts} />
            </div>
        </main>
    );
}
