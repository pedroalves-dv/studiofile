# Session 4 — Pages & Components

## Fixed this session

- [C-1] src/lib/shopify/collections.ts — collection products not normalized; Shopify returns `products` as a connection `{ edges: [...] }` but code passed it directly to ProductGrid as `ShopifyProduct[]`, crashing on `.map()`. Added `ShopifyCollectionRaw` interface and `normalizeCollection()` helper; applied to both `getCollection()` and `getCollectionWithPagination()`. (Also resolves Session 1 C-1 deferred item.)
- [C-2] src/components/home/Hero.tsx:3, BrandStory.tsx:4 — `framer-motion` import; package not in `package.json`. Changed both to `motion/react`.
- [C-3] src/app/(landing)/coming-soon/page.tsx:114,117 — `tracking tight` (missing hyphen) on feature headings. CSS not applied. Fixed to `tracking-tight`.
- [C-4] src/components/home/LandingSignup.tsx:46 — `tacking-tight` typo. Fixed to `tracking-tight`.
- [C-5] src/components/layout/Header.tsx:148 — `jsutify-center` typo (flex alignment broken on icons row) + `border-ink` on the icon strip. Fixed to `justify-center` + `border-stroke`.
- [I-12] src/app/(main)/account/(auth)/forgot-password/ForgotPasswordForm.tsx — no error state; `setSubmitted(true)` ran even if the Server Action threw. Added `error` state, wrapped body in try/catch, renders error message on failure.

## Fixed in final pass

- [I-1] src/app/(main)/page.tsx — metadata description was literal `"..."`; replaced with real description.
- [I-2] src/app/(main)/collections/[handle]/page.tsx — `border-border` replaced with `border-stroke`.
- [I-3] src/app/(main)/collections/[handle]/page.tsx — `bg-stone-100` replaced with `bg-lighter`.
- [I-4] src/app/error.tsx — `border-ink` replaced with `border-stroke` on both ArrowButtons.
- [I-5] src/app/not-found.tsx — `text-stone-200` replaced with `text-lighter`.
- [I-6] src/app/not-found.tsx — `border-ink` replaced with `border-stroke`.
- [I-7] src/app/global-error.tsx — hardcoded hex colors corrected: `#FAF7F2`→`#FAF5F0` (canvas), `#1A1917`→`#31302e` (ink ×2), `#6B6561`→`#6B6560` (muted).
- [I-8] src/app/(main)/about/page.tsx — `bg-stone-100`→`bg-lighter`, `from-stone-200`→`from-stroke`, `to-stone-300`→`to-light`.
- [I-9] src/app/(landing)/coming-soon/page.tsx — `font-inter` experimental token removed from both occurrences.
- [I-10] src/app/(landing)/coming-soon/page.tsx — `border-ink` replaced with `border-stroke`.
- [I-13] src/app/(main)/account/(auth)/login/LoginForm.tsx — event parameter typed as `React.FormEvent<HTMLFormElement>`.
- [I-14] src/components/search/SearchBar.tsx — `border-stroke` added to conditional border class.
- [I-15] src/components/search/PredictiveSearch.tsx — `bg-stone-50` replaced with `bg-canvas` (3 occurrences).
- [I-16] src/components/home/LandingStackSection.tsx — `bg-black` replaced with `bg-ink`.
- [I-18] src/components/product/RecentlyViewed.tsx — silent `.catch(() => {})` replaced with `.catch((err) => console.error('[RecentlyViewed]', err))`.
- [I-19] src/components/home/Process.tsx + FeaturedProducts.tsx — confirmed unused (no importers); both files deleted.
- [M-1] src/app/not-found.tsx — commented-out dead code block removed.
- [M-2] src/app/(main)/faq/page.tsx — `bg-white` replaced with `bg-canvas`.
- [M-3] src/app/(main)/faq/page.tsx — large commented-out code block removed.
- [M-4] src/app/(landing)/coming-soon/page.tsx — redundant `tracking-tight` (overridden by `tracking-tighter`) removed.
- [M-5] src/components/layout/Header.tsx — `bg-white` replaced with `bg-canvas` on account button open state.
- [M-6] src/components/account/AccountNav.tsx — template literal conditional className converted to `cn()`.
- [M-7] src/app/(main)/account/(protected)/orders/page.tsx — empty `className=""` attribute removed.
- [M-8] src/components/home/BrandStory.tsx — outer module-level `fadeUp` const removed (shadowed by inner definition in AnimatedParagraph).
- [M-9] src/components/layout/Footer.tsx — orphaned `email` state, `setEmail` setter, and unused `handleNewsletterSubmit` removed.
- [M-10] src/components/search/SortSelect.tsx — hardcoded `#8A8580` in SVG data URI replaced with `%236B6560` (muted token).
- [M-11] src/components/home/HeroContent.tsx + LandingParallaxImages.tsx — large commented-out code blocks removed.

## Requires human decision

- [I-11] src/app/(main)/faq/page.tsx — last 3 FAQ items have duplicate question titles (copy-paste error); pre-launch content fix needed. Not a code change.
- [I-17] src/components/product/VariantSelector.tsx — `aria-pressed` misused on mutually exclusive options; should be `role="radio"` + `aria-checked` inside a `<fieldset>`. Accessibility refactor — separate scope.
