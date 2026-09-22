#!/usr/bin/env python3
"""Generate the four Citizenship (Amendment) Bill 2026 visuals with post-visuals chrome.

Every figure is traceable to the General Scheme itself (the Heads and the sections
they amend) or to the 1956 Act as currently in force. Where the Scheme deliberately
leaves a number to later regulation -- the income threshold is the only one -- the
tile says so rather than carrying an invented figure.

All four are `figure` (1200x675): they are diagrams inside an article, not link
previews, and the article column is a fixed width, so the smallest canvas gives the
largest effective type. Layout is computed from the content bounds frame.py reports
rather than from the catalog's hero coordinates -- those are quoted for a 1600x900
frame and overflow when scaled down (the six-step process row is wider than hero's
own content area).
"""

import re
import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPTS_DIR.parent
OUTPUT_DIR = PROJECT_DIR / "src" / "content" / "posts" / "irish-citizenship-amendment-bill-2026"
POST_VISUALS = (Path.home() / ".claude" / "skills" / "synced"
                / "57179235-8abd-44f1-933a-6ad93664feb8_da48fdcd-c46a-415c-ac7b-9f1904cf05f6"
                / "post-visuals")
FRAME = POST_VISUALS / "scripts" / "frame.py"

sys.path.insert(0, str(SCRIPTS_DIR))
from embed_font import embed as embed_site_serif  # noqa: E402
CANVAS = "figure"
COVER_CANVAS = "card"  # 1200x628: the OG/link-preview size, matching the sibling post

INK = "#0B0C0E"
MUTED = "#5D5E63"
HAIRLINE = "#D8D2C6"
GREEN = "#148708"
SURFACE = "#F1ECE1"
PALE = "#9C8B76"  # same pale the citizenship charts use for time that does not count
PAPER = "#FAF7F0"

KICKER = "CITIZENSHIP BILL 2026"
# 0.50 x font-size x chars for regular, 0.55 for bold -- the catalog's estimate.
WIDTH_REG, WIDTH_BOLD = 0.50, 0.55


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def fits(s, size, bold, limit, where):
    w = len(s) * size * (WIDTH_BOLD if bold else WIDTH_REG)
    if w > limit:
        print(f"  OVERFLOW {where}: {w:.0f}px > {limit:.0f}px -- {s!r}", file=sys.stderr)
    return w


def text(x, y, s, size, weight=400, fill=INK, anchor="start", spacing=None):
    a = f' text-anchor="{anchor}"' if anchor != "start" else ""
    w = f' font-weight="{weight}"' if weight != 400 else ""
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    return f'<text x="{round(x,1)}" y="{round(y,1)}" font-size="{size}"{w} fill="{fill}"{a}{ls}>{esc(s)}</text>'


def emit(name, subtitle, sources, body_fn, canvas=CANVAS):
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
    # The frame's serif stack omits Source Serif 4, the site's body face, and an SVG
    # in an <img> cannot pull the page's webfonts. Carry the face in the file.
    svg = embed_site_serif(svg)
    out.write_text(svg, encoding="utf8")


# ------------------------------------------------------------------ journey

# One person, arriving January 2026, on four different permissions. The bar is the
# first date an application may be MADE -- a grant is at the Minister's discretion
# and processing sits on top of this, so nothing here is a date of citizenship.
#
# Current law: s. 15(1)(c) is 1 year continuous + 4 in the prior 8. ISD states this
# "totals 5 years of reckonable residence over a 9-year period", so the limbs stack.
# Head 5 makes it 2 + 6 = 8. Spouse: s. 15A(1)(e)+(f), 1 + 2 = 3, Head 6 makes it 5.
START = 2026
AXIS_END = 2040
JOURNEY = [
    ("Employment permit holder", "arrives Jan 2026", 5, 8, None),
    ("Spouse of Irish citizen", "arrives Jan 2026, married 3 yrs", 3, 5, None),
    ("PhD researcher, Stamp 2", "4-year doctorate, then Stamp 1G", 9, 12, None),
    ("Temporary Protection", "s. 60(6) of the 2015 Act", 5, None,
     "clock does not run on this permission"),
]


