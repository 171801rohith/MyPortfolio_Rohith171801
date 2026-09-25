# Rohith M — Portfolio

Personal portfolio for Rohith M, Backend & AI Engineer.
Built with **React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion**.

Live: https://my-portfolio-rohith171801.vercel.app

## Quick start

Requires Node.js 20.19+ (22 LTS recommended).

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then production build into `dist/` (base `/`, for Vercel) |
| `npm run build:gh-pages` | Production build with base `/MyPortfolio_Rohith171801/`, for GitHub Pages |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run fetch:github` | Refresh `src/data/github.json` and `src/data/leetcode.json` |

## Editing content

All text lives in **`src/data/portfolio.ts`**. You shouldn't need to touch components to:

- change the bio, tagline, status line or contact links (`profile`, `about`)
- add or reorder skills (`skills`)
- add a job (`experience`) or a certification (`certifications`; the block appears once the list isn't empty)
- add, remove or reorder projects (`projects`). Set `featured: true` for the large two-column cards, `demo: 'https://…'` to show a **Live demo** button, and `filters` to control which filter chips match.
- adjust the language chart (`githubStats`): which repos and languages to ignore, and how many to show

The downloadable resume is `public/Rohith_M_Resume.pdf`. Replace the file (keep the name) to update it.

## Refreshing GitHub & LeetCode data

### Automatic (daily)

`.github/workflows/refresh-stats.yml` runs every day at 00:30 UTC (06:00 IST). It runs the fetch script and, **only if a number changed**, commits the updated `src/data/*.json` to `main`. That push makes Vercel redeploy, so the live site is never more than a day behind. It needs no secrets, because it uses the built-in `GITHUB_TOKEN`.

- Run it on demand: **Actions → Refresh stats → Run workflow**.
- Change the schedule by editing the `cron` line (e.g. `'0 */6 * * *'` for every 6 hours).
- The bot's commits are authored by `github-actions[bot]`, so they don't count toward your own commit stats.
- GitHub pauses scheduled workflows in repos with no activity for 60 days. If that happens, re-enable it from the Actions tab.

### Manual

```bash
npm run fetch:github
# optional: lift the 60 requests/hour anonymous GitHub limit
GITHUB_TOKEN=ghp_yourtoken npm run fetch:github
# refresh just one source
npm run fetch:github -- --leetcode-only
npm run fetch:github -- --github-only
```

The script (`scripts/fetch-github.js`) uses the GitHub REST API. It doesn't scrape anything. For each repo it collects stars, forks, topics, languages, homepage, dates, and weekly commit counts for the last 52 weeks. It writes everything to `src/data/github.json`, which the Projects and GitHub sections read at build time. It also queries LeetCode's public GraphQL API (the same endpoint the profile page uses) for solved counts by difficulty, active days, max streak and badges, and writes them to `src/data/leetcode.json`. A file is only rewritten when its data changed, apart from the `generatedAt` timestamp. The footer's "Stats updated" date therefore shows when a number last changed. The two sources are independent: if one fails (for example, the GitHub rate limit), its existing file is left untouched and the other still refreshes.

Notes:

- Team projects that live on forks (currently `Pravaah`) are opted in via `INCLUDE_FORKS` in the script. Other forks are skipped.
- Usernames default to `171801rohith` (GitHub) and `hydumGoRFC` (LeetCode). Override them with `GITHUB_USERNAME` / `LEETCODE_USERNAME`.
- Commit counts come from `/stats/participation`, which counts commits by the repo owner on the default branch.

## Project structure

```
public/                 favicon, OG image, resume PDF, robots.txt, sitemap.xml
scripts/fetch-github.js GitHub + LeetCode APIs → src/data/*.json
src/
  data/portfolio.ts     all editable site content
  data/github.json      generated GitHub data (commit it)
  data/leetcode.json    generated LeetCode data (commit it)
  lib/github.ts         typed access + language aggregation
  lib/theme.ts          dark/light toggle (persists choice, follows OS by default)
  components/           one file per section
  index.css             design tokens (colors, fonts) for both themes
index.html              meta, Open Graph, JSON-LD, no-flash theme script
```

## Deploying

### Vercel (primary)

`vercel.json` is already set up for a static Vite build (`dist/`, long-lived caching for hashed assets).

1. Push the repo to GitHub.
2. In Vercel, open the existing project (or **Add New → Project** and import `MyPortfolio_Rohith171801`).
3. Vercel reads `vercel.json`, so no settings need changing. If the project was created for the old Flask app, check that **Settings → Build & Development → Framework Preset** is `Vite` and that there is no leftover Python runtime override.
4. Deploy. Every push to `main` redeploys automatically.

CLI alternative: `npm i -g vercel && vercel --prod`.

### GitHub Pages

A project site is served from `https://171801rohith.github.io/MyPortfolio_Rohith171801/`, so the build needs that base path. `npm run build:gh-pages` sets it (see `vite.config.ts`).

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. **Actions → Deploy to GitHub Pages → Run workflow** (`.github/workflows/deploy-pages.yml`).
   To deploy on every push, uncomment the `push` trigger in that file.

If you deploy to a different URL (Pages, or a custom domain), update the canonical/Open Graph URLs in `index.html`, `site.url` in `src/data/portfolio.ts`, and `public/robots.txt` / `public/sitemap.xml`. Those currently point at the Vercel domain.

For a custom domain or a `<user>.github.io` repo, build with `BASE_PATH=/ npm run build:gh-pages`.

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus rings, `aria-pressed` filter chips, reduced-motion support.
- Charts are decorative for screen readers. Each has a "View as table" fallback and a text summary.
- Colors were chosen for WCAG AA text contrast in both themes.
- No images besides the inline SVG icons, one small JS chunk, fonts loaded with `display=swap`.
