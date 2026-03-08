# Phase 10 — GSAP & Polish

---

## Prompt 10.1 — GSAP Animations

GSAP was installed in Phase 1. Before starting, install the official React hook:

```bash
npm install @gsap/react
```

### src/lib/gsap.ts

Note: file lives at `src/lib/gsap.ts`, imported as `@/lib/gsap` — not `src/lib/gsap.ts`.

```ts
// Must only run client-side
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

### useGSAP hook

Use the official `@gsap/react` hook — do NOT build a custom one:

```ts
import { useGSAP } from '@gsap/react'
```

Register it once alongside ScrollTrigger in `src/lib/gsap.ts`:

```ts
import { useGSAP } from '@gsap/react'
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}
export { gsap, ScrollTrigger, useGSAP }
```

Then import `useGSAP` from `@/lib/gsap` across all components — not directly from `@gsap/react`.

`useGSAP` signature:

```ts
useGSAP(callback: () => void, options?: { scope?: RefObject<Element>, dependencies?: React.DependencyList, revertOnUpdate?: boolean })
```

It handles cleanup (`ctx.revert()`) automatically on unmount. No manual cleanup needed.

### Reduced motion — single guard pattern

Define a utility once in `src/lib/gsap.ts` and use it everywhere:

```ts
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
```

In every animation block, check once at the top — do not wrap individual tweens:

```ts
useGSAP(() => {
  if (prefersReducedMotion()) return  // skip all animations in this block
  // ... all gsap calls below
}, { scope: containerRef })
```

### Animation 1 — RevealOnScroll wrapper component

**src/components/common/RevealOnScroll.tsx ("use client")**

Applied manually at call sites — not automatic. Wrap section headings and content blocks
explicitly wherever you want the effect.

```ts
interface RevealOnScrollProps {
  children: React.ReactNode
  delay?: number   // seconds, default 0
  y?: number       // start offset, default 40
  className?: string
}
```

```ts
const ref = useRef<HTMLDivElement>(null)

useGSAP(() => {
  if (prefersReducedMotion()) return
  gsap.from(ref.current, {
    y,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay,
    scrollTrigger: {
      trigger: ref.current,
      start: 'top 85%',
      once: true,
    },
  })
}, { scope: ref })
```

Usage:

```tsx
<RevealOnScroll>
  <h2>Section Heading</h2>
</RevealOnScroll>
```

Apply to: all section headings on home page, brand story text, process steps, about page sections.
Do not apply to above-the-fold content (hero) — it has its own animation.

### Animation 2 — Product grid stagger

In `src/components/product/ProductGrid.tsx`, add a `useGSAP` block using `ScrollTrigger.batch`:

```ts
const gridRef = useRef<HTMLDivElement>(null)

useGSAP(() => {
  if (prefersReducedMotion()) return
  if (!gridRef.current) return

  ScrollTrigger.batch(gridRef.current.querySelectorAll('[data-product-card]'), {
    onEnter: (elements) => {
      gsap.from(elements, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.06,
      })
    },
    start: 'top 90%',
    once: true,
  })
}, { scope: gridRef })
```

Add `data-product-card` attribute to each `ProductCard` root element:

```tsx
<div data-product-card className="...">
```

### Animation 3 — Header wordmark entrance

In `src/components/layout/Header.tsx`:

```ts
const wordmarkRef = useRef<HTMLSpanElement>(null)

useGSAP(() => {
  if (prefersReducedMotion()) return
  if (typeof window === 'undefined') return  // SSR guard

  // Only animate on first page load — use sessionStorage flag
  const hasAnimated = sessionStorage.getItem('sf-wordmark-animated')
  if (hasAnimated) return

  const el = wordmarkRef.current
  if (!el) return

  // Split "STUDIOFILE" into letter spans
  const letters = el.innerText.split('')
  el.innerHTML = letters
    .map(l => `<span style="display:inline-block">${l}</span>`)
    .join('')

  gsap.from(el.querySelectorAll('span'), {
    y: 10,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
    stagger: 0.04,
    onComplete: () => sessionStorage.setItem('sf-wordmark-animated', '1'),
  })
}, {})
```

Attach `ref={wordmarkRef}` to the `<span>` wrapping "STUDIOFILE" in the header.

### Animation 4 — Home hero kinetic typography

Target: the `<h1>` in the Hero section. It must have a `ref` attached.

```ts
const headingRef = useRef<HTMLHeadingElement>(null)

