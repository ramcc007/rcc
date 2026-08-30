# Q2 2026 Board Deck — data provenance

Every figure in `Komprise_GEO_SEO_Q2_2026_Board_Update.pptx` traces to one of the
sources below. Nothing is estimated or interpolated.

## Semrush — `resource_rank_history`, target `komprise.com`, database `us`
Monthly snapshots. Deck uses 15 Mar 2026 (Q1 exit baseline), 15 Apr / 15 May / 15 Jun
(Q2), and 15 Jul (first post-quarter reading, shown only as context).

| Snapshot  | Organic traffic | Organic keywords | Top-3 | Pos 4–10 | AI Overview kws | PAA kws | Traffic cost | Semrush Rank |
|-----------|-----------------|------------------|-------|----------|-----------------|---------|--------------|--------------|
| 15 Mar 26 | 18,129          | 6,908            | 354   | 1,033    | 5,522           | 4,000   | $30,242      | 105,248      |
| 15 Apr 26 | 16,602          | 6,084            | 366   | 972      | 5,079           | 1,933   | $29,984      | 114,914      |
| 15 May 26 | 20,440          | 6,222            | 387   | 997      | 5,297           | 4,603   | $56,750      | 92,279       |
| 15 Jun 26 | 21,883          | 6,225            | 420   | 1,095    | 5,449           | 5,783   | $82,977      | 88,764       |
| 15 Jul 26 | 23,880          | 6,383            | 506   | 1,075    | 5,532           | 5,786   | $93,355      | 82,397       |

Derived: traffic +31.8% Apr→Jun; traffic value +176.7%; top-3 +14.8%; pos 4–10 +12.65%;
AI Overview kws +7.3%; PAA ×2.99; Semrush Rank improved 26,150 places.
"Best month since May 2025" — 21,883 exceeds every snapshot back to 15 May 2025 (23,653).

## Semrush — competitors, `resource_rank_history`, 15 Jun 2026, `us`
| Domain              | AI Overview kws | Organic traffic | Organic kws | Top-3 |
|---------------------|-----------------|-----------------|-------------|-------|
| everpuredata.com    | 16,766          | 33,353          | 19,633      | 826   |
| komprise.com        | 5,449           | 21,883          | 6,225       | 420   |
| unstructured.io     | 1,259           | 5,582           | 1,901       | 89    |
| hammerspace.com     | 385             | 1,349           | 801         | 34    |
| atempo.com          | 193             | 1,189           | 249         | 9     |
| datadobi.com        | 50              | 300             | 67          | 2     |
| diskoverdata.com    | 43              | 402             | 69          | 4     |

Everpure AI Overview keywords by snapshot: 15 Apr = 0, 15 May = 6,410, 15 Jun = 16,766.
The 15 Apr zero is a genuine absence — everpuredata.com had no measurable organic
presence in the Semrush US database before the rebrand, not a missing reading.

Multiples on slides 2 and 5: 5,449 ÷ 385 = 14.2× (Hammerspace); ÷ 193 = 28.2× (Atempo);
÷ 50 = 109.0× (Datadobi); ÷ 43 = 126.7× (Diskover). 16,766 ÷ 5,449 = 3.08×.

## Semrush — `backlinks_historical`, root domain `komprise.com`
1 Apr 26: 13,800 backlinks / 1,773 referring domains / AS 44.
1 Jul 26: 14,348 backlinks / 1,846 referring domains / AS 44 (AS dipped to 42 in May–Jun).

## Semrush — Position Tracking, campaign `29937088_4919075` ("AI Prompts - Komprise")
First harvest date 10 Jun 2026. Q2 coverage is three weekly crawls: 10, 17 and 24 June.
Across those three dates all 50 prompts returned "-" for komprise.com — no top-100
Google organic placement. Visibility, traffic and traffic-cost all returned 0.

Prompt category counts, derived by classifying the 50 prompts returned by the campaign:
AI & AI-Readiness 16, Unstructured Data Management 11, Data Classification 8,
Data Tiering & Storage Efficiency 8, Migration & Lifecycle 7. Total 50.

## Gmail — narrative and dates (slides 1, 6, 7, 8, 10, 11)
- Darren Cunningham, 24 Aug 2026, "GEO update for the board meeting" — board meets 2 Sept.
- Darren Cunningham, 27–28 Aug 2026, "GenAI stats for tomorrow?" — Q2 focus; the two lanes;
  the four things the deck must explain; deadline Friday or Monday.
- Darren Cunningham, 23 Jun / 29 Jun / 1 Jul / 8 Jul / 15 Jul 2026 — page and launch dates.
- Kumar Goswami, 20 Jun 2026, "This is what's killing us…" — the Gemini framing gap.
- Monte Barnard, 11 Aug 2026, "GEO project: four-week results" — Gemini is the outlier;
  product names repeating back unprompted; third-party workstreams and owners.
- Polly Traylor, 20 Aug / 24 Aug / 28 Aug 2026 — Top 10 prompts still undefined; call requested.
- June 2026 metrics deck — the 594-sources / 3% own-domain baseline (labelled as of June).

## Not included, and why (slide 10)
- No Apr/May prompt-level GEO data exists; the campaign was created 10 Jun 2026.
- AI visibility score, mentions, citations, cited pages and source mix are not exposed by
  the Semrush API connection used here, which serves only the Google side of Position
  Tracking. Figures of that kind are carried from the June deck and labelled as such.
- The "Top KWs by Darren" project (id 27580584) could not be reached: the API returns no
  campaign identifiers for it, and the `campaigns` report returns an empty target list.
  Priority-keyword reporting is omitted rather than substituted.
- Monte's and Polly's brand / non-brand keyword sets were dropped by instruction: Monte's
  workbook is on SharePoint outside this account, and Polly's Top 10 is not yet defined.
