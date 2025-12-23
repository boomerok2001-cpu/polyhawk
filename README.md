# Poly Hawk 🦅
### The Advanced Prediction Market Aggregator

**Poly Hawk** is a professional-grade intelligence terminal for prediction markets. It aggregates real-time data directly from premier on-chain sources like **Polymarket** and regulated exchanges like **Kalshi**, giving traders a unified view of the event-contract landscape.

Unlike other aggregators that rely on slower third-party indexers, Poly Hawk connects **directly** to the source APIs, ensuring the lowest latency and highest data integrity.

![Poly Hawk Terminal](https://via.placeholder.com/1200x600?text=Poly+Hawk+Dashboard+Preview)

---

## 🚀 Key Features

### ⚡ Direct API Integration
- **Polymarket Gamma API**: Fetches active markets, volume, liquidity, and prices directly from the Polygon sidechain.
- **Kalshi API**: Real-time odds for US-regulated election events.
- **Zero Latency**: No intermediate caching layer; you see what the chain sees.

### 📱 Premium UX/UI
- **Mobile-First Design**: A responsive, glassmorphism-inspired interface that works flawlessly on phones and desktops.
- **Dynamic Typography**: Fluid scaling text for optimal readability on any device.
- **Vanilla CSS Architecture**: High-performance, zero-runtime-overhead styling using modern CSS variables and Grid layouts.

### 💼 Portfolio Intelligence
- **Multi-Wallet Support**: Track positions across multiple Polymarket wallets simultaneously.
- **PnL Analytics**: Calculate profit/loss in real-time based on current market mark-to-market values.
- **Whale Watch**: Monitor large positions and smart money movements.

### 🔍 Smart Discovery
- **Trending Feed**: Auto-curated list of highest volume opportunities.
- **Top Gainers**: Algorithmic sorting based on liquidity shifts and volume spikes.
- **News Integration**: Integrated CoinDesk RSS feed to correlate news events with market movements.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Variables, Flex/Grid, Media Queries)
- **Data**: 
  - `src/lib/api.ts`: Direct Polymarket/Kalshi clients.
  - `src/lib/wallet-api.ts`: On-chain portfolio aggregation.

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/poly-hawk.git
    cd poly-hawk
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open the application**:
    Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/             # Server-side API proxies (Leaderboard, Metadata)
│   ├── market/[id]/     # Dynamic market detail view
│   ├── portfolio/       # Wallet tracker
│   ├── layout.tsx       # Root layout & SEO Metadata
│   └── page.tsx         # Home dashboard
├── lib/
│   ├── api.ts           # Core Polymarket & Kalshi direct fetchers
│   └── wallet-api.ts    # Portfolio & Position logic
├── components/          # Reusable UI components
└── data/                # Static helpers & types
```

## 🔒 Privacy & Security
- **No Tracking**: We do not track user IP addresses or trade data.
- **Client-Side Wallets**: Wallet addresses are stored in your local browser storage if saved; we never transmit them to a backend database.

---

*Built with ❤️ for the Prediction Market Community.*
