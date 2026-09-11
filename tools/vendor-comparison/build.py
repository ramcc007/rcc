import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

prs = new_deck()
s = blank(prs)
kicker_header(s, "COMPETITIVE POSITION",
              "How Komprise Compares to the Broader Vendor Set",
              "Organic search footprint and domain authority across the vendor set the board asked about.")

COLS = [0.75, 3.80, 5.55, 7.20, 8.95, 11.15]
WID  = [2.95, 1.70, 1.60, 1.70, 2.15, 1.40]
HDR  = ["Company", "Ranking Keywords", "Pages Indexed", "Monthly Traffic",
        "Keywords in AI Answers", "Authority"]

rect(s, 0.55, 1.62, 12.23, 0.52, PURPLE)
for i, (h, x, w) in enumerate(zip(HDR, COLS, WID)):
    al = PP_ALIGN.LEFT if i == 0 else PP_ALIGN.CENTER
    txt(s, x, 1.72, w, 0.36, [(h, 9.5, True, WHITE, 0, 1.08)], align=al)

ROWS = [("Komprise",        "6,139",  "1,610",   "4,600 *", "5,464",  "43", True),
        ("NetApp",          "39,118", "621,000", "75,742", "32,473", "51", False),
        ("Everpure (Pure)", "20,134", "32,900",  "42,990", "17,968", "51", False),
        ("Cohesity",        "13,381", "310,000", "36,773", "11,136", "43", False),
        ("Commvault",       "18,472", "172,000", "33,189", "14,773", "47", False)]

y = 2.22
for idx, (name, kw, pg, tr, aio, asc, mine) in enumerate(ROWS):
    bg = PALE if mine else (OFFWHITE if idx % 2 else WHITE)
    rect(s, 0.55, y, 12.23, 0.46, bg, BORDER)
    if mine:
        rect(s, 0.55, y, 0.06, 0.46, DGREEN)
    txt(s, COLS[0], y+0.12, WID[0], 0.26,
        [(name, 11.5 if mine else 11, mine, PURPLE if mine else INK)])
    for val, x, w in ((kw, COLS[1], WID[1]), (pg, COLS[2], WID[2]),
                      (tr, COLS[3], WID[3]), (aio, COLS[4], WID[4]),
                      (asc, COLS[5], WID[5])):
        txt(s, x, y+0.12, w, 0.26,
            [(val, 11.5 if mine else 11, mine, PURPLE if mine else GRAY)],
            align=PP_ALIGN.CENTER)
    y += 0.50

txt(s, 0.61, 4.80, 12.1, 0.50,
    [("* Komprise is measured clicks from Google Search Console, twelve-month average to September 2026. The other four are Semrush estimates, which model clicks from ranking position and typically run several times higher. Sources: Semrush 15 August 2026, Google Search Console, Google site: queries September 2026. Page counts are Google estimates and include subdomains.",
      9, False, LGRAY, 0, 1.2)])

rect(s, 0.55, 5.38, 6.02, 1.26, OFFWHITE, BORDER); rect(s, 0.55, 5.38, 0.06, 1.26, DGREEN)
txt(s, 0.83, 5.54, 5.55, 1.04,
    [("Smallest footprint, best conversion", 12.5, True, PURPLE, 5),
     ("Komprise ranks for 6,139 keywords from around 1,610 indexed pages. NetApp needs roughly "
      "621,000 pages to rank for 39,118. Far more of what we publish is working. Our "
      "authority matches Cohesity on a quarter of the referring domains.",
      10.5, False, GRAY, 0, 1.24)])

rect(s, 6.76, 5.38, 6.02, 1.26, OFFWHITE, BORDER); rect(s, 6.76, 5.38, 0.06, 1.26, PURPLE)
txt(s, 7.04, 5.54, 5.55, 1.04,
    [("On their own product terms, we are the answer", 12.5, True, PURPLE, 5),
     ("Google's AI answer for “fabricpool” names Komprise first. NetApp's own pages do not "
      "appear in it at all. The same holds for “dell powerscale”, “dell emc storage” and "
      "“netapp bluexp”.", 10.5, False, GRAY, 0, 1.24)])

rect(s, 0.55, 6.74, 12.23, 0.40, PALE); rect(s, 0.55, 6.74, 0.06, 0.40, PURPLE)
txt(s, 0.83, 6.83, 11.8, 0.26,
    [("Worth watching: Everpure, Commvault and Cohesity all grew traffic faster than us since May. The category is in a land grab.",
      10.5, True, PURPLE)])

footer(s, 1)
out = "/home/user/rcc/Komprise_Vendor_Comparison_Sep2026.pptx"
prs.save(out); print("saved", out)
