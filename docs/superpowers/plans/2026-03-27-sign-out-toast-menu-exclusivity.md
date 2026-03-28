# Sign-out Toast + Menu Exclusivity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a toast notification when the user signs out, and ensure the account dropdown, cart drawer, and mobile hamburger menu are mutually exclusive (opening one closes the others).

**Architecture:** `customerLogout` SA is stripped of its `redirect()` call so the client can control navigation and show a toast after the action resolves. Menu exclusivity is handled by wiring `setIsAccountOpen(false)` into the existing cart/hamburger handlers, and wiring `closeCart()` + `closeMenu()` into the account toggle handler.

**Tech Stack:** Next.js 15 App Router, TypeScript, React `useTransition`, `useRouter`, `useToast` hook from `@/components/common/Toast`

---

## Files

| File | Change |
|---|---|
| `src/lib/shopify/auth.ts` | Remove `redirect('/')` from `customerLogout` |
| `src/components/layout/Header.tsx` | Add `useTransition`, `useRouter`, `useToast`; replace logout form with button; wire account dropdown into mutual-exclusion logic |

---

## Task 1: Strip `redirect` from `customerLogout`

**Files:**
- Modify: `src/lib/shopify/auth.ts`

The current function ends with:
```ts
;(await cookies()).delete(TOKEN_COOKIE)
redirect('/')
```

Remove the `redirect('/')` call and its import if it becomes unused (check if `redirect` is used elsewhere in the file first — it isn't, it's only called once). Also update the return type from `Promise<void>` — it stays `Promise<void>`, nothing changes there.

- [ ] **Step 1: Remove `redirect` call and import from `customerLogout`**

