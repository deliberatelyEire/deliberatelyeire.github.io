# Deliberately Éire

Comparative Irish immigration policy research & analysis.

An independent publication dedicated to evidence-led research on Irish citizenship, immigration policy, and law.

---

## 📊 Project Overview

This site publishes data-driven analysis of Irish citizenship and naturalisation pathways, comparing Ireland against international counterparts (France, Germany, UK, Austria, Portugal). Each article features interactive SVG charts visualising time-to-citizenship for different visitor categories.

**Current focus**: Irish citizenship pathways analysis — comparing skilled workers, PhD researchers, master's graduates, and spouses of citizens across six countries.

---

## 🏗️ Architecture

```
src/
  ├─ components/      # React UI components (shadcn/ui based)
  ├─ content/posts/   # Markdown articles with YAML frontmatter
  ├─ data/citizenship/  # CSV data sources for chart generation
  └─ lib/posts.ts     # Post discovery & content loader
scripts/
  ├─ generate_framed_charts.py       # CSV → framed SVG charts for the citizenship post
  ├─ generate_bill_visuals.py        # Citizenship Bill 2026 post figures
  ├─ embed_font.py                   # Inline the site's serif faces into figure SVGs
  ├─ fonts/                          # Source Serif 4 + Noto Serif Devanagari woff2, as Google Fonts serves them (OFL)
  └─ prerender.mjs                    # Static site prerendering
public/
  └─ article/                     # Sitemap & Open Graph assets
```

**Data pipeline**: CSV data → Python script → SVG charts → embedded in markdown articles → served via Vite + React

---

## 📈 Chart Types

Six SVG charts are generated from CSV data, each comparing five countries:

| Chart | Data Source | Category |
|-------|------------|----------|
| `workers.svg` | `data/citizenship/workers.csv` | Skilled workers on employment permits |
| `phd.svg` | `data/citizenship/phd.csv` | PhD researchers (Stamp 2) |
| `masters_student.svg` | `data/citizenship/masters.csv` | Master's graduates (Stamp 2) |
| `spouse.svg` | `data/citizenship/spouses.csv` | Spouses of Irish citizens |

**Each CSV has columns**: `Country`, `Discarded_Years`, `Requirement_Years`, `Expedited_Years`, `Expedited_Condition`, `Processing_Min_Months`, `Processing_Max_Months`, `Notes`

**Key data points tracked**:
- Years discarded (e.g., Ireland discards all Stamp 2 years for students)
- Standard residence requirement years
- Expedited pathways (e.g., Austria's B2 German → 6 years)
- Processing times (application decision duration)

**2026 Proposal**: Irish Cabinet approved raising general residence from 5y → 8y (not yet enacted). Charts show dashed-bar projections.

---

## 📁 Content Structure

Articles live in `src/content/posts/<slug>/index.md` with YAML frontmatter:

```yaml
id: "ireland-citizenship-pathways-2026"
title: "Is Five Years Truly Five Years? Soon, Perhaps Eight"
excerpt: "Ireland asks a skilled worker for five years, the fastest in Europe alongside France."
author: "Deliberately Éire Research"
role: "Immigration Policy Analysis"
date: "Sept 17, 2026"
category: "Modern Diaspora"
readTime: "8 min read"
cover: "workers.svg"
sources: "DFA, MEA, DGFiP, BAMF, BMI, Home Office, SEF (2026)"
featured: true
order: 1
```

**Automatically parsed fields**: `id`, `slug`, `title`, `excerpt`, `author`, `role`, `date`, `category`, `readTime`, `cover`, `sources`, `featured`, `order`.

Images are resolved via `import.meta.glob` from `src/content/posts/<slug>/` and the `src/assets/` map.

---

## 🛠️ Development

### Prerequisites
- Node.js 18+ (with npm or bun)
- Python 3.x (for chart generation)

### Setup
```sh
git clone <repository-url>
cd delibratelyeire.github.io
npm i        # or: bun install
```

### Development Mode
```sh
npm run dev   # starts Vite dev server at http://localhost:8080
```

### Regenerate the Citizenship Bill 2026 figures
```sh
python3 scripts/generate_bill_visuals.py
```

Writes `journey.svg`, `comparison.svg`, `metrics.svg`, `process.svg` and `cover.svg` into
`src/content/posts/irish-citizenship-amendment-bill-2026/`. Art direction, sourcing
notes and the PNG-preview command live in that folder's `VISUALS.md`. The script
prints an OVERFLOW warning if a label no longer fits its box.

### Regenerate the citizenship pathway charts
If CSV data changes, regenerate the SVGs:

```sh
python3 scripts/generate_framed_charts.py
```

This reads `data/citizenship/*.csv` and writes `{workers,phd,masters,spouses}_framed.svg`
into `src/content/posts/ireland-citizenship/`, embedding the site's faces in each. The
CSVs are kept locally and gitignored, so this only runs where they are present; to
refresh the faces in SVGs that already exist, run `python3 scripts/embed_font.py` over
them instead.

### Build
```sh
npm run build   # Vite build → static dist/
npm run preview # preview the build locally
```

### Lint & Test
```sh
npm run lint   # ESLint
npm run test   # Vitest
```

---

## 🌐 Deployment

This is configured as a GitHub Pages site. The `postbuild` script in `package.json` copies `dist/index.html` to `dist/404.html` and runs the prerender script.

---

## 📊 Technology Stack

- **Runtime**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS 3.4 with oklch color scheme
- **UI components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12
- **Typography**: Semantic type scale — 3 families, 12 roles, one breakpoint. See [TYPOGRAPHY.md](TYPOGRAPHY.md)
- **Data viz**: Custom Python SVG generation, with the site's serifs (Source Serif 4, Noto Serif Devanagari) subset into each SVG
- **Content**: Markdown with YAML frontmatter
- **Query**: @tanstack/react-query
- **Form handling**: React Hook Form + Zod validation
- **Charts**: SVG with manual layout (no external charting library)

---

## 👥 Authors & Contributors

- **Deliberately Éire Research** — Immigration policy analysis
- Comparative research across Irish, French, German, British, Austrian, and Portuguese naturalisation law

---

## 🔗 Related

- [X (@delibratelyEire)](https://x.com/delibratelyEire) — Real-time policy updates
- [Blog](/blog) — All articles
- [Resources](/resources) — Data and reports
- [About](/about) — Publication information

---

*Originally bootstrapped with Lovable, now maintained as an independent Vite/React project. Data sources: Irish Department of Foreign Affairs, German BAMF, French MEA, UK Home Office, Italian BMI, and Irish Cabinet proposals (2026).*