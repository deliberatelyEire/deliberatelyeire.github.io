# Art direction — Citizenship (Amendment) Bill 2026 explainer

Source of truth for the four figures in `index.md`. Regenerate them with:

```sh
python3 scripts/generate_bill_visuals.py
```

The script calls the post-visuals `frame.py` for the chrome, then lays content out
inside the content bounds that script reports. It does **not** use the layout
catalog's literal coordinates: those are quoted for a 1600×900 `hero` frame and
overflow when scaled down — the six-step process row is wider than hero's own
content area. It also carries a width estimator that prints an OVERFLOW warning
when a string will not fit its box, so a text change that breaks a layout is caught
before rendering.

All four are `figure` (1200×675), not the `card` size the original notes suggested.
These are diagrams inside an article, not link previews, and the article column is a
fixed width, so the smallest canvas gives the largest effective type.

This file is inert: `getAllPosts()` globs `*/index.md` and `getPostImages()` globs
image extensions only, so a non-`index.md` file neither publishes nor bundles.

## Typeface

The figures carry the site's body serif, **Source Serif 4**, embedded as a subset
`@font-face` inside each SVG by `scripts/embed_font.py`. The generator calls it
automatically; it can also be run standalone over existing files, and re-running it
refreshes the face rather than skipping.

The post-visuals frame declares `Bitstream Charter, Charter, Georgia, Times New
Roman, serif`, which omits Source Serif 4, so figures placed beside the article read
as a visibly different serif from the prose. An SVG referenced from an `<img>` is an
isolated document and cannot load the page's webfonts, so the face has to travel
inside the file.

Two details decide whether that actually works, and both fail silently:

- **The family name is quoted** — `'Source Serif 4', …`. An unquoted CSS family must
  be a sequence of identifiers, and `4` is not one, so the unquoted form is an invalid
  declaration rather than a failed first choice: the browser discards the whole stack,
  fallbacks included, and draws the figure in its default serif. That is worse than
  doing nothing, and it looks like a near-miss rather than a bug.
- **The subset keeps the `opsz` axis.** Source Serif 4 is variable on `wght` and
  `opsz`, and the browser draws page text with `font-optical-sizing: auto`, pinning
  `opsz` to the font-size. Chrome honours that inside SVG-as-image, so keeping the axis
  matches the prose exactly at every size these figures draw — verified by rendering
  each size and weight and comparing ink extents against the page. Instancing `opsz`
  to the family default would save ~34KB per file but drift up to 8% at the smallest
  type; renderers that ignore optical sizing land on that same default anyway, so
  keeping the axis is never worse. `wght` is clamped to 400–700, the only weights
  drawn, which costs nothing and takes about a third off the subset.

Which characters get embedded is decided by the source font's own cmap, not by a
codepoint range. Devanagari is deliberately left out — its own stack already resolves,
and subsetting conjuncts safely is a separate problem — but a range test that excludes
it also excludes the punctuation these figures lean on: en and em dashes, curly
apostrophes, the minus sign. Those sit above the Devanagari block, the latin font
covers them, and dropping them put Georgia glyphs in the middle of a Source Serif 4
line (`Fastest here — tied with France`, `Processing: 12–19 months`).

The source file is the exact latin woff2 that `fonts.googleapis.com` serves the site
(Source Serif 4 v14), so the figures and the prose are the same build — see
`scripts/fonts/README.md` for provenance. Each figure lands around 70KB, up from ~28KB
before embedding; they are lazily loaded.

## Sourcing

Every figure traces to the General Scheme itself or to the 1956 Act as in force.
Two things were changed from the original notes because the primary source did not
support them:

- **The €40–45k income estimate is gone.** The Scheme fixes no figure: section
  15(3)(a) leaves the threshold to Ministerial regulation, "having taken into account
  of the CSO data on annual earnings and labour costs, the cost of living". The tile
  reads "Not set" and names the mechanism.
- **The chronicle rows were re-checked.** The original 1987 and 2024 rows could not
  be pinned to an amending Act and were dropped. What replaced them: 2001 (the Act
  that inserted section 15A), 2011 (Civil Law (Misc. Provisions) Act, s. 33, which
  extended 15A to civil partners), and the International Protection Act 2026, which
  the Scheme itself cites at Head 7 and Head 9.

## Rendering to PNG

