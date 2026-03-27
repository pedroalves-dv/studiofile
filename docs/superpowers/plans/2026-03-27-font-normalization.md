# Font Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all `font-mono`, `font-body`, and `font-serif` Tailwind classes from component and page files so that Geist Sans is inherited from the `body` default, leaving `font-display` as the only explicit font class in the codebase.

**Architecture:** Pure class removal — no font mapping changes, no visual change (all three classes already resolve to Geist Sans at runtime). The `body` element already sets `font-family: var(--font-body)` in `globals.css`. Tailwind's preflight handles `font-family: inherit` on form controls. Each task covers one logical area of the codebase and ends with a commit.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v3

---

## Exceptions — Do NOT touch these

- `src/app/global-error.tsx:12` — inline style `fontFamily: 'var(--font-body), system-ui, sans-serif'` is an error boundary that renders outside the normal DOM tree. Keep it.
- `src/app/globals.css` lines 179, 193, 234 — CSS rule definitions (`font-family: var(--font-body)`, `font-family: var(--font-mono)`). These are not component classes; they are intentional CSS. Keep them.
- All `font-display` instances everywhere — out of scope for this plan.

---

## Removal pattern

When removing a font class token from a `className` string:
- `"font-mono text-sm text-muted"` → `"text-sm text-muted"`
- `"text-sm font-body tracking-tight"` → `"text-sm tracking-tight"`
- `"font-body"` (sole class) → remove the `className` prop entirely, or replace with another class if needed
- Clean up any double spaces left behind

---

## Task 1: UI Primitives

**Files:**
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/ui/Input.tsx`
- Modify: `src/components/ui/Badge.tsx`
- Modify: `src/components/ui/CustomSelect.tsx`
- Modify: `src/components/ui/ArrowButton.tsx`
- Modify: `src/components/ui/CustomerAvatar.tsx`

- [ ] **Step 1: Pre-check — count instances**

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" grep -n "font-mono\|font-body\|font-serif" \
  src/components/ui/Button.tsx \
  src/components/ui/Input.tsx \
  src/components/ui/Badge.tsx \
  src/components/ui/CustomSelect.tsx \
  src/components/ui/ArrowButton.tsx \
  src/components/ui/CustomerAvatar.tsx
```

Expected: 14 matches total.

- [ ] **Step 2: Edit `Button.tsx` line 28**

Remove `font-mono` from the base class string.

Before:
```
'relative inline-flex items-center justify-center font-mono text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed';
```
After:
```
'relative inline-flex items-center justify-center text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed';
```

- [ ] **Step 3: Edit `Input.tsx` — 4 instances**

Line 31: `"px-1 block text-sm font-mono mb-1 text-light"` → `"px-1 block text-sm mb-1 text-light"`
Line 40: remove `font-mono` from the template literal
Line 45: `"text-error text-xs font-mono mt-1"` → `"text-error text-xs mt-1"`
Line 47: `"text-muted text-xs font-mono mt-1"` → `"text-muted text-xs mt-1"`

- [ ] **Step 4: Edit `Badge.tsx` line 17**

`"inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-display ..."` → remove `font-mono`

- [ ] **Step 5: Edit `CustomSelect.tsx` — 3 instances**

Line 32: `"px-1 block text-sm font-mono mb-1 text-light"` → `"px-1 block text-sm mb-1 text-light"`
Line 38: remove `font-mono` from className
Line 64: remove `font-mono` from className

- [ ] **Step 6: Edit `ArrowButton.tsx` line 31**

`<span className="font-body absolute -left-6 ...">` → `<span className="absolute -left-6 ...">`

- [ ] **Step 7: Edit `CustomerAvatar.tsx` — 4 instances**

Lines 23, 33, 38, 41: remove `font-body` from each className string.

- [ ] **Step 8: Post-check — verify zero matches**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/ui/Button.tsx \
  src/components/ui/Input.tsx \
  src/components/ui/Badge.tsx \
  src/components/ui/CustomSelect.tsx \
  src/components/ui/ArrowButton.tsx \
  src/components/ui/CustomerAvatar.tsx
```

Expected: no output.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/Button.tsx src/components/ui/Input.tsx src/components/ui/Badge.tsx src/components/ui/CustomSelect.tsx src/components/ui/ArrowButton.tsx src/components/ui/CustomerAvatar.tsx
git commit -m "refactor: remove font-mono/font-body from UI primitives"
```

---

