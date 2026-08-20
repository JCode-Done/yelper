# Design team playbook (repo)

UX/Design-led process documentation for **GameTap**. Use these files with PM and Engineering; copy templates into Notion/Figma wiki if your org prefers.

| Doc | Purpose |
| --- | ------- |
| [ProductUXPlan.md](./ProductUXPlan.md) / [ProductUXPlan.pdf](./ProductUXPlan.pdf) | Full UX-led product design plan (PDF export) |
| [DESIGN_PROCESS.md](./DESIGN_PROCESS.md) | Phases (discover → deliver), exit criteria, decision rights |
| [RITUALS.md](./RITUALS.md) | Recurring rituals, scheduling checklist |
| [METRICS.md](./METRICS.md) | UX metrics and baseline table for GameTap |
| [templates/problem-brief.md](./templates/problem-brief.md) | Problem framing before build |
| [templates/flow-spec-handoff.md](./templates/flow-spec-handoff.md) | Design → Eng handoff |
| [templates/ux-qa-checklist.md](./templates/ux-qa-checklist.md) | Pre-release UX QA |

**Regenerate the PDF** (requires Python 3 + `fpdf2`, `markdown`; on macOS uses Arial Unicode from `/System/Library/Fonts/Supplemental/`):

```bash
cd docs/design
python3 -m venv .pdf-venv
.pdf-venv/bin/pip install fpdf2 markdown
.pdf-venv/bin/python export_product_ux_plan.py
```
