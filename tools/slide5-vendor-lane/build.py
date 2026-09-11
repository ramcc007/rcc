import os, sys, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from pptx import Presentation

SRC = sys.argv[1]; OUT = sys.argv[2]
shutil.copy(SRC, OUT)
prs = Presentation(OUT)
s = prs.slides[4]

# strip the existing lane content and verdict bar, keep header and page number
for sh in list(s.shapes):
    if 8 <= sh.shape_id <= 110:
        sh._element.getparent().remove(sh._element)

LANES = [
 (0.55, PURPLE, "AI-READY DATA", [
    ("ai data ingestion", True, "#1"), ("ai data curation", True, "#1"),
    ("unstructured data mgmt", True, "#1"), ("ai data leakage", True, "#1"),
    ("ai data management", False, "Google #15"), ("ai data platform", False, "Google #10"),
    ("ai data preparation", False, "Google #9"), ("how to prepare data for ai", False, "Google #2")]),
 (4.69, DGREEN, "STORAGE PRICE HIKES", [
    ("data tiering", True, "#1"), ("storage tiering", True, "#1"),
    ("intelligent tiering", True, "#1"), ("reduce storage costs", True, "#1"),
    ("data storage costs", True, "#1"), ("azure netapp", True, "#2"),
    ("netapp to pure migration", True, "#1"),
    ("rising costs + sources", False, "no vendor")]),
 (8.83, AMBER, "VENDOR SPECIFIC", [
    ("fabricpool", True, "#1"), ("dell powerscale", True, "#1"),
    ("dell emc storage", True, "#1"), ("netapp bluexp", True, "#1"),
    ("isilon powerscale", True, "#1"), ("cloudpool", False, "Google #13"),
    ("netapp tiering", False, "no rank"), ("netapp storage costs", False, "no rank")]),
]
CW = 3.94

for x, col, label, rows in LANES:
    rect(s, x, 1.62, CW, 0.38, col)
    txt(s, x+0.18, 1.70, CW-0.30, 0.22, [(label, 10, True, WHITE)])
    y = 2.12
    for q, win, note in rows:
        rect(s, x, y, CW, 0.40, OFFWHITE if win else WHITE, BORDER)
        rect(s, x, y, 0.05, 0.40, DGREEN if win else LGRAY)
        txt(s, x+0.17, y+0.11, 1.88, 0.24,
            [(q, 9, win, INK if win else GRAY)])
        chip(s, x+2.10, y+0.08, 1.05, 0.24, "IN AI ANSWER" if win else "NOT YET",
             DGREEN if win else LGRAY, size=7.5)
        txt(s, x+3.20, y+0.11, 0.70, 0.22,
            [(note, 8, win, DGREEN if win else LGRAY)], wrap=False)
        y += 0.46

rect(s, 0.55, 5.92, 12.23, 1.00, PALE)
rect(s, 0.55, 5.92, 0.06, 1.00, PURPLE)
txt(s, 0.82, 6.08, 11.70, 0.78,
    [("The verdict: on storage costs Komprise is already the answer. On vendor-specific searches we often outrank the "
      "vendor's own pages. Google's AI answer for fabricpool names Komprise while NetApp's own documentation does not "
      "appear at all. AI-ready data is where the work continues. The four vendor cost and tiering phrasings we do not "
      "yet hold are now going into tracking.", 11.5, True, PURPLE, 0, 1.22)])

prs.save(OUT); print("saved", OUT)
