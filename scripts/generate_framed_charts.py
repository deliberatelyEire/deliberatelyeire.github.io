#!/usr/bin/env python3
"""Generate publication-ready citizenship charts with post-visuals chrome.

Every chart is one bar per country on a shared scale (PIXELS_PER_YEAR), so the
four pathways can be compared against each other. A bar is:

    [ pale: years discarded ][ solid: years the clock actually runs ]

and the total label is discarded + requirement. Years that *count* toward the
requirement are not additive -- a country that counts doctoral time shows a
plain requirement-length bar, not requirement + study.
"""

import csv
import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPTS_DIR.parent
DATA_DIR = PROJECT_DIR / "data" / "citizenship"
OUTPUT_DIR = PROJECT_DIR / "src" / "content" / "posts" / "ireland-citizenship"
TEMP_DIR = Path("/tmp/citizenship-charts")
POST_VISUALS_DIR = Path.home() / ".claude" / "skills" / "synced" / "57179235-8abd-44f1-933a-6ad93664feb8_da48fdcd-c46a-415c-ac7b-9f1904cf05f6" / "post-visuals"

sys.path.insert(0, str(SCRIPTS_DIR))
from embed_font import embed as embed_site_faces  # noqa: E402

PIXELS_PER_YEAR = 56
BAR_X = 420
BAR_H = 26
LABEL_X = 404          # country names, right-anchored
NOTE_X = 1500          # notes and processing, right-anchored

# #9C8B76 measures 3.08:1 against the #FAF7F0 paper; #D8D2C6 was 1.41:1 and
# #A99885 was 2.61:1, both below the 3:1 floor for non-text contrast.
COLORS = {
    "ireland": "#148708",
    "pale": "#9C8B76",
    "dark": "#5D5E63",
    "ink": "#0B0C0E",
    "muted": "#5D5E63",
    "faint": "#8B8C8F",
    "hairline": "#D8D2C6",
    "dashed": "#333333",
}

CHART_TITLE_Y = 200
LEGEND_Y = 228
AXIS_LABEL_Y = 248
AXIS_TOP = 256
ROW_FIRST_BASELINE = 302
ROW_PITCH = 84
FOOTNOTE_Y = 700
FOOTNOTE_PITCH = 24

CONTENT_LEFT = 88

SOURCES = "Naturalisation law: IE INCA 1956 · DE StAG · FR Code civil 21-18 · UK Imm. Rules · AT StbG"

LEGEND = ("Pale: years discarded. Solid: years that count. Green: Ireland. "
          "Dashed: alternative route, with its change in years (* = 2026 proposal).")

PATHWAYS = {
    "phd": {
        "subtitle": "PhD researchers",
        "csv": "phd.csv",
        "chart_title": "PhD RESEARCHERS: TIME TO CITIZENSHIP",
        "footnotes": [
            "Ireland strikes doctoral years from the reckonable count; the UK lets them count for residence but not for settlement.",
            "*General Scheme of the Irish Nationality and Citizenship (Amendment) Bill 2026, approved for drafting 9 September 2026. Not enacted.",
        ],
    },
    "workers": {
        "subtitle": "Skilled workers",
        "csv": "workers.csv",
        "chart_title": "SKILLED WORKERS: TIME TO CITIZENSHIP",
        "footnotes": [
            "*General Scheme of the Irish Nationality and Citizenship (Amendment) Bill 2026, approved for drafting 9 September 2026. Not enacted.",
        ],
    },
    "masters": {
        "subtitle": "Master’s graduates",
        "csv": "masters.csv",
        "chart_title": "MASTER’S GRADUATES: TIME TO CITIZENSHIP",
        "footnotes": [
            "A taught master’s is one year on Stamp 2 and is discarded; the Stamp 1G year that follows counts.",
            "*General Scheme of the Irish Nationality and Citizenship (Amendment) Bill 2026, approved for drafting 9 September 2026. Not enacted.",
        ],
    },
    "spouses": {
        "subtitle": "Spouses of citizens",
        "csv": "spouses.csv",
        "chart_title": "SPOUSES OF CITIZENS: TIME TO CITIZENSHIP",
        "footnotes": [
            "The 2026 Bill covers ‘most applicants’; its effect on the spousal route is not specified in the General Scheme announcement.",
        ],
    },
}


def load_csv(filepath):
    with open(filepath, newline="") as f:
        return list(csv.DictReader(f))


