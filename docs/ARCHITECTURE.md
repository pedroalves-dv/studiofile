# Architecture — Studiofile

## 1. High-Level Concept

A high-end design studio showcase and e-commerce platform. The site uses a "Headless" approach: **Next.js** for the frontend and **Shopify Storefront API** for the backend.

## 2. The TOTEM Configurator (The "Heart")

Unlike standard products, TOTEM is a modular system.

- **Data Model**: Every "build" is a collection of individual Shopify products (shapes, colors, cables).
- **The Glue**: We use a `_build_id` (UUID) stored in Cart Line Attributes to group these separate items into a single "visual" product in the UI.
- **State Management**: Handled via `src/lib/totem-config.ts`. The UI reconstructs the 3D/Visual state by reading line attributes from the Shopify Cart.

## 3. Tech Stack & Performance

- **Framework**: Next.js (App Router). Pages are Server Components by default.
- **Styling**: Tailwind CSS with a strict "Stroke/Canvas" design system.
- **Animations**: `motion/react` for high-performance, low-bundle-weight transitions.
- **Smooth Scroll**: Lenis (integrated via `SmoothScroll` component) to maintain an "editorial" feel.

## 4. Data Flow

1. **Product Discovery**: Fetched via `src/lib/shopify/products.ts` with ISR (revalidate: 3600).
2. **Cart Logic**: Managed via Server Actions in `src/lib/shopify/cart.ts`.
3. **The "Coming Soon" Gate**: Controlled via `middleware.ts`. All traffic redirects to `/coming-soon` until the gate is removed.

## 5. Directory Mapping

- `@/components/ui`: Low-level, reusable primitives (Buttons, Inputs).
- `@/lib/shopify`: The "Brain" for all commerce logic.
- `@/app/products/totem`: The complex configurator logic.
