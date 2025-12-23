# How to Deploy Poly Hawk

Since this is a secure CLI tool, you must authenticate it manually once.

## Option 1: The Easy Way (Zip Upload)

1.  **Download the Zip**: Locate `poly_hawk_source.zip` in your scratch directory.
2.  **Go to Vercel**: Open [vercel.com/new](https://vercel.com/new).
3.  **Import**: Click **browse** or drag the zip file into the import area (if supported) OR simpler:
    *   Unzip the folder.
    *   Push it to a new GitHub repository.
    *   Import that repository in Vercel.

## Option 2: CLI Deployment (Advanced)

1.  **Run the Deploy Script**:
    ```bash
    .\deploy.bat
    ```
    *(Note: This requires `vercel` CLI to be installed. If not, run `npm i -g vercel` first)*

2.  **Follow Protocol**:
    *   If asked to **Log in**, choose **Continue with GitHub**.
    *   Accept default settings (press `Enter` 4-5 times).
    *   Set up and deploy? **Y**
    *   Which scope? **(Your Name)**
    *   Link to existing project? **N**
    *   Project Name? **poly-hawk**
    *   Code Location? **./**

3.  **Success**:
    Vercel will build the project and give you a `Production` link.

## Step 4: Add a Custom Domain (Optional)
1.  Buy a domain from any provider (Namecheap, GoDaddy, etc.).
2.  Go to **Vercel Dashboard** > **Settings** > **Domains**.
3.  Type your domain (e.g., `polyhawk.com`) and click **Add**.
4.  Copy the **DNS Records** (A Record / CNAME) Vercel shows you.
5.  Paste them into your domain provider's DNS settings.
