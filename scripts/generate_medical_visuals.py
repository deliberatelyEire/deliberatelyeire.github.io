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


# ---------------------------------------------------------------- per person

# People per clinician: the CSO usually resident population divided by each
# register's workforce, matched by year. April 2025 is 5,458,600; April 2024 is
# 5,380,300 (the April 2025 release gives the year's rise as 78,300). One dot is one
# person; saffron dots are the people each clinician would gain without those
# trained outside Ireland.
POP_2025, POP_2024 = 5458600, 5380300
RATIO_SUBTITLE = "If every clinician trained abroad left Ireland"
RATIO_SOURCES = ("CSO Population and Migration Estimates, April 2025; "
                 "NMBI Register 2025, Table 2; "
                 "Medical Council Workforce Report 2024, Table 1")
RATIO_COLS = [
    ("One nurse or midwife for every", "Practising nurses & midwives, 2025",
     POP_2025, 41938 + 42432 + 2578, 41938),
    ("One doctor for every", "Clinically active doctors, 2024",
     POP_2024, 20962, 12230),
]


def dots(x, y, n, base, per_row, pitch, r):
    out = []
    for k in range(n):
        cx = x + (k % per_row) * pitch + r
        cy = y + (k // per_row) * pitch + r
        fill = INK if k < base else SAFFRON
        out.append(f'<circle cx="{round(cx,1)}" cy="{round(cy,1)}" r="{r}" fill="{fill}"/>')
    return out


def ratio(x0, y0, x1, y1):
    out = []
    gutter = 80
    col_w = (x1 - x0 - gutter) / 2
    num_w = 220            # the big number and its caption
    pitch, r = 13, 4.5
    per_row = int((col_w - num_w) // pitch)
    with_rows = max(-(-round(pop / total) // per_row) for _, _, pop, total, _ in RATIO_COLS)
    without_rows = max(-(-round(pop / irish) // per_row) for _, _, pop, _, irish in RATIO_COLS)
    head_h = 32 + 12 + 22
    row1_h = max(with_rows * pitch, 128)
    row2_h = max(without_rows * pitch, 128)
    gap = 40
    block = head_h + 36 + row1_h + gap + row2_h
    top = y0 + (y1 - y0 - block) / 2
    for i, (head, sub, pop, total, irish) in enumerate(RATIO_COLS):
        x = x0 + i * (col_w + gutter)
        with_n, without_n = round(pop / total), round(pop / irish)
        fits(head, 32, True, col_w, "ratio head")
        out.append(text(x, top + 32, head, 32, 700, INK))
        out.append(text(x, top + 32 + 12 + 22, sub, 22, 400, MUTED))
        for j, (n, lines, y_row) in enumerate([
                (with_n, ["people, all staff"], top + head_h + 36),
                (without_n, ["people, Irish-trained", "staff only"],
                 top + head_h + 36 + row1_h + gap)]):
            out.append(text(x, y_row + 68, f"{n:,}", 76, 700, SAFFRON if j else INK))
            for k, line in enumerate(lines):
                out.append(text(x, y_row + 68 + 30 + 24 * k, line, 20, 400, MUTED))
            out.extend(dots(x + num_w, y_row, n, with_n, per_row, pitch, r))
        if i == 0:
            out.append(f'<line x1="{round(x + col_w + gutter / 2,1)}" y1="{round(top,1)}" '
                       f'x2="{round(x + col_w + gutter / 2,1)}" y2="{round(top + block,1)}" '
                       f'stroke="{HAIRLINE}" stroke-width="1.5"/>')
    return out


# ------------------------------------------------------------------- queue

# The queue that exists with today's workforce. Counts are the national totals of
# NTPF open data at the 24 September 2026 archive date, summed across hospitals:
# OpenData_OPNational01_2026 (outpatient), OpenData_IPDCNational01_2026 (inpatient
# and day case) and OpenData_IPDCNational04_2026 (GI endoscopy). The 7.0-month
# weighted average wait is the Department of Health's September 2026 release. The
# headline 1,040,698 figure includes lists not in the open data, so it is not used.
QUEUE_SUBTITLE = "Today’s queue, with staff trained abroad still here"
QUEUE_SOURCES = ("NTPF open data, national waiting lists at 24 September 2026; "
                 "Department of Health, waiting list figures, September 2026")
# (list, published Total, under 6 months, 6-12 months, over 12 months). The
# files' Total column differs from the sum of their bands by a few people, so the
# printed counts use Total and the bands only draw the bar.
QUEUE_ROWS = [
    ("First outpatient appointment", 692524, 407177, 160653, 71251 + 53458),
    ("Inpatient or day-case treatment", 114722, 67682, 26364, 10872 + 9810),
    ("GI endoscopy", 43288, 30419, 8697, 3373 + 809),
]
QUEUE_AVG_WAIT = "7.0 months"


def queue(x0, y0, x1, y1):
    out = []
    total = sum(r[1] for r in QUEUE_ROWS)
    over_year = sum(r[4] for r in QUEUE_ROWS)
    left_w = 470
    # left: the statement
    top = y0 + 24
    out.append(text(x0, top + 20, "WAITING FOR HOSPITAL CARE", 20, 600, MUTED))
    out.append(text(x0, top + 20 + 112, f"{total:,}", 104, 700, INK))
    out.append(text(x0, top + 20 + 112 + 40, "people on three hospital lists", 24, 400, MUTED))
    y2 = top + 20 + 112 + 40 + 104
    out.append(text(x0, y2, f"{over_year:,}", 64, 700, INK))
    out.append(text(x0, y2 + 36, "of them waiting more than a year", 24, 400, MUTED))
    y3 = y2 + 36 + 88
    out.append(text(x0, y3, QUEUE_AVG_WAIT, 64, 700, INK))
    out.append(text(x0, y3 + 36, "average wait across lists", 24, 400, MUTED))
    fits("of them waiting more than a year", 24, False, left_w, "queue left")
    # right: one stacked bar per list, scaled to the largest
    rx = x0 + left_w + 80
    rw = x1 - rx
    out.append(f'<line x1="{rx - 40}" y1="{round(y0 + 16,1)}" x2="{rx - 40}" '
               f'y2="{round(y1 - 16,1)}" stroke="{HAIRLINE}" stroke-width="1.5"/>')
    biggest = max(sum(r[2:]) for r in QUEUE_ROWS)
    fills = [HAIRLINE, MUTED, INK]
    row_top = y0 + 24
    pitch = 152
    for i, (label, n, a, b, c) in enumerate(QUEUE_ROWS):
        y = row_top + i * pitch
        out.append(text(rx, y + 28, label, 28, 700, INK))
        out.append(text(x1, y + 28, f"{n:,}", 28, 700, INK, "end"))
        bx, by, bh = rx, y + 44, 44
        for v, f in zip((a, b, c), fills):
            w = rw * v / biggest
            out.append(rect(bx, by, w, bh, f))
            bx += w
        out.append(text(rx, by + bh + 30, f"{c:,} waiting more than a year", 20, 400, MUTED))
    # legend
    ly = row_top + 3 * pitch + 20
    lx = rx
    for label, f in zip(("Under 6 months", "6 to 12 months", "Over 12 months"), fills):
        out.append(rect(lx, ly - 16, 18, 18, f))
        out.append(text(lx + 28, ly, label, 20, 400, MUTED))
        lx += 28 + fits(label, 20, False, rw, "legend") + 48
    return out


def emit(name, canvas, subtitle, sources, body_fn, min_size):
    global MIN_SIZE
    MIN_SIZE = min_size
    out = OUTPUT_DIR / name
    r = subprocess.run([sys.executable, str(FRAME), "--canvas", canvas,
                        "--kicker", KICKER, "--subtitle", subtitle,
                        "--sources", sources, "--out", str(out)],
                       check=True, capture_output=True, text=True)
    m = re.search(r"content area: x ([\d.]+) to ([\d.]+), y ([\d.]+) to ([\d.]+)", r.stdout)
    x0, x1, y0, y1 = (float(m.group(i)) for i in (1, 2, 3, 4))
    print(f"{name}: bounds x {x0}-{x1} y {y0}-{y1}")
    svg = out.read_text(encoding="utf8")
    svg = svg.replace("<!-- CONTENT -->", "\n".join(body_fn(x0, y0, x1, y1)))
    svg = embed_site_serif(svg)
    out.write_text(svg, encoding="utf8")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    fits("Sources: " + SOURCES, 16, False, 1068 * 0.50 / 0.46, "sources")
    fits("Sources: " + RATIO_SOURCES, 20, False, 1424 * 0.50 / 0.46, "ratio sources")
    emit("cover.svg", "card", SUBTITLE, SOURCES, cover, 26)
    # hero's caption size is 20, its floor
    emit("per-person.svg", "hero", RATIO_SUBTITLE, RATIO_SOURCES, ratio, 20)
    fits("Sources: " + QUEUE_SOURCES, 20, False, 1424 * 0.50 / 0.46, "queue sources")
    emit("waiting-lists.svg", "hero", QUEUE_SUBTITLE, QUEUE_SOURCES, queue, 20)


if __name__ == "__main__":
    main()
