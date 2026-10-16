# How to change the content of your portfolio

Almost everything you see on the site comes from **one file**:

> **`src/content/profile.ts`**

Edit it, save, and the page, the "Ask my AI" console, the SEO tags and the link-preview image all update. You don't need to touch any design code.

---

## 1. The edit → preview → publish loop

```bash
npm run dev          # 1. start the local preview at http://localhost:3000
# 2. edit src/content/profile.ts and save — the browser refreshes by itself
npm run build        # 3. (optional) check that a production build passes
git add .
git commit -m "Update portfolio content"
git push             # 4. Vercel redeploys automatically in about a minute
```

Tip: stop the dev server with `Ctrl + C`. If `npm run dev` says the port is busy, an older server is still running; close that terminal first.

---

## 2. What each field does (`src/content/profile.ts`)

### Basics
| Field | What it controls |
|---|---|
| `name` | Big heading in the hero, navbar initials, footer, browser-tab title |
| `firstName` | Used in the console ("Ask anything about Alex…") |
| `role` | Status pill in the hero and the page title |
| `company` | Status pill and the About card |
| `companyUrl` | Optional link (not currently shown in the hero) |
| `location` | Hero, About card, console answers |
| `yearsOfExperience` | Text, not a number: `"nearly 2"`, `"3+"`. The console says "<value> years of experience" |
| `openToWork` | `true` shows the green "Open to opportunities" badge; `false` hides it |
| `availability` | Optional sentence the console adds after your location. Use `""` to say nothing |
| `tagline` | The paragraph under your name, also the SEO description |
| `rotatingRoles` | The titles that "decode" and cycle in the hero (2 to 5 is ideal) |
| `summary` | 2–3 short paragraphs in the About card (each string is one paragraph) |
| `siteUrl` | Your live address, used for link previews and SEO. Set it after deploying |
| `resume` | Path to your CV, normally `"/resume.pdf"` |

### Contact
```ts
contact: {
  email: "you@example.com",
  phone: "+91 98765 43210",              // include the country code
  linkedin: "https://www.linkedin.com/in/your-handle",
  github: "https://github.com/your-handle",
},
```
The phone number is hidden from the page's HTML and only revealed when a visitor clicks **Show number**. Write it in any readable format; the tap-to-call link strips the spaces automatically.

### Headline numbers (the 4 tiles in About)
```ts
metrics: [
  { value: 4, suffix: "+", label: "Years shipping ML & GenAI" },   // shows 4+
  { value: 38, suffix: "%", label: "Avg. inference cost cut" },    // shows 38%
  { value: 2, prefix: "$", suffix: "M", label: "Revenue influenced" }, // shows $2M
],
```
- `value` must be a number. `prefix` and `suffix` are optional.
- Use **4 items** for the neatest layout. Use only numbers you can defend in an interview.

### Currently exploring (the scrolling ticker)
```ts
exploring: ["Agentic workflows", "Model Context Protocol", "LLM evals"],
```
Remove the whole list (`exploring: []`) to hide the ticker.

### Skills
```ts
skills: [
  {
    title: "GenAI & LLMs",
    icon: "sparkles",          // see the icon list below
    featured: true,            // optional: makes this tile wider
    blurb: "One line describing this group.",
    items: ["OpenAI GPT", "Claude", "RAG", "AI agents"],
  },
  // …more groups
],
```
- **Icons you can use:** `sparkles`, `code`, `workflow`, `brain`, `database`, `cloud`, `shield`.
- **Logos appear automatically** for known tools (Python, PyTorch, LangChain, Docker, Qdrant, Claude, Gemini and more). Names without a logo still show as clean text chips, so any skill name is fine.
- 5–7 groups looks best. Mark **at most two** groups as `featured`.
- The full list of recognised logos is in `src/lib/tech-icons.ts`.

### Experience (newest first)
```ts
experience: [
  {
    role: "GenAI Engineer",
    company: "Your Company",
    companyUrl: "https://example.com",   // optional: makes the name a link
    location: "Bengaluru",               // optional
    start: "Jan 2024",
    end: "Present",
    current: true,                       // highlights it as "Current"
    highlights: [
      "Built X, which improved Y by Z%.",
      "Led A, saving B hours a month.",
    ],
    stack: ["Python", "LangGraph", "AWS"],
  },
],
```
- Put the **most recent job first**. Set `current: true` only on your present role.
- Aim for 2–3 highlights per role, each starting with a verb and ending with a result.