def journey(x0, y0, x1, y1):
    out = []
    lab_w = 260
    ax0, ax1 = x0 + lab_w, x1 - 10
    span = AXIS_END - START
    def px(year):
        return ax0 + (year - START) / span * (ax1 - ax0)

    # Year axis along the top.
    out.append(f'<line x1="{round(ax0,1)}" y1="{round(y0 + 26,1)}" x2="{round(ax1,1)}" '
               f'y2="{round(y0 + 26,1)}" stroke="{HAIRLINE}" stroke-width="1"/>')
    for yr in range(START, AXIS_END + 1, 2):
        out.append(text(px(yr), y0 + 18, str(yr), 15, 400, MUTED, "middle"))
        out.append(f'<line x1="{round(px(yr),1)}" y1="{round(y0 + 26,1)}" x2="{round(px(yr),1)}" '
                   f'y2="{round(y1 - 26,1)}" stroke="{HAIRLINE}" stroke-width="0.5"/>')

    group_h = (y1 - 22 - (y0 + 40)) / len(JOURNEY)
    bar_h = 15
    for g, (label, note, now_y, new_y, caveat) in enumerate(JOURNEY):
        top = y0 + 44 + group_h * g
        fits(label, 18, True, lab_w - 12, f"journey label {g}")
        out.append(text(x0, top + 14, label, 18, 600, INK))
        out.append(text(x0, top + 34, note, 14, 400, MUTED))
        for k, yrs in enumerate((now_y, new_y)):
            by = top + 6 + k * (bar_h + 7)
            tag = "now" if k == 0 else "new"
            fill = PALE if k == 0 else INK
            if yrs is None:
                # Nothing to draw: the permission never starts the clock.
                out.append(f'<line x1="{round(ax0,1)}" y1="{round(by,1)}" x2="{round(ax0,1)}" '
                           f'y2="{round(by + bar_h,1)}" stroke="{fill}" stroke-width="3"/>')
                out.append(text(ax0 + 12, by + 12, f"{tag}   {caveat}", 15, 600, INK))
                continue
            end = px(START + yrs)
            out.append(f'<rect x="{round(ax0,1)}" y="{round(by,1)}" width="{round(end - ax0,1)}" '
                       f'height="{bar_h}" fill="{fill}" rx="2"/>')
            cap = f"{tag}   {START + yrs}"
            if end + 10 + len(cap) * 15 * WIDTH_BOLD > x1:
                # Long bar: set the label inside it rather than off the canvas.
                out.append(text(end - 10, by + 12, cap, 15, 600, PAPER, "end"))
            else:
                out.append(text(end + 10, by + 12, cap, 15, 600 if k else 400,
                                INK if k else MUTED))
    note = ("Bars run to the first date an application may be made. A decision is at the "
            "Minister\u2019s discretion, and processing time sits on top.")
    fits(note, 14, False, x1 - x0, "journey note")
    out.append(text(x0, y1 - 2, note, 14, 400, MUTED))
    return out

# --------------------------------------------------------------- comparison

COMPARE = [
    ("Standard residency", "5 yrs: 1 cont. + 4 of prior 8", "8 yrs: 2 cont. + 6 of prior 10"),
    ("Spouse: marriage", "Married 3 years", "Married 5 years"),
    ("Spouse: residence", "3 yrs: 1 cont. + 2 of prior 4", "5 yrs: 2 cont. + 3 of prior 5"),
    ("Self-sufficiency", "No statutory condition", "Income, welfare and debt tests"),
    ("Language and civics", "Not required", "Both required"),
]
HEADS = ("Requirement", "Current law", "General Scheme 2026")


