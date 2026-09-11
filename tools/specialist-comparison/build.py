import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

prs = new_deck()
s = blank(prs)
kicker_header(s, "COMPETITIVE POSITION",
              "We Lead the Specialist Field on Authority and Footprint",
              "Organic footprint and domain authority across the tracked competitive set.")

COLS = [0.75, 3.70, 5.40, 7.05, 9.20, 11.20]
WID  = [2.85, 1.65, 1.60, 2.10, 1.95, 1.35]
HDR  = ["Domain", "Ranking Keywords", "Monthly Traffic",
        "Keywords in AI Answers", "Referring Domains", "Authority"]

rect(s, 0.55, 1.62, 12.23, 0.52, PURPLE)
for i, (h, x, w) in enumerate(zip(HDR, COLS, WID)):
    al = PP_ALIGN.LEFT if i == 0 else PP_ALIGN.CENTER
    txt(s, x, 1.72, w, 0.36, [(h, 9.5, True, WHITE, 0, 1.08)], align=al)

ROWS = [("komprise.com",        "6,139", "4,600 *", "5,464", "1,944", "43", True),
        ("unstructured.io",     "2,221", "4,397",   "1,789", "2,764", "36", False),
        ("datadynamicsinc.com", "1,421", "1,128",   "1,313", "976",   "30", False),
        ("hammerspace.com",     "853",   "2,508",   "528",   "1,511", "33", False),
        ("atempo.com",          "219",   "472",     "167",   "1,021", "33", False),
        ("datadobi.com",        "115",   "220",     "95",    "755",   "23", False),
        ("diskoverdata.com",    "82",    "413",     "49",    "469",   "25", False)]

y = 2.16
for idx, (name, kw, tr, aio, rd, asc, mine) in enumerate(ROWS):
    bg = PALE if mine else (OFFWHITE if idx % 2 else WHITE)
    rect(s, 0.55, y, 12.23, 0.39, bg, BORDER)
    if mine:
        rect(s, 0.55, y, 0.06, 0.39, DGREEN)
    txt(s, COLS[0], y+0.10, WID[0], 0.24,
        [(name, 11 if mine else 10.5, mine, PURPLE if mine else INK)])
    for val, x, w in ((kw, COLS[1], WID[1]), (tr, COLS[2], WID[2]),
                      (aio, COLS[3], WID[3]), (rd, COLS[4], WID[4]),
                      (asc, COLS[5], WID[5])):
        txt(s, x, y+0.10, w, 0.24,
            [(val, 11 if mine else 10.5, mine, PURPLE if mine else GRAY)],
            align=PP_ALIGN.CENTER)
    y += 0.42

txt(s, 0.61, 5.15, 12.1, 0.36,
    [("* Komprise is measured clicks from Google Search Console, twelve-month average to September 2026. The other six are Semrush estimates, which model clicks from ranking position and typically run several times higher. Source: Semrush, US database, 15 August 2026.",
      9, False, LGRAY, 0, 1.2)])

rect(s, 0.55, 5.55, 6.02, 1.05, OFFWHITE, BORDER); rect(s, 0.55, 5.55, 0.06, 1.05, DGREEN)
txt(s, 0.83, 5.70, 5.55, 0.85,
    [("A clear lead across the set", 12, True, PURPLE, 4),
     ("Close to three times the keywords of the nearest specialist and three times "
      "the presence in AI answers.", 10, False, GRAY, 0, 1.22)])

rect(s, 6.76, 5.55, 6.02, 1.05, OFFWHITE, BORDER); rect(s, 6.76, 5.55, 0.06, 1.05, AMBER)
txt(s, 7.04, 5.70, 5.55, 0.85,
    [("Where the gap is closing", 12, True, PURPLE, 4),
     ("Hammerspace and Unstructured.io both grew AI answer presence by more than a third "
      "between July and August. Ours held roughly flat over the same weeks.",
      10, False, GRAY, 0, 1.22)])

rect(s, 0.55, 6.68, 12.23, 0.36, PALE); rect(s, 0.55, 6.68, 0.06, 0.36, PURPLE)
txt(s, 0.83, 6.76, 11.8, 0.24,
    [("Authority is the compounding asset here. At 43 we sit seven points clear of the next specialist and level with Cohesity, a far larger company.",
      10, True, PURPLE)])

footer(s, 1)
out = "/home/user/rcc/Komprise_Specialist_Comparison_Sep2026.pptx"
prs.save(out); print("saved", out)
