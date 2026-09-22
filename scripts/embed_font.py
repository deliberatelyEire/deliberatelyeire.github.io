#!/usr/bin/env python3
"""Embed the site's typefaces into post-visuals SVGs.

The site draws prose in Source Serif 4 and its Devanagari line in Noto Serif Devanagari
(tailwind.config.ts, src/index.css), both loaded from Google Fonts. An SVG referenced from
an <img> is an isolated document: it cannot reach the page's webfonts, or any other
external resource. The only way a figure can use the site typefaces -- on the page, and
when the file is shared on its own, which is how these images are meant to travel -- is to
carry the faces inside the file.

Four details decide whether that actually works, and all four fail silently.

*Quote the family name.* An unquoted CSS font family must be a sequence of identifiers,
and `4` is not a valid identifier, so `Source Serif 4, Georgia, serif` is an invalid
declaration -- not a failed first choice. The browser discards the whole list, including
the fallbacks, and draws the figure in its default serif. So the stacks below quote it.

*Keep the opsz axis.* Source Serif 4 is variable on wght and opsz, and the browser draws
page text with `font-optical-sizing: auto`, which pins opsz to the font-size. Chrome
honours that inside SVG-as-image too, so a subset that keeps the axis matches the prose
exactly at every size these figures draw. Instancing opsz to the family default instead
would save ~34KB per file but drift up to 8% at the smallest type. Renderers that ignore
optical sizing fall back to that same default instance, so keeping the axis is never
worse.

The wght axis is clamped to 400-700 -- the frame and layouts draw 400, 600 and 700 and
nothing else -- which costs no fidelity and takes about a third off the subset.

*Which characters to embed is decided by each face's own cmap*, not by a codepoint range.
A range test meant to skip Devanagari also skips the general punctuation the figures lean
on -- en and em dashes, curly apostrophes, the minus sign -- which live above that block,
are covered by the latin font, and turn into fallback glyphs mid-line when dropped.

*Keep every layout feature on the Devanagari face.* The frame's footer motto needs the
Indic shaping features -- akhn, rphf, blwf, half, rkrf, cjct, nukt, abvs, blws, psts, pres
-- to form conjuncts and reorder matras. Subsetting with the latin feature list (kern,
liga, calt) leaves a face that renders without error and shapes wrong, so the Devanagari
face keeps all features.

Run standalone to refresh SVGs generated before, or by an older version, of this script:
    python3 scripts/embed_font.py src/content/posts/*/*.svg
"""

import base64
import io
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

FONTS = Path(__file__).resolve().parent / "fonts"
MARKER = "data-embedded-font"
STYLE_RE = re.compile(rf"<style {MARKER}=\"1\">.*?</style>", re.S)


@dataclass(frozen=True)
class Face:
    file: str
    family: str
    stack: str  # what the SVG should say, with the family quoted
    replaces: tuple  # stacks written by the frame script, or by older versions of this one
    features: tuple = ("kern", "liga", "calt")
    wght: tuple = (400, 400, 700)

    @property
    def path(self):
        return FONTS / self.file

    @property
    def stacks(self):
        return (self.stack, *self.replaces)


FACES = (
    Face(
        file="source-serif-4-latin.woff2",
        family="Source Serif 4",
        stack="'Source Serif 4', Bitstream Charter, Charter, Georgia, serif",
        replaces=(
            "Bitstream Charter, Charter, Georgia, Times New Roman, serif",
            "Source Serif 4, Bitstream Charter, Charter, Georgia, serif",
        ),
    ),
    Face(
        file="noto-serif-devanagari.woff2",
        family="Noto Serif Devanagari",
        stack="'Noto Serif Devanagari', 'Lohit Devanagari', serif",
        replaces=("Lohit Devanagari, Noto Serif Devanagari, serif",),
        features=("*",),
    ),
)


def _load(face):
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    # recalcTimestamp would stamp head.modified with the current time, so every rerun
    # would rewrite all nine SVGs with a different base64 blob and no visible change.
    font = TTFont(str(face.path), recalcTimestamp=False)
    font = instancer.instantiateVariableFont(
        font, {"wght": face.wght}, updateFontNames=False
    )
    # Clamping an axis drops the gvar entries that flattened to nothing, but the
    # subsetter's glyph closure still reaches them through GSUB and then indexes gvar
    # by name. Restore them empty; fontTools 4.60 raises KeyError otherwise.
    if "gvar" in font:
        variations = font["gvar"].variations
        for name in font.getGlyphOrder():
            variations.setdefault(name, [])
    return font


def subset_for(face, text):
    from fontTools import subset

    font = _load(face)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = list(face.features)
    opts.drop_tables += ["DSIG"]
    s = subset.Subsetter(options=opts)
    s.populate(text=text)
    s.subset(font)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    return buf.getvalue()


def _drawn_by_face(svg):
    """Map each face to the characters actually drawn in the stack it governs.

    A figure mixes the two faces, and the two cmaps overlap on latin and punctuation, so
    the split has to follow each <text> node's own font-family -- inherited from <svg>
    when the node does not set one -- rather than the codepoints.
    """
    root = re.search(r"<svg\b[^>]*\bfont-family=\"([^\"]*)\"", svg)
    default = root.group(1) if root else ""
    by_face = {face: set() for face in FACES}

    for attrs, body in re.findall(r"<text\b([^>]*)>(.*?)</text>", svg, re.S):
        own = re.search(r"\bfont-family=\"([^\"]*)\"", attrs)
        stack = own.group(1) if own else default
        for face in FACES:
            if stack in face.stacks:
                by_face[face] |= set(re.sub(r"<[^>]+>", "", body))
                break
    return by_face


def embed(svg):
    """Return svg with the site faces inlined. Idempotent, and refreshes a stale face."""
    svg = STYLE_RE.sub("", svg)
    styles = []

    for face, drawn in _drawn_by_face(svg).items():
        covered = set(_load(face).getBestCmap())
        chars = sorted(c for c in drawn if ord(c) in covered)
        if not chars:
            continue
        b64 = base64.b64encode(subset_for(face, "".join(chars))).decode()
        styles.append(
            f'<style {MARKER}="1">@font-face{{font-family:"{face.family}";'
            f"font-style:normal;font-weight:{face.wght[0]} {face.wght[2]};"
            f'src:url(data:font/woff2;base64,{b64}) format("woff2");}}</style>'
        )

    if not styles:
        return svg

    for face in FACES:
        for stale in face.replaces:
            svg = svg.replace(stale, face.stack)
    # Insert the faces as the first children of <svg> so they parse before any text.
    return re.sub(r"(<svg\b[^>]*>)", lambda m: m.group(1) + "".join(styles), svg, count=1)


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
    missing = [f.file for f in FACES if not f.path.exists()]
    if missing:
        sys.exit(f"missing in {FONTS}: {', '.join(missing)}")
    main(sys.argv[1:] or sys.exit(__doc__))
