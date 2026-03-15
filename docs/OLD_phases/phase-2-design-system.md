# Phase 2 — Design System

---

## Prompt 2.1 — Visual Tokens, Fonts & Global Styles

Set up the complete design system for Studiofile. Aesthetic: premium, architectural, editorial.
Monochromatic with warm stone tones. Strong typography. No rounded corners.

### tailwind.config.ts

Extend theme with:

```ts
colors: {
  ink:     '#1A1917',   // primary text, near-black
  canvas:  '#FAF7F2',   // warm off-white background
  accent:  '#C8A97E',   // warm brass/sand — use sparingly
  muted:   '#6B6560',   // secondary text — darkened from #8A8580 to pass WCAG AA on canvas
  stroke:  '#E5E0D8',   // subtle dividers (named 'stroke' not 'border' to avoid Tailwind utility conflict)
  success: '#4A7C59',
  error:   '#B84040',
  // stone: already available via Tailwind's built-in palette — do NOT redeclare
},
fontFamily: {
  display: ['var(--font-cormorant)', 'serif'],      // Cormorant Garamond — headings
  body:    ['var(--font-dm-sans)', 'sans-serif'],   // DM Sans — UI, body text
  mono:    ['var(--font-jetbrains)', 'monospace'],  // JetBrains Mono — prices, labels, tags
},
borderRadius: {
  DEFAULT: '0px',
  sm: '2px',
},
letterSpacing: {
  display: '0.08em',
  tight:   '-0.02em',
},
```

### app/globals.css

Do NOT use `@import` for Google Fonts. Fonts are loaded via `next/font/google` in `layout.tsx` and
injected as CSS variables (`--font-cormorant`, `--font-dm-sans`, `--font-jetbrains`).

Include:

**CSS custom properties** (map to palette — useful for non-Tailwind contexts):

```css
:root {
  --color-ink:     #1A1917;
  --color-canvas:  #FAF7F2;
  --color-accent:  #C8A97E;
  --color-muted:   #6B6560;
  --color-stroke:  #E5E0D8;
}
```

**Base styles:**

```css
html, body {
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: var(--font-dm-sans), sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background-color: var(--color-accent);
  color: var(--color-ink);
}
```

**Custom scrollbar** (Chrome/WebKit only — Firefox ignores gracefully):

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-canvas); }
::-webkit-scrollbar-thumb { background: #C8C3BB; }
```

**Utility classes:**

```css
.font-display {
  font-family: var(--font-cormorant), serif;
  letter-spacing: -0.02em;
}

.text-label {
  font-family: var(--font-jetbrains), monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.section-padding {
  padding-top: 5rem;
  padding-bottom: 5rem;
}
@media (min-width: 768px) {
  .section-padding { padding-top: 8rem; padding-bottom: 8rem; }
}

.container-wide {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
@media (min-width: 768px) {
  .container-wide { padding-left: 3rem; padding-right: 3rem; }
}

.container-narrow {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.link-underline {
  position: relative;
  text-decoration: none;
}
.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width 0.3s ease;
}
.link-underline:hover::after { width: 100%; }
```

**Grain texture** — applied to `body` via `.grain` class.
The pseudo-element must be `position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 9999`
and must NOT intercept clicks (pointer-events: none is critical):

```css
.grain::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 300px 300px;
}
```

**Reduced motion** — place at the end of globals.css:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Note: GSAP animations in Phase 10 also individually check `window.matchMedia('(prefers-reduced-motion: reduce)')`.

### app/layout.tsx

Load fonts using `next/font/google`. Each font exposes a CSS variable:

```ts
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})
```

Apply all three variables to `<html>`:

```tsx
<html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable}`}>
```

Root metadata:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: { template: '%s — Studiofile', default: 'Studiofile — Premium 3D-Printed Objects' },
  description: 'Modular, functional home decor and furniture. Designed in Paris, printed to order.',
}
```

Provider tree (note: `CartProvider` and `WishlistProvider` are stubs returning `{children}` until
Phase 6 and Phase 8 respectively — scaffold them now so layout compiles):

```tsx
<body className="grain">
  <ToastProvider>
    <CartProvider>
      <WishlistProvider>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-canvas focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <LoadingBar />
        {children}
        <CookieConsent />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </WishlistProvider>
    </CartProvider>
  </ToastProvider>
</body>
```

`CartProvider` stub (in `context/CartContext.tsx` for now):

```tsx
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

`WishlistProvider` stub (in `context/WishlistContext.tsx` for now):

```tsx
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

These stubs are replaced with full implementations in Phase 6 and Phase 8.

---

## Prompt 2.2 — Header, Footer & Breadcrumb

Build the full layout shell: Header, Footer, Breadcrumb, PageWrapper.

### components/layout/Header.tsx

**Behavior:**

- Fixed top, full width, `z-50`
- Transparent on load
- On scroll Y > 60: `backdrop-blur-sm` + `bg-canvas/90` + thin bottom border (`1px solid var(--color-stroke)`)
- Use `useState` + `useEffect` with a scroll event listener (throttled or passive)

**Layout (desktop):**

- Left: `STUDIOFILE` wordmark — Cormorant Garamond, uppercase, tracking-display. `<Link href="/">`.
- Center: Nav links — `Shop` → `/shop`, `Collections` → `/collections`, `About` → `/about`, `Process` → `/about#process`, `Contact` → `/contact`
  - Active state: `usePathname()` comparison → accent-colored underline
  - Note: there is no standalone `/process` page — it links to the Process section on the About page
