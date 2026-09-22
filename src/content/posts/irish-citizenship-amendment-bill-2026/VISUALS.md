# Art direction — Citizenship (Amendment) Bill 2026 explainer

Source of truth for the cover and the eight figures in `index.md`. Regenerate them with:

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

The body figures are `figure` (1200×675), not the `card` size the original notes
suggested. They are diagrams inside an article, not link previews, and the article
column is a fixed width, so the smallest canvas gives the largest effective type.

**Held to the post-visuals standard.** Colour is the token set only: content uses
`ink`, `muted`, `hairline` and `paper`, and panels are paper with a hairline edge
rather than a tint. Time that does not count, and the rule being replaced, is
`muted`; the proposal is `ink`. Saffron and green appear only in the frame's
tricolour bar: nothing in these figures belongs to one side of an Irish–Indian
pairing, so no content element carries a national colour. No text in a figure is
below 16px (hero's 20px caption at the figure's 0.8 scale); `text()` asserts it. The
source line is checked against the margin width, calibrated to Source Serif 4's
measured ~0.46em per character. The two deliberate departures from the skill are the
typeface (below) and headless Chrome for PNG export.

The embedder needs `fonttools` and `brotli` (`pip install fonttools brotli`, in a
virtualenv if the system Python is managed).

This file is inert: `getAllPosts()` globs `*/index.md` and `getPostImages()` globs
image extensions only, so a non-`index.md` file neither publishes nor bundles.

## Typeface

The figures carry the site's two faces — **Source Serif 4** for the latin text and
**Noto Serif Devanagari** for the footer motto — embedded as subset `@font-face`
blocks inside each SVG by `scripts/embed_font.py`. The generator calls it
automatically; it can also be run standalone over existing files, and re-running it
refreshes the faces rather than skipping. Its output is byte-stable, so a rerun that
changes nothing leaves the files alone.

The post-visuals frame declares `Bitstream Charter, Charter, Georgia, Times New
Roman, serif` for latin and `Lohit Devanagari, Noto Serif Devanagari, serif` for
Devanagari. Neither resolves the way the page does, and an SVG referenced from an
`<img>` is an isolated document that cannot load the page's webfonts, so both faces
have to travel inside the file.

Four details decide whether that actually works, and all four fail silently:

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
- **Which characters get embedded comes from each face's own cmap**, not from a
  codepoint range. A range test meant to skip Devanagari also skips the punctuation
  these figures lean on: en and em dashes, curly apostrophes, the minus sign. Those
  sit above the Devanagari block, the latin font covers them, and dropping them put
  Georgia glyphs in the middle of a Source Serif 4 line (`Fastest here — tied with
  France`, `Processing: 12–19 months`). Because the two cmaps overlap on latin, the
  split follows each `<text>` node's own `font-family` rather than the codepoints.
- **The Devanagari face keeps every layout feature.** Conjuncts and matra reordering
  need the Indic GSUB features — `akhn`, `rphf`, `blwf`, `half`, `rkrf`, `cjct`,
  `nukt`, `abvs`, `blws`, `psts`, `pres` — so subsetting it with the latin feature
  list (`kern`, `liga`, `calt`) yields a face that renders without error and shapes
  wrong.

Leaving Devanagari to its own stack, as an earlier version of this did, looks safe and
is not: neither Lohit nor Noto Serif Devanagari is installed by default on macOS or
Windows, so the motto fell through to whatever Devanagari face the viewer's OS
happened to ship — a sans on this machine, something else elsewhere, never the site's
face. Verified by rendering the motto three ways at 27.6px and comparing ink extents:
embedded 169px, the page's Noto Serif Devanagari webfont 171px, the macOS fallback
162px, with the embedded and webfont renders visually identical.

The source files are the exact woff2 builds `fonts.googleapis.com` serves the site, so
the figures and the prose are the same fonts — see `scripts/fonts/README.md` for
provenance and licences. Each figure lands around 80KB, up from ~28KB before
embedding; they are lazily loaded.

## Sourcing

Every figure traces to the General Scheme itself or to the 1956 Act as in force,
with two procedural exceptions cited to their own primary sources: the Bill's stages
(Houses of the Oireachtas, "Stages of a Bill") and Stamp 2 not being reckonable (ISD,
Immigration permission/stamps). One thing was changed from the original notes because
the primary source did not support it:

- **The €40–45k income estimate is gone.** The Scheme fixes no figure: section
  15(3)(a) leaves the threshold to Ministerial regulation, "having taken into account
  of the CSO data on annual earnings and labour costs, the cost of living". The tile
  reads "Not set" and names the mechanism.