## Task 2: Cart Components

**Files:**
- Modify: `src/components/cart/CartItem.tsx`
- Modify: `src/components/cart/CartSummary.tsx`
- Modify: `src/components/cart/EmptyCart.tsx`
- Modify: `src/components/cart/TotemCartGroup.tsx`

- [ ] **Step 1: Pre-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/cart/CartItem.tsx \
  src/components/cart/CartSummary.tsx \
  src/components/cart/EmptyCart.tsx \
  src/components/cart/TotemCartGroup.tsx
```

Expected: ~13 matches (3 in CartItem, 3 in CartSummary, 1 live + 1 commented in EmptyCart, 6 in TotemCartGroup).

- [ ] **Step 2: Edit `CartItem.tsx` — 3 instances (lines 56, 75, 86)**

Remove `font-mono` from each className.

- [ ] **Step 3: Edit `CartSummary.tsx` — 3 instances (lines 36, 45, 59)**

Remove `font-mono` from each className.

- [ ] **Step 4: Edit `EmptyCart.tsx`**

Line 14: `"text-7xl font-body font-semibold tracking-[-0.07em] ..."` → remove `font-body`
Line 17 is a comment — leave as-is (commented code).

- [ ] **Step 5: Edit `TotemCartGroup.tsx` — 6 instances (lines 74, 77, 81, 104, 108, 121)**

Remove `font-mono` from each className.

- [ ] **Step 6: Post-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/cart/CartItem.tsx \
  src/components/cart/CartSummary.tsx \
  src/components/cart/EmptyCart.tsx \
  src/components/cart/TotemCartGroup.tsx
```

Expected: no output (the comment in EmptyCart.tsx will not be flagged as it is preceded by `//`). If it is flagged, that's fine — it is commented code and safe to ignore.

- [ ] **Step 7: Commit**

```bash
git add src/components/cart/CartItem.tsx src/components/cart/CartSummary.tsx src/components/cart/EmptyCart.tsx src/components/cart/TotemCartGroup.tsx
git commit -m "refactor: remove font-mono/font-body from cart components"
```

---

## Task 3: Product Components (excluding TotemConfigurator)

**Files:**
- Modify: `src/components/product/ProductCard.tsx`
- Modify: `src/components/product/ProductGrid.tsx`
- Modify: `src/components/product/ProductInfoPanel.tsx`
- Modify: `src/components/product/VariantSelector.tsx`

- [ ] **Step 1: Pre-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/product/ProductCard.tsx \
  src/components/product/ProductGrid.tsx \
  src/components/product/ProductInfoPanel.tsx \
  src/components/product/VariantSelector.tsx
```

Expected: ~9 matches.

- [ ] **Step 2: Edit `ProductCard.tsx` — 2 instances (lines 67, 71)**

Remove `font-mono` from each className.

- [ ] **Step 3: Edit `ProductGrid.tsx` — 2 instances (lines 71, 77)**

Remove `font-mono` from each className.

- [ ] **Step 4: Edit `ProductInfoPanel.tsx` — 3 instances (lines 97, 102, 155)**

Remove `font-mono` from each className.

Line 155 also has `border-border` — leave that alone, only remove `font-mono`.

- [ ] **Step 5: Edit `VariantSelector.tsx` line 93**

`'px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all duration-200'` → remove `font-mono`

- [ ] **Step 6: Post-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/product/ProductCard.tsx \
  src/components/product/ProductGrid.tsx \
  src/components/product/ProductInfoPanel.tsx \
  src/components/product/VariantSelector.tsx
```

Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/components/product/ProductCard.tsx src/components/product/ProductGrid.tsx src/components/product/ProductInfoPanel.tsx src/components/product/VariantSelector.tsx
git commit -m "refactor: remove font-mono from product components"
```

---

## Task 4: Layout, Search, Wishlist, Contact

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Breadcrumb.tsx`
- Modify: `src/components/layout/NewsletterForm.tsx`
- Modify: `src/components/search/PredictiveSearch.tsx`
- Modify: `src/components/wishlist/WishlistDrawer.tsx`
- Modify: `src/components/contact/ContactForm.tsx`

- [ ] **Step 1: Pre-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/layout/Header.tsx \
  src/components/layout/Breadcrumb.tsx \
  src/components/layout/NewsletterForm.tsx \
  src/components/search/PredictiveSearch.tsx \
  src/components/wishlist/WishlistDrawer.tsx \
  src/components/contact/ContactForm.tsx
