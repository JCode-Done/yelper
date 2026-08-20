# UX metrics and baseline (GameTap)

We track a **small set** of UX metrics so design decisions tie to measurable outcomes. Baseline **before** the next major release; re-measure after shipping meaningful UX changes.

---

## Primary metrics (3)

### 1. Task success rate — “Find a game and open details”

- **Definition:** % of sessions (or test participants) who successfully open a game detail from search or browse path within one attempt.
- **Why:** Core discovery loop for the app.
- **How to measure:**
  - **Lab / unmoderated test:** Task: “Find a game called [X] or any strategy game and open its details.” Success = correct detail screen.
  - **Product analytics (when instrumented):** Funnel: `search_submitted` or `category_selected` → `game_detail_opened` within same session.

**Baseline (fill in):**

| Date | Method | Sample size | Success % | Notes |
| ---- | ------ | ----------- | --------- | ----- |
| | | | | |

**Target (squad sets with PM):** e.g. ≥ 85% in moderated tests; funnel conversion +X% vs. baseline.

---

### 2. Time on task — “Complete first search”

- **Definition:** Median time from landing on Home with empty results to first search result list shown (or “no results” state).
- **Why:** Captures perceived performance and clarity of search.
- **How to measure:**
  - Stopwatch in moderated tests, or analytics timestamps between `home_view` and `search_results_rendered` (when events exist).

**Baseline:**

| Date | Median (sec) | p75 (sec) | Notes |
| ---- | ------------ | --------- | ----- |
| | | | |

---

### 3. Perceived ease — short post-task rating

- **Definition:** After the find-a-game task, ask: “How easy was that?” (1–5) or use **SUS** on a quarterly sample.
- **Why:** Lightweight signal for satisfaction without a full survey every release.
- **How:** In research sessions or in-app optional prompt (coordinate with PM for frequency caps).

**Baseline:**

| Date | Mean ease (1–5) | N | Notes |
| ---- | ----------------- | --- | ----- |
| | | | |

---

## Secondary metrics (optional)

| Metric | Use when |
| ------ | -------- |
| Drop-off on Sign in → Home | Onboarding or auth changes |
| Dark mode usage % | Theme or accessibility initiatives |
| Voice search success / abandon | Voice feature iterations |
| Accessibility issues found in prod | After major UI refactors |

---

## Baseline process

1. **Pick a build** (TestFlight / internal / production).
2. **Run** at least **5 moderated** or **15 unmoderated** sessions for metric 1 (or use analytics if live).
3. **Record** results in the tables above with date and owner.
4. **Re-baseline** after major IA or search changes.

**Owner (Design + PM):** _________________ **Next review date:** _________________
