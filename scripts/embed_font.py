#!/usr/bin/env python3
"""Embed the site's body serif into post-visuals SVGs.

The site sets its serif to Source Serif 4 (tailwind.config.ts, src/index.css) and loads
it from Google Fonts. An SVG referenced from an <img> is an isolated document: it cannot
reach the page's webfonts, or any other external resource. The only way a figure can use
the site typeface -- on the page, and when the file is shared on its own, which is how
these images are meant to travel -- is to carry the face inside the file.

Two details decide whether that actually works, and both fail silently.

*Quote the family name.* An unquoted CSS font family must be a sequence of identifiers,
and `4` is not a valid identifier, so `Source Serif 4, Georgia, serif` is an invalid
declaration -- not a failed first choice. The browser discards the whole list, including
the fallbacks, and draws the figure in its default serif. So the stack below quotes it.

*Keep the opsz axis.* Source Serif 4 is variable on wght and opsz, and the browser draws
page text with `font-optical-sizing: auto`, which pins opsz to the font-size. Chrome
honours that inside SVG-as-image too, so a subset that keeps the axis matches the prose
exactly at every size these figures draw. Instancing opsz to the family default instead
would save ~34KB per file but drift up to 8% at the smallest type. Renderers that ignore
optical sizing fall back to that same default instance, so keeping the axis is never
worse.

The wght axis is clamped to 400-700 -- the frame and layouts draw 400, 600 and 700 and
nothing else -- which costs no fidelity and takes about a third off the subset.

Which characters to embed is decided by the source font's own cmap, not by a codepoint
range. Devanagari is left alone -- its own stack already resolves, and subsetting
conjuncts safely is a separate problem -- but a range test that excludes it also excludes
the general punctuation the figures lean on: en and em dashes, curly apostrophes, the
minus sign. Those live above the Devanagari block, the latin font covers them, and
dropping them puts Georgia glyphs in the middle of a Source Serif 4 line.

Run standalone to refresh SVGs generated before, or by an older version of, this script:
    python3 scripts/embed_font.py src/content/posts/*/*.svg
"""

import base64
import io
import re
import sys
from pathlib import Path

FONT = Path(__file__).resolve().parent / "fonts" / "source-serif-4-latin.woff2"
FAMILY = "Source Serif 4"
FRAME_STACK = "Bitstream Charter, Charter, Georgia, Times New Roman, serif"
SITE_STACK = f"'{FAMILY}', Bitstream Charter, Charter, Georgia, serif"
WGHT = (400, 400, 700)  # the only weights the frame and layouts draw
MARKER = "data-embedded-font"
STYLE_RE = re.compile(rf"<style {MARKER}=\"1\">.*?</style>", re.S)
# Stacks written by earlier versions of this script, replaced on sight.
STALE_STACKS = [f"{FAMILY}, Bitstream Charter, Charter, Georgia, serif"]


def _load():
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    font = TTFont(str(FONT))
    return instancer.instantiateVariableFont(font, {"wght": WGHT}, updateFontNames=False)


def subset_for(text):
    from fontTools import subset

    font = _load()
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "calt"]
    opts.drop_tables += ["DSIG"]
    s = subset.Subsetter(options=opts)
    s.populate(text=text)
    s.subset(font)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    return buf.getvalue()


def embed(svg):
    """Return svg with the site serif inlined. Idempotent, and refreshes a stale face."""
    svg = STYLE_RE.sub("", svg)
    drawn = set()
    for node in re.findall(r"<text\b[^>]*>(.*?)</text>", svg, re.S):
        drawn |= set(re.sub(r"<[^>]+>", "", node))
    covered = set(_load().getBestCmap())
    chars = sorted(c for c in drawn if ord(c) in covered)
    if not chars:
        return svg
    b64 = base64.b64encode(subset_for("".join(chars))).decode()
    style = (
        f'<style {MARKER}="1">@font-face{{font-family:"{FAMILY}";'
        f"font-style:normal;font-weight:400 700;src:url(data:font/woff2;base64,{b64})"
        f' format("woff2");}}</style>'
    )
    for stale in [FRAME_STACK, *STALE_STACKS]:
        svg = svg.replace(stale, SITE_STACK)
    # Insert the face as the first child of <svg> so it is parsed before any text.
    return re.sub(r"(<svg\b[^>]*>)", r"\1" + style, svg, count=1)


def main(paths):
    for p in paths:
        p = Path(p)
        before = p.read_text(encoding="utf8")
        after = embed(before)
        if after == before:
            print(f"  {p.name}: unchanged")
            continue
        p.write_text(after, encoding="utf8")
        print(f"  {p.name}: {len(before)//1024}KB -> {len(after)//1024}KB")


if __name__ == "__main__":
    if not FONT.exists():
        sys.exit(f"missing {FONT}")
    main(sys.argv[1:] or sys.exit(__doc__))
