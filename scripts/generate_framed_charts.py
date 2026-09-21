#!/usr/bin/env python3
"""Generate publication-ready citizenship charts with post-visuals chrome.

Uses post-visuals aesthetic principles: generous spacing, clear typography,
visual hierarchy. Row pitch ~84px follows post-visuals layout guide.
"""

import csv
import re
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

# Frame content bounds (from post-visuals hero canvas)
CONTENT_LEFT = 88
CONTENT_RIGHT = 1512
CONTENT_TOP = 184.0
CONTENT_BOTTOM = 769.0

# Chart spacing following post-visuals aesthetics (row pitch ~84px like layouts guide)
CHART_TOP = 220
CHART_ROW_PITCH = 84

# Pathway configurations
PATHWAYS = {
    "phd": {
        "kicker": "WHICH DOOR?",
        "subtitle": "PhD researchers: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "phd.csv",
    },
    "workers": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Skilled workers: time from arrival to eligibility",
        "sources": "DFA, BAMF, UK Home Office, BMI (2026)",
        "csv": "workers.csv",
    },
    "masters": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Master's graduates: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "masters.csv",
    },
    "spouses": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Spouses of citizens: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "spouses.csv",
    }
}

def load_csv(filepath):
    """Load citizenship data from CSV."""
    data = []
    with open(filepath) as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
    return data

def generate_phd_chart_svg(data):
    """Generate PhD timeline SVG chart content with post-visuals spacing."""
    svg = []
    y_pos = CHART_TOP

    for row in data:
        country = row["Country"]
        phd_years = int(row["PhD_Years"])
        requirement_years = int(row["Requirement_Years"])
        notes = row.get("Notes", "")
        proc_min = row.get("Processing_Min_Months", "")
        proc_max = row.get("Processing_Max_Months", "")

        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="#0B0C0E" text-anchor="end">{country}</text>')

        phd_width = phd_years * PIXELS_PER_YEAR
        req_width = requirement_years * PIXELS_PER_YEAR
        color = "#148708" if country == "Ireland" else "#5D5E63"

        svg.append(f'<rect x="420" y="{y_pos - 22}" width="{phd_width}" height="26" rx="2" fill="#D8D2C6"/>')
        svg.append(f'<rect x="{420 + phd_width}" y="{y_pos - 22}" width="{req_width}" height="26" rx="2" fill="{color}"/>')

        total = phd_years + requirement_years
        svg.append(f'<text x="{420 + phd_width + req_width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="{color}">{total}y</text>')
        svg.append(f'<text x="1280" y="{y_pos - 1}" font-size="18" fill="#5D5E63">{notes}</text>')

        if proc_min and proc_max:
            svg.append(f'<text x="1280" y="{y_pos + 17}" font-size="14" fill="#8B8C8F">Processing: {proc_min}–{proc_max} months</text>')

        y_pos += CHART_ROW_PITCH

    return '\n'.join(svg)

def generate_workers_chart_svg(data):
    """Generate workers timeline SVG chart content."""
    svg = []
    y_pos = CHART_TOP

    for row in data:
        country = row["Country"]
        requirement = int(row["Requirement_Years"])
        width = requirement * PIXELS_PER_YEAR

        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="#0B0C0E" text-anchor="end">{country}</text>')
        svg.append(f'<rect x="420" y="{y_pos - 22}" width="{width}" height="26" rx="2" fill="#5D5E63"/>')
        svg.append(f'<text x="{420 + width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="#5D5E63">{requirement}y</text>')

        y_pos += CHART_ROW_PITCH

    return '\n'.join(svg)

