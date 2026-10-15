# Hosting on Vercel (free), step by step

**Before you start:** the repo may still contain placeholder data. You can deploy now to see it live, but replace your details in `src/content/profile.ts` and `public/resume.pdf` before sharing the link. Redeploys are automatic, so nothing is lost by deploying twice.

## Step 1: Sign in to Vercel
1. Go to **https://vercel.com/signup**.
2. Choose **Hobby** (the free plan, for personal projects).
3. Click **Continue with GitHub** and authorise Vercel. Use the same GitHub account that owns the repo.

## Step 2: Import the repository
1. On the Vercel dashboard, click **Add New… → Project**.
2. Find **Shashank8602/Portfolio** in the list and click **Import**.
   - If it isn't listed, click **Adjust GitHub App Permissions**, allow access to the `Portfolio` repo, and come back.

## Step 3: Configure (leave the defaults)
Vercel detects the project automatically. Check that the page shows:

| Setting | Value |
|---|---|
| Framework Preset | **Next.js** |
| Root Directory | `./` |
| Build Command | `next build` (default) |
| Output Directory | default |
| Environment Variables | none needed |

## Step 4: Deploy
1. Click **Deploy**.
2. Wait about a minute while it builds. When it finishes you'll see a confetti screen.
3. Click the preview image or **Visit** to open your live site at an address like `https://portfolio-xxxx.vercel.app`.

## Step 5: Set your real URL (so link previews work)
1. Open `src/content/profile.ts` and set `siteUrl` to your live address, for example `"https://portfolio-xxxx.vercel.app"`.
2. Commit and push:
   ```bash
   git add .
   git commit -m "Set site URL"
   git push
   ```
3. Vercel redeploys on its own within a minute. LinkedIn, WhatsApp and Slack previews will now show the correct image and title.

## Step 6 (optional): Cleaner address
**Project → Settings → Domains** lets you change the free subdomain, for example to `shashank-ai.vercel.app`. Type the name you want, click **Add**, and update `siteUrl` to match.

## Step 7 (optional): Your own domain
1. Buy a domain (for example `yourname.dev`) from any registrar, such as GoDaddy, Namecheap or Cloudflare.
2. In Vercel, go to **Project → Settings → Domains → Add** and enter the domain.
3. Vercel shows the DNS record to create at your registrar:
   - **A record** pointing `@` to the IP Vercel shows, for the root domain
   - **CNAME** pointing `www` to `cname.vercel-dns.com`
4. Save it. HTTPS is issued automatically, usually within a few minutes.
5. Update `siteUrl` to the new domain and push.

## Updating the site later
Edit your files, then:
```bash
git add .
git commit -m "Update projects"
git push
```
Every push to `main` goes live automatically. Pushes to other branches get their own private preview URL, so you can check changes first.

## Troubleshooting
- **Build failed:** open the failed deployment in Vercel and read the log. Run `npm run build` locally to reproduce it.
- **Old content showing:** hard-refresh the page (Ctrl + Shift + R). Link previews on LinkedIn or WhatsApp are cached, so use their "re-scrape" tools such as the LinkedIn Post Inspector.
- **Résumé download shows the placeholder:** you haven't replaced `public/resume.pdf` yet. Keep the file name the same and push.
