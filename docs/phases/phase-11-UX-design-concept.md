# Phase 11 — UX Design Concept

This phase is an art-direction pass. Everything is already functional.
The goal is to make the site feel like a Pentagram case study, not an e-commerce scaffold.

**Design references:** Pentagram.com, highfulminds.com, Readymag showcases, high-end design studio websites.

**Core principles for this phase:**

- Type is the layout. Headings at 8–15vw. Text runs over images, not beside them.
- Composition, not grid. Elements at unexpected positions. Layering is encouraged.
- Controlled density. Alternate between very dense (tight mono text) and very open (one massive element).
- Scroll as narrative. The page tells a story as you scroll — not sections stacking.
- Interactions are earned. Each micro-interaction reinforces the studio identity.

**Do not** add features outside this phase. **Do not** touch `lib/`, `hooks/` (except new hooks below),
or `shopify/` files. This phase is purely front-end visual and interaction work.

---

## Prompt 11.1 — Global Interaction Layer

Build the interaction primitives used across all pages. These must exist before
touching any page layouts.

### Files to create / modify

- `src/hooks/useMagnet.ts` — new: magnetic pull effect for buttons
- `src/components/common/CustomCursor.tsx` — new: branded cursor
- `src/app/globals.css` — add cursor styles
- `src/app/layout.tsx` — mount CustomCursor
- `src/components/common/RevealOnScroll.tsx` — add `mode="mask"` variant
- The Marquee home section — replace CSS animation with GSAP velocity-driven

---

### 1. Custom Cursor

**src/components/common/CustomCursor.tsx** (`'use client'`)

A small dot that follows the mouse with smooth lerp interpolation.
Reacts to hover context via `data-cursor` attributes placed on elements throughout the site.

```ts
interface CursorState {
  x: number
  y: number
  variant: 'default' | 'hover' | 'image' | 'drag'
}
```

Implementation:

- Two DOM elements rendered into a portal: `.cursor-dot` (8px filled circle) and `.cursor-ring` (32px outline circle)
- Dot follows cursor position directly (no lag) — set via `style` on `mousemove`
- Ring follows with lerp on each `requestAnimationFrame` tick: `ring.x += (target.x - ring.x) * 0.12`
- Use `document.body.setAttribute('data-cursor', variant)` to switch cursor state
- Delegate globally: in a single `mouseover` listener on `document`, check if the hovered element
  (or any ancestor) has `data-cursor="image"` or `data-cursor="drag"` or is a `<a>`/`<button>` —
  update body attribute accordingly
- On `mouseleave` from any special element: reset body to `data-cursor="default"`
- **Touch/coarse pointer:** check `window.matchMedia('(pointer: coarse)').matches` on mount.
  If true, render `null` immediately — never show custom cursor on touch devices.

Add to `src/app/globals.css`:

```css
/* Custom cursor */
body { cursor: none; }
body a, body button, body [role="button"] { cursor: none; }

.cursor-dot {
  position: fixed;
  top: 0; left: 0;
  width: 8px; height: 8px;
  background: var(--color-ink);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 200ms ease, height 200ms ease, background 200ms ease,
              border 200ms ease, border-radius 200ms ease;
  will-change: transform;
}
.cursor-ring {
  position: fixed;
  top: 0; left: 0;
  width: 32px; height: 32px;
  border: 1px solid var(--color-ink);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: width 300ms ease, height 300ms ease, opacity 300ms ease;
  will-change: transform;
}

/* Hover state — links and buttons */
body[data-cursor="hover"] .cursor-dot {
  width: 4px; height: 4px;
}
body[data-cursor="hover"] .cursor-ring {
  width: 48px; height: 48px;
}

/* Image state — product images, collection images */
body[data-cursor="image"] .cursor-ring {
  opacity: 0;
}
body[data-cursor="image"] .cursor-dot {
  width: 56px; height: 56px;
  background: transparent;
  border: 1px solid var(--color-ink);
}

/* Drag state — horizontal scroll containers */
body[data-cursor="drag"] .cursor-ring {
  width: 64px; height: 64px;
  opacity: 0.5;
}
```

Mount in `src/app/layout.tsx` as the first child of `<body>`:

```tsx
import { CustomCursor } from '@/components/common/CustomCursor'
// ...
<body>
  <CustomCursor />
  {/* rest of layout */}
</body>
```

---

### 2. useMagnet hook

**src/hooks/useMagnet.ts**

Applies a subtle magnetic pull to an element when the cursor enters its proximity zone.
Returns a ref to attach to the target element.

```ts
import { gsap } from '@/lib/gsap'
import { useRef, useEffect } from 'react'

export function useMagnet<T extends HTMLElement>(
  strength: number = 0.4,
  radius: number = 80
): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < radius) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.3,
          ease: 'power2.out',
        })
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' })
      }
    }

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    }

    window.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength, radius])

  return ref
}
```

Apply `useMagnet` only to hero CTAs on the home page and major standalone call-to-action elements.
Do NOT apply globally — magnetic effect loses meaning if overused.

