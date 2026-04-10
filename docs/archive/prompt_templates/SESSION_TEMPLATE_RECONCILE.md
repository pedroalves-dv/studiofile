# Session Opening Template

Copy and paste this at the start of every Claude Code session, filling in the blanks.

---

Read the following files before doing anything else:

1. CLAUDE.md
2. docs/STATUS.md
3. docs/phases/phase-5-search.md

All source files live under src/. Use src/ prefix for all file paths.
Path alias @/ maps to src/ — use @/ in imports, src/ in file path references.

Read every existing file that phase-5-search.md mentions before touching anything.
Determine which files those are from the phase prompt — all paths are under src/.

Systematically Use subagents for any task that requires reading many files to gather information before acting — return only the findings to the main session.

Today's task: RECONCILE Phase 5.

The code for this phase was built against older instructions and may not match
the current phase-5-search.md. Do not assume existing code is correct.

For each file listed in the phase prompt:

- If it doesn't exist: create it following the new instructions
- If it exists but differs from the new instructions: update it
- If it exists and already matches: leave it alone and note that it's correct

Scope: Only create or edit files listed in the phase prompt.
Do not touch any file not explicitly listed.

When done:

- Run `npm run type-check` and fix all errors
- Tell me what was already correct, what was updated, and what was created from scratch
- Update docs/STATUS.md
