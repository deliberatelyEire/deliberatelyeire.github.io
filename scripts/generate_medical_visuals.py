#!/usr/bin/env python3
"""Generate the cover for the internationally trained doctors and nurses post.

The cover is a `card` (1200x628), since it doubles as the OG image. It shows each
register twice in one bar: the whole workforce, and what is left without those
trained outside Ireland. Every count is read from a primary table:

- Nurses and midwives: NMBI State of the Register 2025, Table 2, practising
  registrants at 1 June 2025 -- Irish educated 41,938, non-EU educated 42,432,
  EU educated 2,578.
- Doctors: Medical Council Medical Workforce Intelligence Report 2024, Table 1,
  clinically active doctors -- Irish BMQ 12,230, EU/UK 2,902, international 5,830.

Green is the Irish-trained share and saffron the share trained abroad: a genuine
Irish/non-Irish pairing, which is what the post-visuals accent rule reserves them for.
"""

import re
import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPTS_DIR.parent
OUTPUT_DIR = PROJECT_DIR / "src" / "content" / "posts" / "ireland-international-doctors-nurses"
POST_VISUALS = (Path.home() / ".claude" / "skills" / "synced"
                / "57179235-8abd-44f1-933a-6ad93664feb8_da48fdcd-c46a-415c-ac7b-9f1904cf05f6"
                / "post-visuals")
FRAME = POST_VISUALS / "scripts" / "frame.py"

sys.path.insert(0, str(SCRIPTS_DIR))
from embed_font import embed as embed_site_serif  # noqa: E402

INK = "#0B0C0E"
MUTED = "#5D5E63"
HAIRLINE = "#D8D2C6"
SAFFRON = "#FD8932"
GREEN = "#148708"

KICKER = "HEALTH WORKFORCE"
SUBTITLE = "Ireland’s clinicians, with and without those trained abroad"
SOURCES = ("NMBI State of the Register 2025, Table 2; "
           "Medical Council Workforce Intelligence Report 2024, Table 1")
WIDTH_REG, WIDTH_BOLD = 0.50, 0.55
MIN_SIZE = 26  # the card floor

# (label, Irish-trained, trained outside Ireland)
ROWS = [
    ("Practising nurses & midwives, 2025", 41938, 42432 + 2578),
    ("Clinically active doctors, 2024", 12230, 2902 + 5830),
]


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def fits(s, size, bold, limit, where):
    w = len(s) * size * (WIDTH_BOLD if bold else WIDTH_REG)
    if w > limit:
        print(f"  OVERFLOW {where}: {w:.0f}px > {limit:.0f}px -- {s!r}", file=sys.stderr)
    return w


def text(x, y, s, size, weight=400, fill=INK, anchor="start"):
    assert size >= MIN_SIZE, f"{size}px is below the card minimum: {s!r}"
    a = f' text-anchor="{anchor}"' if anchor != "start" else ""
    w = f' font-weight="{weight}"' if weight != 400 else ""
    return f'<text x="{round(x,1)}" y="{round(y,1)}" font-size="{size}"{w} fill="{fill}"{a}>{esc(s)}</text>'


def rect(x, y, w, h, fill):
    return f'<rect x="{round(x,1)}" y="{round(y,1)}" width="{round(w,1)}" height="{round(h,1)}" fill="{fill}"/>'


def cover(x0, y0, x1, y1):
    """ContentGrid crops covers to aspect-[16/10] with object-cover, keeping the
    middle ~84% of the width, so the block is inset on both sides."""
    inset = (x1 - x0) * 0.04 + 32
    left, right = x0 + inset, x1 - inset
    width = right - left
    label_h, gap1, bar_h, gap2, cap_h, row_gap = 28, 14, 44, 14, 26, 36
    row_h = label_h + gap1 + bar_h + gap2 + cap_h
    top = y0 + (y1 - y0 - (2 * row_h + row_gap)) / 2
    out = []
    for i, (label, irish, abroad) in enumerate(ROWS):
        total = irish + abroad
        y = top + i * (row_h + row_gap)
        change = f"{total:,} → {irish:,}"
        fits(label, 28, True, width - fits(change, 28, True, width, "change") - 24, label)
        out.append(text(left, y + label_h, label, 28, 700, INK))
        out.append(text(right, y + label_h, change, 28, 700, INK, "end"))
        by = y + label_h + gap1
        wi = width * irish / total
        out.append(rect(left, by, wi, bar_h, GREEN))
        out.append(rect(left + wi + 3, by, width - wi - 3, bar_h, SAFFRON))
        pct = round(100 * abroad / total)
        cy = by + bar_h + gap2 + cap_h
        sq = 18
        out.append(rect(left, cy - sq, sq, sq, GREEN))
        cap_l = f"{irish:,} trained in Ireland"
        out.append(text(left + sq + 10, cy, cap_l, 26, 400, MUTED))
        cap_r = f"{abroad:,} trained abroad ({pct}%)"
        fits(cap_r, 26, False, width / 2, "caption")
        out.append(text(right - sq - 10, cy, cap_r, 26, 400, MUTED, "end"))
        out.append(rect(right - sq, cy - sq, sq, sq, SAFFRON))
    return out


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUTPUT_DIR / "cover.svg"
    fits("Sources: " + SOURCES, 16, False, 1068 * 0.50 / 0.46, "sources")
    r = subprocess.run([sys.executable, str(FRAME), "--canvas", "card",
                        "--kicker", KICKER, "--subtitle", SUBTITLE,
                        "--sources", SOURCES, "--out", str(out)],
                       check=True, capture_output=True, text=True)
    m = re.search(r"content area: x ([\d.]+) to ([\d.]+), y ([\d.]+) to ([\d.]+)", r.stdout)
    x0, x1, y0, y1 = (float(m.group(i)) for i in (1, 2, 3, 4))
    print(f"cover.svg: bounds x {x0}-{x1} y {y0}-{y1}")
    svg = out.read_text(encoding="utf8")
    svg = svg.replace("<!-- CONTENT -->", "\n".join(cover(x0, y0, x1, y1)))
    svg = embed_site_serif(svg)
    out.write_text(svg, encoding="utf8")


if __name__ == "__main__":
    main()