```

Expected: ~16 matches (5 in Header, 1 in Breadcrumb, 1 in NewsletterForm, 1 in PredictiveSearch, 1 in WishlistDrawer, 4 in ContactForm).

- [ ] **Step 2: Edit `Header.tsx` — 5 instances (lines 134, 181, 191, 284, 296)**

Remove `font-body` from each className string.

- [ ] **Step 3: Edit `Breadcrumb.tsx` line 40**

`"font-mono text-xs text-muted uppercase tracking-wider"` → `"text-xs text-muted uppercase tracking-wider"`

- [ ] **Step 4: Edit `NewsletterForm.tsx` line 24**

Remove `font-mono` from className.

- [ ] **Step 5: Edit `PredictiveSearch.tsx` line 123**

Remove `font-mono` from className.

- [ ] **Step 6: Edit `WishlistDrawer.tsx` line 69**

Remove `font-mono` from className.

- [ ] **Step 7: Edit `ContactForm.tsx` — 4 instances**

Line 92 is a comment — leave as-is.
Lines 201, 212, 217: remove `font-mono` from each className.

- [ ] **Step 8: Post-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/layout/Header.tsx \
  src/components/layout/Breadcrumb.tsx \
  src/components/layout/NewsletterForm.tsx \
  src/components/search/PredictiveSearch.tsx \
  src/components/wishlist/WishlistDrawer.tsx \
  src/components/contact/ContactForm.tsx
```

Expected: no output (comments excepted).

- [ ] **Step 9: Commit**

```bash
git add \
  src/components/layout/Header.tsx \
  src/components/layout/Breadcrumb.tsx \
  src/components/layout/NewsletterForm.tsx \
  src/components/search/PredictiveSearch.tsx \
  src/components/wishlist/WishlistDrawer.tsx \
  src/components/contact/ContactForm.tsx
git commit -m "refactor: remove font-mono/font-body from layout, search, wishlist, contact"
```

---

## Task 5: Home Components

**Files:**
- Modify: `src/components/home/Process.tsx`
- Modify: `src/components/home/HeroContent.tsx`
- Modify: `src/components/home/FeaturedProducts.tsx`
- Modify: `src/components/home/Collections.tsx`
- Modify: `src/components/home/LandingMinimalHeader.tsx`
- Modify: `src/components/home/LandingStackSection.tsx`
- Modify: `src/components/home/LandingSignup.tsx`
- Modify: `src/components/home/LandingParallaxImages.tsx`
- Modify: `src/components/home/ProductSpotlight.tsx`

- [ ] **Step 1: Pre-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/home/Process.tsx \
  src/components/home/HeroContent.tsx \
  src/components/home/FeaturedProducts.tsx \
  src/components/home/Collections.tsx \
  src/components/home/LandingMinimalHeader.tsx \
  src/components/home/LandingStackSection.tsx \
  src/components/home/LandingSignup.tsx \
  src/components/home/LandingParallaxImages.tsx \
  src/components/home/ProductSpotlight.tsx
```

Expected: ~33 matches.

- [ ] **Step 2: Edit `Process.tsx` — 3 `font-serif` instances (lines 59, 62, 68)**

Remove `font-serif` from each className. The italic styling (`italic`) on these elements can stay if present; only `font-serif` is removed.

Before (line 59): `<p className="font-serif italic text-3xl text-ink">`
After: `<p className="italic text-3xl text-ink">`

- [ ] **Step 3: Edit `HeroContent.tsx` line 109**

`"tracking-display font-mono rounded-xl flex items-center justify-center"` → `"tracking-display rounded-xl flex items-center justify-center"`

- [ ] **Step 4: Edit `FeaturedProducts.tsx` — 7 instances (lines 42, 45, 72, 75, 110, 113, 129)**

Remove `font-mono` from each className.

- [ ] **Step 5: Edit `Collections.tsx` line 42**

Remove `font-mono` from className.

- [ ] **Step 6: Edit `LandingMinimalHeader.tsx` — 3 instances (lines 34, 37, 40)**

Remove `font-body` from each className.

- [ ] **Step 7: Edit `LandingStackSection.tsx` — 3 instances (lines 82, 224, 229)**

Lines 82 and 229: remove `font-mono`
Line 224: remove `font-body`

- [ ] **Step 8: Edit `LandingSignup.tsx` — 9 instances (lines 44, 48, 63, 74, 85, 96, 108, 118, 123)**

Remove `font-body` from each className.

- [ ] **Step 9: Edit `LandingParallaxImages.tsx` — 8 instances (lines 73, 78, 117, 123, 301, 306, 313, 318)**

Remove `font-body` from each className.

- [ ] **Step 10: Edit `ProductSpotlight.tsx` — 2 instances (lines 29, 52)**

Remove `font-body` from each className.

- [ ] **Step 11: Post-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/home/Process.tsx \
  src/components/home/HeroContent.tsx \
  src/components/home/FeaturedProducts.tsx \
  src/components/home/Collections.tsx \
  src/components/home/LandingMinimalHeader.tsx \
  src/components/home/LandingStackSection.tsx \
  src/components/home/LandingSignup.tsx \
  src/components/home/LandingParallaxImages.tsx \
  src/components/home/ProductSpotlight.tsx
```