def as_int(value, default=0):
    value = (value or "").strip()
    return int(value) if value else default


def esc(text):
    return (text or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def generate_chart_svg(data, config):
    """Render one pathway. Identical geometry rules for all four charts."""
    svg = []

    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y}" font-size="22" font-weight="700" '
               f'fill="{COLORS["muted"]}" letter-spacing="1.4">{esc(config["chart_title"])}</text>')
    svg.append(f'<text x="{CONTENT_LEFT}" y="{LEGEND_Y}" font-size="18" '
               f'fill="{COLORS["muted"]}">{esc(LEGEND)}</text>')

    rows = []
    for row in data:
        discarded = as_int(row.get("Discarded_Years"))
        requirement = as_int(row.get("Requirement_Years"))
        rows.append({
            "country": row["Country"],
            "discarded": discarded,
            "requirement": requirement,
            "total": discarded + requirement,
            "expedited": as_int(row.get("Expedited_Years"), 0),
            "condition": (row.get("Expedited_Condition") or "").strip(),
            "notes": (row.get("Notes") or "").strip(),
            "proc_min": (row.get("Processing_Min_Months") or "").strip(),
            "proc_max": (row.get("Processing_Max_Months") or "").strip(),
        })

    last_bar_bottom = ROW_FIRST_BASELINE + (len(rows) - 1) * ROW_PITCH - 22 + BAR_H + 18

    # Labelled reference lines. An unlabelled gridline tells the reader nothing.
    widest = max(max(r["total"] for r in rows), max(r["expedited"] for r in rows))
    for year_mark in (5, 10):
        if year_mark > widest:
            continue
        x_pos = BAR_X + year_mark * PIXELS_PER_YEAR
        svg.append(f'<line x1="{x_pos}" y1="{AXIS_TOP}" x2="{x_pos}" y2="{last_bar_bottom + 4}" '
                   f'stroke="{COLORS["hairline"]}" stroke-width="1" stroke-dasharray="2,3"/>')
        svg.append(f'<text x="{x_pos}" y="{AXIS_LABEL_Y}" font-size="14" fill="{COLORS["faint"]}" '
                   f'text-anchor="middle">{year_mark} years</text>')

    for index, r in enumerate(rows):
        baseline = ROW_FIRST_BASELINE + index * ROW_PITCH
        bar_top = baseline - 22
        is_ireland = r["country"] == "Ireland"

        name_color = COLORS["ireland"] if is_ireland else COLORS["ink"]
        svg.append(f'<text x="{LABEL_X}" y="{baseline}" font-size="24" font-weight="700" '
                   f'fill="{name_color}" text-anchor="end">{esc(r["country"])}</text>')

        solid_color = COLORS["ireland"] if is_ireland else COLORS["dark"]
        pale_width = r["discarded"] * PIXELS_PER_YEAR
        solid_width = r["requirement"] * PIXELS_PER_YEAR

        if pale_width:
            svg.append(f'<rect x="{BAR_X}" y="{bar_top}" width="{pale_width}" height="{BAR_H}" '
                       f'rx="2" fill="{COLORS["pale"]}"/>')

        # Green and grey sit only 1.40:1 apart in luminance, so Ireland carries an
        # outline as a redundant cue that survives greyscale printing.
        outline = f' stroke="{COLORS["ink"]}" stroke-width="1.5"' if is_ireland else ""
        svg.append(f'<rect x="{BAR_X + pale_width}" y="{bar_top}" width="{solid_width}" '
                   f'height="{BAR_H}" rx="2" fill="{solid_color}"{outline}/>')

        total_x = BAR_X + r["total"] * PIXELS_PER_YEAR + 20
        svg.append(f'<text x="{total_x}" y="{baseline}" font-size="24" font-weight="700" '
                   f'fill="{solid_color}">{r["total"]}y</text>')

        if r["expedited"]:
            # The alternative gets its own track below the bar. Overlaid on the bar it
            # read as a segment of the standard route, and it swallowed the total label.
            alt_w = r["expedited"] * PIXELS_PER_YEAR
            alt_top = bar_top + BAR_H + 5
            svg.append(f'<rect x="{BAR_X}" y="{alt_top}" width="{alt_w}" height="12" '
                       f'fill="none" stroke="{COLORS["dashed"]}" stroke-width="1.25" '
                       f'stroke-dasharray="5,3"/>')
            # Signed delta rather than colour. Red/green would collide with green
            # meaning Ireland, and is the worst pair for colour blindness; the
            # delta survives greyscale and says the same thing faster.
            star = "*" if r["expedited"] > r["total"] else ""
            delta = r["expedited"] - r["total"]
            sign = "+" if delta > 0 else "\u2212"
            label = f'{r["expedited"]}y{star} ({sign}{abs(delta)})'
            svg.append(f'<text x="{BAR_X + alt_w + 10}" y="{alt_top + 11}" font-size="16" '
                       f'font-weight="700" fill="{COLORS["dashed"]}">{label}</text>')
            if r["condition"]:
                off = 10 + 0.55 * 16 * len(label) + 10
                cond_x = BAR_X + alt_w + off
                cond_right = cond_x + 0.5 * 14 * len(r["condition"])
                if r["proc_min"] and r["proc_max"]:
                    proc = f'Processing: {r["proc_min"]}\u2013{r["proc_max"]} months'
                    if cond_right > NOTE_X - 0.5 * 16 * len(proc) - 20:
                        print(f'  ! {r["country"]}: condition "{r["condition"]}" runs into '
                              f'the processing column; shorten it in the CSV')
                svg.append(f'<text x="{cond_x:.0f}" y="{alt_top + 11}" font-size="14" '
                           f'fill="{COLORS["faint"]}">{esc(r["condition"])}</text>')

        if r["notes"]:
            svg.append(f'<text x="{NOTE_X}" y="{baseline - 1}" font-size="20" '
                       f'fill="{COLORS["muted"]}" text-anchor="end">{esc(r["notes"])}</text>')

        if r["proc_min"] and r["proc_max"]:
            svg.append(f'<text x="{NOTE_X}" y="{baseline + 18}" font-size="16" '
                       f'fill="{COLORS["faint"]}" text-anchor="end">'
                       f'Processing: {esc(r["proc_min"])}–{esc(r["proc_max"])} months</text>')

    for i, note in enumerate(config["footnotes"]):
        svg.append(f'<text x="{CONTENT_LEFT}" y="{FOOTNOTE_Y + i * FOOTNOTE_PITCH}" font-size="17" '
                   f'fill="{COLORS["faint"]}">{esc(note)}</text>')

    return "\n".join(svg)


