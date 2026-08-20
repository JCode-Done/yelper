# Design-led process: phases and decision rights

This document aligns Product, Engineering, and Design on **how** we work before and during delivery. It applies to GameTap and can be reused for adjacent products.

## Purpose and north star

- **Design** leads **problem framing**, **experience quality**, and **user-validated direction**.
- **Product** owns **business outcomes**, **priority**, and **scope**.
- **Engineering** owns **feasibility**, **implementation**, and **technical tradeoffs**.

Design does not replace PM or Eng; it **raises clarity** so the squad ships the right thing with fewer surprises.

**North star:** Decisions should be traceable to **user needs** and **measurable experience quality** (usability, accessibility, satisfaction), not feature count alone.

---

## Phases: discover → define → validate → deliver

Each phase has **exit criteria** so the squad agrees when to move on.

### 1. Discover

**Goals:** Shared understanding of the problem, users, and constraints.

**Activities (examples):** Problem statement, jobs-to-be-done, competitive or heuristic review, analytics review.

**Exit criteria (with PM):**

- Problem and **non-goals** are written down.
- **Success signals** agreed (what “better” means for users and business).
- Scope is bounded enough to estimate next phase.

**Lead:** Design facilitates; **PM** signs off on scope and success signals.

---

### 2. Define

**Goals:** Buildable picture of the experience (flows, IA, key states).

**Activities (examples):** User flows, information architecture, low → mid fidelity screens or prototypes.

**Exit criteria (with Eng):**

- Eng can **estimate** work and name **major risks** (platform, performance, data).
- Edge cases surfaced: empty, loading, error, permissions (as relevant).

**Lead:** Design owns artifacts; **Eng** signs off on feasibility for estimate; **PM** confirms priority vs. timeline.

---

### 3. Validate

**Goals:** Reduce risk on high-impact flows before or alongside build.

**Activities (examples):** Usability tests, hallway tests, A/B or qualitative checks on critical paths.

**Exit criteria:**

- Blockers are **fixed** or **explicitly accepted** with documented tradeoff (PM + Design).

**Lead:** Design + Research (if any); **PM** accepts residual risk.

---

### 4. Deliver

**Goals:** Ship matches intent; accessibility and UX acceptance are visible.

**Activities (examples):** High-fidelity specs, interaction notes, design QA in staging, accessibility pass.

**Exit criteria:**

- Handoff complete per [flow-spec-handoff template](./templates/flow-spec-handoff.md).
- UX QA per [ux-qa-checklist](./templates/ux-qa-checklist.md) for the epic (or agreed subset).

**Lead:** Design specifies and QA’s experience; **Eng** merges and releases; **PM** accepts release against goals.

---

## Decision rights (RACI-style summary)

| Topic | Primary owner | Consulted | Informed |
| ----- | ------------- | --------- | -------- |
| User problem framing & success metrics | Design + PM | Eng | Stakeholders |
| Scope & priority | PM | Design, Eng | Stakeholders |
| Technical approach & estimates | Eng | Design, PM | — |
| Visual / interaction spec | Design | Eng | PM |
| Ship / no-ship for release | PM | Eng, Design | Stakeholders |
| Accessibility bar for release | Design + Eng | PM | — |

**Conflict resolution:** If Design, PM, and Eng disagree after discussion, **PM** breaks ties on scope/timeline; **Eng** on technical impossibility; escalate to leadership only when tradeoff is strategic (e.g. brand vs. velocity).

---

## Related docs

- [RITUALS.md](./RITUALS.md) — cadence and meetings
- [templates/](./templates/) — problem brief, flow spec, UX QA
- [METRICS.md](./METRICS.md) — UX metrics and baselines for GameTap
