# What the Semrush AI Overview data actually says, and what it does not

Written 11 September 2026 after a challenge that none of the slide 5 vendor
terms show Komprise at #1 in Google's AI answer.

## Where the number comes from

Semrush report `resource_organic`, target komprise.com, database us,
`display_positions_type=all`. That returns one row per keyword per SERP slot.
The `position_type` column is one of Organic, AI overview, People also ask,
Things to know, Image pack or Knowledge panel. An "AI overview" row means
Semrush's crawler saw a komprise.com URL cited as a source inside the AI
Overview block for that query.

Raw rows are in `raw_semrush_rows.csv` alongside this file.

## Three things the number does not mean

**1. "#1" is the citation slot, not the verdict.**
The position on an AI overview row is where the Komprise link sits in the AI
Overview's source list. It does not mean Google's AI answer recommends
Komprise, names Komprise first in its text, or names Komprise at all. A page
can be cited as a source for a definition while the prose never mentions the
brand. The slide chip reading "IN AI ANSWER" next to "#1" invites the reading
"we are the top answer", which the data does not support.

**2. Every row is a stale single snapshot, and the dates are all different.**
Semrush recrawls each keyword on its own cycle. Across the slide 5 terms the
crawl dates run from 20 July to 10 September 2026. "isilon powerscale" and
"intelligent tiering" were last seen on 20 July, almost two months old. Nothing
on the slide is a live reading.

**3. AI Overviews are personalised and unstable.**
Semrush crawls logged out, from a fixed US desktop location, with no search
history. A logged in user in a different city, on mobile, or with different
history routinely gets a different AI Overview, a different source list, or no
AI Overview at all. Google also declines to generate one on a large share of
repeat searches for the same query. So failing to reproduce a row by hand does
not disprove it, and reproducing it once does not prove it holds.

Taken together: these rows are evidence that Komprise pages are being picked up
as AI Overview sources across vendor terms. They are not a claim that anyone
searching today will see Komprise first.

## Rows on slide 5 that the data does not support

Checked every row. Three fail.

| Slide row | Slide claim | What Semrush returns |
|---|---|---|
| netapp bluexp | in AI answer, #1 | Organic #12 and #30 only. No AI overview row. The spaced variant "netapp blue xp" has an AI overview row at #1, crawled 28 July. Two different keywords, and I ran them together. |
| ai data curation | in AI answer, #1 | Organic #4 and #49 only. No AI overview row. "what is data curation" and "data curation meaning" each have one at #1. Again a different keyword. |
| reduce storage costs | in AI answer, #1 | Organic #2 only. No AI overview row. "data storage costs" has one at #1. |

## Rows that hold up