def generate_masters_chart_svg(data):
    """Generate masters timeline SVG chart content."""
    svg = []
    y_pos = CHART_TOP

    for row in data:
        country = row["Country"]
        master_years = int(row.get("Master_Years", 0)) if row.get("Master_Years") else 0
        requirement = int(row["Requirement_Years"])
        total = master_years + requirement if master_years else requirement

        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="#0B0C0E" text-anchor="end">{country}</text>')

        if master_years:
            svg.append(f'<rect x="420" y="{y_pos - 22}" width="{master_years * PIXELS_PER_YEAR}" height="26" rx="2" fill="#D8D2C6"/>')
            svg.append(f'<rect x="{420 + master_years * PIXELS_PER_YEAR}" y="{y_pos - 22}" width="{requirement * PIXELS_PER_YEAR}" height="26" rx="2" fill="#5D5E63"/>')
        else:
            svg.append(f'<rect x="420" y="{y_pos - 22}" width="{requirement * PIXELS_PER_YEAR}" height="26" rx="2" fill="#5D5E63"/>')

        svg.append(f'<text x="{420 + total * PIXELS_PER_YEAR + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="#5D5E63">{total}y</text>')
        y_pos += CHART_ROW_PITCH

    return '\n'.join(svg)

def generate_spouses_chart_svg(data):
    """Generate spouses timeline SVG chart content."""
    svg = []
    y_pos = CHART_TOP

    for row in data:
        country = row["Country"]
        requirement = int(row["Requirement_Years"])
        width = requirement * PIXELS_PER_YEAR
        color = "#148708" if country == "Ireland" else "#5D5E63"

        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="#0B0C0E" text-anchor="end">{country}</text>')
        svg.append(f'<rect x="420" y="{y_pos - 22}" width="{width}" height="26" rx="2" fill="{color}"/>')
        svg.append(f'<text x="{420 + width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="{color}">{requirement}y</text>')

        if row.get("Notes"):
            svg.append(f'<text x="1160" y="{y_pos - 1}" font-size="18" fill="#5D5E63">{row["Notes"]}</text>')

        y_pos += CHART_ROW_PITCH

    return '\n'.join(svg)

def generate_frame_and_chart(pathway_key, pathway_config):
    """Generate framed chart for a pathway."""
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
        chart_svg = generate_phd_chart_svg(data)
    elif pathway_key == "workers":
        chart_svg = generate_workers_chart_svg(data)
    elif pathway_key == "masters":
        chart_svg = generate_masters_chart_svg(data)
    elif pathway_key == "spouses":
        chart_svg = generate_spouses_chart_svg(data)

    print(f"✓ Generated chart (row pitch {CHART_ROW_PITCH}px for spacing)")

    frame_svg_content = frame_svg_path.read_text()
    framed_svg = frame_svg_content.replace("<!-- CONTENT -->", chart_svg)

    framed_svg_output = OUTPUT_DIR / f"{pathway_key}_framed.svg"
    framed_svg_output.write_text(framed_svg)
    print(f"✓ Generated framed SVG: {framed_svg_output.name}")
    print(f"  File size: {framed_svg_output.stat().st_size / 1024:.1f} KB")

    return True

def main():
    """Generate all framed charts."""
    TEMP_DIR.mkdir(exist_ok=True)
    OUTPUT_DIR.mkdir(exist_ok=True)

    print("\n" + "="*60)
    print("CITIZENSHIP CHARTS: CSV → POST-VISUALS FRAMING")
    print(f"Chart spacing: start at y={CHART_TOP}, pitch {CHART_ROW_PITCH}px")
    print("="*60)

    if not POST_VISUALS_DIR.exists():
        print(f"\n✗ Post-visuals not found at: {POST_VISUALS_DIR}")
        sys.exit(1)

    print(f"\n✓ Post-visuals found")

    success_count = 0
    for pathway_key, pathway_config in PATHWAYS.items():
        if generate_frame_and_chart(pathway_key, pathway_config):
            success_count += 1

    print(f"\n{'='*60}")
    print(f"SUMMARY: {success_count}/{len(PATHWAYS)} pathways completed")
    print(f"{'='*60}")

    if success_count == len(PATHWAYS):
        print("\n✓ All charts generated with post-visuals aesthetics!")
        return 0
    else:
        print(f"\n✗ {len(PATHWAYS) - success_count} pathway(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