def comparison(x0, y0, x1, y1):
    out = []
    w = (x1 - x0) / 3
    cols = [x0, x0 + w, x0 + 2 * w]
    band_y, band_h = y0 + 4, 40
    out.append(f'<rect x="{round(cols[2] - 12, 1)}" y="{band_y}" width="{round(w, 1)}" height="{band_h}" '
               f'fill="{SURFACE}" rx="6"/>')
    for cx, label in zip(cols, HEADS):
        out.append(text(cx, band_y + 27, label, 20, 600, INK))
    rows_top = band_y + band_h + 34
    pitch = (y1 - rows_top - 6) / (len(COMPARE) - 1)
    for i, row in enumerate(COMPARE):
        y = rows_top + pitch * i
        out.append(f'<line x1="{x0}" y1="{round(y - 26, 1)}" x2="{x1}" y2="{round(y - 26, 1)}" '
                   f'stroke="{HAIRLINE}" stroke-width="1"/>')
        for j, (cx, cell) in enumerate(zip(cols, row)):
            bold = j == 2
            fits(cell, 18, bold, w - 16, f"comparison r{i}c{j}")
            out.append(text(cx, y, cell, 18, 600 if bold else 400, INK))
    return out


# ------------------------------------------------------------------ metrics

TILES = [
    ("MINIMUM INCOME", "Not set", "To be prescribed by", "Ministerial regulation"),
    ("WELFARE AND HOUSING", "2 yrs", "No prescribed support;", "6 months may be excused"),
    ("DEBT TO THE STATE", "None", "Revenue, social welfare,", "or an unpaid court fine"),
]


def metrics(x0, y0, x1, y1):
    out = []
    gap = 28
    w = (x1 - x0 - gap * 2) / 3
    h = min(230.0, y1 - y0 - 40)
    top = y0 + (y1 - y0 - h) / 2
    for i, (label, figure, s1, s2) in enumerate(TILES):
        cx = x0 + (w + gap) * i
        fill = SURFACE if i == 0 else "#F6F1E6"
        out.append(f'<rect x="{round(cx,1)}" y="{round(top,1)}" width="{round(w,1)}" height="{round(h,1)}" '
                   f'fill="{fill}" rx="6"/>')
        pad = 22
        fits(label, 15, True, w - pad * 2, f"metrics {i} label")
        fits(s1, 17, False, w - pad * 2, f"metrics {i} sub1")
        fits(s2, 17, False, w - pad * 2, f"metrics {i} sub2")
        out.append(text(cx + pad, top + 48, label, 15, 600, MUTED, spacing="1.1"))
        out.append(text(cx + pad, top + 122, figure, 54, 700, INK))
        out.append(text(cx + pad, top + 165, s1, 17, 400, MUTED))
        out.append(text(cx + pad, top + 190, s2, 17, 400, MUTED))
    return out


# ------------------------------------------------------------------ process

STEPS = [
    ("Reside", "8 yrs", "total reckonable"),
    ("Of which", "2 yrs", "continuous, latest"),
    ("Earn", "Income", "set by regulation"),
    ("Off supports", "2 yrs", "no welfare/housing"),
    ("Language", "Pass", "Irish, English, ISL"),
    ("Civics", "Test", "set by Minister"),
]


def process(x0, y0, x1, y1):
    out = []
    n = len(STEPS)
    gap = 26
    w = (x1 - x0 - gap * (n - 1)) / n
    h = min(180.0, y1 - y0 - 40)
    top = y0 + (y1 - y0 - h) / 2
    for i, (name, big, sub) in enumerate(STEPS):
        cx = x0 + (w + gap) * i
        out.append(f'<rect x="{round(cx,1)}" y="{round(top,1)}" width="{round(w,1)}" height="{round(h,1)}" '
                   f'fill="{PAPER}" stroke="{HAIRLINE}" stroke-width="2" rx="6"/>')
        pad = 14
        fits(name, 17, True, w - pad * 2, f"process {i} name")
        fits(sub, 13, False, w - pad * 2, f"process {i} sub")
        out.append(text(cx + pad, top + 34, f"0{i+1}", 14, 600, GREEN))
        out.append(text(cx + pad, top + 68, name, 17, 600, INK))
        out.append(text(cx + pad, top + 104, big, 24, 700, INK))
        out.append(text(cx + pad, top + 132, sub, 13, 400, MUTED))
        if i < n - 1:
            ax = cx + w
            mid = top + h / 2
            out.append(f'<line x1="{round(ax+5,1)}" y1="{round(mid,1)}" x2="{round(ax+gap-8,1)}" y2="{round(mid,1)}" '
                       f'stroke="{MUTED}" stroke-width="2"/>')
            out.append(f'<path d="M{round(ax+gap-5,1)} {round(mid,1)} l-8 -5 v10 z" fill="{MUTED}"/>')
    return out