useGSAP(() => {
  if (prefersReducedMotion()) return
  const el = headingRef.current
  if (!el) return

  // Split text content into word spans — do this in JS, not JSX,
  // so the ref has real text content to split
  const words = el.innerText.split(' ')
  el.innerHTML = words
    .map(w => `<span style="display:inline-block; overflow:hidden">
                 <span class="word-inner" style="display:inline-block">${w}</span>
               </span>`)
    .join(' ')

  gsap.from(el.querySelectorAll('.word-inner'), {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    stagger: 0.08,
  })
}, { scope: headingRef })
```

After heading animation completes, animate subtext and CTAs:

```ts
gsap.from([subtextRef.current, ctaRef.current], {
  y: 20,
  opacity: 0,
  duration: 0.6,
  ease: 'power2.out',
  delay: 0.7,  // after heading stagger finishes
})
```

## Prompt 10.2 — Page Transitions, Image Zoom & Accessibility Audit

### View Transitions

**Browser support note:** `@view-transition` and the View Transitions API have good support in
Chrome/Edge but limited in Firefox (behind a flag) and no support in Safari as of early 2025.
The CSS below degrades gracefully — browsers without support simply skip the transitions.

`next.config.ts`: `experimental.viewTransition: true` — verify this is present from Phase 1.1.

Add to `src/app/globals.css`:

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: 350ms ease-out both fade-and-slide-out;
}

::view-transition-new(root) {
  animation: 350ms ease-out both fade-and-slide-in;
}

@keyframes fade-and-slide-out {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-8px); }
}

@keyframes fade-and-slide-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Instant transitions for reduced motion */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

**Shared element transition — ProductCard → PDP:**

`viewTransitionName` is not in the standard TypeScript `React.CSSProperties` type.
Use a cast to avoid type errors:

In `ProductCard`:

```tsx
<div
  style={{ viewTransitionName: `product-image-${product.handle}` } as React.CSSProperties}
  className="relative aspect-[4/5] overflow-hidden"
>
  <Image ... />
</div>
```

In PDP `ImageGallery` main image container:

```tsx
<div
  style={{ viewTransitionName: `product-image-${product.handle}` } as React.CSSProperties}
  className="relative aspect-[4/5] overflow-hidden"
>
  <Image priority ... />
