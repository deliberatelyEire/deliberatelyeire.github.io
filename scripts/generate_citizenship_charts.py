#!/usr/bin/env python3
"""Generate SVG citizenship charts from CSV data."""

import csv
from pathlib import Path

PIXELS_PER_YEAR = 56
COLORS = {
    "ireland": "#148708",
    "grey_light": "#D8D2C6",
    "grey_dark": "#5D5E63",
    "text_dark": "#0B0C0E",
    "text_light": "#5D5E63",
    "text_muted": "#8B8C8F",
}

def load_csv(filepath):
    """Load citizenship data from CSV."""
    data = []
    with open(filepath) as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
    return data

def generate_phd_svg(data, output_path):
    """Generate PhD timeline SVG."""
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="900" viewBox="0 0 1800 900" font-family="Bitstream Charter, Charter, Georgia, Times New Roman, serif">']
    svg.append('<rect width="1600" height="900" fill="#FAF7F0"/>')
    svg.append('<text x="207.0" y="89.0" font-size="27.0" font-weight="700" fill="#0B0C0E" letter-spacing="1.6">WHICH DOOR?</text>')
    svg.append('<text x="207.0" y="123.0" font-size="22.0" fill="#5D5E63">PhD students</text>')
    svg.append('<text x="88" y="206" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">PhD STUDENTS: TIME TO CITIZENSHIP</text>')

    y_pos = 295
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

    svg.append('</svg>')

    with open(output_path, 'w') as f:
        f.write('\n'.join(svg))

def generate_workers_svg(data, output_path):
    """Generate workers timeline SVG."""
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="900" viewBox="0 0 1800 900" font-family="Bitstream Charter, Charter, Georgia, Times New Roman, serif">']
    svg.append('<rect width="1600" height="900" fill="#FAF7F0"/>')
    svg.append('<text x="207.0" y="89.0" font-size="27.0" font-weight="700" fill="#0B0C0E" letter-spacing="1.6">WHICH DOOR?</text>')
    svg.append('<text x="207.0" y="123.0" font-size="22.0" fill="#5D5E63">Skilled workers</text>')
    svg.append('<text x="88" y="206" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">SKILLED WORKERS: TIME TO CITIZENSHIP</text>')

    y_pos = 295
    for row in data:
        country = row["Country"]
        requirement = int(row["Requirement_Years"])
        width = requirement * PIXELS_PER_YEAR

        svg.append(f'<text x="404" y="{y_pos}" font-size="24" font-weight="700" fill="#0B0C0E" text-anchor="end">{country}</text>')
        svg.append(f'<rect x="420" y="{y_pos - 22}" width="{width}" height="26" rx="2" fill="#5D5E63"/>')
        svg.append(f'<text x="{420 + width + 20}" y="{y_pos}" font-size="24" font-weight="700" fill="#5D5E63">{requirement}y</text>')

        y_pos += 62

    svg.append('</svg>')
    with open(output_path, 'w') as f:
        f.write('\n'.join(svg))

def generate_masters_svg(data, output_path):
    """Generate masters timeline SVG."""
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="900" viewBox="0 0 1800 900" font-family="Bitstream Charter, Charter, Georgia, Times New Roman, serif">']
    svg.append('<rect width="1600" height="900" fill="#FAF7F0"/>')
    svg.append('<text x="207.0" y="89.0" font-size="27.0" font-weight="700" fill="#0B0C0E" letter-spacing="1.6">WHICH DOOR?</text>')
    svg.append('<text x="207.0" y="123.0" font-size="22.0" fill="#5D5E63">Master\'s graduates</text>')
    svg.append('<text x="88" y="206" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">MASTER\'S GRADUATES: TIME TO CITIZENSHIP</text>')

    y_pos = 295
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

    svg.append('</svg>')
    with open(output_path, 'w') as f:
        f.write('\n'.join(svg))

def generate_spouses_svg(data, output_path):
    """Generate spouses timeline SVG."""
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" font-family="Bitstream Charter, Charter, Georgia, Times New Roman, serif">']
    svg.append('<rect width="1600" height="900" fill="#FAF7F0"/>')
    svg.append('<text x="207.0" y="89.0" font-size="27.0" font-weight="700" fill="#0B0C0E" letter-spacing="1.6">WHICH DOOR?</text>')
    svg.append('<text x="207.0" y="123.0" font-size="22.0" fill="#5D5E63">Spouses of citizens</text>')
    svg.append('<text x="88" y="206" font-size="22" font-weight="700" fill="#5D5E63" letter-spacing="1.4">SPOUSES OF CITIZENS: TIME TO CITIZENSHIP</text>')

    y_pos = 295
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

    svg.append('</svg>')
    with open(output_path, 'w') as f:
        f.write('\n'.join(svg))

if __name__ == "__main__":
    data_dir = Path(__file__).parent.parent / "data" / "citizenship"
    output_dir = Path(__file__).parent.parent / "src" / "content" / "posts" / "ireland-citizenship"

    phd_data = load_csv(data_dir / "phd.csv")
    generate_phd_svg(phd_data, output_dir / "phd.svg")
    print("✓ Generated phd.svg")

    workers_data = load_csv(data_dir / "workers.csv")
    generate_workers_svg(workers_data, output_dir / "workers.svg")
    print("✓ Generated workers.svg")

    masters_data = load_csv(data_dir / "masters.csv")
    generate_masters_svg(masters_data, output_dir / "masters_student.svg")
    print("✓ Generated masters_student.svg")

    spouses_data = load_csv(data_dir / "spouses.csv")
    generate_spouses_svg(spouses_data, output_dir / "spouse.svg")
    print("✓ Generated spouse.svg")

    print("\nAll charts generated successfully!")