# -------------------------------------------------------------- reckonable

# Head 9 lists what is taken OUT of reckonable residence. It does not enumerate
# what stays in, and neither does anything else in the article, so this figure is
# one-sided on purpose: an invented "counts" column would be the exact kind of
# plausible-looking fabrication a figure that travels alone must not carry.
EXCLUDED = [
    ("Temporary Protection", "s. 60(6) of the 2015 Act, the mass-influx route"),
    ("Awaiting EU treaty rights", "where the claim is afterwards refused"),
    ("Reviews and appeals", "of a refused EU treaty rights claim"),
    ("Residence obtained by fraud", "or by abuse of rights"),
    ("Any other temporary permission", "that the Minister prescribes"),
]


def reckonable(x0, y0, x1, y1):
    out = []
    head_y = y0 + 22
    out.append(text(x0, head_y, "Time spent on these permissions will not count", 21, 600, INK))
    rows_top = head_y + 52
    # Stop the rows well clear of the footer rule; at y1 - 46 the last baseline
    # sat 8px above it and the descenders touched.
    pitch = (y1 - 92 - rows_top) / (len(EXCLUDED) - 1)
    bar_w, bar_h = 26, 14
    for i, (label, hook) in enumerate(EXCLUDED):
        y = rows_top + pitch * i
        # A pale block, the same token the pathway charts use for time that is
        # discarded -- the figures should agree with each other on what pale means.
        out.append(f'<rect x="{round(x0,1)}" y="{round(y - bar_h + 2,1)}" width="{bar_w}" '
                   f'height="{bar_h}" fill="{PALE}" rx="2"/>')
        tx = x0 + bar_w + 18
        fits(label, 20, True, 420, f"reckonable {i} label")
        fits(hook, 17, False, x1 - (tx + 440), f"reckonable {i} hook")
        out.append(text(tx, y, label, 20, 600, INK))
        out.append(text(tx + 440, y, hook, 17, 400, MUTED))
    foot = y1 - 6
    out.append(f'<line x1="{x0}" y1="{round(foot - 40,1)}" x2="{x1}" y2="{round(foot - 40,1)}" '
               f'stroke="{HAIRLINE}" stroke-width="1"/>')
    note = "Applications made before commencement are assessed under the old rules."
    fits(note, 17, False, x1 - x0, "reckonable note")
    out.append(text(x0, foot, note, 17, 400, MUTED))
    return out


# ----------------------------------------------------------------- passage

# Deliberately not the numbered green chips process.svg uses: that figure is the
# applicant's path and this one is the Bill's, they sit in the same article, and a
# forwarded image carries only its subtitle to tell them apart.
# Names are given as lines: "pre-legislative scrutiny" is the term of art and will
# not fit a fifth of the content width on one line, and shortening it to something
# that fits would be renaming a statutory stage for layout reasons.
STAGES = [
    (["General Scheme"], "published July 2026", True),
    (["Pre-legislative", "scrutiny"], "submissions invited", False),
    (["Bill drafted"], "after scrutiny", False),
    (["Oireachtas passage"], "months to a year or more", False),
    (["Commencement"], "phased, Minister decides", False),
]


