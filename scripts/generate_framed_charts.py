#!/usr/bin/env python3
"""Generate publication-ready citizenship charts with post-visuals chrome.

Charts maintain internal visual hierarchy (title + content) while frame
provides branding chrome. Both layers work together for coherent design.
"""

import csv
import subprocess
import sys
from pathlib import Path

# Project paths
SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPTS_DIR.parent
DATA_DIR = PROJECT_DIR / "data" / "citizenship"
OUTPUT_DIR = PROJECT_DIR / "src" / "content" / "posts" / "ireland-citizenship"
TEMP_DIR = Path("/tmp/citizenship-charts")
POST_VISUALS_DIR = Path.home() / ".claude" / "skills" / "synced" / "57179235-8abd-44f1-933a-6ad93664feb8_da48fdcd-c46a-415c-ac7b-9f1904cf05f6" / "post-visuals"

# Chart generation constants
PIXELS_PER_YEAR = 56
COLORS = {
    "ireland": "#148708",
    "grey_light": "#D8D2C6",
    "grey_dark": "#5D5E63",
    "text_dark": "#0B0C0E",
    "text_light": "#5D5E63",
    "text_muted": "#8B8C8F",
}

# Frame content bounds
CONTENT_LEFT = 88
CONTENT_RIGHT = 1512
CONTENT_TOP = 184.0

# Chart spacing following post-visuals aesthetics
CHART_TITLE_Y = 200
CHART_TOP = 250  # Increased gap below title for visual breathing room
CHART_ROW_PITCH = 84

# Pathway configurations
PATHWAYS = {
    "phd": {
        "kicker": "WHICH DOOR?",
        "subtitle": "PhD researchers: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "phd.csv",
        "chart_title": "PhD STUDENTS: TIME TO CITIZENSHIP"
    },
    "workers": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Skilled workers: time from arrival to eligibility",
        "sources": "DFA, BAMF, UK Home Office, BMI (2026)",
        "csv": "workers.csv",
        "chart_title": "SKILLED WORKERS: TIME TO CITIZENSHIP"
    },
    "masters": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Master's graduates: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "masters.csv",
        "chart_title": "MASTER'S GRADUATES: TIME TO CITIZENSHIP"
    },
    "spouses": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Spouses of citizens: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "spouses.csv",
        "chart_title": "SPOUSES OF CITIZENS: TIME TO CITIZENSHIP"
    }
}

def load_csv(filepath):
    """Load citizenship data from CSV."""
    data = []
    with open(filepath) as f:
        import csv as csv_module
        reader = csv_module.DictReader(f)
        for row in reader:
            data.append(row)
    return data

