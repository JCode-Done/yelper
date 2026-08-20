---
pdf_options:
  format: Letter
  margin: 20mm 18mm
  printBackground: true
  displayHeaderFooter: true
  headerTemplate: '<div style="font-size:9px;width:100%;text-align:center;color:#666;">Product UX Plan</div>'
  footerTemplate: '<div style="font-size:9px;width:100%;text-align:center;color:#666;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
---

# Product UX Plan

## Plan: Product design team led by UX / Design

*GameTap — UX/Design-led product design*

---

## Purpose and north star

- **Role of design**: UX/Design leads **problem framing, experience quality, and user-validated direction**; product and engineering own **business outcomes and feasibility**. Design does not replace PM or Eng but **elevates clarity** before and during build.
- **North star**: Decisions are traceable to **user needs + measurable experience quality** (usability, accessibility, satisfaction), not only feature throughput.

---

## Team shape (typical roles)

- **Design / UX lead**: Vision for experience, critique culture, design-system direction, stakeholder alignment on “good enough to ship.”
- **Product designers** (or UX generalists): End-to-end flows, prototypes, usability tests, specs handoff.
- **Content design** (if scale allows): Voice, microcopy, empty/error states.
- **Research / UX research** (dedicated or fractional): Study design, synthesis, journey maps; can be embedded or shared across squads.
- **Design ops / systems** (often part-time at first): Component library, Figma libraries, templates, tooling.

*Adjust headcount to org size; the plan scales by **principles**, not fixed FTE.*

---

## Benefits of a dedicated embedded product design team

**Dedicated** means designers are assigned to the product (not only fractional or shared across many unrelated initiatives). **Embedded** means they work day-to-day inside the same squad or product unit as PM and engineering—not as a distant “service desk.” Together, that setup typically yields:

- **Deep product context**: Designers accumulate domain knowledge (users, roadmap, constraints, past decisions) so work needs less re-briefing and avoids repeating mistakes.
- **Faster, tighter iteration**: Short feedback loops with Eng on feasibility and with PM on scope; fewer handoffs and round-trips than agency or pooled shared-service models.
- **Shared language and trust**: Daily collaboration builds mutual understanding of tradeoffs; design is treated as a partner in refinement, not a late gate.
- **End-to-end ownership of experience quality**: The same people who frame problems also specify flows, support QA, and follow releases—so UX intent is less likely to erode in implementation.
- **Consistent vision and design system adoption**: Embedded designers advocate for patterns and tokens in real features, so the system stays aligned with production—not a parallel Figma-only library.
- **Earlier risk and edge-case surfacing**: Empty states, errors, accessibility, and platform differences get discussed when estimates are formed, reducing late rework and “surprise” UI debt.
- **Compound research value**: Studies, interviews, and analytics interpretations build on each other; insights stay with the team instead of resetting when external teams rotate off.
- **Stronger design literacy in the org**: Engineers and PMs pick up UX vocabulary and habits (critique, user goals, accessibility) through proximity, improving decisions even when designers are not in the room.
- **Clearer accountability for outcomes**: When design is embedded, “who owns the experience?” maps to named people on the squad, which supports retros, metrics, and follow-up after launch.

*Tradeoff to acknowledge*: Dedicated headcount has a cost; the return shows up in reduced rework, faster alignment, and better measured user outcomes—not only in “more screens shipped.”

---

## How design “leads” without blocking shipping

**Process flow:** Discover → Define → Validate → Deliver → (repeat)

1. **Discover** → **Define** → **Validate** → **Deliver** → back to Discover as needed.

- **Discover**: Problem statements, jobs-to-be-done, competitive/heuristic scans; exit when scope and success signals are agreed with PM.
- **Define**: User flows, information architecture, low → mid fidelity; exit when Eng can estimate and risks are visible.
- **Validate**: Usability tests, A/B or qualitative checks on critical paths; exit when blockers are fixed or explicitly accepted.
- **Deliver**: High fidelity + interaction notes + accessibility criteria + design QA in staging; exit when release criteria met.

