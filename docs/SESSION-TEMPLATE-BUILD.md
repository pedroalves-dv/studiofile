# Session Build Template

Use this file to start any build session. Update only the phase number and file name in the prompt below.

---

## Prompt

Read the following files before doing anything else:

1. `CLAUDE.md` — project rules, design constraints, TypeScript standards
2. `docs/STATUS.md` — current progress, deferred items, known issues
3. `docs/phases/phase-[N]-[name].md` — the phase instructions for this session

Then build exactly what is specified in the phase file, section by section.

Work through each sub-prompt in order. After each sub-prompt:

- Run `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — fix all errors before continuing
- Commit: `feat: phase [N].[sub] — [description]`
- Update `docs/STATUS.md`

Do not start the next sub-prompt until the current one type-checks clean.