def generate_phd_chart_svg(data, chart_title):
    """Generate PhD timeline SVG with internal title and chart content."""
    svg = []

    # Internal chart title (visual hierarchy)
    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y}" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">{chart_title}</text>')

    # Color key
    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y + 28}" font-size="16" fill="#5D5E63">Green: counted toward citizenship. Pale: not counted. Dashed line: processing time after application.</text>')

    y_pos = CHART_TOP + 30
    for row in data:
        country = row["Country"]
        phd_years = int(row["PhD_Years"])
        requirement_years = int(row["Requirement_Years"])
        phd_counts = row.get("PhD_Counts", "false").lower()
        notes = row.get("Notes", "")
        proc_min = row.get("Processing_Min_Months", "")
        proc_max = row.get("Processing_Max_Months", "")

        country_color = "#148708" if country == "Ireland" else "#0B0C0E"
        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="{country_color}" text-anchor="end">{country}</text>')

        phd_width = phd_years * PIXELS_PER_YEAR
        req_width = requirement_years * PIXELS_PER_YEAR
        color = "#148708" if country == "Ireland" else "#5D5E63"

        # PhD bar color based on whether years count
        if phd_counts == "true":
            phd_bar_color = color  # Green/dark if counted
        elif phd_counts == "partial":
            # For UK: first 2 years discarded, last 2 count
            partial_years = phd_years // 2
            partial_width = partial_years * PIXELS_PER_YEAR
            svg.append(f'<rect x="420" y="{y_pos - 22}" width="{partial_width}" height="26" rx="2" fill="#D8D2C6"/>')
            svg.append(f'<rect x="{420 + partial_width}" y="{y_pos - 22}" width="{partial_width}" height="26" rx="2" fill="{color}"/>')
            phd_width = phd_width  # Keep full width for offset calculation
            svg.append(f'<rect x="{420 + phd_width}" y="{y_pos - 22}" width="{req_width}" height="26" rx="2" fill="{color}"/>')
            total = phd_years + requirement_years
            svg.append(f'<text x="{420 + phd_width + req_width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="{color}">{total}y</text>')
            svg.append(f'<text x="1500" text-anchor="end" y="{y_pos - 1}" font-size="18" fill="#5D5E63">{notes}</text>')
            if proc_min and proc_max:
                svg.append(f'<text x="1500" text-anchor="end" y="{y_pos + 17}" font-size="14" fill="#8B8C8F">Processing: {proc_min}–{proc_max} months</text>')
            y_pos += CHART_ROW_PITCH
            continue
        else:
            phd_bar_color = "#D8D2C6"  # Pale if not counted

        svg.append(f'<rect x="420" y="{y_pos - 22}" width="{phd_width}" height="26" rx="2" fill="{phd_bar_color}"/>')
        svg.append(f'<rect x="{420 + phd_width}" y="{y_pos - 22}" width="{req_width}" height="26" rx="2" fill="{color}"/>')

        total = phd_years + requirement_years
        svg.append(f'<text x="{420 + phd_width + req_width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="{color}">{total}y</text>')
        svg.append(f'<text x="1500" text-anchor="end" y="{y_pos - 1}" font-size="18" fill="#5D5E63">{notes}</text>')

        if proc_min and proc_max:
            svg.append(f'<text x="1500" text-anchor="end" y="{y_pos + 17}" font-size="14" fill="#8B8C8F">Processing: {proc_min}–{proc_max} months</text>')

        y_pos += CHART_ROW_PITCH

    return '\n'.join(svg)

def generate_workers_chart_svg(data, chart_title):
    """Generate workers timeline SVG with internal title."""
    svg = []

    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y}" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">{chart_title}</text>')

    # Color key
    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y + 28}" font-size="16" fill="#5D5E63">Dark: counted toward citizenship. Dashed line: processing time after application.</text>')

    y_pos = CHART_TOP + 30
    for row in data:
        country = row["Country"]
        requirement = int(row["Requirement_Years"])
        width = requirement * PIXELS_PER_YEAR

        country_color = "#148708" if country == "Ireland" else "#0B0C0E"
        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="{country_color}" text-anchor="end">{country}</text>')
        svg.append(f'<rect x="420" y="{y_pos - 22}" width="{width}" height="26" rx="2" fill="#5D5E63"/>')
        svg.append(f'<text x="{420 + width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="#5D5E63">{requirement}y</text>')

        y_pos += CHART_ROW_PITCH

    return '\n'.join(svg)

def generate_masters_chart_svg(data, chart_title):
    """Generate masters timeline SVG with internal title."""
    svg = []

    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y}" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">{chart_title}</text>')

    # Color key
    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y + 28}" font-size="16" fill="#5D5E63">Dark: counted toward citizenship. Pale: not counted. Dashed line: processing time after application.</text>')

    y_pos = CHART_TOP + 30
    for row in data:
        country = row["Country"]
        master_years = int(row.get("Master_Years", 0)) if row.get("Master_Years") else 0
        requirement = int(row["Requirement_Years"])
        total = master_years + requirement if master_years else requirement

        country_color = "#148708" if country == "Ireland" else "#0B0C0E"
        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="{country_color}" text-anchor="end">{country}</text>')

        if master_years:
            svg.append(f'<rect x="420" y="{y_pos - 22}" width="{master_years * PIXELS_PER_YEAR}" height="26" rx="2" fill="#D8D2C6"/>')
            svg.append(f'<rect x="{420 + master_years * PIXELS_PER_YEAR}" y="{y_pos - 22}" width="{requirement * PIXELS_PER_YEAR}" height="26" rx="2" fill="#5D5E63"/>')
        else:
            svg.append(f'<rect x="420" y="{y_pos - 22}" width="{requirement * PIXELS_PER_YEAR}" height="26" rx="2" fill="#5D5E63"/>')

        svg.append(f'<text x="{420 + total * PIXELS_PER_YEAR + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="#5D5E63">{total}y</text>')
        y_pos += CHART_ROW_PITCH

    return '\n'.join(svg)

