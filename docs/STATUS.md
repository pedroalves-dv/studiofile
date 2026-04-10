# Project Status — Studiofile (April 2026)

## 🛠️ Technical Debt & Refactors

- [ ] **Hero Parallax**: Replace hardcoded pixel `inputRange` with dynamic element position calculations (Current: `400dvh` risk).

### 🎯 Current Milestone: Phase 2 Launch Prep

**Goal**: Move from placeholders to real Shopify data.

### TOTEM Configurator

- [ ] Create real module products in Shopify Admin.
- [ ] Replace `NEXT_PUBLIC_TOTEM_VARIANT_ID` with real ID.
- [ ] Connect `addBundle()` to real variant logic.

### Pre-Launch Polish

- [ ] Remove `/coming-soon` middleware redirect.
- [ ] Wire `/api/contact` to Resend.
- [ ] Wire `/api/newsletter` to Shopify/Klaviyo.
- [ ] Final SEO Audit (JSON-LD Organization + Social Links).
- [ ] Run `npm run build` (Target: 0 warnings, 90+ Lighthouse).

### Deferred / Inactive

- [ ] Wishlist (Code exists, entry point commented out).
- [ ] Search Overlay (Code exists, disabled in Header).
