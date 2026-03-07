# Session Opening Template

Copy and paste this at the start of every Claude Code session, filling in the blanks.

---

Read the following files before doing anything else:

1. CLAUDE.md
2. docs/STATUS.md
3. docs/phases/phase-3-infrastructure.md

All source files live under src/. Use src/ prefix for all file paths.
Path alias @/ maps to src/ — use @/ in imports, src/ in file path references.

Then read the existing files this phase will touch before editing them.
Determine which files those are from the phase prompt — all paths are under src/.

Use subagents for any task that requires reading many files to gather information
before acting — return only the findings to the main session.

Today's task: AUDIT Phase 3 — do not build anything new.

Scope: Only create or edit the files listed in the phase prompt.
Do not touch any file not explicitly listed.

When done:

- Run tsc --noEmit and fix all errors
- Tell me what you built and what (if anything) was deferred or unclear
  