Expected: no output.

- [ ] **Step 12: Commit**

```bash
git add \
  src/components/home/Process.tsx \
  src/components/home/HeroContent.tsx \
  src/components/home/FeaturedProducts.tsx \
  src/components/home/Collections.tsx \
  src/components/home/LandingMinimalHeader.tsx \
  src/components/home/LandingStackSection.tsx \
  src/components/home/LandingSignup.tsx \
  src/components/home/LandingParallaxImages.tsx \
  src/components/home/ProductSpotlight.tsx
git commit -m "refactor: remove font-mono/font-body/font-serif from home components"
```

---

## Task 6: Account Components & Auth

**Files:**
- Modify: `src/components/account/AccountNav.tsx`
- Modify: `src/components/account/OrderCard.tsx`
- Modify: `src/app/(main)/account/(auth)/login/LoginForm.tsx`
- Modify: `src/app/(main)/account/(protected)/settings/SettingsForm.tsx`
- Modify: `src/app/(main)/account/(protected)/addresses/AddressManager.tsx`

- [ ] **Step 1: Pre-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/account/AccountNav.tsx \
  src/components/account/OrderCard.tsx \
  "src/app/(main)/account/(auth)/login/LoginForm.tsx" \
  "src/app/(main)/account/(protected)/settings/SettingsForm.tsx" \
  "src/app/(main)/account/(protected)/addresses/AddressManager.tsx"
```

Expected: ~31 matches.

- [ ] **Step 2: Edit `AccountNav.tsx` line 58**

`"relative text-base font-medium tracking-[-0.04em] font-body px-4 py-2 ..."` → remove `font-body`

- [ ] **Step 3: Edit `OrderCard.tsx` line 45**

Remove `font-mono` from className.

- [ ] **Step 4: Edit `LoginForm.tsx` — 4 instances**

Grep first to confirm line numbers, then remove `font-mono` from each className.

```bash
grep -n "font-mono" "src/app/(main)/account/(auth)/login/LoginForm.tsx"
```

- [ ] **Step 5: Edit `SettingsForm.tsx` — 3 instances (lines 20, 82, 151)**

Line 20: `const labelClass = "font-body text-light text-base tracking-tight"` → `const labelClass = "text-light text-base tracking-tight"`
Lines 82 and 151: remove `font-body` from className.

- [ ] **Step 6: Edit `AddressManager.tsx` — 23 instances**

Line 53 const: `const labelClass = "font-body text-light text-base tracking-tight"` → `const labelClass = "text-light text-base tracking-tight"`
Lines 642, 649, 658, 691, 709, 744, 750, 754, 758, 763, 767, 777, 784, 792: remove `font-body`
Lines with `font-mono` (lines referenced in Task 1 pre-check from earlier): remove `font-mono`

Confirm all instances:
```bash
grep -n "font-mono\|font-body" "src/app/(main)/account/(protected)/addresses/AddressManager.tsx"
```

- [ ] **Step 7: Post-check**

```bash
grep -n "font-mono\|font-body\|font-serif" \
  src/components/account/AccountNav.tsx \
  src/components/account/OrderCard.tsx \
  "src/app/(main)/account/(auth)/login/LoginForm.tsx" \
  "src/app/(main)/account/(protected)/settings/SettingsForm.tsx" \
  "src/app/(main)/account/(protected)/addresses/AddressManager.tsx"
