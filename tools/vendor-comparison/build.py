import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

prs = new_deck()
s = blank(prs)
kicker_header(s, "COMPETITIVE POSITION",
              "How Komprise Compares to the Broader Vendor Set",
              "Organic search footprint and domain authority across the vendor set the board asked about.")

COLS = [0.75, 4.45, 6.55, 8.65, 10.95]
WID  = [3.60, 2.00, 2.00, 2.20, 1.60]
HDR  = ["Company", "Ranking Keywords", "Monthly Traffic",
        "Keywords in AI Answers", "Authority"]

rect(s, 0.55, 1.62, 12.23, 0.52, PURPLE)
for i, (h, x, w) in enumerate(zip(HDR, COLS, WID)):
    al = PP_ALIGN.LEFT if i == 0 else PP_ALIGN.CENTER
    txt(s, x, 1.72, w, 0.36, [(h, 9.5, True, WHITE, 0, 1.08)], align=al)

ROWS = [("Komprise",        "6,139",  "25,126", "5,464",  "43", True),
        ("NetApp",          "39,118", "75,742", "32,473", "51", False),
        ("Everpure (Pure)", "20,134", "42,990", "17,968", "51", False),
        ("Cohesity",        "13,381", "36,773", "11,136", "43", False),
        ("Commvault",       "18,472", "33,189", "14,773", "47", False)]

y = 2.22
for idx, (name, kw, tr, aio, asc, mine) in enumerate(ROWS):
    bg = PALE if mine else (OFFWHITE if idx % 2 else WHITE)
    rect(s, 0.55, y, 12.23, 0.46, bg, BORDER)
    if mine:
        rect(s, 0.55, y, 0.06, 0.46, DGREEN)
    txt(s, COLS[0], y+0.12, WID[0], 0.26,
        [(name, 11.5 if mine else 11, mine, PURPLE if mine else INK)])
    for val, x, w in ((kw, COLS[1], WID[1]), (tr, COLS[2], WID[2]),
                      (aio, COLS[3], WID[3]), (asc, COLS[4], WID[4])):
        txt(s, x, y+0.12, w, 0.26,
            [(val, 11.5 if mine else 11, mine, PURPLE if mine else GRAY)],
            align=PP_ALIGN.CENTER)
    y += 0.50

txt(s, 0.61, 4.82, 12.1, 0.24,
    [("Source: Semrush, US database, snapshot of 15 August 2026. Authority is Semrush's 0 to 100 measure of overall domain strength.",
      9.5, False, LGRAY)])

rect(s, 0.55, 5.18, 6.02, 1.44, OFFWHITE, BORDER); rect(s, 0.55, 5.18, 0.06, 1.44, DGREEN)
txt(s, 0.83, 5.36, 5.55, 1.16,
    [("Smallest footprint, best conversion", 12.5, True, PURPLE, 5),
     ("Komprise ranks for a sixth of NetApp's keywords and holds a third of its traffic. "
      "Each keyword earns 4.1 visits against 1.9 for NetApp, and our authority matches "
      "Cohesity on a quarter of the referring domains.", 10.5, False, GRAY, 0, 1.24)])

rect(s, 6.76, 5.18, 6.02, 1.44, OFFWHITE, BORDER); rect(s, 6.76, 5.18, 0.06, 1.44, PURPLE)
txt(s, 7.04, 5.36, 5.55, 1.16,
    [("On their own product terms, we are the answer", 12.5, True, PURPLE, 5),
     ("Google's AI answer for “fabricpool” names Komprise first. NetApp's own pages do not "
      "appear in it at all. The same holds for “dell powerscale”, “dell emc storage” and "
      "“netapp bluexp”.", 10.5, False, GRAY, 0, 1.24)])

rect(s, 0.55, 6.72, 12.23, 0.40, PALE); rect(s, 0.55, 6.72, 0.06, 0.40, PURPLE)
txt(s, 0.83, 6.81, 11.8, 0.26,
    [("Worth watching: Everpure, Commvault and Cohesity all grew traffic faster than us since May. The category is in a land grab.",
      10.5, True, PURPLE)])

footer(s, 1)
out = "/home/user/rcc/Komprise_Vendor_Comparison_Sep2026.pptx"
prs.save(out); print("saved", out)
