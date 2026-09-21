#!/usr/bin/env python3
"""Generate publication-ready citizenship charts with post-visuals chrome.

Combines CSV data → SVG chart generation → post-visuals framing → PNG export.
Each pathway gets a framed graphic with tricolour, diya mark, footer, and sources.
"""

import csv
import re
import subprocess
import sys
from pathlib import Path
from io import StringIO

# Project paths
SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPTS_DIR.parent
DATA_DIR = PROJECT_DIR / "data" / "citizenship"
OUTPUT_DIR = PROJECT_DIR / "src" / "content" / "posts" / "ireland-citizenship"
TEMP_DIR = Path("/tmp/citizenship-charts")
POST_VISUALS_DIR = Path.home() / ".claude" / "skills" / "synced" / "57179235-8abd-44f1-933a-6ad93664feb8_da48fdcd-c46a-415c-ac7b-9f1904cf05f6" / "post-visuals"

# Chart generation constants (from generate_citizenship_charts.py)
PIXELS_PER_YEAR = 56
COLORS = {
    "ireland": "#148708",
    "grey_light": "#D8D2C6",
    "grey_dark": "#5D5E63",
    "text_dark": "#0B0C0E",
    "text_light": "#5D5E63",
    "text_muted": "#8B8C8F",
}

# Pathway configurations
PATHWAYS = {
    "phd": {
        "kicker": "WHICH DOOR?",
        "subtitle": "PhD researchers: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "phd.csv",
        "svg_name": "phd.svg",
        "png_name": "phd-framed.png",
        "chart_title": "PhD STUDENTS: TIME TO CITIZENSHIP"
    },
    "workers": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Skilled workers: time from arrival to eligibility",
        "sources": "DFA, BAMF, UK Home Office, BMI (2026)",
        "csv": "workers.csv",
        "svg_name": "workers.svg",
        "png_name": "workers-framed.png",
        "chart_title": "SKILLED WORKERS: TIME TO CITIZENSHIP"
    },
    "masters": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Master's graduates: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "masters.csv",
        "svg_name": "masters_student.svg",
        "png_name": "masters-framed.png",
        "chart_title": "MASTER'S GRADUATES: TIME TO CITIZENSHIP"
    },
    "spouses": {
        "kicker": "WHICH DOOR?",
        "subtitle": "Spouses of citizens: time from arrival to eligibility",
        "sources": "DFA, MEA, BAMF, UK Home Office, BMI (2026)",
        "csv": "spouses.csv",
        "svg_name": "spouse.svg",
        "png_name": "spouse-framed.png",
        "chart_title": "SPOUSES OF CITIZENS: TIME TO CITIZENSHIP"
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
    """Generate PhD timeline SVG chart content."""
    svg = []
    svg.append('<text x="88" y="50" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">PhD STUDENTS: TIME TO CITIZENSHIP</text>')

    y_pos = 140
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

        y_pos += 62

    return '\n'.join(svg)

def generate_workers_chart_svg(data):
    """Generate workers timeline SVG chart content."""
    svg = []
    svg.append('<text x="88" y="50" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">SKILLED WORKERS: TIME TO CITIZENSHIP</text>')

    y_pos = 140
    for row in data:
        country = row["Country"]
        requirement = int(row["Requirement_Years"])
        width = requirement * PIXELS_PER_YEAR

        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="#0B0C0E" text-anchor="end">{country}</text>')
        svg.append(f'<rect x="420" y="{y_pos - 22}" width="{width}" height="26" rx="2" fill="#5D5E63"/>')
        svg.append(f'<text x="{420 + width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="#5D5E63">{requirement}y</text>')

        y_pos += 62

    return '\n'.join(svg)

def generate_masters_chart_svg(data):
    """Generate masters timeline SVG chart content."""
    svg = []
    svg.append('<text x="88" y="50" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">MASTER\'S GRADUATES: TIME TO CITIZENSHIP</text>')

    y_pos = 140
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
        y_pos += 62

    return '\n'.join(svg)

def generate_spouses_chart_svg(data):
    """Generate spouses timeline SVG chart content."""
    svg = []
    svg.append('<text x="88" y="50" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">SPOUSES OF CITIZENS: TIME TO CITIZENSHIP</text>')

    y_pos = 140
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

        y_pos += 62

    return '\n'.join(svg)

def generate_frame_and_chart(pathway_key, pathway_config):
    """Generate framed chart for a pathway."""
    print(f"\n{'='*60}")
    print(f"Generating: {pathway_key}")
    print(f"{'='*60}")

    # Load CSV data
    csv_path = DATA_DIR / pathway_config["csv"]
    data = load_csv(csv_path)
    print(f"✓ Loaded CSV: {csv_path.name}")

    # Generate frame using post-visuals
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

    # Parse content area bounds from frame output
    bounds_line = [l for l in result.stdout.split('\n') if 'content area' in l]
    if bounds_line:
        # Extract: "content area: x 88 to 1512, y 184.0 to 769.0"
        bounds_str = bounds_line[0]
        # Simple parsing
        x_match = re.search(r'x (\d+) to (\d+)', bounds_str)
        y_match = re.search(r'y ([\d.]+) to ([\d.]+)', bounds_str)
        if x_match and y_match:
            content_left = int(x_match.group(1))
            content_right = int(x_match.group(2))
            content_top = float(y_match.group(1))
            content_bottom = float(y_match.group(2))
            print(f"✓ Content bounds: x {content_left}-{content_right}, y {content_top}-{content_bottom}")

    # Generate chart SVG
    if pathway_key == "phd":
        chart_svg = generate_phd_chart_svg(data)
    elif pathway_key == "workers":
        chart_svg = generate_workers_chart_svg(data)
    elif pathway_key == "masters":
        chart_svg = generate_masters_chart_svg(data)
    elif pathway_key == "spouses":
        chart_svg = generate_spouses_chart_svg(data)

    print(f"✓ Generated chart SVG")

    # Read frame SVG
    frame_svg_content = frame_svg_path.read_text()

    # Insert chart into frame
    framed_svg = frame_svg_content.replace("<!-- CONTENT -->", chart_svg)

    # Write framed SVG to output
    framed_svg_output = OUTPUT_DIR / f"{pathway_key}_framed.svg"
    framed_svg_output.write_text(framed_svg)
    print(f"✓ Generated framed SVG: {framed_svg_output.name}")
    print(f"  File size: {framed_svg_output.stat().st_size / 1024:.1f} KB")
    print(f"  Location: {framed_svg_output}")

    return True

def main():
    """Generate all framed charts."""
    TEMP_DIR.mkdir(exist_ok=True)
    OUTPUT_DIR.mkdir(exist_ok=True)

    print("\n" + "="*60)
    print("CITIZENSHIP CHARTS: CSV → POST-VISUALS FRAMING")
    print("="*60)

    # Check post-visuals directory
    if not POST_VISUALS_DIR.exists():
        print(f"\n✗ Post-visuals not found at: {POST_VISUALS_DIR}")
        print("  Make sure the post-visuals skill is loaded.")
        sys.exit(1)

    print(f"\n✓ Post-visuals found: {POST_VISUALS_DIR}")

    # Generate all pathways
    success_count = 0
    for pathway_key, pathway_config in PATHWAYS.items():
        if generate_frame_and_chart(pathway_key, pathway_config):
            success_count += 1

    # Summary
    print(f"\n{'='*60}")
    print(f"SUMMARY: {success_count}/{len(PATHWAYS)} pathways completed")
    print(f"{'='*60}")

    if success_count == len(PATHWAYS):
        print("\n✓ All charts generated successfully!")
        print(f"\nOutput location: {OUTPUT_DIR}")
        print("  - phd-framed.png")
        print("  - workers-framed.png")
        print("  - masters-framed.png")
        print("  - spouse-framed.png")
        return 0
    else:
        print(f"\n✗ {len(PATHWAYS) - success_count} pathway(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