```

Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add \
  src/components/account/AccountNav.tsx \
  src/components/account/OrderCard.tsx \
  "src/app/(main)/account/(auth)/login/LoginForm.tsx" \
  "src/app/(main)/account/(protected)/settings/SettingsForm.tsx" \
  "src/app/(main)/account/(protected)/addresses/AddressManager.tsx"
git commit -m "refactor: remove font-mono/font-body from account components"
```

---

## Task 7: TotemConfigurator

**Files:**
- Modify: `src/components/product/TotemConfigurator.tsx`

This file has the most instances (~35 combined). Read the full file first to understand context, then remove all `font-mono` and `font-body` tokens.

- [ ] **Step 1: Pre-check — list all instances**

```bash
grep -n "font-mono\|font-body\|font-serif" src/components/product/TotemConfigurator.tsx
```

Expected: ~35 matches across lines 605–1174.

- [ ] **Step 2: Remove all `font-body` instances**

Lines: 605, 608, 611, 618, 621, 624, 742, 749, 792, 853, 860, 870, 925, 939, 966, 992, 995, 1024, 1038, 1056, 1065, 1094, 1104, 1114, 1123, 1126, 1131, 1147, 1160, 1174

Remove `font-body` from each className string.

- [ ] **Step 3: Remove all `font-mono` instances**

Lines: 967, 1014, 1057, 1090, 1144

Remove `font-mono` from each className string.

- [ ] **Step 4: Post-check**

```bash
grep -n "font-mono\|font-body\|font-serif" src/components/product/TotemConfigurator.tsx
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/components/product/TotemConfigurator.tsx
git commit -m "refactor: remove font-mono/font-body from TotemConfigurator"
```

---

## Task 8: Pages

**Files:**
- Modify: `src/app/(main)/about/page.tsx`
- Modify: `src/app/(main)/faq/page.tsx`
- Modify: `src/app/(main)/contact/page.tsx`
- Modify: `src/app/(landing)/coming-soon/page.tsx`
- Modify: `src/app/(main)/account/(protected)/page.tsx`
- Modify: `src/app/(main)/account/(protected)/orders/page.tsx`
- Modify: `src/app/(main)/account/(protected)/addresses/page.tsx`
- Modify: `src/app/(main)/account/(protected)/settings/page.tsx`

Also check and clean remaining pages with `font-mono`:
- `src/app/collections/page.tsx`
- `src/app/(main)/policies/[handle]/page.tsx`
- `src/app/(main)/products/[handle]/page.tsx`

- [ ] **Step 1: Pre-check — all page files**

```bash
grep -rn "font-mono\|font-body\|font-serif" src/app/ --include="*.tsx" \
  | grep -v "global-error.tsx" \
  | grep -v "globals.css"
```

This shows all remaining page-level instances. Note the count.

- [ ] **Step 2: Edit `about/page.tsx` — 12 instances (lines 69, 72, 115, 121, 124, 132, 135, 148, 151, 154, 157, 164)**

Remove `font-body` from each className.

- [ ] **Step 3: Edit `faq/page.tsx` — 5 instances**

Lines 78, 83, 102, 111: remove `font-body`
Line 137: remove `font-mono`
Line 105: is a comment — leave as-is.

- [ ] **Step 4: Edit `contact/page.tsx` line 20**

Remove `font-body` from className.

- [ ] **Step 5: Edit `coming-soon/page.tsx` — 6 instances (lines 57, 67, 83, 92, 111, 117)**

Remove `font-body` from each className.

- [ ] **Step 6: Edit account protected pages — 4 files, 1 instance each**

`account/(protected)/page.tsx` line 20: remove `font-body`
`account/(protected)/orders/page.tsx` line 21: remove `font-body`
`account/(protected)/addresses/page.tsx` line 21: remove `font-body`
`account/(protected)/settings/page.tsx` line 18: remove `font-body`

- [ ] **Step 7: Edit remaining pages with `font-mono`**

```bash
grep -n "font-mono\|font-body" \
  src/app/collections/page.tsx \
  "src/app/(main)/policies/[handle]/page.tsx" \
  "src/app/(main)/products/[handle]/page.tsx"
```

Remove all matches found.

- [ ] **Step 8: Post-check — full pages sweep**

```bash
grep -rn "font-mono\|font-body\|font-serif" src/app/ --include="*.tsx" \
  | grep -v "global-error.tsx"
```

Expected: no output.

- [ ] **Step 9: Commit**

