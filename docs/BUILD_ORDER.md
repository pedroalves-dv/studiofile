# Build Order & Rationale

Phase 1  → Foundation            Scaffolding, env, Shopify client, TS types, utilities
Phase 2  → Design System         Tokens, fonts, layout shell, Header, Footer, Toast, Cookie consent
Phase 3  → Infrastructure        Loading/error/not-found states, OG images, favicon, security headers
Phase 4  → Core Pages            Home, Collections index, Shop/Collection, PDP (full), About, Policies, Contact
Phase 5  → Search & Discovery    Full-text search, predictive search, filtering, sorting, pagination
Phase 6  → Cart & Checkout       Cart context, cart drawer, stock states, discount codes, cart note
Phase 7  → Customer Auth         Login, Register, Account dashboard, Order history
Phase 8  → Engagement Features   Wishlist, Recently viewed, Related products, Free shipping bar
Phase 9  → Analytics & SEO       Vercel Analytics, structured data, sitemap, robots
Phase 10 → GSAP & Polish         Scroll animations, page transitions, image zoom, accessibility audit

**Why this exact order:**

- Types (Phase 1) define the contract for everything downstream — never skip this.
- Design tokens (Phase 2) before any UI so components are styled correctly from day one.
- Infrastructure (Phase 3) before pages so loading/error boundaries exist when pages are built.
- Pages before cart — cart needs real product/variant data to be meaningful.
- Auth before engagement features — wishlist should know if a user is logged in.
- GSAP last — animate what already works, not placeholders.

**Before Phase 4:** Create your Shopify development store (free at shopify.com/partners) and get your `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`. You cannot render real product data without these.