---

### 3. RevealOnScroll — mask mode

Add a `mode` prop to `src/components/common/RevealOnScroll.tsx`.

```tsx
interface RevealOnScrollProps {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  mode?: 'fade' | 'mask'   // default: 'fade' (existing behaviour unchanged)
}
```

When `mode="mask"`:
- Wrap children in an `overflow-hidden` container (no visible clip needed — just overflow)
- On ScrollTrigger enter, animate `yPercent: 100 → 0` — no opacity change
- Duration: 0.9s, ease: `'expo.out'`
- The text slides up from behind the container edge — a hard curtain/shutter reveal

```ts
if (mode === 'mask') {
  gsap.from(innerRef.current, {
    yPercent: 100,
    duration: 0.9,
    ease: 'expo.out',
    delay,
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top 88%',
      once: true,
    },
  })
} else {
  // existing fade animation
}
```

The component now needs two refs: `containerRef` (the outer `overflow-hidden` div) and
`innerRef` (the inner div wrapping `children`). Keep the outer div's className passthrough.

---

### 4. Scroll-velocity marquee

Read the current Marquee component (likely inline in `src/app/page.tsx` or a file in
`src/components/home/`). Replace the CSS `@keyframes marquee` animation with GSAP.

Create or convert to a client component: `src/components/home/Marquee.tsx` (`'use client'`)

```tsx
'use client'
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    if (!trackRef.current) return

    const tl = gsap.to(trackRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: 'none',
    })

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const velocity = self.getVelocity()
        gsap.to(tl, {
          timeScale: 1 + velocity / 3000,
          duration: 0.5,
          overwrite: true,
        })
      },
    })
  }, {})

  const text = 'DESIGNED IN PARIS · 3D-PRINTED · MADE TO ORDER · MODULAR OBJECTS · '

  return (
    <div className="overflow-hidden border-y border-stroke py-3">
      <div ref={trackRef} className="flex whitespace-nowrap w-max">
        <span className="text-label text-muted pr-0">{text}</span>
        <span className="text-label text-muted">{text}</span>
      </div>
    </div>
  )
}
```

Update `src/app/page.tsx` to import `<Marquee />` from this component.
Remove the old CSS `@keyframes marquee` from `globals.css`.

---

**11.1 complete when:**

- [ ] Custom cursor visible on desktop, hidden on touch/coarse pointer
- [ ] Cursor dot + ring render correctly, ring lerps behind dot
- [ ] `data-cursor="hover"` on links/buttons expands ring, shrinks dot
- [ ] `data-cursor="image"` on image containers shows circular outline cursor
- [ ] `useMagnet` hook exported from `src/hooks/useMagnet.ts`, type-checks
- [ ] `RevealOnScroll` supports `mode="mask"` — text slides up on enter (no fade)
- [ ] Marquee uses GSAP, speeds up/slows with scroll velocity
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.1 — global interaction layer`

---

## Prompt 11.2 — Home Page Full Overhaul

Read `src/app/page.tsx` and all files in `src/components/home/` before starting.

This prompt rebuilds the home page from a stacked-sections pattern to a composed editorial layout.
Work section by section. The goal: each section should feel like a deliberate design decision,
not a template fill.

---

### Hero — full overhaul

**Current:** Two-column split. Text left, image right. Standard.

**New concept:** Full-viewport composition. Product image fills the right 60% of the screen
from top of viewport to bottom fold. The heading runs at 12vw — large enough that it
visually crosses into the image area. No column divide visible.

Desktop layout:
```
┌─────────────────────────────────────────────────┐  ← top of viewport
│  3D-PRINTED STUDIO / PARIS — EST. 2024          │  ← small meta, top-left
│                                                 │
│                                                 │
│  OBJECTS             ┌──────────────────────┐   │
│  MADE TO             │                      │   │
│  LAST.───────────────│   product image      │   │
│                      │   absolute right-0   │   │
│                      │   top-0 h-full       │   │
│  [shop →]            │   w-[60%]            │   │
│  [collections →]     │                      │   │
└──────────────────────┴──────────────────────┘   │  ← 100vh
```

Implementation in `src/components/home/HeroContent.tsx` (client component):

```tsx
// Hero container
<section className="relative min-h-screen overflow-hidden bg-canvas">

  {/* Full-height image — absolute right panel */}
  <div className="absolute right-0 top-0 w-[60%] h-full hidden md:block">
    <Image
      src={product.featuredImage.url}
      alt={product.featuredImage.altText ?? product.title}
      fill
      className="object-cover"
      priority
      data-cursor="image"
    />
  </div>

  {/* Mobile image — stacked above text */}
  <div className="relative aspect-[4/3] w-full md:hidden">
    <Image ... fill className="object-cover" priority />
  </div>

  {/* Content layer */}
  <div className="relative z-10 container-wide min-h-screen flex flex-col justify-between py-8 md:py-12">

    {/* Top meta */}
    <p className="text-label text-muted">
      3D-PRINTED STUDIO / PARIS — EST. 2024
    </p>

    {/* Heading — each line wrapped in its own RevealOnScroll mask */}
    <div className="mt-auto">
      <h1 className="font-mono font-bold leading-[0.9] tracking-tight
                     text-[clamp(4rem,12vw,11rem)] text-ink">
        <div className="overflow-hidden">
          <RevealOnScroll mode="mask" delay={0}>
            <span className="block">OBJECTS</span>
          </RevealOnScroll>
        </div>
        <div className="overflow-hidden">
          <RevealOnScroll mode="mask" delay={0.12}>
            <span className="block">MADE TO</span>
          </RevealOnScroll>
        </div>
        <div className="overflow-hidden">
          <RevealOnScroll mode="mask" delay={0.24}>
            <span className="block">LAST.</span>
          </RevealOnScroll>
        </div>
      </h1>

      {/* CTAs — text links, not Button components */}
      <div className="flex gap-8 mt-12">
        <a
          ref={shopRef}   // useMagnet ref
          href="/shop"
          data-cursor="hover"
          className="font-mono text-sm uppercase tracking-wider border-b border-ink pb-0.5
                     hover:text-muted transition-colors"
        >
          Shop →
        </a>
        <a
          ref={collectionsRef}   // useMagnet ref
          href="/collections"
          data-cursor="hover"
          className="font-mono text-sm uppercase tracking-wider border-b border-ink pb-0.5
                     hover:text-muted transition-colors"
        >
          Collections →
        </a>
      </div>
    </div>

  </div>