def generate_spouses_chart_svg(data, chart_title):
    """Generate spouses timeline SVG with internal title."""
    svg = []

    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y}" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">{chart_title}</text>')

    # Color key
    svg.append(f'<text x="{CONTENT_LEFT}" y="{CHART_TITLE_Y + 28}" font-size="16" fill="#5D5E63">Green: Ireland. Dark: other countries. Dashed line: processing time after application.</text>')

    y_pos = CHART_TOP + 30
    for row in data:
        country = row["Country"]
        requirement = int(row["Requirement_Years"])
        width = requirement * PIXELS_PER_YEAR
        color = "#148708" if country == "Ireland" else "#5D5E63"

        country_text_color = "#148708" if country == "Ireland" else "#0B0C0E"
        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="{country_text_color}" text-anchor="end">{country}</text>')
        svg.append(f'<rect x="420" y="{y_pos - 22}" width="{width}" height="26" rx="2" fill="{color}"/>')
        svg.append(f'<text x="{420 + width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="{color}">{requirement}y</text>')

        if row.get("Notes"):
            svg.append(f'<text x="1160" y="{y_pos - 1}" font-size="18" fill="#5D5E63">{row["Notes"]}</text>')

        y_pos += CHART_ROW_PITCH

    return '\n'.join(svg)

def generate_frame_and_chart(pathway_key, pathway_config):
    """Generate framed chart with internal visual hierarchy."""
    print(f"\n{'='*60}")
    print(f"Generating: {pathway_key}")
    print(f"{'='*60}")

    csv_path = DATA_DIR / pathway_config["csv"]
    data = load_csv(csv_path)
    print(f"✓ Loaded CSV: {csv_path.name}")

    frame_svg_path = TEMP_DIR / f"{pathway_key}_frame.svg"
    frame_cmd = [
        "python3",
        str(POST_VISUALS_DIR / "scripts" / "frame.py"),
        "--canvas", "hero",
        "--kicker", pathway_config["kicker"],
        "--subtitle", pathway_config["subtitle"],
        "--sources", pathway_config["sources"],
        "--out", str(frame_svg_path)
    ]

    result = subprocess.run(frame_cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"✗ Frame generation failed: {result.stderr}")
        return False

    print(f"✓ Frame generated with post-visuals chrome")

    if pathway_key == "phd":
        chart_svg = generate_phd_chart_svg(data, pathway_config["chart_title"])
    elif pathway_key == "workers":
        chart_svg = generate_workers_chart_svg(data, pathway_config["chart_title"])
    elif pathway_key == "masters":
        chart_svg = generate_masters_chart_svg(data, pathway_config["chart_title"])
    elif pathway_key == "spouses":
        chart_svg = generate_spouses_chart_svg(data, pathway_config["chart_title"])

    print(f"✓ Generated chart with internal title + content")

    frame_svg_content = frame_svg_path.read_text()
    framed_svg = frame_svg_content.replace("<!-- CONTENT -->", chart_svg)

    framed_svg_output = OUTPUT_DIR / f"{pathway_key}_framed.svg"
    framed_svg_output.write_text(framed_svg)
    print(f"✓ Generated framed SVG: {framed_svg_output.name}")

    return True

def main():
    """Generate all framed charts."""
    TEMP_DIR.mkdir(exist_ok=True)
    OUTPUT_DIR.mkdir(exist_ok=True)

    print("\n" + "="*60)
    print("CITIZENSHIP CHARTS: CSV → INTERNAL TITLE + POST-VISUALS FRAME")
    print("="*60)

    if not POST_VISUALS_DIR.exists():
        print(f"\n✗ Post-visuals not found")
        sys.exit(1)

    print(f"\n✓ Post-visuals found")

    success_count = 0
    for pathway_key, pathway_config in PATHWAYS.items():
        if generate_frame_and_chart(pathway_key, pathway_config):
            success_count += 1

    print(f"\n{'='*60}")
    print(f"SUMMARY: {success_count}/{len(PATHWAYS)} completed")
    print(f"{'='*60}\n")

    return 0 if success_count == len(PATHWAYS) else 1

if __name__ == "__main__":
    sys.exit(main())