### Projects
```ts
projects: [
  {
    title: "DocuMind",
    tagline: "One-line description.",
    // Use EITHER the story fields…
    problem: "What was broken or missing.",
    approach: "What you built and how.",
    outcome: "What changed as a result.",
    // …OR a bullet list (every field in this group is optional; only what you fill in is shown)
    highlights: ["First thing worth knowing.", "Second thing."],
    metric: { value: "92%", label: "answer accuracy" },   // optional highlight number
    pipeline: ["Docs", "Embed", "Vector DB", "LLM", "Answer"],  // draws the mini diagram
    stack: ["LangChain", "Qdrant", "FastAPI"],
    links: { github: "https://github.com/…", demo: "https://…" }, // each one optional
  },
],
```
- 3–4 projects is ideal. `pipeline` should be 4–6 short steps describing the data flow.
- Leave out `links.github` or `links.demo` (or both) if they don't exist. The matching button disappears.
- Leave out `metric` if you don't have an honest number.
- Only write what you can back up in an interview. Numbers should come from your résumé or your own measurements.
- With an odd number of projects (1, 3, 5…), the first card automatically spans the full width.

### Certifications and education
```ts
certifications: [
  { name: "AWS Certified Machine Learning – Specialty", issuer: "Amazon Web Services", year: "2024", url: "https://…" },
],
education: [{ degree: "B.Tech in Computer Science", school: "Your University", year: "2021" }],
```
- `certifications: []` **hides the whole Certifications section** (and the section numbers renumber themselves).
- `education` appears only in console answers, not as a page section.

---

## 3. Your résumé (CV)

1. Export your CV as a PDF.
2. Name it exactly **`resume.pdf`**.
3. Put it in the **`public/`** folder, replacing the placeholder.
4. Commit and push. All "Download CV" and "Résumé" buttons use it.

To use a different file name, change `resume` in `profile.ts` to match (for example `"/Shashank-CV.pdf"`).

---

## 4. The "Ask my AI" console answers

Most answers (skills, experience, projects, contact, location, availability) are **generated from `profile.ts`**, so they're already in sync.

A few answers are hand-written in **`src/content/assistant.ts`**. Rewrite them in your own voice:

| Intent id | Question it answers | What to do |
|---|---|---|
| `rag` | RAG / vector search experience | Describe your actual approach |
| `agents` | AI agents / tool calling | Describe your agent work |
| `why-hire` | "Why should we hire you?" | Make this specifically about you |
| `joke`, `meta`, `thanks` | Small talk and "how does this work?" | Optional |

Each looks like this. Only change the `answer` text (and `chips`, the suggested follow-up questions):
```ts
intents.push({
  id: "why-hire",
  keywords: [...],     // words that trigger it — usually leave as is
  examples: [...],     // sample questions — usually leave as is
  answer: `Your own text here.`,
  chips: ["How do I contact you?", "Download résumé"],
});
```
To add a **brand-new** question (for example, "Do you do open-source work?"), copy one `intents.push({ … })` block, give it a unique `id`, a few `keywords`, 3–4 `examples` and an `answer`.

---

## 5. Other things you may want to change

| I want to change… | File and spot |
|---|---|
| Section headings ("Selected work.", "A toolkit built for the GenAI stack.") | `src/components/sections/*.tsx`, in the `title` and `description` props |
| The "Let's build something intelligent" contact text | `src/components/sections/Contact.tsx` |
| Hero intro line ("Hi, I'm") | `src/components/hero/Hero.tsx` |
| Footer text | `src/components/Footer.tsx` |
| Navigation links | `NAV_LINKS` in `src/app/page.tsx` |
| Which theme/mode first-time visitors see | `DEFAULT_THEME` and `DEFAULT_MODE` in `src/lib/theme.ts` (also set the matching `data-theme` / `data-mode` fallbacks via those constants) |
| Theme colours | The CSS variables at the top of `src/app/globals.css` |
| Fonts | `src/app/layout.tsx` |
| Browser-tab icon | `src/app/icon.svg` |
| The social-share image | Generated automatically from `name`, `role` and `rotatingRoles` in `src/app/opengraph-image.tsx` |

---

## 6. Checklist before you share the link

- [ ] Replaced every `// TODO` line in `profile.ts`
- [ ] Updated the hand-written console answers in `assistant.ts`
- [ ] Replaced `public/resume.pdf` with your own CV
- [ ] Set `siteUrl` to your real Vercel (or custom) address
- [ ] Checked email, LinkedIn and GitHub links by clicking them
- [ ] Clicked **Show number** and tested the phone link
- [ ] Asked the console 5–6 questions, including one with a typo
- [ ] Looked at the site on your phone
- [ ] Ran `npm run build` (it must finish without errors) and pushed

---

## 7. If something goes wrong

| Problem | Fix |
|---|---|
| Red error screen after saving | Usually a missing comma, quote or bracket in `profile.ts`. The error shows the line number. |
| A skill shows no logo | Expected: it has no logo in the registry. It still shows as a text chip. To add a logo, see `src/lib/tech-icons.ts`. |
| A project card looks too tall | Shorten `problem`, `approach` and `outcome` to one or two sentences each. |
| Changes not visible on the live site | Check that you ran `git push`, then watch the **Deployments** tab in Vercel. Hard-refresh with `Ctrl + Shift + R`. |
| Build fails on Vercel | Run `npm run build` locally to see the same error. |
