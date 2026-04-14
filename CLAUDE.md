# CLAUDE.md — Studiofile

## Context

Premium Paris design studio's e-commerce website.
User is a beginner "vibe-coder."
Current Status: Soft-launch (All traffic redirected to `/coming-soon`).

## Modular Rules

Detailed instructions are offloaded to reduce context tokens:

- **Design/UI**: See @.claude/rules/style.md
- **Shopify/Auth**: See @.claude/rules/shopify.md
- **TOTEM Logic**: See @.claude/rules/totem.md
- **Lessons**: See @.claude/rules/lessons.md

## Critical Commands

- **Type-Check**: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check`
- **Graphify**: Always check `@graphify-out/GRAPH_REPORT.md` before architecture changes.

## Workflow

1. **Plan Mode**: Default to "Plan mode" for non trivial 3+ step tasks.
2. **Subagents**: Use for research to keep main window clean.
3. **Maintenance**: After a correction, update @.claude/rules/lessons.md.
  
## Design

- Treat the code as truth.
- Use lucid for icons.
- Use rounded-lg for border radius.
- use global.css utilities.
