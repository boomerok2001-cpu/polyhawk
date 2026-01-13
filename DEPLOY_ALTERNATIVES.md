# 🌍 Deployment Alternatives

Since Vercel is unavailable, here are the best free alternatives for your static site.

## Option 1: Netlify (Recommended) 🏆
**Best for:** Ease of use, similar to Vercel.

1.  **Sign up/Login** to [Netlify](https://www.netlify.com).
2.  Click **"Add new site"** > **"Import from existing project"**.
3.  Connect **GitHub**.
4.  Select `polyhawk/polyhawk`.
5.  **Build Settings** (should auto-detect from `netlify.toml` I just added):
    *   **Build Command:** `npm run build`
    *   **Publish directory:** `out`
6.  Click **Deploy**.

## Option 2: Cloudflare Pages ⚡
**Best for:** Speed and reliability.

1.  **Sign up/Login** to [Cloudflare Dashboard](https://dash.cloudflare.com).
2.  Go to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
3.  Select `polyhawk/polyhawk`.
4.  **Build Settings**:
    *   **Framework Preset:** Next.js (Static HTML Export)
    *   **Build Command:** `npm run build`
    *   **Build output directory:** `out`
5.  Click **Save and Deploy**.

## Option 3: GitHub Pages
**Best for:** Integrated directly in GitHub.

1.  Go to your repository settings on GitHub.
2.  Navigate to **Pages**.
3.  Under **Build and deployment**, select **GitHub Actions**.
4.  GitHub usually suggests a Next.js Static workflow. If not, create a file at `.github/workflows/nextjs.yml` with standard static export config.
    *   *Note:* GitHub Pages often requires a `basePath` in `next.config.ts` if you strictly use `username.github.io/repo-name`. Custom domains avoid this complexity.

---

## ✅ Why these works safely
All these options serve **static files**. They effectively host a folder of HTML/CSS/JS. There is **no server-side code execution**, so you cannot be blocked for high CPU usage on the hosting platform side (as the "compilation" happens during build, and "runtime" happens in the user's browser).
