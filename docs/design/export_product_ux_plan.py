#!/usr/bin/env python3
"""
Build ProductUXPlan.pdf from ProductUXPlan.md (Letter, headers/footers, Unicode).

Requires: pip install fpdf2 markdown

On macOS, Arial Unicode is used for full Unicode support. Override with env:
  ARIAL_UNICODE_TTF=/path/to/font.ttf ARIAL_BOLD_TTF=/path/to/bold.ttf
"""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

try:
    import markdown
    from fpdf import FPDF
    from fpdf.enums import TextEmphasis
    from fpdf.fonts import FontFace, TextStyle
except ImportError:
    print("Install dependencies: pip install fpdf2 markdown", file=sys.stderr)
    sys.exit(1)

HERE = Path(__file__).resolve().parent
MD_FILE = HERE / "ProductUXPlan.md"
PDF_FILE = HERE / "ProductUXPlan.pdf"

# macOS system fonts (full Unicode + bold companion)
DEFAULT_UNICODE = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
DEFAULT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        m = re.match(r"^---\n.*?\n---\n", text, re.DOTALL)
        if m:
            return text[m.end() :]
    return text


class PlanPDF(FPDF):
    def header(self) -> None:
        self.set_font("PlanBody", size=9)
        self.set_text_color(102, 102, 102)
        self.cell(0, 6, "Product UX Plan", align="C", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(220, 220, 220)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(2)
        self.set_text_color(0, 0, 0)

    def footer(self) -> None:
        self.set_y(-12)
        self.set_font("PlanBody", size=9)
        self.set_text_color(102, 102, 102)
        self.cell(0, 8, f"Page {self.page_no()} of {{nb}}", align="C")


def main() -> None:
    if not MD_FILE.is_file():
        print(f"Missing {MD_FILE}", file=sys.stderr)
        sys.exit(1)

    uni = os.environ.get("ARIAL_UNICODE_TTF", DEFAULT_UNICODE)
    bold = os.environ.get("ARIAL_BOLD_TTF", DEFAULT_BOLD)
    if not Path(uni).is_file():
        print(
            f"Font not found: {uni}\n"
            "Set ARIAL_UNICODE_TTF to a .ttf with Unicode coverage.",
            file=sys.stderr,
        )
        sys.exit(1)
    if not Path(bold).is_file():
        bold = uni  # fallback: faux bold

    body = strip_frontmatter(MD_FILE.read_text(encoding="utf-8"))
    html = markdown.markdown(
        body,
        extensions=["tables", "nl2br", "sane_lists"],
        extension_configs={"tables": {"use_align_attribute": True}},
    )

    pdf = PlanPDF(format="Letter", unit="mm")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(left=18, top=22, right=18)

    # Register under one family for HTML bold/italic
    pdf.add_font("PlanBody", "", uni)
    pdf.add_font("PlanBody", "B", bold)
    pdf.add_font("PlanBody", "I", uni)
    pdf.add_font("PlanBody", "BI", bold)

    # Only tags in fpdf2 DEFAULT_TAG_STYLES may be customized (no table cells).
    tag_styles: dict[str, TextStyle | FontFace] = {
        "p": TextStyle(font_family="PlanBody", font_size_pt=10),
        "li": TextStyle(font_family="PlanBody", font_size_pt=10, l_margin=5, t_margin=2),
        "ul": TextStyle(font_family="PlanBody", font_size_pt=10, t_margin=2),
        "ol": TextStyle(font_family="PlanBody", font_size_pt=10, t_margin=2),
        "code": FontFace(family="PlanBody", size_pt=9, color=(60, 60, 60)),
        "h1": TextStyle(
            font_family="PlanBody", font_style=TextEmphasis.B, font_size_pt=20
        ),
        "h2": TextStyle(
            font_family="PlanBody", font_style=TextEmphasis.B, font_size_pt=13
        ),
        "h3": TextStyle(
            font_family="PlanBody", font_style=TextEmphasis.B, font_size_pt=11
        ),
        "strong": FontFace(family="PlanBody", emphasis=TextEmphasis.B),
        "em": FontFace(family="PlanBody", emphasis=TextEmphasis.I),
        "a": FontFace(family="PlanBody", color=(0, 80, 160)),
    }

    pdf.add_page()
    pdf.set_font("PlanBody", size=10)
    pdf.write_html(html, tag_styles=tag_styles, table_line_separators=True)
    pdf.output(PDF_FILE)
    print(f"Wrote {PDF_FILE}")


if __name__ == "__main__":
    main()