def passage(x0, y0, x1, y1):
    out = []
    n = len(STAGES)
    track_y = y0 + 96
    step = (x1 - x0) / n
    out.append(f'<line x1="{round(x0 + step / 2,1)}" y1="{round(track_y,1)}" '
               f'x2="{round(x1 - step / 2,1)}" y2="{round(track_y,1)}" '
               f'stroke="{HAIRLINE}" stroke-width="2"/>')
    for i, (name, status, done) in enumerate(STAGES):
        cx = x0 + step * i + step / 2
        if done:
            out.append(f'<circle cx="{round(cx,1)}" cy="{round(track_y,1)}" r="11" fill="{GREEN}"/>')
        else:
            out.append(f'<circle cx="{round(cx,1)}" cy="{round(track_y,1)}" r="10" fill="{PAPER}" '
                       f'stroke="{PALE}" stroke-width="2"/>')
        fits(status, 15, False, step - 12, f"passage {i} status")
        for k, line in enumerate(reversed(name)):
            fits(line, 18, True, step - 12, f"passage {i} name {k}")
            out.append(text(cx, track_y - 34 - k * 24, line, 18, 600,
                            INK if done else MUTED, "middle"))
        out.append(text(cx, track_y + 38, status, 15, 400, MUTED, "middle"))
    band_top = track_y + 78
    out.append(f'<rect x="{x0}" y="{round(band_top,1)}" width="{round(x1 - x0,1)}" '
               f'height="{round(y1 - band_top - 2,1)}" fill="{SURFACE}" rx="6"/>')
    lead = "The General Scheme is not law."
    fits(lead, 26, True, x1 - x0 - 48, "passage lead")
    out.append(text(x0 + 24, band_top + 46, lead, 26, 700, INK))
    for j, line in enumerate([
        "It is a policy proposal. The Bill may change during scrutiny, and the numbers that",
        "matter most \u2014 income threshold, welfare and housing lists, language and civics",
        "standards, waiver categories \u2014 are set by regulation after enactment, not in the Act.",
    ]):
        fits(line, 17, False, x1 - x0 - 48, f"passage line {j}")
        out.append(text(x0 + 24, band_top + 80 + j * 25, line, 17, 400, MUTED))
    return out


# ---------------------------------------------------------------- barriers

# Each item is a list of lines. A wrapped item keeps a single bullet, so three
# points do not read as five.
BARS = ("Bars a grant", "Schedule 1 \u2014 no discretion", [
    ["Immigration Acts 1999 and 2004"],
    ["International Protection Acts 2015, 2026"],
    ["EU Free Movement Regulations 2015"],
    ["EU Withdrawal Agreement Regulations 2020"],
])
REVOKES = ("Revokes a grant", "Head 10, section 19", [
    ["New ground: public policy, public order", "or national security"],
    ["Sits alongside fraud, concealment, disloyalty"],
    ["Duty to consult the Committee of Inquiry", "Chairperson is removed"],
])


def barriers(x0, y0, x1, y1):
    out = []
    gap = 36
    w = (x1 - x0 - gap) / 2
    line_h, item_gap, head_h = 32, 14, 122
    # One height for both tiles, sized to whichever column holds more.
    tall = max(sum(len(it) for it in items) * line_h + (len(items) - 1) * item_gap
               for _, _, items in (BARS, REVOKES))
    h = head_h + tall + 34
    top = y0 + max(0.0, (y1 - y0 - h) / 2)
    for i, (title, hook, items) in enumerate((BARS, REVOKES)):
        cx = x0 + (w + gap) * i
        y0 = top
        out.append(f'<rect x="{round(cx,1)}" y="{round(top,1)}" width="{round(w,1)}" '
                   f'height="{round(h,1)}" fill="{SURFACE if i == 0 else "#F6F1E6"}" rx="6"/>')
        pad = 24
        fits(title, 24, True, w - pad * 2, f"barriers {i} title")
        fits(hook, 16, False, w - pad * 2, f"barriers {i} hook")
        out.append(text(cx + pad, top + 46, title, 24, 700, INK))
        out.append(text(cx + pad, top + 76, hook, 16, 400, MUTED))
        out.append(f'<line x1="{round(cx + pad,1)}" y1="{round(top + 96,1)}" '
                   f'x2="{round(cx + w - pad,1)}" y2="{round(top + 96,1)}" '
                   f'stroke="{HAIRLINE}" stroke-width="1"/>')
        iy = top + head_h
        for j, lines in enumerate(items):
            for k, line in enumerate(lines):
                fits(line, 18, False, w - pad * 2 - 18, f"barriers {i} item {j}.{k}")
                if k == 0:
                    out.append(f'<rect x="{round(cx + pad,1)}" y="{round(iy - 9,1)}" '
                               f'width="6" height="6" fill="{MUTED}" rx="1"/>')
                out.append(text(cx + pad + 18, iy, line, 18, 400, INK))
                iy += line_h
            iy += item_gap
    return out