- Right: Search icon, Wishlist icon (with count badge), Cart icon (with count badge)
  - Cart count: `useCart()` — returns `0` safely until CartContext is real (Phase 6)
  - Wishlist count: `useWishlist()` — returns `0` safely until WishlistContext is real (Phase 8)
  - Both hooks must have safe fallbacks: if context is undefined, return `{ totalQuantity: 0, totalCount: 0 }`

**Mobile (< md):**

- Left: wordmark. Right: hamburger button + cart icon
- Hamburger toggles `isMenuOpen` state — full-screen overlay slides down from top
- Overlay: `position: fixed, inset: 0, z-index: 40`, bg-canvas
- Mobile menu contains: all nav links (stacked) + inline search `<input>`
- Close button (X) in overlay — `aria-label="Close menu"`

**All icon buttons** must have `aria-label`:

- `aria-label="Open search"`
- `aria-label="Open wishlist"` (append ` — {n} items` if count > 0)
- `aria-label="Open cart"` (append ` — {n} items` if count > 0)
- `aria-label="Open menu"` / `aria-label="Close menu"`

All icons: `lucide-react`.

### components/layout/Footer.tsx

Three-column desktop layout, stacked mobile. `bg-ink text-canvas`. Generous padding (`py-16 md:py-24`).

- **Col 1:** `STUDIOFILE` wordmark (Cormorant) + tagline: `"Objects made to last."`
- **Col 2:** Navigation links — Shop, Collections, About, Contact, and policy links
- **Col 3:** Social links (Instagram, Pinterest — `href="#"` placeholder) + Newsletter form
  - Email input + "Subscribe" button — UI only, no action wired yet
  - Input: `aria-label="Email address"`, `type="email"`, `placeholder="your@email.com"`

**Bottom bar:** `border-t border-canvas/10 mt-12 pt-6`

- Left: `© {new Date().getFullYear()} Studiofile`
- Right: `Privacy Policy · Terms of Service · Refund Policy`
  - Links to `/policies/privacy-policy`, `/policies/terms-of-service`, `/policies/refund-policy`

### components/layout/Breadcrumb.tsx

Props:

```ts
interface BreadcrumbItem { label: string; href?: string }
interface BreadcrumbProps { items: BreadcrumbItem[] }
```

Renders: `Home › Collections › [Name] › [Product]`

- All items except the last are `<Link>` elements
- Last item: plain `<span aria-current="page">`
- Separator: `›` — wrapped in `<span aria-hidden="true">`
- Styling: `font-mono text-xs text-muted`

Includes `BreadcrumbList` JSON-LD as a `<script type="application/ld+json">` tag:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://studiofile.com/" },
    ...
  ]
}
```

Build this from the `items` prop + `process.env.NEXT_PUBLIC_SITE_URL`.

### components/layout/PageWrapper.tsx

```tsx
interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  narrow?: boolean  // if true: container-narrow, else container-wide
}
```

```tsx
<main id="main-content" className={cn(narrow ? 'container-narrow' : 'container-wide', 'section-padding', className)}>
  {children}
</main>
```

---

## Prompt 2.3 — UI Primitives, Toast & Cookie Consent

Build all foundational UI components.

### components/ui/Button.tsx

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  asChild?: boolean  // renders as Slot (pass-through) — implement a basic Slot or use children as-is
}
```

Styles:

- All variants: `font-mono text-sm uppercase tracking-display cursor-pointer` — no border-radius
- `primary`: `bg-ink text-canvas hover:bg-ink/90`
- `secondary`: `border border-ink text-ink hover:bg-ink hover:text-canvas`
- `ghost`: `text-ink hover:bg-ink/5`
- `link`: `underline underline-offset-4 text-ink`
- Sizes: `sm` → `px-4 py-2`, `md` → `px-6 py-3`, `lg` → `px-8 py-4`
- `isLoading`: show inline spinner SVG (animated), `disabled` + `opacity-70`, prevent click
- `fullWidth`: `w-full`
- `disabled`: `opacity-40 cursor-not-allowed`

