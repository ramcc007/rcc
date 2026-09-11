import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

prs = new_deck()
s = blank(prs)
kicker_header(s, "COMPETITIVE POSITION",
              "How Komprise Compares to the Broader Vendor Set",
              "Semrush, US database, August 2026. Sorted by visits earned per ranking keyword.")

COLS = [0.75, 4.05, 5.85, 7.90, 9.88, 11.40]
WID  = [3.20, 1.75, 2.00, 1.95, 1.50, 1.30]
HDR  = ["Company", "Ranking Keywords", "Monthly Traffic",
        "Keywords in AI Answers", "Visits per Keyword", "Authority"]

rect(s, 0.55, 1.62, 12.23, 0.52, PURPLE)
for i,(h,x,w) in enumerate(zip(HDR, COLS, WID)):
    al = PP_ALIGN.LEFT if i == 0 else PP_ALIGN.CENTER
    txt(s, x, 1.72, w, 0.36, [(h, 9.5, True, WHITE, 0, 1.08)], align=al)

ROWS = [("Komprise",            "6,139",  "25,126", "5,464",  "4.1", "43", True),
        ("Cohesity",            "13,381", "36,773", "11,136", "2.7", "43", False),
        ("Everpure (Pure)",     "20,134", "42,990", "17,968", "2.1", "51", False),
        ("NetApp",              "39,118", "75,742", "32,473", "1.9", "51", False),
        ("Commvault",           "18,472", "33,189", "14,773", "1.8", "47", False)]

y = 2.22
for idx,(name, kw, tr, aio, vpk, asc, mine) in enumerate(ROWS):
    bg = PALE if mine else (OFFWHITE if idx % 2 else WHITE)
    rect(s, 0.55, y, 12.23, 0.46, bg, BORDER)
    if mine:
        rect(s, 0.55, y, 0.06, 0.46, DGREEN)
    txt(s, COLS[0], y+0.12, WID[0], 0.26,
        [(name, 11.5 if mine else 11, mine, PURPLE if mine else INK)])
    for val, x, w, hero in ((kw, COLS[1], WID[1], False), (tr, COLS[2], WID[2], False),
                            (aio, COLS[3], WID[3], False), (vpk, COLS[4], WID[4], True),
                            (asc, COLS[5], WID[5], False)):
        col = DGREEN if (mine and hero) else (PURPLE if mine else GRAY)
        txt(s, x, y+0.12, w, 0.26, [(val, 11.5 if mine else 11, mine, col)], align=PP_ALIGN.CENTER)
    y += 0.50

# ── two read-outs
rect(s, 0.55, 4.92, 6.02, 1.62, OFFWHITE, BORDER); rect(s, 0.55, 4.92, 0.06, 1.62, DGREEN)
txt(s, 0.83, 5.12, 5.55, 1.30,
    [("Smallest footprint, best conversion", 12.5, True, PURPLE, 6),
     ("Komprise ranks for a sixth of NetApp's keywords and holds a third of its organic traffic. "
      "Every ranking keyword works harder here than at any vendor in the set, and the authority score "
      "matches Cohesity on a quarter of the referring domains.", 11, False, GRAY, 0, 1.26)])

rect(s, 6.76, 4.92, 6.02, 1.62, OFFWHITE, BORDER); rect(s, 6.76, 4.92, 0.06, 1.62, PURPLE)
txt(s, 7.04, 5.12, 5.55, 1.30,
    [("On their own product terms, we are the answer", 12.5, True, PURPLE, 6),
     ("Google's AI answer for “fabricpool” names Komprise first. NetApp's own pages do not appear in it "
      "at all. The same holds for “dell powerscale”, “dell emc storage” and “netapp bluexp”.", 11, False, GRAY, 0, 1.26)])

rect(s, 0.55, 6.66, 12.23, 0.48, PALE); rect(s, 0.55, 6.66, 0.06, 0.48, PURPLE)
txt(s, 0.83, 6.78, 11.8, 0.30,
    [("Worth watching: Everpure, Commvault and Cohesity all grew traffic faster than us since May. The category is in a land grab.", 11, True, PURPLE)])

footer(s, 1)
out = "/home/user/rcc/Komprise_Vendor_Comparison_Sep2026.pptx"
prs.save(out); print("saved", out)
