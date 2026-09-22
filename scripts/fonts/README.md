# Fonts

`source-serif-4-latin.woff2` is the exact latin woff2 that `fonts.googleapis.com`
serves this site for Source Serif 4 (v14) — the variable roman face, axes
`wght 200–900` and `opsz 8–60`. Taking the same build the page loads is the point:
`scripts/embed_font.py` subsets it into each figure SVG so figure type and prose are
the same font at the same optical size.

Retrieved 2026-09-22 from the `css2` API with a current Chrome user agent:

    https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..900;1,8..60,300..900

Licensed under the SIL Open Font License 1.1 — see `OFL.txt`. Source:
https://github.com/adobe-fonts/source-serif
