# Slide 5 vendor lane, corrected 11 September 2026

Added in response to Krishna's 31 August note asking whether the vendor specific
searches are tracked. Corrected after a challenge that the AI Overview claims
could not be reproduced by hand.

Full evidence pack, including raw rows and the limits of this data, is in
`tools/ai-overview-evidence/`.

## Correction

Three rows on the first version claimed an AI Overview citation that Semrush
does not return. All three were keyword mismatches on my side, where a similar
but different query does hold the citation.

| Row | Claimed | Actual | Now shown as |
|---|---|---|---|
| netapp bluexp | AI Overview #1 | Organic #12 and #30, no AI Overview row. The spaced variant "netapp blue xp" holds #1. | NOT YET, Google #12 |
| ai data curation | AI Overview #1 | Organic #4 and #49, no AI Overview row. "what is data curation" holds #1. | NOT YET, Google #4 |
| reduce storage costs | AI Overview #1 | Organic #2, no AI Overview row. "data storage costs" holds #1. | NOT YET, Google #2 |

The chip label was changed from "IN AI ANSWER" to "AI OVERVIEW", because the
position is the rank of the Komprise citation inside the AI Overview source
list, not a ranking of the answer. A source line carrying the crawl window and
the personalisation caveat was added below the verdict bar.

## Krishna's six named terms
`resource_organic` for komprise.com, US, display_positions_type=all.

| Term | Result | Crawl |
|---|---|---|
| fabricpool | AI Overview #1, organic #2 | 12 Aug 2026 |
| cloudpool | organic #13, no AI Overview | 27 Jul 2026 |
| netapp tiering | no ranking found | n/a |
| netapp storage costs | no ranking found | n/a |
| dell tiering | no ranking found | n/a |
| dell storage costs | no ranking found | n/a |

## Vendor terms Komprise does hold
| Term | Result | Crawl |
|---|---|---|
| dell powerscale | AI Overview #1 | 24 Aug 2026 |
| dell emc storage | AI Overview #1 | 1 Aug 2026 |
| isilon powerscale | AI Overview #1 | 20 Jul 2026 |

"dell emc" also holds AI Overview #1 at a 4 September crawl but is not on the
slide, because eight rows is the maximum that fits above the verdict bar.
azure netapp and netapp to pure migration sit in the storage lane and are not
duplicated here.

## The fabricpool finding
For "fabricpool", a komprise.com glossary page is cited first among the sources
of Google's AI Overview and ranks #2 organically, at the 12 August crawl.
NetApp's own pages rank from position 60 downward across docs.netapp.com,
kb.netapp.com and community.netapp.com and are not cited in that AI Overview.
Present it as at 12 August rather than as a standing fact.

## Labels shortened to fit three columns
"unstructured data management solutions" to "unstructured data mgmt",
"netapp to pure storage migration cost and timeline" to "netapp to pure
migration", "rising storage costs, cite sources" to "rising costs + sources".
Underlying queries are unchanged.
