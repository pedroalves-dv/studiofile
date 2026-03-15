# Session Opening Template

Read the following files before doing anything else:

1. CLAUDE.md
2. docs/STATUS.md
3. docs/phases/phase-11-UX-design-concept.md

Before editing any file: read it first. Systematically Use subagents for any task that requires reading files to gather information before acting — return only the findings to the main session.

Today's task: BUILD Phase 11.2

Scope: Only create or edit the files listed in that sub-prompt.
Do not touch any file not explicitly listed. Do not begin the next sub-phase.

When done:

- Run type checking: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check`
- Fix all errors before finishing — do not use npx or bare npm
- Update docs/STATUS.md — tick completed items
- Tell me what was built and anything deferred or unclear
  