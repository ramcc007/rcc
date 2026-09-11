# Komprise_Vendor_Comparison_Sep2026.pptx - data provenance

One slide answering the board question relayed by Darren on 1 Sep 2026: how does
Komprise compare against Cohesity, Commvault, NetApp and Everpure.

## Table - Semrush `resource_rank_history`, US database, snapshot 15 Aug 2026
| Company | Ranking keywords | Organic traffic | Keywords in AI answers | Top 3 |
|---|---|---|---|---|
| Komprise | 6,139 | 25,126 | 5,464 | 548 |
| NetApp | 39,118 | 75,742 | 32,473 | 2,182 |
| Everpure | 20,134 | 42,990 | 17,968 | 1,061 |
| Cohesity | 13,381 | 36,773 | 11,136 | 872 |
| Commvault | 18,472 | 33,189 | 14,773 | 764 |

Visits per keyword, quoted in the left read-out rather than as a column:
Komprise 4.09, Cohesity 2.75, Everpure 2.14, NetApp 1.94, Commvault 1.80.
Derived as organic traffic divided by ranking keywords.

## Authority score and referring domains - Semrush `backlinks_overview`
Komprise 43 / 1,944. Cohesity 43 / 8,563. Commvault 47 / 10,108.
NetApp 51 / 23,670. Everpure 51 / 8,799.

Supports the claim that Komprise matches Cohesity's authority score on roughly a
quarter of the referring domains.

## Traffic growth, 15 May to 15 Aug 2026
Everpure 22,910 to 42,990 (+87.6%). Commvault 21,246 to 33,189 (+56.2%).
Cohesity 25,499 to 36,773 (+44.2%). Komprise 20,440 to 25,126 (+22.9%).
NetApp 76,798 to 75,742 (-1.4%). Basis for the "worth watching" line.

## Vendor-specific terms - Semrush `resource_organic`, `display_positions_type=all`
Answers Krishna's 31 Aug question about vendor-specific tracking. The
`position_type` column states whether the domain appears in Google's AI Overview.

Komprise holds the AI answer on:
- fabricpool (AI Overview #1, organic #2). netapp.com appears only at organic
  positions 60 and below on this term, and is absent from the AI Overview.
- dell powerscale, dell emc, dell emc storage, emc dell, what is dell emc
- netapp bluexp, azure netapp (#2), netapp to pure storage migration

Not yet ranking or outside the AI answer:
- netapp tiering, netapp storage costs, dell tiering, dell storage costs
- cloudpool (organic #13, no AI Overview)

## Open items this slide commits to
Adding the five gap terms above to the position tracking campaign.


## Pages indexed in Google - not included, and why
Requested as a column but not added, because no source available here can fill it
for all five vendors:

- Google Search Console reports indexed page counts only to the verified owner of
  a property, so it covers komprise.com and none of the competitors.
- Semrush `resource_organic_unique` lists pages ranking in Google's top 100, which
  is a different measure, and the API caps `display_limit` at 1000 with
  `display_offset` required to be below it. Totals for the larger domains cannot
  be counted.
- Semrush `backlinks_pages` reports pages in Semrush's own backlink index, not
  Google's index.

The conventional fallback is a `site:` query per domain in Google. Those figures
are rough estimates by Google's own description and would need labelling as such.

## Pages indexed - added September 2026
Google `site:` result counts, captured from screenshots on 11 September 2026:
komprise.com 1,610; netapp.com 621,000; cohesity.com 310,000;
commvault.com 172,000; everpuredata.com 32,900.

Google describes these as estimates, and they include subdomains. NetApp's
results include docs., kb., careers. and xcp.; Cohesity includes api. and docs.;
Commvault includes documentation. and benefits. Much of the competitor bulk is
product documentation rather than marketing content. Both caveats are stated in
the on-slide source line.

## Traffic column - a modelled estimate, not measured clicks
Semrush organic traffic is derived from ranking position, search volume and an
assumed click-through rate. It is not measured click data.

Google Search Console for komprise.com reports 55.3k total clicks over the
twelve months to 11 September 2026, roughly 4.6k per month, against Semrush's
25,126 for August. Semrush is overstating actual clicks for this domain by
around five times.

Decision taken: the Komprise cell shows 4,600, the Search Console twelve-month
average, marked with an asterisk. The other four stay on Semrush estimates,
because Search Console data exists only for a property you own.

The consequence is recorded here so it is not forgotten. Against Semrush figures
throughout, Komprise sits at roughly a third of NetApp's traffic. As displayed,
mixing measured clicks against modelled estimates, it reads as about six per
cent. If the competitors were measured the same way their figures would likely
fall by a similar multiple, so the column understates Komprise's relative
position by roughly five times. The on-slide footnote states which figure is
measured and which are modelled, and notes that estimates typically run several
times higher.

### Open item for the Q2 board deck
Komprise_GEO_SEO_Q2_2026.pptx uses the same Semrush series and describes it as
"Organic Traffic" and "monthly visits", quoting 16,602 rising to 21,883 and
"+32%". Those absolute figures carry the same five times overstatement. The
Search Console clicks line over April to June also looks flat to slightly down
rather than up 32%, so the trend needs checking against Search Console before
the figure is quoted again.
