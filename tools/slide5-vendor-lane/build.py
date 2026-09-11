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
    if sh.shape_id >= 8 and sh.shape_id != 112:
        sh._element.getparent().remove(sh._element)

LANES = [
 (0.55, PURPLE, "AI-READY DATA", [
    ("ai data ingestion", True, "#1"), ("unstructured data mgmt", True, "#1"),
    ("ai data leakage", True, "#1"), ("ai data curation", False, "Google #4"),
    ("ai data management", False, "Google #15"), ("ai data platform", False, "Google #10"),
    ("ai data preparation", False, "Google #9"), ("how to prepare data for ai", False, "Google #2")]),
 (4.69, DGREEN, "STORAGE PRICE HIKES", [
    ("data tiering", True, "#1"), ("storage tiering", True, "#1"),
    ("intelligent tiering", True, "#1"), ("data storage costs", True, "#1"),
    ("netapp to pure migration", True, "#1"), ("azure netapp", True, "#2"),
    ("reduce storage costs", False, "Google #2"),
    ("rising costs + sources", False, "no vendor")]),
 (8.83, AMBER, "VENDOR SPECIFIC", [
    ("fabricpool", True, "#1"), ("dell powerscale", True, "#1"),
    ("dell emc storage", True, "#1"), ("isilon powerscale", True, "#1"),
    ("netapp bluexp", False, "Google #12"), ("cloudpool", False, "Google #13"),
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
        chip(s, x+2.10, y+0.08, 1.05, 0.24, "AI OVERVIEW" if win else "NOT YET",
             DGREEN if win else LGRAY, size=7.5)
        txt(s, x+3.20, y+0.11, 0.70, 0.22,
            [(note, 8, win, DGREEN if win else LGRAY)], wrap=False)
        y += 0.46

rect(s, 0.55, 5.88, 12.23, 0.86, PALE)
rect(s, 0.55, 5.88, 0.06, 0.86, PURPLE)
txt(s, 0.82, 6.00, 11.70, 0.68,
    [("The verdict: on storage costs and tiering Komprise is cited first in Google's AI Overview for six of the eight "
      "phrasings shown. On vendor terms we are cited on four, including fabricpool, where NetApp's own documentation "
      "ranks from position 60 down and is not cited at all. AI-ready data is where the work continues. The vendor "
      "phrasings we do not yet hold are going into daily tracking.", 11, True, PURPLE, 0, 1.20)])

txt(s, 0.55, 6.80, 12.23, 0.32,
    [("Source: Semrush AI Overview citations for komprise.com, US desktop, crawls dated 20 July to 10 September 2026. "
      "The position shown is the rank of the Komprise citation within the AI Overview source list, not a ranking of "
      "the answer itself. AI Overviews vary by location, device and sign-in state.", 7.5, False, LGRAY, 0, 1.15)])

prs.save(OUT); print("saved", OUT)
