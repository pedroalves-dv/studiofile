# Session 4 — Pages & Components

## Fixed this session
- [C-1] src/lib/shopify/collections.ts — collection products not normalized; Shopify returns `products` as a connection `{ edges: [...] }` but code passed it directly to ProductGrid as `ShopifyProduct[]`, crashing on `.map()`. Added `ShopifyCollectionRaw` interface and `normalizeCollection()` helper; applied to both `getCollection()` and `getCollectionWithPagination()`. (Also resolves Session 1 C-1 deferred item.)
- [C-2] src/components/home/Hero.tsx:3, BrandStory.tsx:4 — `framer-motion` import; package not in `package.json`. Changed both to `motion/react`.
- [C-3] src/app/(landing)/coming-soon/page.tsx:114,117 — `tracking tight` (missing hyphen) on feature headings. CSS not applied. Fixed to `tracking-tight`.
- [C-4] src/components/home/LandingSignup.tsx:46 — `tacking-tight` typo. Fixed to `tracking-tight`.
- [C-5] src/components/layout/Header.tsx:148 — `jsutify-center` typo (flex alignment broken on icons row) + `border-ink` on the icon strip. Fixed to `justify-center` + `border-stroke`.
- [I-12] src/app/(main)/account/(auth)/forgot-password/ForgotPasswordForm.tsx — no error state; `setSubmitted(true)` ran even if the Server Action threw. Added `error` state, wrapped body in try/catch, renders error message on failure.

## Deferred — fix in final pass
### IMPORTANT
- [I-1] src/app/(main)/page.tsx:8 — metadata description is literal `"..."`, fix before launch
- [I-2] src/app/(main)/collections/[handle]/page.tsx:174 — `border-border` instead of `border-stroke`
- [I-3] src/app/(main)/collections/[handle]/page.tsx:136 — `bg-stone-100` not a design token, use `bg-lighter`
- [I-4] src/app/error.tsx:31,36 — `border-ink` instead of `border-stroke` on both ArrowButtons
- [I-5] src/app/not-found.tsx:6 — `text-stone-200` not a design token, use `text-lighter` or `text-stroke` (designer call)
- [I-6] src/app/not-found.tsx:21 — `border-ink` instead of `border-stroke`
- [I-7] src/app/global-error.tsx — hardcoded hex colors don't match actual tokens: `#1A1917` should be `#31302e` (ink), `#FAF7F2` should be `#FAF5F0` (canvas)
- [I-8] src/app/(main)/about/page.tsx — `bg-stone-100`, `from-stone-200`, `to-stone-300` not design tokens
- [I-9] src/app/(landing)/coming-soon/page.tsx:52,114 — `font-inter` is an experimental token, not for production components
- [I-10] src/app/(landing)/coming-soon/page.tsx:62 — `border-ink` instead of `border-stroke`
- [I-11] src/app/(main)/faq/page.tsx — last 3 FAQ items have duplicate question titles (copy-paste error); pre-launch content fix needed
- [I-13] src/app/(main)/account/(auth)/login/LoginForm.tsx:21 — untyped event parameter (implicit any)
- [I-14] src/components/search/SearchBar.tsx:125 — missing `border-stroke` in conditional border class; renders with no color when unfocused
- [I-15] src/components/search/PredictiveSearch.tsx:107,150,186 — `bg-stone-50` not a design token, use `bg-canvas` or similar
- [I-16] src/components/home/LandingStackSection.tsx:190 — `bg-black` instead of `bg-ink`
- [I-17] src/components/product/VariantSelector.tsx — `aria-pressed` misused on mutually exclusive options; should be `role="radio"` + `aria-checked` inside a `<fieldset>`
- [I-18] src/components/product/RecentlyViewed.tsx — fetch errors silently swallowed in `.catch(() => {})`
- [I-19] src/components/home/Process.tsx:45, FeaturedProducts.tsx:39 — unused (no importers) dead components with debug `border border-green-500` artifacts

### MINOR
- [M-1] src/app/not-found.tsx:23-27 — commented-out dead code
- [M-2] src/app/(main)/faq/page.tsx:92 — `bg-white` instead of `bg-canvas`
- [M-3] src/app/(main)/faq/page.tsx:105-141 — large commented-out code block
- [M-4] src/app/(landing)/coming-soon/page.tsx:57 — `tracking-tight` immediately overridden by `tracking-tighter` on same element; first class is redundant
- [M-5] src/components/layout/Header.tsx:163 — `bg-white` instead of `bg-canvas` on account button open-state highlight
- [M-6] src/components/account/AccountNav.tsx:58 — template literal for conditional classes instead of `cn()`
- [M-7] src/app/(main)/account/(protected)/orders/page.tsx — empty `className=""` attribute
- [M-8] src/components/home/BrandStory.tsx — `fadeUp` animation defined twice; inner definition shadows outer
- [M-9] src/components/layout/Footer.tsx — `setEmail` state setter never called
- [M-10] src/components/search/SortSelect.tsx:48 — hardcoded `#8A8580` hex in SVG data URI; doesn't match any design token
- [M-11] src/components/home/HeroContent.tsx, LandingParallaxImages.tsx — large commented-out code blocks