# ------------------------------------------------------------------- tests

TESTS = [
    ("LANGUAGE", "Irish, English or", "Irish Sign Language"),
    ("CIVICS", "Irish civics, society", "and politics"),
]


def tests(x0, y0, x1, y1):
    out = []
    gap = 32
    w = (x1 - x0 - gap) / 2
    h = 262.0
    for i, (label, s1, s2) in enumerate(TESTS):
        cx = x0 + (w + gap) * i
        out.append(f'<rect x="{round(cx,1)}" y="{round(y0,1)}" width="{round(w,1)}" '
                   f'height="{h}" fill="{SURFACE if i == 0 else "#F6F1E6"}" rx="6"/>')
        pad = 26
        for s, size, bold in ((label, 15, True), (s1, 19, False), (s2, 19, False)):
            fits(s, size, bold, w - pad * 2, f"tests {i} {s[:12]}")
        out.append(text(cx + pad, y0 + 50, label, 15, 600, MUTED, spacing="1.1"))
        out.append(text(cx + pad, y0 + 114, "Every applicant", 30, 700, INK))
        out.append(text(cx + pad, y0 + 158, s1, 19, 400, MUTED))
        out.append(text(cx + pad, y0 + 186, s2, 19, 400, MUTED))
        out.append(text(cx + pad, y0 + 228, "Standard set by the Minister", 16, 400, MUTED))
    band_top = y0 + h + 30
    out.append(f'<line x1="{x0}" y1="{round(band_top,1)}" x2="{x1}" y2="{round(band_top,1)}" '
               f'stroke="{HAIRLINE}" stroke-width="1"/>')
    for j, (line, weight) in enumerate([
        ("The Minister may waive both for prescribed categories of applicant (Head 8, s. 16(1A)).", 400),
        ("Good character can never be waived (s. 16(1B)).", 600),
    ]):
        fits(line, 19, weight == 600, x1 - x0, f"tests band {j}")
        out.append(text(x0, band_top + 38 + j * 30, line, 19, weight, MUTED if weight == 400 else INK))
    return out


# ---------------------------------------------------------------- statement

# Years of residence required before an application can be made, by applicant
# category. Current column: Act of 1956 s. 15(1)(c) and s. 15A(1)(f) as in force.
# Proposed: Heads 5 and 6. The temporary-permission row is not a year figure --
# that time was reckonable and Head 9 excludes it outright. It is drawn at the same
# length as the worker row's "now" bar so all three rows share one scale, then
# reduced to a stub, which is what the change does. Head 9 reaches Temporary
# Protection under s. 60(6) of the 2015 Act, not a refugee declaration.
# The cover is the journey figure cut to three rows and card proportions: the
# standard case, the worst case, and the one where the clock stops entirely.
COVER_ROWS = [
    ("EMPLOYMENT PERMIT", 5, 8, None),
    ("PhD ON STAMP 2, THEN STAMP 1G", 9, 12, None),
    ("TEMPORARY PROTECTION", 5, None, "the clock stops"),
]