In `src/lib/shopify/auth.ts`, find the `customerLogout` function and remove the `redirect('/')` line at the end. Also remove the `redirect` import from `'next/navigation'` at the top of the file (it's only used by this one function).

After the change, the function should end like this:
```ts
export async function customerLogout(): Promise<void> {
  const token = await getCustomerToken()

  if (token) {
    try {
      await storefront(
        CUSTOMER_ACCESS_TOKEN_DELETE,
        { customerAccessToken: token },
        { cache: 'no-store' }
      )
    } catch {}
  }

  ;(await cookies()).delete(TOKEN_COOKIE)
}
```

And the imports at the top should no longer include `redirect`:
```ts
import { cookies } from 'next/headers'
// (redirect removed)
import { storefront } from './client'
```

- [ ] **Step 2: Run type-check**

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/shopify/auth.ts
git commit -m "refactor: remove redirect from customerLogout — navigation handled client-side"
```

---

## Task 2: Wire account dropdown into mutual-exclusion logic

**Files:**
- Modify: `src/components/layout/Header.tsx`

Three handler changes — no new state, no new hooks yet.

- [ ] **Step 1: Update the cart button `onClick` to close the account dropdown**

Find the cart button's `onClick` (currently around line 215). It reads:
```tsx
onClick={() => {
  if (isOpen) {
    closeCart();
  } else {
    openCart();
    if (isMobileMenuOpen) closeMenu();
  }
}}
```

Change it to:
```tsx
onClick={() => {
  if (isOpen) {
    closeCart();
  } else {
    openCart();
    if (isMobileMenuOpen) closeMenu();
    setIsAccountOpen(false);
  }
}}
```

- [ ] **Step 2: Update the hamburger button `onClick` to close the account dropdown**

Find the hamburger button's `onClick` (currently around line 246). It reads:
```tsx
onClick={() => {
  if (isMobileMenuOpen && !isClosingMenu) {
    closeMenu();
  } else if (!isMobileMenuOpen) {
    setIsMobileMenuOpen(true);
    closeCart();
  }
}}
```

Change it to:
```tsx
onClick={() => {
  if (isMobileMenuOpen && !isClosingMenu) {
    closeMenu();
  } else if (!isMobileMenuOpen) {
    setIsMobileMenuOpen(true);
    closeCart();
    setIsAccountOpen(false);
  }
}}
```

- [ ] **Step 3: Update the account button `onClick` to close cart and mobile menu when opening**

Find the account button's `onClick` (currently around line 149). It reads:
```tsx
onClick={() => setIsAccountOpen((v) => !v)}
```

Change it to:
```tsx
onClick={() => {
  const opening = !isAccountOpen;
  setIsAccountOpen((v) => !v);
  if (opening) {
    closeCart();
    if (isMobileMenuOpen) closeMenu();
  }
}}
```

- [ ] **Step 4: Run type-check**

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check
```

Expected: zero errors.

- [ ] **Step 5: Manual verification**

Start the dev server:
```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run dev
```

Log in, then test these scenarios:
1. Open cart → account dropdown (if visible) should close
2. Open mobile hamburger → account dropdown should close
3. Open account dropdown → cart drawer should close; hamburger menu should close if open
4. Open hamburger → open cart via the cart icon in the header → hamburger should close
   (this was already working — verify it still does)

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: wire account dropdown into menu mutual-exclusion logic"
```

---

## Task 3: Replace logout form with client-side handler + toast

**Files:**
- Modify: `src/components/layout/Header.tsx`

This task adds three things to Header: `useTransition`, `useRouter`, and `useToast`. Then it replaces the `<form action={customerLogout}>` block with a button that calls the SA, fires the toast, and navigates.

- [ ] **Step 1: Add missing imports to `Header.tsx`**

Find the existing React import line:
```tsx
import { useState, useEffect, useRef, useCallback } from "react";
```

Add `useTransition`:
```tsx
import { useState, useEffect, useRef, useCallback, useTransition } from "react";
```

Add `useRouter` — insert after the existing Next.js imports (`usePathname` is already there):
```tsx
import { usePathname, useRouter } from "next/navigation";
```

Add `useToast` — insert after the existing internal imports:
```tsx
import { useToast } from "@/context/ToastContext";
```

- [ ] **Step 2: Initialise the new hooks inside the `Header` component**

Find the existing hook initialisations near the top of the component body (after the refs):
```tsx
const pathname = usePathname();
const { isScrolled } = useScroll(60);
```

Add directly below those two lines:
```tsx
const router = useRouter();
const { success: toastSuccess } = useToast();
const [isPendingLogout, startLogoutTransition] = useTransition();
```

- [ ] **Step 3: Replace the logout `<form>` with a client-side button**

Find and replace the logout form block inside the account dropdown. It currently reads:
```tsx
<div className="border-t border-ink p-1 bg-lighter">
  <form action={customerLogout}>
    <button
      type="submit"
      className="block w-full text-left px-4 py-3 rounded-md tracking-[-0.04em] text-lg text-ink hover:bg-error hover:text-canvas transition-colors font-semibold"
    >
      Sign out
    </button>
  </form>
</div>
```

Replace with:
```tsx
<div className="border-t border-ink p-1 bg-lighter">
  <button
    type="button"
    disabled={isPendingLogout}
    onClick={() => {
      startLogoutTransition(async () => {
        await customerLogout();
        toastSuccess("You've been signed out");
        router.push("/");
      });
    }}
    className="block w-full text-left px-4 py-3 rounded-md tracking-[-0.04em] text-lg text-ink hover:bg-error hover:text-canvas transition-colors font-semibold disabled:opacity-50"
  >
    {isPendingLogout ? "Signing out..." : "Sign out"}
  </button>
</div>
```

- [ ] **Step 4: Run type-check**

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check
```

Expected: zero errors.

- [ ] **Step 5: Manual verification**

With the dev server running, log in and click "Sign out":
1. Button text changes to "Signing out..." and is disabled during the SA call
2. After the SA resolves, a green success toast appears: "You've been signed out"
3. The page navigates to `/`
4. The toast remains visible for ~4 seconds on the home page before auto-dismissing

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: sign-out toast — client-side logout with useTransition and success toast"
```
