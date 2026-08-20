# Design rituals: cadence and scheduling

Use this doc to **schedule** recurring design rituals with PM and Engineering. Add real calendar links and owners when your squad is named.

## Ritual overview

| Ritual | Owner | Cadence | Outcome |
| ------ | ----- | ------- | ------- |
| Design critique | Design lead | Weekly | Shared quality bar; faster decisions |
| Research readout | Research / Design | Per study | Evidence-backed alignment |
| Design × Eng sync | Designer + Tech lead | Per epic | Feasibility and edge cases early |
| Accessibility review | Design (+ Eng) | Before major release | WCAG-oriented checklist pass |
| Design process retro | Design lead | Monthly | Improve handoff, tooling, templates |

---

## Scheduling checklist

### 1. Weekly design critique

- [ ] Create a recurring calendar event (suggested: **60 min**, same day/time weekly).
- [ ] Invite: design team + optional PM/Eng for cross-functional critique.
- [ ] Agenda template: 2–3 artifacts, 15–20 min each; end with **one decision** or **one follow-up owner** per item.
- [ ] Document location: Figma link + Loom or meeting notes in wiki/Notion (team choice).

**Owner:** _________________ **Calendar link:** _________________

---

### 2. Per-epic Design × Eng sync

- [ ] For each epic, schedule **one sync** after “Define” exit (see [DESIGN_PROCESS.md](./DESIGN_PROCESS.md)) and optionally a **short pre-QA** before release.
- [ ] Invite: designer(s), tech lead or iOS/Android/web point as needed.
- [ ] Agenda: walk flows, API/data assumptions, platform limits, empty/error states.

**Owner:** _________________

---

### 3. Monthly design process retro

- [ ] Recurring **monthly** 45 min: what improved handoff? what caused rework?
- [ ] Invite: Design + Eng + PM representatives.
- [ ] Output: 1–3 action items (e.g. update template, fix component doc).

**Owner:** _________________ **Calendar link:** _________________

---

### 4. Research readout

- [ ] After each study: 30 min readout with PM + Eng + Design.
- [ ] Share: goals, method, key findings, recommended next steps.

**Owner:** _________________

---

### 5. Accessibility review (before major release)

- [ ] Block **half-day or 2h** with Design + Eng before release branch cut.
- [ ] Use [ux-qa-checklist.md](./templates/ux-qa-checklist.md) accessibility section as the spine.

**Owner:** _________________

---

## GameTap-specific notes

- Mobile (Expo): include **iOS and Android** in accessibility and gesture discussions.
- Voice search and media flows: treat as **higher-risk** for an extra Design × Eng sync before ship.
