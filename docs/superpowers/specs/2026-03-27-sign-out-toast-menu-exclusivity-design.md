# Design: Sign-out Toast + Menu Exclusivity

**Date:** 2026-03-27
**Scope:** `Header.tsx`, `src/lib/shopify/auth.ts`

---

## 1. Sign-out Toast

### Problem
`customerLogout` is a Server Action that calls `redirect('/')` internally. Any client-side toast fired before the redirect does not survive the full-page reload.

### Solution
Remove `redirect('/')` from `customerLogout`. The function already deletes the auth cookie — let it return `void`. Navigation and feedback become the client's responsibility.

In `Header.tsx`, replace the `<form action={customerLogout}>` block with a `<button>` that:
- Calls the SA via `useTransition` (prevents double-submit, non-blocking)
- While pending: button text changes to `"Signing out..."` and is `disabled`
- On resolution: fires `toast.success("You've been signed out")`, then `router.push('/')`

### Why this is not slower
The server round-trip (cookie deletion) is identical in both approaches. `router.push('/')` is a client-side navigation — faster than the current full-page redirect. `useTransition`/`isPending` only guards against double-clicks during the existing latency.

### Toast spec
- **Type:** `success`
- **Message:** `"You've been signed out"`
- **Duration:** default (4 000 ms)

---

## 2. Menu Exclusivity

### Problem
The cart drawer and hamburger menu already close each other. The account dropdown is not wired into this mutual-exclusion logic.

### Rules (after change)
| Menu opened | Closes |
|---|---|
| Cart drawer | Mobile menu · Account dropdown |
| Mobile hamburger menu | Cart drawer · Account dropdown |
| Account dropdown | Cart drawer · Mobile menu |

### Changes to `Header.tsx` onClick handlers

**Cart button** (line ~215):
```
openCart();
if (isMobileMenuOpen) closeMenu();
+ setIsAccountOpen(false);
```

**Hamburger button** (line ~248):
```
setIsMobileMenuOpen(true);
closeCart();
+ setIsAccountOpen(false);
```

**Account button** (line ~149):
```
- onClick={() => setIsAccountOpen((v) => !v)}
+ onClick={() => {
+   const opening = !isAccountOpen;
+   setIsAccountOpen((v) => !v);
+   if (opening) {
+     closeCart();
+     if (isMobileMenuOpen) closeMenu();
+   }
+ }}
```

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/shopify/auth.ts` | Remove `redirect('/')` from `customerLogout` |
| `src/components/layout/Header.tsx` | Replace logout form with `useTransition` button; wire account dropdown into mutual-exclusion logic |

No new files. No new dependencies.
