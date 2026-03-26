# Hero Sticky Columns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the home page `Hero()` function to feature staggered image columns as a scrollable background, with the TOTEM title staying sticky-centered for the full scroll duration.

**Architecture:** The `<section>` gets an explicit `h-[300dvh]` on md+. Placeholder image columns sit in an `absolute inset-0 overflow-hidden` wrapper — invisible on mobile, 2 columns on md, 3 on xl, each staggered via `padding-top`. The TOTEM wrapper is in normal document flow as `sticky top-0 z-10`, which keeps it pinned while the page scrolls through the section. On mobile the section collapses to `min-h-dvh` with all columns hidden and a solid background.

**Tech Stack:** Next.js 15 App Router · Tailwind CSS v3 · TypeScript — one file change, no new dependencies.

**Spec:** `docs/superpowers/specs/2026-03-26-hero-redesign-design.md`

---

## File Map

| File | Action |
| ---- | ------ |
| `src/app/(main)/page.tsx` | Modify — rewrite `Hero()` function only |
| `src/components/home/HeroContent.tsx` | No change |

---

## Task 1: Rewrite the `Hero()` function

**Files:**
- Modify: `src/app/(main)/page.tsx` (lines 15–31, the `Hero` function)

### Critical notes before touching the file

- The current `<section>` has `overflow-hidden` and `section-centered` — **both must be removed** from the section tag. `overflow-hidden` on the section breaks `position: sticky`.
- Do **not** add `overflow-hidden` to the section. It belongs only on the inner `absolute inset-0` columns wrapper.
- The sticky wrapper must be a **sibling** of the columns wrapper (not nested inside it), and must be in **normal document flow** (not `position: absolute`).
- `HeroContent.tsx` is untouched. Its inner `section-centered` handles vertical centering.

---

- [ ] **Step 1: Read the current file**

  Read `src/app/(main)/page.tsx` in full to confirm the exact current state before editing.

- [ ] **Step 2: Replace the `Hero()` function**

  Replace lines 15–31 (the entire `Hero` function) with:

  ```tsx
  function Hero() {
    return (
      <section className="relative w-full min-h-dvh md:h-[300dvh]">
        {/* Image columns — absolute, decorative, clipped at section boundary */}
        <div className="absolute inset-0 hidden md:flex overflow-hidden">
          {/* Column 1 — md+, no offset */}
          <div className="flex-1 flex flex-col">
            <div className="h-dvh w-full bg-light" />
            <div className="h-dvh w-full bg-lighter" />
            <div className="h-dvh w-full bg-light" />
          </div>
          {/* Column 2 — md+, staggered 50dvh */}
          <div className="flex-1 flex flex-col pt-[50dvh]">
            <div className="h-dvh w-full bg-lighter" />
            <div className="h-dvh w-full bg-light" />
            <div className="h-dvh w-full bg-lighter" />
          </div>
          {/* Column 3 — xl+ only, staggered 100dvh */}
          <div className="hidden xl:flex flex-1 flex-col pt-[100dvh]">
            <div className="h-dvh w-full bg-light" />
            <div className="h-dvh w-full bg-lighter" />
            <div className="h-dvh w-full bg-light" />
          </div>
        </div>

        {/* Mobile fallback background */}
        <div className="absolute inset-0 md:hidden bg-light" />

        {/* Sticky TOTEM — in normal document flow */}
        <div className="sticky top-0 z-10">
          <HeroContent />
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3: Run type-check**

  ```bash
  PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check
  ```

  Expected: zero errors. If errors appear, fix before continuing.

- [ ] **Step 4: Start dev server and verify visually**

  ```bash
  PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run dev
  ```

  Open `http://localhost:3000` and check each breakpoint:

  | Breakpoint | What to verify |
  | ---------- | -------------- |
  | **xl (≥1280px)** | 3 staggered columns visible · TOTEM centered · scroll slowly — TOTEM stays put while image blocks slide past |
  | **md (768–1279px)** | Exactly 2 columns · 3rd column absent · sticky still works |
  | **mobile (<768px)** | No columns · solid `bg-light` background · hero is one viewport tall · no extra scroll |
  | **All sizes** | TOTEM letter animation plays on load · ProductSpotlight appears after scrolling through the hero |

  Sticky release check (desktop): scroll to ~200dvh into the hero — the TOTEM title should begin drifting off the **top** of the viewport (not disappear suddenly) as ProductSpotlight enters from below.

- [ ] **Step 5: Commit**

  ```bash
  git add src/app/(main)/page.tsx
  git commit -m "feat: hero sticky columns — staggered image bg, TOTEM sticky on scroll"
  ```

---

## Task 2: Update STATUS.md

**Files:**
- Modify: `docs/STATUS.md`

- [ ] **Step 1: Open and read `docs/STATUS.md`**

- [ ] **Step 2: Add a note under the current phase**

  Mark the hero redesign as done. Note that image columns currently use placeholder color blocks (`bg-light` / `bg-lighter`) — real product/lifestyle images to be swapped in a future phase.

- [ ] **Step 3: Commit**

  ```bash
  git add docs/STATUS.md
  git commit -m "docs: note hero sticky columns complete, images pending"
  ```