fabricpool (AI overview #1, organic #2, crawled 12 Aug), dell powerscale (#1,
24 Aug), dell emc storage (#1, 1 Aug), isilon powerscale (#1, 20 Jul),
data tiering (#1, 29 Aug), storage tiering (#1, 11 Aug), intelligent tiering
(#1, 20 Jul), data storage costs (#1, 12 Aug), azure netapp (#2, 10 Aug),
ai data ingestion (#1, 25 Jul), ai data leakage (#1, 22 Aug), unstructured data
management solutions (#1, 11 Aug).

cloudpool is organic #13 with no AI overview row, which is what the slide says.
netapp tiering, netapp storage costs, dell tiering and dell storage costs
return no rows at all, which is also what the slide says.

## The fabricpool claim, restated accurately

For "fabricpool", a komprise.com glossary page is cited first among the sources
of Google's AI Overview, and ranks #2 organically, as of the 12 August crawl.
NetApp's own pages rank from position 60 downward across docs.netapp.com,
kb.netapp.com and community.netapp.com and do not appear among the AI Overview
sources in that crawl. That is a real and unusual result. It is still a single
snapshot of a personalised feature, so it should be presented as "as of
12 August" rather than as a standing fact.

## How to make this reproducible

Semrush Position Tracking with the AI Overview feature enabled tracks a fixed
keyword list daily from a fixed location and keeps history, rather than giving
one crawl per keyword whenever the crawler happened to pass. Moving these terms
into the tracked campaign is what turns this from a snapshot into something
that can be shown to a board and defended when someone checks it by hand.

---

# Second correction, 11 September 2026, after a live check

A screenshot of Google for "fabricpool" showed NetApp cited throughout with no
Komprise anywhere. Two findings came out of chasing that down.

## Google cannot be reached from this environment

The agent proxy returns `403 to CONNECT` for `www.google.com:443`. Chromium and
Playwright are installed here and launch fine, but every request to Google is
refused at the network layer. So no live check is possible from here. Every
number in this work stream came from the Semrush API, and that limit should
have been stated before any of it went near a slide.

## The screenshot was AI Mode, not AI Overview

The "Ask anything" box, the query bubble, the scrolling source rail and the
AI Mode tab identify Google's conversational AI Mode. That is a separate
surface from the AI Overview block on the standard results page, and it is not
what Semrush reports on. This is a real distinction, not a defence of the
slide, because of the next finding.

## The position on an AI Overview row is not a rank

Pulling the same keyword for the vendors settles it. For "fabricpool", from the
same 12 August crawl as the Komprise rows:

```
netapp.com  fabricpool;1;Organic;    docs.netapp.com/us-en/ontap/concepts/fabricpool-concept.html
netapp.com  fabricpool;1;AI overview;docs.netapp.com/us-en/ontap/concepts/fabricpool-concept.html
netapp.com  fabricpool;1;AI overview;docs.netapp.com/us-en/flexpod/hybrid-cloud/cloud-fabricpool_fabricpool.html
```

NetApp holds two AI Overview rows for one keyword, both numbered 1. Dell holds
three for "dell powerscale", all numbered 1. The number is a presence flag, not
an ordering. Nothing can be "#1 in the AI answer" on this data, for anyone.

## What was wrong, and what is actually true

Previously claimed: for fabricpool, Komprise is cited first and NetApp's own
documentation ranks from position 60 downward and is not cited at all.

That is false. NetApp ranks organic #1 for fabricpool and is cited in the AI
Overview. The 60-plus positions are NetApp's deep configuration pages. Reading
those as the whole picture missed the #1 result sitting at the top of the same
response.

What is true: Komprise ranks organic #2 for fabricpool, directly behind
NetApp's own concept page, and is also cited in the AI Overview. On
"dell powerscale" the same shape holds, Dell #1 and Komprise #2. Ranking second
to the vendor on the vendor's own product name is a genuinely strong result for
a third party. It is not beating them.

There is one clean win over a vendor in this set. For "data tiering" Komprise
is organic #2 with an AI Overview citation, while netapp.com is organic #4 with
no AI Overview row at all.

## Consequence for the deck

Slide 5 was rebuilt on Google organic position only, in
`tools/slide5-organic/`. Organic positions are stable, reproducible by hand and
consistent between vendors. The AI Overview presence data stays out of the
board deck until a manual check confirms it. The worksheet for that check is in
`tools/manual-verification/`.

---

# Third check, 11 September 2026

## Google is still unreachable

Retried on three separate routes. All refused.

| Route | Result |
|---|---|
| curl through the agent proxy | `CONNECT tunnel failed, response 403` |
| Playwright with the bundled Chromium | `net::ERR_TUNNEL_CONNECTION_FAILED` |
| WebFetch | `EGRESS_BLOCKED: Access to www.google.com is blocked by the network egress proxy` |

No live Google check is possible from this environment. The manual worksheet in
`tools/manual-verification/` remains the only way to confirm the AI Overview
data.

## Independent corroboration of the organic ordering

A general web search index, separate from Semrush and separate from Google, was
used to sanity check the three terms carrying the strongest claims on slide 5.
Result ordering in that index is not Google's, so this confirms relative
presence rather than exact position.

**fabricpool.** Both komprise.com fabricpool pages appear in the top ten
alongside several docs.netapp.com pages, including the ONTAP concept page.
Consistent with the Semrush reading of NetApp first and Komprise close behind.
Nothing here supports the original claim that NetApp was absent.

**dell powerscale.** Dell's own product, support and blog pages fill most of
the top ten. The komprise.com glossary page sits among them. Consistent with
Dell first and Komprise close behind.

**data tiering.** The komprise.com data tiering page ranks above
netapp.com/data-services/tiering/. This independently corroborates the one
clean win over a vendor found in the Semrush data.

So the organic story on slide 5 holds up against a second source. The AI
Overview story still has no independent confirmation and stays out of the deck.