```bash
git add \
  "src/app/(main)/about/page.tsx" \
  "src/app/(main)/faq/page.tsx" \
  "src/app/(main)/contact/page.tsx" \
  "src/app/(landing)/coming-soon/page.tsx" \
  "src/app/(main)/account/(protected)/page.tsx" \
  "src/app/(main)/account/(protected)/orders/page.tsx" \
  "src/app/(main)/account/(protected)/addresses/page.tsx" \
  "src/app/(main)/account/(protected)/settings/page.tsx" \
  src/app/collections/page.tsx \
  "src/app/(main)/policies/[handle]/page.tsx" \
  "src/app/(main)/products/[handle]/page.tsx"
git commit -m "refactor: remove font-mono/font-body from page files"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Full-codebase sweep for removed classes**

```bash
grep -rn "font-mono\|font-body\|font-serif" src/ --include="*.tsx" --include="*.ts" \
  | grep -v "global-error.tsx" \
  | grep -v "globals.css" \
  | grep -v "tailwind.config"
```

Expected: no output. If any remain, fix them before proceeding.

- [ ] **Step 2: Verify `font-display` is untouched**

```bash
grep -rn "font-display" src/ --include="*.tsx" | wc -l
```

Count should match pre-change count (~65). No instances should have been added or removed.

- [ ] **Step 3: Type-check**

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check
```

Expected: zero errors.

---

## Task 10: Documentation Updates

**Files:**
- Modify: `CLAUDE.md`
- Modify: `docs/STATUS.md`
- Modify: `/home/jira/.claude/projects/-home-jira-Desktop-studiofile/memory/MEMORY.md`
- Modify: relevant memory files in `/home/jira/.claude/projects/-home-jira-Desktop-studiofile/memory/`

- [ ] **Step 1: Update `CLAUDE.md` Typography section**

Current lines 179–182:
```
- Display: `Noka` (`font-display`) — logo font, used sparingly for product type animations
- Body: `Geist Sans` (`font-body`) — Main font, all headings, body text
- Mono labels: `JetBrains Mono` (`font-mono`) — small details: prices, tags, UI labels
- Accent Typography: `Instrument Serif` (`font-serif`) — not yet used.
```

Replace with:
```
- Display: `Noka` (`font-display`) — product font; used for product titles, section headings, and type animations. The only font class used in components.
- Body: `Geist Sans` — default font, set on `body` in `globals.css`; inherited by all elements. Do not add `font-body` to components — it is redundant.
- `font-mono`, `font-serif` — removed from all components. Tokens remain in config for potential future use but must not be added to components.
```

- [ ] **Step 2: Update `docs/STATUS.md`**

Find the deferred notes section (line ~123) that says:
```
- **Experimental font tokens in `tailwind.config.ts`** — ... Only the canonical tokens (`font-display`, `font-body`, `font-mono`, `font-serif`) should be used in production components.
```

Update to:
```
- **Font normalization complete** — `font-body`, `font-mono`, and `font-serif` classes removed from all components. Geist Sans is inherited from the `body` default. Only `font-display` (Noka) is used explicitly in components.
- **Experimental font tokens in `tailwind.config.ts`** — `font-tasa`, `font-hubot`, `font-mona`, `font-zal`, `font-funnel`, `font-khregular`, `font-khbold`, `font-stack`, `font-stacktext`, `font-mono2` exist for type testing only. Do not use in production components until a font decision is made.
```

- [ ] **Step 3: Update memory files**

In `/home/jira/.claude/projects/-home-jira-Desktop-studiofile/memory/MEMORY.md`, find the Design Rules section and update the font entries:

Find:
```
- `font-display` = `Noka` (headings, h1–h6, large editorial text)
- `font-body` = `Geist Sans` (body copy)
- `font-mono` = `JetBrains Mono` (prices, labels, UI text, buttons)
- `font-serif` = `Instrument Serif` (narrative paragraphs, pull quotes)
```

Replace with:
```
- `font-display` = `Noka` — the ONLY font class used in components (product titles, section headings, animations)
- Body font = `Geist Sans` — inherited from `body` default in `globals.css`; do NOT add `font-body` to components
- `font-mono`, `font-serif` — removed from all components; tokens remain in config but must not be used
```

Also update any standalone memory files in that directory that reference `font-mono` or `font-body` usage guidance.

- [ ] **Step 4: Commit documentation**

```bash
git add CLAUDE.md docs/STATUS.md
git commit -m "docs: update font normalization — font-display only in components"
```

Note: memory files are not part of the repo and don't need to be committed.
