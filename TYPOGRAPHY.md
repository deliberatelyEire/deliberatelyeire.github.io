# Typography

The scale the citizenship articles already used, written down and applied everywhere
else. Three families, twelve roles, one breakpoint.

Definitions live in `src/index.css` under `@layer utilities`; the families are `:root`
custom properties that `tailwind.config.ts` reads, so a stack is spelled out once.

## Families

| Token | Stack | Used for |
|---|---|---|
| `--font-serif` | `"Source Serif 4", "Bitstream Charter", Charter, Georgia, serif` | Everything that is read: headings, prose, titles, captions |
| `--font-ui` | `"Plus Jakarta Sans", system-ui, -apple-system, sans-serif` | Everything that is operated or scanned: buttons, nav, tables, bylines, labels |
| `--font-deva` | `"Noto Serif Devanagari", "Lohit Devanagari", serif` | The Devanagari motto |

Source Serif 4 is **quoted**. An unquoted CSS family must be a sequence of identifiers
and `4` is not one, so `font-family: Source Serif 4, Georgia, serif` is an invalid
declaration — the browser discards the whole list, fallbacks included, and falls back to
its default serif. This has bitten this codebase twice, once in `tailwind.config.ts` and
once in the figure SVGs.

The serif/sans split is the load-bearing decision: serif means *prose*, sans means
*interface*. A link inside a paragraph stays serif; a link that is a button goes sans.

## The scale

Sizes in px. One breakpoint, `md` (768px). Interface roles do not step — a button label
is the same size on a phone as on a desktop.

| Role | <768px | ≥768px | Family | Leading | Tracking |
|---|---|---|---|---|---|
| `type-display` | 30 | 48 | serif | 1.15 / 1.05 | −0.015em |
| `type-h1` | 30 | 36 | serif | 1.2 / 1.15 | −0.015em |
| `type-h2` | 24 | 30 | serif | 1.33 / 1.2 | −0.015em |
| `type-h3` | 20 | 24 | serif | 1.4 / 1.33 | −0.015em |
| `type-h4` | 18 | 20 | serif | 1.4 | −0.015em |
| `type-title` | 16 | 18 | serif | 1.375 | — |
| `type-body` | 16 | 18 | serif | 1.625 | — |
| `type-caption` | 14 | 14 | serif | 1.55 | — |
| `type-ui` | 14 | 14 | sans | 1.43 | — |
| `type-meta` | 12 | 12 | sans | 1.4 | — |
| `type-label` | 12 | 12 | sans | 1.4 | +0.05em, uppercase |
| `type-deva` | 20 | 24 | deva | 1.4 | +0.025em |

**12px is the floor.** Nothing on the site is smaller.

## Where each role goes

- **`type-display`** — the page title. One per page: the article headline, "Articles &
  Chronicles", the homepage hero. Never twice on a screen.
- **`type-h1` / `h2` / `h3`** — section breaks inside prose, in order. These are what
  `#`, `##` and `###` render as in an article.
- **`type-h4`** — the smallest thing that still reads as a heading rather than as bold
  body copy: sidebar headings, card group titles, the masthead wordmark.
- **`type-title`** — a card or list-item title. It is a link, not a section break, so it
  is tighter and does not carry heading tracking.
- **`type-body`** — running prose. The one role tuned for reading length rather than for
  fit, at 1.625.
- **`type-caption`** — supporting serif copy: card blurbs, a sidebar note, the standfirst
  under a box heading. Wraps, so it is looser than the interface roles.
- **`type-ui`** — buttons, nav links, filter pills, form fields, table cells.
- **`type-meta`** — bylines, dates, read times, source lines, counts.
- **`type-label`** — kickers, category chips, eyebrow text. Always small caps.
- **`type-deva`** — the Devanagari motto, wherever it appears.

## Rules

**A role sets family, size and line-height together.** This is the point of the system,
not an implementation detail. `text-base md:text-lg leading-relaxed` looks like it asks
for 1.625 at every width, but Tailwind's `md:text-lg` re-declares `line-height` inside
the media block and wins, so every article paragraph rendered at 1.556 above 768px while
the list items beside it stayed at 1.625. Nobody noticed for as long as the site has
existed. One rule setting both means a size and its leading cannot drift apart.

**Weight and colour are not part of the role.** The same role is drawn at several
weights — `type-meta font-semibold`, `type-title font-bold`. Keep using `font-*` and
`text-*` colour utilities.

**Do not put a `text-*` size or a `leading-*` on an element that has a role.** They will
fight, and above 768px the role wins, so the override silently does nothing. If a role
genuinely needs a different leading — the two-line masthead lockup is the only case
today — use `!leading-none`, which is important and beats the media block.

**Reach for an existing role before adding one.** Twelve is enough to describe the whole
site. A thirteenth means either the design grew a genuinely new kind of text, or
something is being nudged that should instead move a step.

## Adding a role

1. Add it to `@layer utilities` in `src/index.css`, next to its neighbours in size order.
2. Put its `md` step in the single media block at the bottom of that layer, and only if
   it steps.
3. Add a row to the table above and a line to "Where each role goes".

## Known divergence

The figure SVGs carry their own type scale, set in `scripts/generate_framed_charts.py`
and `scripts/generate_bill_visuals.py` against a fixed 1200 or 1600px canvas. They share
the families — see `scripts/fonts/README.md` — but not this scale, because a figure is
laid out once at a fixed size and then scaled by the browser. On a phone a figure renders
at roughly 0.29 of its canvas width, which puts 14px figure type at about 4px beside
16px body text. That is a real legibility problem and it is not solved by this scale;
it needs either tap-to-open, a higher minimum size in the generators, or mobile variants.