## Rendering to PNG

The skill's `export_png.py` needs cairo, which is not installed here. Headless
Chrome does the same job and is already a build dependency via `scripts/prerender.mjs`:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1200,675 --screenshot=out.png "file://$PWD/journey.svg"
```

---

## 1. Cover — card 1200x628, statement

Canvas: card | Layout: `statement`

**Built** as `cover.svg` and rendered to `cover.png`, which the post's `cover:`
frontmatter points at. Not a body image.

The catalog's layout for a card is `statement`, `quote` or `metrics`: dense layouts do
not survive a link preview at ~500px wide. An earlier version carried three rows of
paired bars from the journey figure; it held the 26px floor but read as a chart
squeezed into a thumbnail. The cover is now one figure:

- Eyebrow: "RESIDENCE BEFORE YOU CAN APPLY" (26px, muted)
- Figure: **8 yrs** (140px, ink)
- Line: "Up from 5 today, for most applicants" (30px, muted)
- Subtitle: "Most applicants would wait three years longer"
- Source: Head 5; Act of 1956 s. 15(1)(c). Current s. 15(1)(c) is 1 year continuous +
  4 of the prior 8, five in all; Head 5 makes it 2 + 6 of the prior 10, eight in all.

The original note's headline, "The Biggest Citizenship Shift in 20 Years", stays out:
it is an editorial claim with no source behind it, and a cover travels without the
article attached.

Two layout constraints, both learned from renders that failed:

- **Content is inset to the middle ~84%.** `ContentGrid` crops covers to
  `aspect-[16/10]` with `object-cover`, so a left-aligned block at x=64 loses its
  first characters in the blog card. The frame's chrome may clip; the data may not.
- **PNG, not SVG**, because this doubles as the Open Graph image and social
  scrapers do not render SVG.
- The frame's own chrome on a card (subtitle, source line, Irish motto) is set by
  `frame.py` at 18–22px, below the skill's 26px card floor. That is the skill
  script's output, not this layout's, and is left as the script emits it.

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
three years. "Stamp 2 not reckonable" is cited to ISD's Immigration permission/stamps
page, which says so in terms; bars for now are `muted`, bars for the Scheme `ink`.

## 3. Comparison — figure 1200×675
Canvas: figure | Layout: `comparison`, three columns
Position: under the At a Glance table. File: `comparison.svg`
- Subtitle: "What the Scheme would change"
- Columns: Requirement | Current law | General Scheme 2026. The Scheme column is set in
  ink and bold; the other two headers are muted. No saffron or green: no row belongs
  to one side of a pairing.
- Rows: standard residency (5 yrs: 1 + 4 of prior 8 → 8 yrs: 2 + 6 of prior 10);
  spouse marriage (3 → 5 years); spouse residence (3 yrs: 1 + 2 of prior 4 → 5 yrs:
  2 + 3 of prior 5); self-sufficiency (none → income, welfare and debt tests);
  language and civics (not required → both required).
- A hairline sits under the header, between rows, and closes the table.
- Source: "Heads 5-6; Act of 1956 ss. 15, 15A as in force"

`![Current versus proposed naturalisation requirements](./comparison.svg)`

## 4. Self-sufficiency — figure 1200×675
Canvas: figure | Layout: `metrics`, three tiles
Position: in "2. Self-Sufficiency". File: `metrics.svg`
- Subtitle: "The three self-sufficiency tests"
- Tiles:
  1. "MINIMUM INCOME" — **Not set** — "To be prescribed by Ministerial regulation"
  2. "WELFARE AND HOUSING" — **2 yrs** — "No prescribed support; 6 months may be excused"
  3. "DEBT TO THE STATE" — **None** — "Revenue, social welfare, or an unpaid court fine"
- No income estimate (see Sourcing). "Not set" is one character over the catalog's
  six-character limit for a display figure; every shorter wording tried was less clear.
- Source: "Head 7; s. 15(3)(a)-(c), s. 15(4)"

`![The three self-sufficiency tests](./metrics.svg)`

## 5. Standard applicant — figure 1200×675
Canvas: figure | Layout: `process`, six panels
Position: under "For Future Applicants". File: `process.svg`
- Subtitle: "What a standard applicant must clear"
- Steps: Reside **8 yrs** (total reckonable); Of which **2 yrs** (continuous, the
  latest); Earn **Income** (threshold set by regulation); Off supports **2 yrs** (no
  welfare or housing support); Language **Pass** (Irish, English or ISL); Civics
  **Test** (standard set by Minister).
- Six hairline-edged panels fill the content height, joined by muted arrows. Step
  numbers are muted, not green. Each sub-line is two lines at 16px, since a sixth of
  the content width will not hold one.
- Source: "Heads 5 and 7; ss. 15, 15F"

`![Steps to citizenship under the proposed law](./process.svg)`

## 6. Language and civics — figure 1200×675
Canvas: figure | Layout: two tiles + a rule-separated band
Position: in "3. Language and Civics Tests", replacing the requirements table.
File: `tests.svg`
- Subtitle: "Two new tests, standards set later"
- Tiles: "LANGUAGE" — Every applicant — "Irish, English or Irish Sign Language";
  "CIVICS" — Every applicant — "Irish civics, society and politics". Both close with
  "Standard set by the Minister", which is the point of the figure: the requirement is
  in the Scheme, the bar is not.
- Band: the waiver (Head 8, s. 16(1A)) in muted, then **good character can never be
  waived** (s. 16(1B)) in ink. The second line is the one that should survive a crop.
- Source: "Heads 5, 6 and 8; ss. 15, 15A, 16(1A)-(1B)"

`![The two new tests, and the one thing that can never be waived](./tests.svg)`

## 7. Reckonable residence — figure 1200×675
Canvas: figure | Layout: single column of muted-marked rows
Position: in "4. Cleaner Reckonable Residence", replacing the bullet list.
File: `reckonable.svg`
- Subtitle: "Time the Scheme stops counting"
- **One-sided on purpose.** Head 9 enumerates what is excluded; nothing in the Scheme
  or the article enumerates what remains included. A "counts" column would have to be
  inferred, and an inferred column on an image that travels alone is exactly the kind
  of plausible fabrication the sourcing rules exist to stop.
- The row marker is `muted`, the same colour the journey figure and the sibling
  pathway charts use for time that does not count.
- Footer: the transitional protection — applications made before commencement are
  assessed under the old rules.
- Source: "Head 9; s. 16A; International Protection Act 2015 s. 60(6)"

`![Time the Scheme stops counting toward reckonable residence](./reckonable.svg)`

## 8. Bars and revocation — figure 1200×675
Canvas: figure | Layout: two tiles, bulleted line-groups
Position: at the end of "6. Offences That Bar Naturalisation", covering sections 5 and 6.
File: `barriers.svg`
- Subtitle: "Two ways citizenship can be refused or withdrawn"
- Left "Bars a grant / Schedule 1 — no discretion": the four instruments.
- Right "Revokes a grant / Head 10, section 19": the new public policy, public order or
  national security ground; that it sits alongside fraud, concealment and disloyalty;
  and the removal of the duty to consult the Committee of Inquiry Chairperson.
- Items are lists of lines with a single bullet each, so a wrapped point does not read
  as two.
- Source: "Head 10 and Schedule 1; Act of 1956 s. 19"

`![What bars a grant of citizenship, and what revokes one](./barriers.svg)`

## 9. Legislative passage — figure 1200×675
Canvas: figure | Layout: horizontal track with status nodes + a statement band
Position: in "What Happens Next?", replacing the stage table.
File: `passage.svg`
- Subtitle: "The Bill’s own path, not the applicant’s" — deliberately unmissable,
  because `process.svg` is also a step-flow in the same article under the same kicker,
  and a forwarded image carries only its subtitle to tell them apart. For the same
  reason this one uses track nodes rather than `process.svg`'s numbered panels.
- Nodes: General Scheme (filled ink, done, published July 2026); pre-legislative
  scrutiny (by Oireachtas committee); Bill drafted; Oireachtas passage (five Stages in
  each House); commencement — all hollow, muted. Progress is not an Irish-side
  attribution, so the reached node is ink, not green. No duration is given for
  passage: no official source states one.
- Band: **"The General Scheme is not law."** then the regulation-after-enactment
  caveat. This is the single most important thing the figure carries once separated
  from the article.
- No status glyphs. The article's table used ✅ and ⏳; neither codepoint is in Source
  Serif 4 or Noto Serif Devanagari, so in an isolated SVG document they would fall back
  or go to tofu. Colour and fill carry the status instead.
- Source: the stages are Oireachtas procedure, not text in the Scheme, and are cited to
  the Houses of the Oireachtas "Stages of a Bill" procedure guide rather than
  attributed to the Scheme.

`![Where the Bill actually is, and what is still left to regulation](./passage.svg)`
