# AI/GenAI Developer Portfolio

A futuristic, single-page portfolio built with Next.js and Tailwind CSS. It has two signature features:

- **A live neural-network hero:** a hand-written Canvas 2D animation. Signal pulses travel between neurons and the network reacts to the cursor.
- **An "Ask my AI" console:** an LLM-style chat that answers questions about you. It runs entirely in the visitor's browser, with no backend and no API key.

It also includes three colour themes (Nebula, Matrix, Sunset), each with a light and dark mode, plus a responsive layout from 360 px phones up to wide desktops.

---

## 1. Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # production build (run this before deploying)
npm run start      # serve the production build locally
npm run lint
```

## 2. Put in your own content

Almost everything lives in **one file: [`src/content/profile.ts`](src/content/profile.ts)**. Every line with placeholder data is marked `TODO`. Edit it, save, and the page and the AI console update automatically.

| What | Where |
| --- | --- |
| Name, role, company, location, tagline, summary | `profile.ts` (top) |
| Email, phone, LinkedIn, GitHub | `profile.ts` → `contact` |
| Headline numbers (the 4 stat tiles) | `profile.ts` → `metrics` |
| Skills (grouped tiles; `featured: true` makes a tile wider) | `profile.ts` → `skills` |
| Experience timeline (newest first) | `profile.ts` → `experience` |
| Projects (with the mini architecture diagram in `pipeline`) | `profile.ts` → `projects` |
| Certifications / education (use `[]` to hide) | `profile.ts` |
| Your CV | Replace **`public/resume.pdf`** (keep the same file name) |
| Your final website URL (used for SEO and link previews) | `profile.ts` → `siteUrl` |

**Tech logos.** Skills such as Python, PyTorch, LangChain, Docker and Qdrant show their logo automatically. Any name without a logo still displays as a clean text chip. The list of known logos is in [`src/lib/tech-icons.ts`](src/lib/tech-icons.ts).

**The AI console's answers.** Answers about skills, experience, projects and contact details are generated from `profile.ts`. A few hand-written answers (RAG, agents, "why should we hire you", and so on) are in [`src/content/assistant.ts`](src/content/assistant.ts) and marked `TODO`. Rewrite them in your own voice.

**Your phone number** is never written into the page as plain text. It is encoded, and only revealed when a visitor clicks **Show number**, so simple spam scrapers can't harvest it.

## 3. Choose a theme

Use the 🎨 button in the navbar, or type `/theme nebula`, `/theme matrix`, `/theme sunset`, `/theme light` or `/theme dark` in the console. The site remembers each visitor's choice.

To change the theme **first-time visitors** see, edit `DEFAULT_THEME` / `DEFAULT_MODE` in [`src/lib/theme.ts`](src/lib/theme.ts). The colours themselves are CSS variables at the top of [`src/app/globals.css`](src/app/globals.css).

## 4. How the "Ask my AI" console works without a backend

1. A small knowledge base of "intents" is built from your profile. Each intent has keywords, example questions and an answer.
2. The visitor's question is matched against the intents in the browser by [`src/components/console/engine.ts`](src/components/console/engine.ts). The matcher:
   - normalises the question, removes filler words and applies light stemming;
   - maps synonyms (for example, "stack" → skills, "cv" → résumé) and tolerates typos;
   - weights rare, specific words more heavily than common ones;
   - adds a fuzzy comparison with each intent's example questions.
3. The best match is streamed back token by token, like a real LLM. Questions that don't match get a polite fallback with suggested questions.
4. Slash commands: `/help`, `/skills`, `/experience`, `/projects`, `/contact`, `/resume`, `/theme <name>`, `/clear`.

Nothing is sent to a server and there are no API costs. If you later want a real LLM, only `respond()` in `engine.ts` needs to change, for example to call a Vercel serverless function.

---

## 5. Deploy to Vercel (free)

Yes: a site like this (static, no backend) runs on Vercel's free **Hobby** plan, which is meant for personal, non-commercial projects. You get HTTPS, a global CDN and automatic redeploys.

### Step 1: Put the code on GitHub
1. Create a free account at <https://github.com>, if you don't have one.
2. Click **New repository**. Name it, for example, `portfolio`; it can be Public or Private. **Don't** add a README, `.gitignore` or licence, because the project already has them. Then click **Create repository**.
3. In this project folder, run:

   ```bash
   git init                # skip if already done
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```

### Step 2: Import the repo into Vercel
1. Go to <https://vercel.com/signup> and choose **Continue with GitHub**.
2. On the dashboard, click **Add New… → Project**.
3. Find your `portfolio` repo and click **Import**. If it isn't listed, click "Adjust GitHub App Permissions" and grant access to the repo.
4. Vercel detects **Next.js** automatically. Leave every setting at its default; no environment variables are needed.
5. Click **Deploy**. About a minute later you'll get a live URL like `https://portfolio-<something>.vercel.app`. 🎉

### Step 3: Finishing touches
1. Copy your live URL into `siteUrl` in `src/content/profile.ts`, then commit and push. This makes link previews (LinkedIn, WhatsApp, Slack) and SEO use the correct address.
2. *(Optional)* Rename the project under **Project → Settings → General** to get a cleaner `https://<name>.vercel.app` address.
3. *(Optional)* **Custom domain.** Buy a domain (for example, `yourname.dev`) from any registrar, then go to **Project → Settings → Domains → Add**. Vercel shows the DNS record to add at your registrar: an `A` record for the root domain, or a `CNAME` for `www`. HTTPS is issued automatically once DNS updates, usually within minutes.
4. *(Optional)* Turn on **Analytics** in the Vercel project to see visitor counts.

### Updating the site later
Edit, commit and push. Vercel redeploys automatically:

```bash
git add .
git commit -m "Update projects"
git push
```

Every pull request or branch also gets its own preview URL, so you can check changes before they go live.

---

## Project structure

```
src/
  app/                  layout (fonts, SEO, no-flash theme script), page, OG image, 404, robots, sitemap
  content/
    profile.ts          ← your data
    assistant.ts        ← console knowledge base (partly generated from profile.ts)
    types.ts
  components/
    hero/               Hero, NeuralCanvas, DecodeText
    console/            AIConsole (UI) + engine (matcher, commands, streaming tokens)
    nav/                Navbar (scroll progress, mobile menu), ThemeSwitcher
    sections/           About, Skills, Experience, Projects, Certifications, Contact
    ui/                 Section, Reveal, TechChip, PipelineDiagram, PhoneReveal, …
  lib/                  theme helpers, tech-icon registry, shared events
public/resume.pdf       ← your CV
```

Accessibility and performance features:
- keyboard-navigable, with a skip link and visible focus rings;
- screen-reader friendly console output;
- all animations respect the visitor's **reduced motion** setting;
- the canvas pauses when off-screen or in a background tab;
- no animation library is used; motion is CSS and small hand-written effects.
