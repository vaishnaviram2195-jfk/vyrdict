# VYRDICT Launch Measurement Scorecard

## Purpose

This scorecard is for the first public-launch period. It is designed to answer one question: **are people using VYRDICT as a decision tool, not merely landing on the homepage?**

Do not optimize for raw page-view volume alone. The strongest early signals are product exploration, Score Discovery usage, shopping intent, saves, search success, and return behavior.

## Pre-launch baseline

**Snapshot:** August 20, 2026 at approximately 8:48 PM ET  
**Important:** this baseline contains founder QA, development traffic, and early beta-tester activity. It is a reset point, not a performance benchmark.

| Event | Pre-launch total |
|---|---:|
| Page views | 179 |
| Searches | 18 |
| Product opens | 9 |
| Retailer clicks | 8 |
| Saves / unsaves | 5 |
| Account starts | 7 |
| Account sign-ins | 5 |
| Product suggestions opened | 1 |
| Zero-result searches | 1 |
| Product Score Discovery opens | Tracking begins at launch |

Tagged page views currently include 21 `new` and 62 `returning` visits; older page views predate the visit-type field. These values are not unique-user counts.

## Core launch funnel

### 1. Product discovery rate

**Formula:** `product_open / page_view`

Tells us whether visitors move beyond the homepage and investigate products.

**Working launch signal:**
- Healthy: 20%+
- Watch: 10–20%
- Investigate: below 10%

### 2. Search usage

**Formula:** `search / page_view`

Shows whether people actively use VYRDICT as a product lookup tool.

**Working launch signal:** 10%+ is encouraging for early traffic.

### 3. Search success

**Formula:** `search_results / (search_results + search_zero)`

Shows whether the catalog answers what users are looking for.

**Working launch signal:**
- Healthy: 85%+ successful
- Watch: 70–85%
- Investigate: below 70%

Repeated zero-result searches should become catalog-research leads, not automatic product additions.

### 4. Trust exploration

**Formula:** `score_discovery_open / product_open`

Measures whether users want to understand the evidence behind a product score. This is one of VYRDICT's most important differentiators.

**Working launch signal:** 5–10%+ is a positive early signal. Higher is welcome; low usage is not automatically a failure if users already understand the score presentation.

### 5. Shopping intent

**Formula:** `retailer_click / product_open`

Shows whether a VYRDICT verdict moves users toward a real purchase decision.

**Working launch signal:** 10%+ is meaningful early intent.

### 6. Save intent

Use `save_clicked` rows where `event_value = 1`.

**Formula:** `positive saves / product_open`

Shows whether users see VYRDICT as something worth returning to rather than a one-time browsing site.

**Working launch signal:** 5%+ is encouraging.

### 7. Account funnel

**Start rate:** `account_started / page_view`  
**Completion rate:** `account_signed_in / account_started`

Accounts are optional, so a low start rate is not a product failure. Completion matters more once a user chooses to start.

**Working completion signal:** 50%+.

### 8. Returning behavior

Use tagged page views only.

**Formula:** `returning / (new + returning)`

Do not judge this on launch day. Review after 3 days and again after 7 days.

The important question is whether people return without being personally reminded.

## Secondary signals

Track these for qualitative insight rather than launch success/failure:

- `category_open` — which categories attract exploration
- `rankings_open` — interest in weekly rankings
- `market_switch` — Canada / US market-context usage
- `scores_open` — general methodology-page interest
- `suggest_open` — demand for products not yet covered
- `search_zero` — unmet catalog demand

## Launch review cadence

### First 24 hours
Focus on:
1. Product discovery rate
2. Search usage and zero-result rate
3. Score Discovery opens
4. Retailer clicks
5. Saves
6. Any broken or abnormal funnel behavior

Do **not** redesign the product from one day of data.

### Day 3
Add:
- returning-visit signal
- top product/category interest
- repeated zero-result searches
- account completion

### Day 7
Decide only then whether a recurring pattern warrants a product or UX change.

## Decision rule

**Behavior + repeated user feedback beats opinion.**

A change should normally require at least one of:
- a real bug,
- repeated beta/user confusion,
- a clear analytics funnel problem,
- repeated unmet search demand,
- or a strong post-launch strategic reason.

Do not add features simply because one user suggests them.

## Launch-day comparison

For the public launch, measure events from the launch timestamp forward rather than comparing lifetime totals. This keeps development and beta traffic out of the launch readout.
