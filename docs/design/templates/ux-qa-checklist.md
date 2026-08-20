# UX QA checklist (pre-release)

**Release / version:**  
**QA owner (Design / QA):**  
**Date:**  
**Build / branch:**  

Use this checklist before a **major** release or when UX risk is high. For small fixes, trim sections with PM.

---

## A. Critical user flows (GameTap)

Mark **Pass / Fail / N/A** and link issues.

| Flow | Pass? | Notes |
| ---- | ----- | ----- |
| Splash → Sign in → Home | | |
| Search board games (text) | | |
| Category filter (e.g. Euro / Strategy) | | |
| Open game detail from list / featured | | |
| Favorite / unfavorite | | |
| Profile view and edit profile modal | | |
| Videos list → video player | | |
| Dark mode toggle (Home) | | |
| Voice search (if enabled in build) | | |

---

## B. Visual and layout

- [ ] No unintended clipping or overlap on small phones (e.g. SE-class) and large phones
- [ ] Tab bar and headers match theme (light / dark)
- [ ] Images load or show sensible placeholders
- [ ] Lists scroll smoothly; no jank on first paint

---

## C. Interaction

- [ ] Primary actions reachable with thumb (where applicable)
- [ ] Pull-to-refresh / keyboard dismiss behave as expected
- [ ] Haptics (category icons, etc.) feel appropriate — not double-firing
- [ ] Back / close behavior matches platform conventions

---

## D. Content and copy

- [ ] No placeholder or lorem text in production paths
- [ ] Error messages are human-readable and actionable
- [ ] Empty states explain what to do next

---

## E. Accessibility

- [ ] Interactive elements have sufficient touch target size (min ~44pt)
- [ ] Text contrast acceptable in light and dark themes (WCAG AA target)
- [ ] Screen reader: focus order logical on Home, Game detail, Profile (spot-check)
- [ ] Dynamic type: critical screens don’t break layout at larger sizes (spot-check)

---

## F. Performance (UX-facing)

- [ ] App doesn’t feel blocked on cold start after splash
- [ ] Search / list loading states visible; no infinite spinners without error

---

## Sign-off

| Role | Name | Date | Approved |
| ---- | ---- | ---- | -------- |
| Design | | | ☐ |
| PM | | | ☐ |
| Eng | | | ☐ |