</section>
```

Apply `useMagnet` to `shopRef` and `collectionsRef`.
The GSAP word-animation from Phase 10 is replaced by the mask-reveal — remove the old GSAP
word-split animation from HeroContent.

---

### Featured Products — editorial asymmetric layout

**Current:** 3-column equal grid.

**New concept:** One dominant product takes the left 5 columns, three secondary products
stack in the right 2 columns. Zero gaps — edges touch.

Section heading treatment:

```tsx
<div className="flex justify-between items-baseline border-b border-stroke pb-4 mb-0">
  <span className="font-mono font-bold text-[clamp(2rem,5vw,4rem)] tracking-tight">SELECTED</span>
  <span className="font-mono font-bold text-[clamp(2rem,5vw,4rem)] tracking-tight">WORKS</span>
</div>
```

Grid:

```tsx
<div className="grid grid-cols-[5fr_2fr] gap-0">

  {/* Large — left */}
  <Link href={`/products/${products[0].handle}`} className="group block border-r border-stroke">
    <div className="relative aspect-[3/5] overflow-hidden" data-cursor="image">
      <Image ... fill className="object-cover" />
    </div>
    <div className="p-4 border-t border-stroke">
      <h3 className="font-mono font-bold text-xl">{products[0].title}</h3>
      <p className="font-mono text-sm text-muted mt-1">
        {formatPrice(...)}
      </p>
    </div>
  </Link>

  {/* Three small — right, stacked */}
  <div className="flex flex-col">
    {products.slice(1, 4).map((p, i) => (
      <Link key={p.id} href={`/products/${p.handle}`}
        className={cn('group block flex-1', i > 0 && 'border-t border-stroke')}>
        <div className="relative aspect-[3/2] overflow-hidden" data-cursor="image">
          <Image ... fill className="object-cover" />
        </div>
        <div className="px-3 py-2">
          <h3 className="font-mono text-xs uppercase tracking-wider truncate">{p.title}</h3>
        </div>
      </Link>
    ))}
  </div>

</div>

{/* Footer link */}
<div className="flex justify-end pt-4">
  <Link href="/shop" className="text-label text-muted hover:text-ink transition-colors"
    data-cursor="hover">
    → ALL WORKS
  </Link>
</div>
```

Build this inline in the home page (or a new `src/components/home/FeaturedProducts.tsx`
server component). Do NOT use the shared `ProductCard` component here — this layout requires
bespoke control.

---

### Brand Story — typographic anchor

**Current:** Two-column with "&" decorative shape.

**New concept:** Full-width statement text, then a thin rule, then a short paragraph.

```tsx
<section className="section-padding">
  {/* Escape container — full bleed statement */}
  <div className="-mx-6 md:-mx-12 px-6 md:px-12">
    <div className="overflow-hidden">
      <RevealOnScroll mode="mask" delay={0}>
        <p className="font-mono font-bold tracking-tight leading-[0.95]
                      text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
          DESIGNED IN PARIS.
        </p>
      </RevealOnScroll>
    </div>
    <div className="overflow-hidden">
      <RevealOnScroll mode="mask" delay={0.1}>
        <p className="font-mono font-bold tracking-tight leading-[0.95]
                      text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
          PRINTED TO ORDER.
        </p>
      </RevealOnScroll>
    </div>
  </div>

  <hr className="border-stroke mt-12 mb-12" />

  <div className="max-w-xl">
    <p className="font-mono text-sm text-muted leading-relaxed">
      We design functional objects for the home — modular, adaptable, and built to last.
      Each piece is 3D-printed to order in our Paris studio.
    </p>
    <a
      ref={aboutRef}  // useMagnet
      href="/about"
      data-cursor="hover"
      className="inline-block mt-6 font-mono text-sm border-b border-ink pb-0.5
                 hover:text-muted transition-colors"
    >
      About the Studio →
    </a>
  </div>
