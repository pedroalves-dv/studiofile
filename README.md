# Studiofile — E-Commerce Platform

Premium e-commerce + showcase website for a 3D printing and design studio.

## Quick Start

### Installation

```bash
npm install

PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm install
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and add your Shopify credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

### `/src/app` — Next.js Routes (App Router)

- **`layout.tsx`** — Root layout with metadata and providers
- **`globals.css`** — Tailwind + CSS custom properties
- **`page.tsx`** — Home page
- **`error.tsx`** — Error boundary (client component)
- **`global-error.tsx`** — Root error boundary
- **`loading.tsx`** — Root loading skeleton
- **`not-found.tsx`** — 404 page

#### Routes

- **`/`** — Home page
- **`/shop`** — All products page
- **`/collections`** — All collections
- **`/collections/[handle]`** — Single collection
- **`/products/[handle]`** — Product detail
- **`/search?q=...`** — Search results
- **`/account`** — Account dashboard
- **`/account/login`** — Login page
- **`/account/register`** — Registration
- **`/account/forgot-password`** — Password reset
- **`/account/orders`** — Order history
- **`/about`** — About page
- **`/contact`** — Contact page
- **`/policies/[handle]`** — Policy pages (refund-policy, privacy-policy, terms-of-service)
- **`/api/contact`** — Contact form API

### `/src/components` — Reusable Components

#### `/ui`
Base UI components with consistent design:
- `Button.tsx` — Configurable button with variants
- `Badge.tsx` — Badge component
- `Input.tsx` — Text input
- `Skeleton.tsx` — Loading skeleton
- `Dialog.tsx` — Modal dialog
- `Tooltip.tsx` — Tooltip

#### `/layout`
Layout components:
- `Header.tsx` — Top navigation
- `Footer.tsx` — Footer section
- `PageWrapper.tsx` — Main layout wrapper
- `Breadcrumb.tsx` — Breadcrumb navigation

#### `/product`
Product-related components:
- `ProductCard.tsx` — Product card in grid
- `ProductGrid.tsx` — Product grid layout
- `ProductImage.tsx` — Product image with zoom
- `VariantSelector.tsx` — Variant selection dropdown
- `StockIndicator.tsx` — Stock status display
- `RelatedProducts.tsx` — Related products section
- `RecentlyViewed.tsx` — Recently viewed products
- `ImageZoom.tsx` — Image zoom (GSAP integration)

#### `/cart`
Shopping cart components:
- `CartDrawer.tsx` — Side cart panel
- `CartItem.tsx` — Individual cart item
- `CartSummary.tsx` — Subtotal/total display
- `DiscountInput.tsx` — Discount code input
- `CartNote.tsx` — Order notes textarea
- `FreeShippingBar.tsx` — Free shipping progress
- `EmptyCart.tsx` — Empty cart state

#### `/search`
Search functionality:
- `SearchBar.tsx` — Search input
- `SearchResults.tsx` — Search results display
- `PredictiveSearch.tsx` — Autocomplete suggestions
- `FilterPanel.tsx` — Product filters
- `SortSelect.tsx` — Sort dropdown

#### `/account`
Account pages:
- `AccountDashboard.tsx` — Dashboard overview
- `OrderList.tsx` — List of orders
- `OrderCard.tsx` — Single order card

#### `/wishlist`
Wishlist functionality:
- `WishlistButton.tsx` — Wishlist toggle button
- `WishlistDrawer.tsx` — Wishlist sidebar

#### `/common`
Shared utilities:
- `Toast.tsx` — Toast notifications
- `CookieConsent.tsx` — Cookie banner
- `LoadingBar.tsx` — Page load progress bar
- `SkeletonCard.tsx` — Skeleton for product cards

### `/src/lib` — Utilities & Integration

#### `/shopify`
Shopify Storefront API integration:
- **`client.ts`** — GraphQL fetch client
- **`queries.ts`** — GraphQL queries (products, collections)
- **`mutations.ts`** — GraphQL mutations (cart operations)
- **`types.ts`** — TypeScript types for API responses
- **`products.ts`** — Product-specific functions
- **`collections.ts`** — Collection-specific functions
- **`cart.ts`** — Shopping cart operations
- **`auth.ts`** — Customer authentication
- **`search.ts`** — Product search
- **`policies.ts`** — Shop policies

#### `/utils`
Utility functions:
- **`format.ts`** — Price, date, text formatting
- **`cn.ts`** — Class name merge utility (clsx + tailwind-merge)
- **`seo.ts`** — Metadata builders for SEO

### `/src/hooks` — Custom React Hooks

- **`useCart.ts`** — Cart state management
- **`useWishlist.ts`** — Wishlist state management
- **`useScrollLock.ts`** — Disable body scroll
- **`useLocalStorage.ts`** — Persistent client storage
- **`useDebounce.ts`** — Debounce function calls
- **`useMediaQuery.ts`** — Responsive media queries
- **`useRecentlyViewed.ts`** — Track recently viewed products

### `/src/context` — React Context Providers

- **`CartContext.tsx`** — Cart provider with global state
- **`WishlistContext.tsx`** — Wishlist provider

### Root Configuration Files

- **`next.config.ts`** — Next.js configuration
  - Image optimization for Shopify CDN
  - View transitions enabled
  - Security headers
- **`tailwind.config.ts`** — Tailwind CSS configuration
- **`postcss.config.js`** — PostCSS setup
- **`src/middleware.ts`** — Route middleware (TODO: auth protection)
- **`.env.local.example`** — Environment variables template
- **`public/robots.txt`** — SEO robots file

## Stack

- **Frontend:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS 3.4
- **Animations:** GSAP + ScrollTrigger
- **State:** React Context (Cart, Wishlist)
- **API:** Shopify Storefront API (GraphQL)
- **Icons:** Lucide React
- **Utilities:** clsx, tailwind-merge
- **Hosting:** Vercel (with Analytics & Speed Insights)

## Key Features

✓ TypeScript throughout
✓ Responsive design with Tailwind CSS
✓ Custom CSS properties for branding
✓ Empty page shells ready for development
✓ Shopify API integration skeleton
✓ Cart and wishlist context providers
✓ Custom hooks for common patterns
✓ SEO optimization utilities
✓ Middleware support for authentication
✓ Error boundaries and loading states
✓ View transitions for smooth navigation
✓ Security headers configured
✓ Production-ready build setup

## Next Steps

1. **Shopify Setup**
   - Create Shopify store
   - Generate Storefront API credentials
   - Add tokens to `.env.local`

2. **API Implementation**
   - Implement `client.ts` fetch wrapper
   - Complete mutation and query functions
   - Test product requests

3. **Design & Layout**
   - Build Header component
   - Build Footer component
   - Implement PageWrapper for consistent layouts
   - Add brand styling/fonts

4. **Core Features**
   - Product listing page
   - Product detail page
   - Shopping cart (with Shopify checkout)
   - Collection pages
   - Search functionality

5. **Account Features**
   - Customer login/registration
   - Account dashboard
   - Order history
   - Address management

6. **Animations**
   - GSAP scroll animations
   - Page transitions
   - Product hover effects
   - Cart drawer animation

## Development Workflow

```bash
# Start development server
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Deployment

Deploy to Vercel with one click:

```bash
vercel
```

Vercel automatically:
- Builds your Next.js app
- Optimizes performance
- Provides analytics
- Enables edge functions

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP Documentation](https://greensock.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

## License

Private project for Studiofile.