def cover(x0, y0, x1, y1):
    """Cover: one person arriving January 2026, three permissions, when each may
    first apply. ContentGrid crops covers to aspect-[16/10] with object-cover, so the
    content is inset into the middle ~84%; the frame's chrome may clip, the data may
    not. Card type is set explicitly and never drops below 26px."""
    out = []
    inset = (x1 - x0) * 0.08 / 2 + 24
    x0, x1 = x0 + inset, x1 - inset
    bx = x0 + 72
    span = AXIS_END - START
    def px(year):
        return bx + (year - START) / span * (x1 - 96 - bx)

    group_h, bar_h = 92, 16
    top0 = y0 + ((y1 - y0) - group_h * len(COVER_ROWS)) / 2
    for g, (label, now_y, new_y, caveat) in enumerate(COVER_ROWS):
        top = top0 + group_h * g
        if g:
            out.append(f'<line x1="{x0}" y1="{round(top - 6,1)}" x2="{x1}" y2="{round(top - 6,1)}" '
                       f'stroke="{HAIRLINE}" stroke-width="1"/>')
        fits(label, 26, True, x1 - x0, f"cover label {g}")
        out.append(text(x0, top + 20, label, 26, 600, MUTED, spacing="1.4"))
        for k, yrs in enumerate((now_y, new_y)):
            by = top + 32 + k * 28
            tag, fill = ("now", PALE) if k == 0 else ("new", INK)
            out.append(text(x0, by + 13, tag, 26, 400, MUTED))
            if yrs is None:
                out.append(f'<line x1="{round(bx,1)}" y1="{round(by,1)}" x2="{round(bx,1)}" '
                           f'y2="{round(by + bar_h,1)}" stroke="{fill}" stroke-width="3"/>')
                out.append(text(bx + 12, by + 13, caveat, 26, 600, INK))
                continue
            end = px(START + yrs)
            out.append(f'<rect x="{round(bx,1)}" y="{round(by,1)}" width="{round(end - bx,1)}" '
                       f'height="{bar_h}" fill="{fill}" rx="2"/>')
            cap = str(START + yrs)
            fits(cap, 26, True, x1 - (end + 12), f"cover cap {g}/{k}")
            out.append(text(end + 12, by + 13, cap, 26, 600 if k else 400, INK if k else MUTED))
    return out


SCHEME = "General Scheme, Irish Nationality and Citizenship (Amendment) Bill 2026"


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    emit("journey.svg", "One arrival, January 2026, four permissions",
         SCHEME + ", Heads 5, 6, 9; Act of 1956 ss. 15, 15A; ISD reckonable residence rules",
         journey)
    emit("comparison.svg", "What the Scheme would change",
         SCHEME + ", Heads 5-6; Act of 1956 ss. 15, 15A as in force", comparison)
    emit("metrics.svg", "The three self-sufficiency tests",
         SCHEME + ", Head 7; s. 15(3)(a)-(c), s. 15(4)", metrics)
    emit("process.svg", "What a standard applicant must clear",
         SCHEME + ", Heads 5 and 7; ss. 15, 15F", process)
    emit("tests.svg", "Two new tests, standards set later",
         SCHEME + ", Heads 5, 6 and 8; ss. 15, 15A, 16(1A)-(1B)", tests)
    emit("reckonable.svg", "Time the Scheme stops counting",
         SCHEME + ", Head 9; s. 16A; International Protection Act 2015 s. 60(6)",
         reckonable)
    emit("barriers.svg", "Two ways citizenship can be refused or withdrawn",
         SCHEME + ", Head 10 and Schedule 1; Act of 1956 s. 19", barriers)
    # The stages are Oireachtas procedure, not text in the Scheme, so they are cited
    # as such rather than attributed to it.
    emit("passage.svg", "The Bill's own path, not the applicant's",
         "Oireachtas legislative process; " + SCHEME + ", published July 2026", passage)
    emit("cover.svg", "Arriving January 2026: when can she apply?",
         SCHEME + ", Heads 5, 6, 9; Act of 1956 ss. 15, 15A, 16A", cover,
         canvas=COVER_CANVAS)


if __name__ == "__main__":
    main()