def generate_frame_and_chart(pathway_key, config):
    print(f"\n{'=' * 60}\nGenerating: {pathway_key}\n{'=' * 60}")

    data = load_csv(DATA_DIR / config["csv"])
    print(f"✓ Loaded CSV: {config['csv']}")

    frame_svg_path = TEMP_DIR / f"{pathway_key}_frame.svg"
    result = subprocess.run([
        "python3", str(POST_VISUALS_DIR / "scripts" / "frame.py"),
        "--canvas", "hero",
        "--kicker", "WHICH DOOR?",
        "--subtitle", config["subtitle"],
        "--sources", SOURCES,
        "--out", str(frame_svg_path),
    ], capture_output=True, text=True)

    if result.returncode != 0:
        print(f"✗ Frame generation failed: {result.stderr}")
        return False

    chart_svg = generate_chart_svg(data, config)
    framed = frame_svg_path.read_text().replace("<!-- CONTENT -->", chart_svg)
    # The frame's stacks are neither of the site's faces, and an SVG in an <img>
    # cannot pull the page's webfonts. Carry both faces in the file.
    framed = embed_site_faces(framed)

    out = OUTPUT_DIR / f"{pathway_key}_framed.svg"
    out.write_text(framed)
    print(f"✓ Generated framed SVG: {out.name}")

    totals = ", ".join(f"{r['Country']} {as_int(r.get('Discarded_Years')) + as_int(r.get('Requirement_Years'))}y"
                       for r in data)
    print(f"  totals: {totals}")
    return True


def main():
    TEMP_DIR.mkdir(exist_ok=True)
    OUTPUT_DIR.mkdir(exist_ok=True)

    if not POST_VISUALS_DIR.exists():
        print("\n✗ Post-visuals not found")
        sys.exit(1)

    ok = sum(generate_frame_and_chart(k, v) for k, v in PATHWAYS.items())
    print(f"\n{'=' * 60}\nSUMMARY: {ok}/{len(PATHWAYS)} completed\n{'=' * 60}\n")
    return 0 if ok == len(PATHWAYS) else 1


if __name__ == "__main__":
    sys.exit(main())