Design leads **sequence and quality bar**; PM leads **priority and scope**; Eng leads **implementation and tradeoffs**.

---

## Rituals (cadence)

| Ritual | Owner | Cadence | Outcome |
| ------ | ----- | ------- | ------- |
| Design critique | Design lead | Weekly | Shared quality bar, faster decisions |
| Research readout | Research / Design | Per study | Shared evidence, not opinions |
| Design × Eng sync | Designer + Tech lead | Per epic | Feasibility + edge cases early |
| Accessibility review | Design (+ Eng) | Before major release | WCAG-oriented checklist |
| Retro (design process) | Design lead | Monthly | Improve handoff and tooling |

*Scheduling checklists and calendar placeholders live in `docs/design/RITUALS.md` in the repo.*

---

## Deliverables (what “done” looks like from design)

- **Problem brief** (1–2 pages): User, context, constraints, non-goals, success metrics.
- **Flows and states**: Happy path, empty, loading, error, offline (as relevant).
- **Prototype**: Clickable for tests or alignment; level matches risk (higher risk → more fidelity).
- **Spec for build**: Components, spacing, motion, copy, breakpoints; link to design system.
- **Acceptance notes for UX**: What to verify in QA (with PM/Eng).

*Templates: `docs/design/templates/problem-brief.md`, `flow-spec-handoff.md`, `ux-qa-checklist.md`.*

---

## Collaboration with Product and Engineering

- **Shared backlog language**: Epics user-framed (“Players can find a game in under 30s”) plus technical tasks underneath.
- **Design in refinement**: Designers present flows **before** sprint commit; no “surprise” UI at sprint start.
- **Engineering partnership**: Pair on component API, performance, and platform limits (iOS/Android/web).
- **PM partnership**: Design brings **options and tradeoffs** (e.g. faster ship vs. clearer onboarding), PM chooses given business constraints.

---

## Design system and consistency

- Single source of truth (e.g. Figma + code components) with **tokens** (color, type, spacing) aligned to brand and accessibility.
- Contribution model: designers propose, Eng implements reusable pieces; avoid one-off pixels in production without rationale.

---

## Metrics (design-relevant)

- **Behavioral**: Task success rate, time-on-task, drop-off on key funnels.
- **Perceptual**: SUS or short CSAT on critical journeys post-release.
- **Quality**: Accessibility issues found in prod, design-debt backlog size and burn-down.
- **Process**: Time from “problem agreed” to “build-ready spec,” rework rate after handoff.

*GameTap baseline tables: `docs/design/METRICS.md`.*

---

## Risks and mitigations

- **Design as bottleneck**: Timebox discovery; use “good enough” prototypes; parallelize research with build on non-dependent tracks.
- **Design without research**: Allocate minimum research % per quarter; use unmoderated tests when calendar is tight.
- **Beauty over utility**: Tie critiques to user goals and metrics, not taste alone.

---

## 90-day starter sequence (for a new lead)

1. **Weeks 1–2**: Stakeholder map, audit current flows, list top 3 user pain points with PM.
2. **Weeks 3–4**: Establish critique + handoff template; align design system gaps with Eng.
3. **Weeks 5–8**: Run one end-to-end study on highest-risk flow; ship one measurable improvement.
4. **Weeks 9–12**: Document playbook (this plan + templates); retro process and adjust cadence.

---

## Related repository documentation

| Document | Path |
| -------- | ---- |
| Design process & decision rights | `docs/design/DESIGN_PROCESS.md` |
| Rituals & scheduling | `docs/design/RITUALS.md` |
| UX metrics & baseline | `docs/design/METRICS.md` |
| Playbook index | `docs/design/README.md` |

---

*This plan is **org-agnostic**: the same structure applies whether the team is 2 or 20 designers.*
