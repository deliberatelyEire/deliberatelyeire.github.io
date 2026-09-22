# Fonts

The two faces `scripts/embed_font.py` subsets into each figure SVG, so that figure
type and page prose are the same build of the same font. Both are the exact woff2
files `fonts.googleapis.com` serves this site, which is the point of vendoring them
rather than picking an upstream release.

Retrieved 2026-09-22 from the `css2` API with a current Chrome user agent; the API
serves woff2 and variable builds only to a modern UA, so the request matters.

## `source-serif-4-latin.woff2`

Source Serif 4 v14, the variable roman latin subset — axes `wght 200–900` and
`opsz 8–60`. The site's body serif (`tailwind.config.ts`, `src/index.css`).

    https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..900;1,8..60,300..900

SIL Open Font License 1.1 — `OFL-SourceSerif4.txt`.
Upstream: https://github.com/adobe-fonts/source-serif

## `noto-serif-devanagari.woff2`

Noto Serif Devanagari v34, the variable `devanagari` subset — axis `wght 100–900`.
The frame's footer motto (सर्वे भवन्तु सुखिनः) and the site footer's Devanagari line
(`font-deva`).

    https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400..700

SIL Open Font License 1.1 — `OFL-NotoSerifDevanagari.txt`.
Upstream: https://github.com/notofonts/devanagari

Note the subsetting asymmetry: this face keeps **every** layout feature, while the
latin face keeps only `kern`, `liga` and `calt`. Devanagari shaping needs the Indic
GSUB features — `akhn`, `rphf`, `blwf`, `half`, `rkrf`, `cjct`, `nukt`, `abvs`,
`blws`, `psts`, `pres` — to form conjuncts and reorder matras. A face subset without
them renders with no error and shapes wrong.