</section>
```

---

### Collections — edge-to-edge horizontal strip

**Current:** 3-column card grid with spacing.

**New concept:** Full-bleed strip, zero gaps, images edge-to-edge. Text below each image.
On mobile: horizontal scroll with snap.

```tsx
{/* Full bleed — escape container padding */}
<section className="section-padding">
  <div className="-mx-6 md:-mx-12">

    {/* Desktop: grid */}
    <div className="hidden md:grid grid-cols-3 gap-0">
      {collections.map((col, i) => (
        <Link key={col.id} href={`/collections/${col.handle}`}
          className="group block border-r border-stroke last:border-r-0">
          <div className="relative aspect-[2/3] overflow-hidden" data-cursor="image">
            {col.image ? (
              <Image src={col.image.url} alt={col.image.altText ?? col.title}
                fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-stone-100" />
            )}
            {/* Hover: accent outline */}
            <div className="absolute inset-0 outline outline-1 outline-accent opacity-0
                            group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="border-t border-stroke px-6 md:px-8 py-4">
            <h3 className="font-mono font-bold text-base uppercase tracking-wider">
              {col.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>

    {/* Mobile: horizontal scroll */}
    <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory">
      {collections.map((col) => (
        <Link key={col.id} href={`/collections/${col.handle}`}
          className="shrink-0 min-w-[80vw] snap-center border-r border-stroke last:border-r-0">
          <div className="relative aspect-[2/3]" data-cursor="image">
            {/* same image block */}
          </div>
          <div className="border-t border-stroke px-4 py-3">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider">{col.title}</h3>
          </div>
        </Link>
      ))}
    </div>

  </div>
</section>
```

---

### Process — typographic step texture

**Current:** Three equal cards.

**New concept:** Full-width stacked steps. Each step has a large ghosted number as structural texture.

```tsx
<section className="section-padding">
  <div className="container-wide">
    {[
      { n: '01', title: 'DESIGNED IN-STUDIO', desc: 'Every object begins as a sketch and becomes a parametric 3D model.' },
      { n: '02', title: 'PRINTED TO ORDER',   desc: 'We print each piece in our Paris atelier — no warehouse, no waste.' },
      { n: '03', title: 'SHIPPED TO YOU',     desc: 'Packaged and dispatched within 5–7 working days of your order.' },
    ].map((step) => (
      <div key={step.n} className="border-t border-stroke py-8 grid grid-cols-[auto_1fr] gap-8 items-start">

        {/* Ghosted number */}
        <span className="font-mono font-bold leading-none select-none
                         text-[clamp(4rem,10vw,9rem)] text-stroke/50">
          {step.n}
        </span>

        {/* Content */}
        <div className="pt-2">
          <RevealOnScroll mode="mask">
            <h3 className="font-mono text-lg uppercase tracking-[0.2em] text-ink">
              {step.title}
            </h3>
          </RevealOnScroll>
          <p className="font-mono text-sm text-muted mt-2 max-w-md">{step.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>
```

Note: `text-stroke` uses the `stroke` color token from Tailwind config at 50% opacity.
Use `text-[#E5E0D8]/50` if the token doesn't support opacity modifier — check config.

---

**11.2 complete when:**

- [ ] Hero: full-viewport, image absolute right 60%, heading at 12vw bleeds visually toward image
- [ ] Hero: CTAs are text links with underline, not Button components
- [ ] Hero: mask-reveal on each heading line (staggered)
- [ ] Featured: dominant left (5fr) + three stacked right (2fr), zero gap
- [ ] Brand story: full-width statement text, mask-reveal, thin rule, short paragraph
- [ ] Collections: edge-to-edge strip, mobile horizontal scroll with snap
- [ ] Process: ghosted step numbers, thin rule separators, mask-reveal
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.2 — home page editorial overhaul`

---

## Prompt 11.3 — Header & Footer Redesign

Read `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx` before starting.
Make targeted changes — do not rebuild from scratch.

---

### Header — precision refinements

**1. Wordmark:**

Find the `<span>` or element rendering "STUDIOFILE". Change it to:

```tsx
<span className="font-mono font-bold tracking-tight">
  STUDIO<span className="text-accent">/</span>FILE
</span>
```

The `/` in accent color is a small brand signature. Keep the GSAP letter animation
on the outer span — it should still animate, with the slash included.

**2. Nav link hover — numbered index:**

Replace the current underline hover with a numbered index prefix that appears on hover.

Add `data-index` attributes and a CSS approach:

```tsx
<a
  href="/shop"
  data-index="01"
  data-cursor="hover"
  className="nav-link font-mono text-sm uppercase tracking-wider
             relative flex items-center gap-1.5
             hover:text-muted transition-colors"
>
  Shop
</a>
```

Add to `globals.css`:

```css
.nav-link::before {
  content: attr(data-index);
  font-size: 0.65em;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 200ms ease, transform 200ms ease;
  color: var(--color-accent);
}
.nav-link:hover::before {
  opacity: 1;
  transform: translateX(0);
}
```

Apply `data-index="01"` through `data-index="05"` to each nav link.
Add `data-cursor="hover"` to all nav links and the cart/wishlist/search icon buttons.

**3. Header height — tighten:**

Find the current vertical padding on the header element (likely `py-4` or `py-5`).
Change to `py-3`. Check that the logo/icon alignment still looks correct.

**4. Smart-hide on scroll down:**

Add smart-hide behaviour: header slides out of view when scrolling down, returns on scroll up.

```ts
const [hidden, setHidden] = useState(false)
const lastY = useRef(0)

useEffect(() => {
  const handleScroll = () => {
    const y = window.scrollY
    if (y > 80 && y > lastY.current) {
      setHidden(true)
    } else if (y < lastY.current) {
      setHidden(false)
    }
    lastY.current = y
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

Apply to the header element:

```tsx
<header
  className={cn(
    'fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out',
    // ... existing classes ...
    hidden && '-translate-y-full'
  )}
>
```

Ensure the existing backdrop blur / border scroll logic is preserved alongside this.

**5. Mobile menu:**

Add `border-b border-stroke` to each mobile nav link for a cleaner list:

```tsx
<a className="... border-b border-stroke py-3 block"> ... </a>
```

---

### Footer — mega wordmark

**Current:** Three-column dark layout (wordmark, links, social).

**New layout:**

```text
bg-ink text-canvas

┌──────────────────────────────────────────────────┐
│  STUDIOFILE                                      │
│  ← 15vw, full width, bold, leading-none ────────→│
│                                                  │
├──────────────────────────────────────────────────┤
│  Shop         │   Instagram · X · TikTok         │
│  Collections  │                                  │
│  About        │   [email] ──────────────── [→]   │
│  Contact      │                                  │
│  ─────        │                                  │
│  Privacy · …  │                                  │
├──────────────────────────────────────────────────┤
│  © 2025 Studiofile. All rights reserved.         │
└──────────────────────────────────────────────────┘
```

Structure:

```tsx
<footer className="bg-ink text-canvas">
  <div className="container-wide">

    {/* Mega wordmark */}
    <div className="py-16 md:py-24 border-b border-canvas/10 overflow-hidden">
      <RevealOnScroll mode="mask">
        <p className="font-mono font-bold leading-none tracking-tight
                      text-[clamp(4rem,15vw,14rem)] text-canvas">
          STUDIOFILE
        </p>
      </RevealOnScroll>
    </div>

    {/* Links + Social */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-b border-canvas/10">

      {/* Left: nav links */}
      <div className="space-y-2">
        {navLinks.map(link => (
          <Link key={link.href} href={link.href}
            className="block font-mono text-sm text-canvas/60 hover:text-canvas transition-colors"
            data-cursor="hover">
            {link.label}
          </Link>
        ))}
        <div className="pt-4 border-t border-canvas/10 mt-4 space-y-1">
          {policyLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="block font-mono text-xs text-canvas/40 hover:text-canvas/60 transition-colors"
              data-cursor="hover">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: social + newsletter */}
      <div className="space-y-8">
        <div className="flex gap-6">
          {/* social icon links — keep existing */}
        </div>
        {/* newsletter form — keep existing */}
      </div>
    </div>

    {/* Copyright */}
    <div className="py-6">
      <p className="font-mono text-xs text-canvas/30">
        © {new Date().getFullYear()} Studiofile. All rights reserved.
      </p>
    </div>

  </div>
</footer>
```

Note: `RevealOnScroll mode="mask"` on dark backgrounds — the `overflow-hidden` container
must have `bg-ink` set, or the sliding text will show canvas behind it. Set `bg-ink` on
the wrapping div if needed.

---

**11.3 complete when:**

- [ ] Wordmark shows `STUDIO/FILE` with accent-colored slash
- [ ] Nav links show numbered index prefix on hover
- [ ] Header has `py-3` vertical padding
- [ ] Header smart-hides on scroll down, reappears on scroll up
- [ ] Footer leads with `STUDIOFILE` mega wordmark at 15vw
- [ ] Footer utility links grid below wordmark
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.3 — header and footer redesign`

---

## Prompt 11.4 — Shop & Collection Editorial Layout

Read the following before starting:

- `src/app/shop/page.tsx`
- `src/app/collections/[handle]/page.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/product/ProductGrid.tsx`

---

### ProductCard — complete redesign

**Current:** Image → title → price. scale-105 on hover. Generic.

**New design:**

- Image: `aspect-[4/5]` — slightly taller proportion. Sharp edges (`rounded-none`).
- Add `data-cursor="image"` to the image container div.
- Remove `transition-transform group-hover:scale-105` from the `<Image>`.
- On hover: a 1px accent-colored top border slides down from above the image.
- Title: always visible, `font-mono font-bold text-sm uppercase tracking-wider`.
- Price: hidden by default, slides up from below on hover.

```tsx
export function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange, compareAtPriceRange, availableForSale } = product
  const price = priceRange.minVariantPrice
  const compareAtPrice = compareAtPriceRange.minVariantPrice
  const onSale = compareAtPrice ? isOnSale(price, compareAtPrice) : false
  const discountPercent = onSale && compareAtPrice ? getDiscountPercent(price, compareAtPrice) : 0

  return (
    <Link href={`/products/${handle}`} className="group block">

      {/* Image container */}
      <div
        className="relative overflow-hidden aspect-[4/5]"
        data-cursor="image"
        style={{ viewTransitionName: `product-image-${handle}` } as React.CSSProperties}
      >
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
            <span className="text-label text-muted">No image</span>
          </div>
        )}

        {/* Sold out overlay */}
        {!availableForSale && (
          <div className="absolute inset-0 bg-canvas/60 flex items-end p-3">
            <span className="text-label text-ink">SOLD OUT</span>
          </div>
        )}

        {/* Sale badge */}
        {onSale && availableForSale && (
          <div className="absolute top-3 left-3">
            <Badge variant="sale">−{discountPercent}%</Badge>
          </div>
        )}

        {/* Accent top border reveal on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-accent
                        -translate-y-full group-hover:translate-y-0
                        transition-transform duration-300" />

        {/* Wishlist */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton productHandle={handle} />
        </div>
      </div>

      {/* Info */}
      <div className="pt-3">
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-ink leading-tight">
          {title}
        </h3>
        {/* Price: slides up on hover */}
        <div className="overflow-hidden h-5 mt-1">
          <div className="translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                          transition-all duration-300">
            <span className="font-mono text-xs text-muted">
              {formatPrice(price.amount, price.currencyCode)}
              {onSale && compareAtPrice && (
                <span className="ml-2 line-through text-muted/50">
                  {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

    </Link>
  )
}
```

Also update the inline product link rendering in `ProductGrid.tsx` to match this card treatment
(or refactor ProductGrid to use ProductCard — whichever is cleaner).

---

### Shop page — editorial layout

**Current:** `grid-cols-[200px_1fr]` sidebar + grid. Large heading.

**New layout:**

Remove the two-column sidebar. Filters move into a collapsible top bar.

```tsx
// src/app/shop/page.tsx — main structure:

export default async function ShopPage({ searchParams }: ShopPageProps) {
  return (
    <PageWrapper>

      {/* Heading row */}
      <div className="border-b border-stroke pb-4 mb-0">
        <h1 className="font-mono font-bold text-[clamp(3rem,8vw,7rem)] tracking-tight leading-none mb-4">
          SHOP
        </h1>
        <ShopControls />   {/* client component: filter toggle + sort + count */}
      </div>

      {/* Collapsible filter panel — client component */}
      <FilterDrawer />

      {/* Products — full width, tight grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-1">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ShopContent searchParams={searchParams} />
        </Suspense>
      </div>

    </PageWrapper>
  )
}
```

Create `src/components/shop/ShopControls.tsx` (`'use client'`) to manage:

- Product count display: `"— 24 OBJECTS"` in `text-label text-muted`
- Sort select (reuse `SortSelect` from `components/search/`)
- Filter toggle button: `"FILTER ↓"` / `"FILTER ↑"` in `font-mono text-sm uppercase`
- View toggle: grid icon / list icon — two small square icon buttons top-right

State in `ShopControls`:

```ts
const [filterOpen, setFilterOpen] = useState(false)
const [view, setView] = useState<'grid' | 'list'>('grid')
```

Pass `view` down to `ProductGrid` (or via a URL param / context — use `useState` for simplicity).

**Collapsible filter panel:**

When `filterOpen === true`, render a full-width panel below the controls row:

```tsx
<div className={cn(
  'overflow-hidden transition-all duration-300',
  filterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
)}>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-stroke">
    {/* FilterPanel groups — reuse FilterPanel from components/search/ */}
    <FilterPanel />
  </div>
</div>
```

**List view:**

When `view === 'list'`, render products as horizontal rows instead of cards:

```tsx
// List row
<Link href={`/products/${product.handle}`}
  className="grid grid-cols-[64px_1fr_auto] gap-4 items-center
             py-4 border-b border-stroke hover:bg-stone-50 transition-colors group">
  <div className="relative w-16 h-16 shrink-0 overflow-hidden" data-cursor="image">
    <Image ... fill className="object-cover" />
  </div>
  <div>
    <h3 className="font-mono text-sm font-bold uppercase tracking-wider">{product.title}</h3>
    {product.productType && (
      <p className="font-mono text-xs text-muted mt-0.5">{product.productType}</p>
    )}
  </div>
  <span className="font-mono text-sm text-muted">
    {formatPrice(product.priceRange.minVariantPrice.amount, ...)}
  </span>
</Link>
```

Apply the same structural changes to `src/app/collections/[handle]/page.tsx` —
same collapsible filter panel, same view toggle, same tight grid.

---

**11.4 complete when:**

- [ ] ProductCard: accent border slides in at top on hover, price slides up, no scale
- [ ] ProductCard: sold-out overlay is a canvas-tinted strip with "SOLD OUT" label
- [ ] Shop: no sidebar, full-width tight `gap-1` grid (4 cols desktop)
- [ ] Shop: heading `SHOP` at 8vw with controls below
- [ ] Shop: collapsible filter panel (full-width, not sidebar)
- [ ] Shop: grid/list view toggle — list view renders horizontal rows
- [ ] Collection page: same collapsible filter and view toggle
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.4 — shop and collection editorial layout`

---

## Prompt 11.5 — PDP Redesign

Read the following before starting:

- `src/app/products/[handle]/page.tsx`
- `src/components/product/ProductInfoPanel.tsx`
- `src/components/product/ImageGallery.tsx` (or wherever the gallery is defined)

---

### PDP — editorial product story layout

**Current:** Classic 50/50 split — gallery left, info right.

**New concept:** Full-width editorial. Cinematic image leads. Sticky purchase strip.

---

**Section 1 — Cinematic hero image**

```tsx
{/* Full-width hero image */}
<div
  className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden"
  data-cursor="image"
  style={{ viewTransitionName: `product-image-${product.handle}` } as React.CSSProperties}
  onClick={() => setZoomOpen(true)}
>
  <Image
    src={product.featuredImage?.url ?? ''}
    alt={product.featuredImage?.altText ?? product.title}
    fill
    className="object-cover"
    priority
  />
</div>
```

Mobile: `aspect-[4/3]`. Desktop: `aspect-[21/9]` — cinematic widescreen crop.
The image is full-width: no `container-wide` wrapper on this element, use `w-full`.
Clicking opens `ImageZoom` (existing component).

**Section 2 — Large title + product type**

Immediately below the image, inside `container-wide`:

```tsx
<div className="container-wide pt-6 pb-4 border-b border-stroke">
  <RevealOnScroll mode="mask">
    <h1 className="font-mono font-bold leading-[0.95] tracking-tight
                   text-[clamp(2rem,6vw,5.5rem)] text-ink">
      {product.title}
    </h1>
  </RevealOnScroll>
  {product.productType && (
    <p className="text-label text-muted mt-2">{product.productType}</p>
  )}
</div>
```

**Section 3 — Purchase strip (inline)**

The `ProductInfoPanel` is restructured to render this inline purchase strip.
Replace the current right-column panel layout with:

```tsx
{/* Inline purchase strip — ref'd for IntersectionObserver */}
<div ref={purchaseRef} className="container-wide">
  <div className="flex flex-wrap items-center justify-between gap-6
                  border-b border-stroke py-5">

    {/* Price */}
    <span className="font-mono font-bold text-2xl text-ink">
      {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
    </span>

    {/* Variants — inline pills */}
    <div className="flex gap-2 flex-wrap">
      <VariantSelector ... />
      {/* VariantSelector renders pill buttons — ensure it uses pill style, not default */}
    </div>

    {/* Quantity */}
    <div className="flex items-center gap-3 font-mono text-sm">
      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 border border-stroke flex items-center justify-center hover:bg-ink hover:text-canvas transition-colors">−</button>
      <span className="w-6 text-center">{quantity}</span>
      <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 border border-stroke flex items-center justify-center hover:bg-ink hover:text-canvas transition-colors">+</button>
    </div>

    {/* Add to cart */}
    <button
      onClick={handleAddToCart}
      disabled={!selectedVariant?.availableForSale || isLoading}
      className="bg-ink text-canvas font-mono text-sm uppercase tracking-wider
                 px-10 py-3 hover:opacity-80 transition-opacity disabled:opacity-40"
      data-cursor="hover"
    >
      {isLoading ? 'Adding...' : 'Add to Cart →'}
    </button>

  </div>
</div>
```

**Sticky purchase bar (slides up from bottom):**

When the inline purchase strip scrolls out of view, a fixed bottom bar appears.
Create `src/components/product/StickyPurchaseBar.tsx` (`'use client'`).

```tsx
interface StickyPurchaseBarProps {
  product: ShopifyProduct
  selectedVariant: ShopifyProductVariant | null
  purchaseRef: React.RefObject<HTMLDivElement>
}
```

IntersectionObserver logic:
```ts
const [visible, setVisible] = useState(false)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setVisible(!entry.isIntersecting),
    { threshold: 0 }
  )
  if (purchaseRef.current) observer.observe(purchaseRef.current)
  return () => observer.disconnect()
}, [purchaseRef])
```

GSAP slide-up:

```ts
useGSAP(() => {
  if (barRef.current) {
    gsap.to(barRef.current, {
      y: visible ? 0 : '100%',
      duration: 0.4,
      ease: 'power2.inOut',
    })
  }
}, { dependencies: [visible] })
```

Bar markup:

```tsx
<div
  ref={barRef}
  className="fixed bottom-0 left-0 right-0 bg-canvas border-t border-stroke z-40
             flex items-center justify-between px-6 md:px-12 py-4 translate-y-full"
>
  <span className="font-mono font-bold">{product.title}</span>
  <div className="flex items-center gap-4">
    <span className="font-mono text-sm text-muted">
      {selectedVariant ? formatPrice(...) : '—'}
    </span>
    <button className="bg-ink text-canvas font-mono text-sm uppercase tracking-wider px-8 py-2"
      data-cursor="hover">
      Add to Cart →
    </button>
  </div>
</div>
```

**Section 4 — Filmstrip thumbnail gallery**

Replace the existing ImageGallery thumbnail strip with a full-width horizontal filmstrip.
This goes immediately after the purchase strip:

```tsx
<div className="container-wide">
  <div
    className="flex overflow-x-auto gap-2 py-4 border-b border-stroke"
    data-cursor="drag"
  >
    {product.images.edges.map(({ node: img }, i) => (
      <button
        key={img.url}
        onClick={() => setActiveImage(i)}
        className={cn(
          'shrink-0 relative w-24 h-24 overflow-hidden',
          activeImage === i && 'outline outline-1 outline-ink'
        )}
      >
        <Image src={img.url} alt={img.altText ?? ''} fill className="object-cover" />
      </button>
    ))}
  </div>
</div>
```

**Section 5 — Description + Specs (full-width)**

Move existing description and specs from the right-column panel to full-width sections:

```tsx
<div className="container-wide section-padding">
  <div className="max-w-2xl">
    <p className="text-label text-muted mb-6">DETAILS</p>
    <div
      className="font-mono text-sm text-muted leading-relaxed"
      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
    />
  </div>

  {/* Specs from tags */}
  {specs.length > 0 && (
    <div className="mt-12 max-w-2xl">
      {specs.map(({ key, value }) => (
        <div key={key} className="flex justify-between border-b border-stroke py-3 font-mono text-sm">
          <span className="text-muted uppercase tracking-wider">{key}</span>
          <span className="text-ink">{value}</span>
        </div>
      ))}
    </div>
  )}
</div>
```

**ProductInfoPanel restructure:**

The `ProductInfoPanel` component currently renders a full right-column panel.
Restructure it to instead export the purchase strip + sticky bar as a self-contained unit.
The component remains `'use client'` and continues to own `selectedVariant`, `quantity`,
`isLoading` state and the `addItem` call.

Preserve all existing state logic:

- `selectedVariant` derived from URL `?variant=` param
- `quantity` state
- `addItem` via `useCart`
- `useWishlist` for wishlist integration
- Stock checking

Remove from `ProductInfoPanel`:

- Breadcrumb (already in `page.tsx`)
- The trust badges (`"Free returns"`, `"Secure checkout"`, `"Made to order"`)
  — move a simplified version to the description section, or remove entirely

Update `src/app/products/[handle]/page.tsx` to use the new full-width layout
instead of the `grid grid-cols-1 md:grid-cols-2` split.

---

**11.5 complete when:**

- [ ] PDP hero image is full-width, `aspect-[21/9]` on desktop, `aspect-[4/3]` on mobile
- [ ] Product title is large (`6vw`) and full-width, below the image
- [ ] Purchase strip (price, variants, qty, add to cart) is a dense horizontal row
- [ ] Sticky bar slides up from bottom when purchase strip leaves viewport
- [ ] Filmstrip: full-width horizontal scroll with `data-cursor="drag"`
- [ ] Description + specs as full-width sections below filmstrip
- [ ] Old 50/50 split layout removed from `page.tsx`
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.5 — PDP editorial redesign`

---

## Phase 11 Completion Criteria

All must pass before the phase is marked done:

- [ ] Custom cursor: desktop only, dot + ring, 3 states
- [ ] useMagnet applied to hero CTAs and brand story "About" link
- [ ] RevealOnScroll: `mode="mask"` works on all major headings
- [ ] Marquee: velocity-scrubbed, speeds with scroll
- [ ] Home hero: full-viewport, heading at 12vw over image, text-link CTAs
- [ ] Home featured: 5fr / 2fr asymmetric grid, zero gap
- [ ] Home brand story: full-width typographic statement
- [ ] Home collections: edge-to-edge strip, mobile snap scroll
- [ ] Home process: ghosted step numbers, thin rules
- [ ] Header: `STUDIO/FILE` slash wordmark, numbered nav hover, smart-hide
- [ ] Footer: mega wordmark at 15vw leads the footer
- [ ] ProductCard: accent border reveal, price slides up, no scale
- [ ] Shop: tight 4-col grid, collapsible filter, list/grid toggle
- [ ] PDP: cinematic hero image, large title, purchase strip, sticky bar, filmstrip
- [ ] `npm run type-check` — zero errors
- [ ] `npm run build` — clean

Commit per sub-prompt: `feat: phase 11.X — [description]`
Update `docs/STATUS.md` after each sub-prompt.
