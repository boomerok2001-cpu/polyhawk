# Vercel KV Setup Instructions

## Before Deploying

You need to create a Vercel KV (Redis) database for whale alert storage.

### Steps:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/poly-hawks-projects
   - Navigate to the "Storage" tab

2. **Create KV Database**
   - Click "Create Database"
   - Select "KV" (Redis)
   - Name it: `polyhawk-whale-alerts`
   - Choose region closest to your users
   - Click "Create"

3. **Connect to Project**
   - After creation, click "Connect to Project"
   - Select your `polyhawk` project
   - This will automatically add environment variables:
     - `KV_URL`
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`

4. **Optional: Add Cron Secret**
   - Go to Project Settings → Environment Variables
   - Add: `CRON_SECRET` = (generate a random string)
   - This secures your cron endpoint

5. **Deploy**
   - The deployment will now have access to KV storage
   - Cron job will start running every 5 minutes automatically

## How It Works

- **Cron Job**: Runs every 5 minutes at `/api/cron/fetch-whale-alerts`
- **Storage**: Alerts stored in Vercel KV (Redis) with 7-day retention
- **Client**: Fetches from backend storage, uses localStorage as cache
- **Capacity**: Stores up to 1000 most recent alerts

## Monitoring

- Check cron execution: Vercel Dashboard → Deployments → Functions → Cron
- View KV data: Vercel Dashboard → Storage → polyhawk-whale-alerts