### components/ui/Input.tsx

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}
```

Styles:

- Wrapper: `flex flex-col gap-1`
- `<label>`: `text-label text-muted`
- Input: `w-full bg-transparent border-b border-stroke py-2 text-ink placeholder:text-muted/60`
  `focus:outline-none focus:border-accent transition-colors`
- Error state: `border-error`
- Error message: `text-label text-error mt-1`
- Hint: `text-label text-muted mt-1`
- Prefix/suffix: positioned with flex, `text-muted`

### components/ui/Badge.tsx

```ts
interface BadgeProps {
  variant?: 'default' | 'sale' | 'soldOut' | 'new' | 'featured'
  children: React.ReactNode
  className?: string
}
```

All badges: `text-label px-2 py-0.5 inline-block` — no border-radius

- `default`: `bg-ink/10 text-ink`
- `sale`: `bg-error text-canvas`
- `soldOut`: `bg-muted/20 text-muted`
- `new`: `bg-accent text-ink`
- `featured`: `border border-ink text-ink`

### components/ui/Skeleton.tsx

```tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-stone-200', className)} />
  )
}
```

Use Tailwind's `animate-pulse`. Accepts `className` for all sizing/shape.

### components/ui/Dialog.tsx

Accessible modal — behaviour only, no visual styling baked in.

Implementation requirements:

- Uses `ReactDOM.createPortal` targeting `document.body`
- **SSR guard:** only mount portal after `useEffect` (use `isMounted` state) — `document` does not exist server-side
- Focus trap: on open, move focus to first focusable element inside dialog; on Tab/Shift+Tab, cycle within dialog
- Escape key closes dialog — `keydown` listener on `document`
- Backdrop click closes dialog — `onClick` on backdrop div, stop propagation on dialog itself
- Restore focus to the trigger element on close — accept `triggerRef?: React.RefObject<HTMLElement>` prop

```ts
interface DialogProps {
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLElement>
  children: React.ReactNode
  ariaLabel?: string
}
```

Backdrop: `fixed inset-0 z-50 bg-ink/40`
Dialog container: `fixed inset-0 z-50 flex items-center justify-center p-4`
Inner: `role="dialog" aria-modal="true" aria-label={ariaLabel}`

### components/common/Toast.tsx + Toaster.tsx

**ToastContext.tsx** (in `context/`):

```ts
type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toasts: Toast[]
  toast: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
  }
  dismiss: (id: string) => void
}
```

- `ToastProvider` wraps children, manages `toasts` state via `useReducer`
- Auto-dismiss after 4000ms (use `setTimeout` in the add action, clear on dismiss)
- Max 3 toasts visible — if a 4th arrives, remove the oldest

**useToast.ts hook** (in `hooks/`):

```ts
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.toast
}
```

**Toaster.tsx** (in `components/common/`):

- Fixed bottom-right: `fixed bottom-6 right-6 z-[9999] flex flex-col gap-2`
- Reads from ToastContext
- Each toast: `bg-ink text-canvas px-4 py-3 min-w-[280px] flex items-start gap-3`
  - Left border accent: `success` → border-success, `error` → border-error, `info` → border-accent, `warning` → border-amber-400
  - Close X button: `aria-label="Dismiss notification"`, `ml-auto`
  - Slide in from right: CSS keyframe `@keyframes slideIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`

**Toast.tsx** — single toast item component extracted for clarity.

### components/common/LoadingBar.tsx

Thin 2px progress bar at top of viewport during route transitions.

**Important:** This component uses `useSearchParams()` which requires a Suspense boundary in
Next.js 15 App Router. Wrap it in `<Suspense fallback={null}>` at the point of use in `layout.tsx`.

Implementation:

- `usePathname()` + `useSearchParams()` — detect navigation changes via `useEffect` deps
- On pathname/searchParams change: start bar (width 0% → 80% over 300ms), complete (80% → 100% over 150ms), then hide
- Color: `bg-accent`, height: `2px`, position: `fixed top-0 left-0 z-[9999]`
- CSS transition for width — do NOT use GSAP here (GSAP Phase 10 only)

In `layout.tsx`, import as:

```tsx
import { Suspense } from 'react'
import { LoadingBar } from '@/components/common/LoadingBar'
// ...
<Suspense fallback={null}>
  <LoadingBar />
</Suspense>
```

### components/common/CookieConsent.tsx

GDPR banner. Appears on first visit at bottom of screen.

**SSR guard required:** read localStorage only inside `useEffect`. Component should render nothing
until after mount (use `isMounted` state) to avoid hydration mismatch.

```tsx
const [isMounted, setIsMounted] = useState(false)
const [consent, setConsent] = useState<'accepted' | 'minimal' | null>(null)

useEffect(() => {
  setIsMounted(true)
  const stored = localStorage.getItem('sf-cookie-consent')
  if (stored === 'accepted' || stored === 'minimal') setConsent(stored)
}, [])

if (!isMounted || consent !== null) return null
```

UI:

- `fixed bottom-0 left-0 right-0 z-[9998] bg-canvas border-t border-stroke px-6 py-4`
- Text: `"We use cookies to improve your experience and analyse site usage."`
- Buttons: `"Accept All"` (primary Button) + `"Necessary Only"` (ghost Button)
- On choice: `localStorage.setItem('sf-cookie-consent', value)` → `setConsent(value)`

---

**After Phase 2, verify:**

> - `tsc --noEmit` — zero errors
> - `npm run dev` — app loads, fonts render, grain visible, header scrolls correctly
> - No hydration warnings in console (grain, cookie consent, loading bar are all SSR-safe)
