# Session Opening Template

Copy and paste this at the start of every Claude Code session, filling in the blanks.

---

Read the following files before doing anything else:

1. CLAUDE.md
2. docs/STATUS.md
3. docs/phases/phase-10-polish.md

All source files live under src/. Use src/ prefix for all file paths.
Path alias @/ maps to src/ — use @/ in imports, src/ in file path references.

Read the existing files this phase will touch before editing them.
Determine which files those are from the phase prompt — all paths are under src/.

Systematically Use subagents for any task that requires reading many files to gather information before acting — return only the findings to the main session.

Today's task: BUILD Phase 10.

Scope: Only create or edit the files listed in the phase prompt.
Do not touch any file not explicitly listed.

When done:

- Run Run Type checking: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` and fix all errors. Do not use `npx` or bare `npm` directly — nvm is not available in the shell. Always prepend `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"` to any Node/npm commands.
- Tell me what you built and what (if anything) was deferred or unclear
- Update docs/STATUS.md accordingly
  