import os, sys, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from pptx import Presentation

SRC = sys.argv[1]; OUT = sys.argv[2]
shutil.copy(SRC, OUT)
prs = Presentation(OUT)
s = prs.slides[4]

for sh in list(s.shapes):
    if sh.shape_id >= 8 and sh.shape_id != 112:
        sh._element.getparent().remove(sh._element)

# retitle: this slide now reports Google organic position, which anyone can reproduce
for sh in s.shapes:
    if sh.shape_id == 6:
        sh.text_frame.paragraphs[0].runs[0].text = "Where We Rank in Each Lane"
    if sh.shape_id == 7:
        tf = sh.text_frame
        for r in tf.paragraphs[0].runs[1:]:
            r.text = ""
        tf.paragraphs[0].runs[0].text = "Komprise position on Google for the terms behind each lane"

# top is a top-three organic position
LANES = [
 (0.55, PURPLE, "AI-READY DATA", [
    ("ai data ingestion", True, "#1"), ("how to prepare data for ai", True, "#2"),
    ("unstructured data mgmt", True, "#3"), ("ai data curation", False, "#4"),
    ("ai data preparation", False, "#9"), ("ai data leakage", False, "#9"),
    ("ai data platform", False, "#10"), ("ai data management", False, "#15")]),
 (4.69, DGREEN, "STORAGE PRICE HIKES", [
    ("data tiering", True, "#2"), ("storage tiering", True, "#2"),
    ("reduce storage costs", True, "#2"), ("data storage costs", False, "#4"),
    ("tiering", False, "#4"), ("cloud tiering", False, "#4"),
    ("intelligent tiering", False, "#5"), ("azure netapp", False, "#5")]),
 (8.83, AMBER, "VENDOR SPECIFIC", [
    ("fabricpool", True, "#2"), ("dell powerscale", True, "#2"),
    ("dell emc storage", False, "#7"), ("netapp bluexp", False, "#12"),
    ("cloudpool", False, "#13"), ("isilon powerscale", False, "no rank"),
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
        txt(s, x+0.17, y+0.11, 2.10, 0.24, [(q, 9, win, INK if win else GRAY)])
        chip(s, x+2.32, y+0.08, 0.92, 0.24, "TOP 3" if win else "PAGE 1+",
             DGREEN if win else LGRAY, size=7.5)
        txt(s, x+3.34, y+0.11, 0.56, 0.22,
            [(note, 8.5, win, DGREEN if win else LGRAY)], wrap=False)
        y += 0.46

rect(s, 0.55, 5.88, 12.23, 0.86, PALE)
rect(s, 0.55, 5.88, 0.06, 0.86, PURPLE)
txt(s, 0.82, 6.00, 11.70, 0.68,
    [("The verdict: Komprise holds a top-three position on eight of the twenty-four terms behind the two lanes. On "
      "fabricpool and dell powerscale we sit at number two, directly behind the vendor's own product page, which is "
      "unusual for a third party. Storage costs and tiering are the strongest lane. AI-ready data is where the work "
      "continues. The vendor phrasings we do not yet hold are going into daily tracking.", 11, True, PURPLE, 0, 1.20)])

txt(s, 0.55, 6.80, 12.23, 0.32,
    [("Source: Semrush organic positions for komprise.com, US desktop, crawls dated 20 July to 10 September 2026. "
      "Positions are for the standard Google results page. Presence inside Google's AI Overview is tracked separately "
      "and is not shown here.", 7.5, False, LGRAY, 0, 1.15)])

prs.save(OUT); print("saved", OUT)