</div>
```

The `handle` must be identical in both places for the shared element transition to connect.

### ImageZoom — verify completeness

`src/components/product/ImageZoom.tsx` was built in Phase 4.4. Verify it has:

- [ ] `Dialog` component from Phase 2.3 as the wrapper (focus trap + Escape handling)
- [ ] Full-resolution `next/image` with `fill` and `object-contain`
- [ ] `triggerRef` passed to `Dialog` for focus restoration
- [ ] `currentIndex` state with prev/next buttons
- [ ] `aria-label="Previous image"` / `aria-label="Next image"` on arrow buttons
- [ ] Keyboard: `←` / `→` arrow key listeners on `document` while open (add/remove in `useEffect`)
- [ ] Thumbnail strip — `aria-current="true"` on current thumbnail
- [ ] Loading state: show thumbnail as blurred placeholder while full-res loads
  (`onLoad` on the full-res image → hide spinner)
- [ ] `aria-label` on the close button: `"Close image viewer"`

If any of these are missing, complete them now.

### Final Accessibility Audit

Work through each item systematically. Fix issues before marking complete.

**1. Icon-only buttons — verify aria-labels:**

- Cart icon: `aria-label={Open cart${totalQuantity > 0 ? ` — ${totalQuantity} items` : ''}}`
- Wishlist icon: `aria-label={Open wishlist${totalCount > 0 ? ` — ${totalCount} items` : ''}}`
- Search icon: `aria-label="Open search"`
- Cart close: `aria-label="Close cart"`
- Wishlist close: `aria-label="Close wishlist"`
- Search close: `aria-label="Close search"`
- Mobile menu open: `aria-label="Open menu"`
- Mobile menu close: `aria-label="Close menu"`
- Quantity increase: `aria-label="Increase quantity"`
- Quantity decrease: `aria-label="Decrease quantity"`
- Remove from cart: `aria-label={Remove ${productTitle} from cart}`
- Remove from wishlist: `aria-label={Remove ${productTitle} from wishlist}`
- Image zoom prev/next: `aria-label="Previous image"` / `aria-label="Next image"`
- Scroll row prev/next: `aria-label="Scroll left"` / `aria-label="Scroll right"`

**2. Focus management — verify each panel:**

For each of: CartDrawer, WishlistDrawer, SearchOverlay, ImageZoom, mobile nav:

- Focus moves to first interactive element on open
- Focus is trapped inside (Tab/Shift+Tab cycles within)
- Focus returns to trigger element on close
- Escape key closes the panel

All should use the `Dialog` primitive from Phase 2.3. If any were implemented without it,
refactor to use it.

**3. Product images:**

- All `<Image>` components for products: `alt={product.featuredImage?.altText ?? product.title}`
- Never leave `alt=""` on product images (empty alt = decorative, which is wrong for products)
- Collection images: `alt={collection.image?.altText ?? collection.title}`

**4. Skip to content link:**

- Verify `<a href="#main-content" ...>Skip to content</a>` is first child of `<body>` in layout.tsx
- Verify `<main id="main-content">` exists in `PageWrapper.tsx`
- Test: press Tab on any page — skip link should appear, press Enter should jump to main content

**5. Color contrast:**

- `muted` color was corrected to `#6B6560` in Phase 2.1 (not `#8A8580` which fails WCAG AA)
- Verify `tailwind.config.ts` has `muted: '#6B6560'`
- Verify no component still references the old hex value `#8A8580` directly

**6. Form labels:**
Verify every `<input>`, `<textarea>`, `<select>` has an associated `<label>`:

- Login: Email, Password
- Register: First Name, Last Name, Email, Password, Confirm Password
- Contact: Name, Email, Subject, Message (honeypot field must have `aria-hidden="true"`)
- Newsletter inputs in Header/Footer: `aria-label="Email address"` (no visible label here is
  acceptable if `aria-label` is present)
- Cart note textarea: `<label>` or `aria-label`
- Discount code input: `<label>` or `aria-label`
- Search input: `aria-label="Search products"` (set in Phase 5)

**7. Reduced motion — CSS consistency:**
CSS animations in `globals.css` use the Phase 2.1 approach (reduce → override to near-zero):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This covers all CSS animations. GSAP animations use `prefersReducedMotion()` guard from 10.1.
View transition overrides are handled separately in the `::view-transition` block above.
Do NOT add redundant `@media (prefers-reduced-motion: no-preference)` wrappers — they conflict
with the Phase 2.1 approach.

**8. Custom interactive elements:**
Any `<div>` or `<span>` used as a button must have:

- `role="button"`
- `tabIndex={0}`
- `onKeyDown` handler for Enter and Space keys
Prefer native `<button>` elements wherever possible — review stepper buttons, filter checkboxes,
and any custom toggle components.

**9. Keyboard navigation — manual test:**
Tab through each of the following and verify logical order, no traps, all elements reachable:

- [ ] Header nav (desktop + mobile)
- [ ] Cart drawer (open → items → discount → note → checkout)
- [ ] Wishlist drawer
- [ ] Search overlay + predictive results (arrow keys)
- [ ] PDP (breadcrumb → title → variant selector → quantity → add to cart)
- [ ] Filters panel
- [ ] Image zoom lightbox

---

 **Phase 10 complete when:**

> - GSAP animations run on desktop, are skipped on `prefers-reduced-motion`
> - View transitions animate between pages in Chrome (degrade silently in Firefox/Safari)
> - ProductCard → PDP shared element transition connects correctly in Chrome
> - All accessibility audit items checked and passing
> - Lighthouse accessibility score ≥ 90
> - `npm run type-check` — zero errors
> - `npm run build` — clean build with no warnings