The skill's `export_png.py` needs cairo, which is not installed here. Headless
Chrome does the same job and is already a build dependency via `scripts/prerender.mjs`:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1200,675 --screenshot=out.png "file://$PWD/journey.svg"
```

---

## 1. Cover — card 1200x628, paired bars

Canvas: card | Layout: adapted from `comparison`

The original note specified a 1600x900 `hero` `statement` with the headline "The
Biggest Citizenship Shift in 20 Years". Both are superseded: the claim has no source
behind it, and the applicant-category contrast is the stronger hook.

**Built** as `cover.svg` (a `card` 1200x628) and rendered to `cover.png`, which the
post's `cover:` frontmatter points at. Not a body image.

It carries the applicant-category contrast rather than the original note's headline,
"The Biggest Citizenship Shift in 20 Years" — that is an editorial claim with no
source behind it, and a cover travels without the article attached. Three categories
from the At a Glance table, paired bars, pale for the current rule and solid ink for
the proposed one:

| Category | Now | Under the Scheme | Source |
|---|---|---|---|
| Worker / long-term resident | 4 yrs in a window of 8 | 6 yrs in a window of 10 | Head 5; s. 15(1)(c) |
| Spouse of an Irish citizen | 2 yrs in a window of 4 | 3 yrs in a window of 5 | Head 6; s. 15A(1)(f) |
| Temporary permission (incl. Temporary Protection) | counted as reckonable | excluded entirely | Head 9; s. 16A; s. 60(6) of the 2015 Act |

The Temporary Protection row is not a year figure. That time was reckonable and Head 9
excludes it outright, so it is drawn at the same length as the worker row's "now" bar —
one scale across all three rows — and then reduced to a stub, which is what the change
does. Head 9 reaches Temporary Protection under s. 60(6) of the 2015 Act (the mass-influx
route), **not** a refugee or subsidiary-protection declaration. The spouse marriage requirement (3 → 5 years) is left to the body;
three bar groups is what a card holds legibly.

Two layout constraints, both learned from renders that failed:

- **Content is inset to the middle ~84%.** `ContentGrid` crops covers to
  `aspect-[16/10]` with `object-cover`, so a left-aligned block at x=64 loses its
  first characters in the blog card. The frame's chrome may clip; the data may not.
- **PNG, not SVG**, because this doubles as the Open Graph image and social
  scrapers do not render SVG.

## 2. Journey — figure 1200x675

Canvas: figure | Layout: horizontal Gantt on a calendar axis

Replaces the 1956-2026 legal chronicle that was here. The history is not the story;
what the Scheme does to a person is. File: `journey.svg`, in `index.md` under
"What It Means for One Arrival".

One arrival, January 2026, four permissions. Bars run to the **first date an
application may be made** — not a date of citizenship. A grant is at the Minister's
discretion and processing sits on top, which the figure states on its face.

| Row | Now | Under the Scheme | Basis |
|---|---|---|---|
| Employment permit | 2031 | 2034 | 5 yrs (s. 15(1)(c)) to 8 yrs (Head 5) |
| Spouse, married 3 yrs on arrival | 2029 | 2031 | 3 yrs (s. 15A(1)(e),(f)) to 5 yrs (Head 6) |
| PhD on Stamp 2, 4-yr doctorate | 2035 | 2038 | Stamp 2 not reckonable; clock starts at Stamp 1G in 2030 |
| Temporary Protection | 2031 | clock does not run | Head 9 excludes s. 60(6) of the 2015 Act |

**The limbs stack.** Current s. 15(1)(c) is 1 year continuous + 4 in the prior 8, and
ISD describes that as totalling "5 years of reckonable residence over a 9-year
period" — so Head 5's 2 + 6 is **8 years**, not 6. Stating only the second limb
(4 to 6) undersells the wait by three years and contradicts the sibling article's
own title. Two assumptions are the author's, not the Scheme's, and are printed in
the row labels: the four-year doctorate, and the spouse arriving already married
three years.

## 3. Comparison table graphic — 1200×628
Canvas: card | Layout: comparison
In `index.md` under the At a Glance table. File: `comparison.svg`
- Kicker: "OLD vs NEW" | Subtitle: "Naturalisation requirements side by side"
- Columns: Requirement | Current Law | Proposed (Bill 2026)
- Rows: as in the markdown table in that section
- Accent: saffron for Indian-context rows, green for Irish-side rows
- Source: "General Scheme, Sections 15, 15A, 16A, 19"

`![Current versus proposed naturalisation requirements](./comparison.svg)`

## 4. Metrics cards — 1200×628
Canvas: card | Layout: metrics
Position: in "2. Self-Sufficiency", after "three objective tests (Section 15(3))".
File: `metrics.svg`
- Kicker: "SELF-SUFFICIENCY TEST" | Subtitle: "Three gates to citizenship"
- Tiles:
  1. "MINIMUM INCOME" — "€40–45k (est.)" — "CSO earnings + cost of living"
  2. "NO WELFARE/HOUSING" — "2-year lookback" — "6-month grace at Minister's discretion"
  3. "NO STATE DEBTS" — "Revenue, DSP, courts" — "Zero tolerance"
- Source: "Section 15(3), Section 15F"

`![The three self-sufficiency tests](./metrics.svg)`

## 5. Process flow diagram — 1200×675
Canvas: figure | Layout: process
In `index.md` under "For Future Applicants". File: `process.svg`
- Kicker: "PATH TO CITIZENSHIP 2026" | Subtitle: "New steps under proposed law"
- Steps:
  1. "Enter legally & maintain continuous residence (2yrs)"
  2. "Accumulate 6yrs total in 10yr window"
  3. "Meet income threshold (no welfare/housing 2yrs)"
  4. "Pass language test (Irish/English/ISL)"
  5. "Pass civics test (Constitution, government, society)"
  6. "Maintain all conditions until Minister decides"
- Connectors: arrows. Accent: green for residency, saffron for tests.
- Source: "Sections 15, 15A, 15F, 16A"

`![Steps to citizenship under the proposed law](./process.svg)`
