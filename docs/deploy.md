The One Critical Issue: Revoke the Admin Token
There is a variable in your .env.local called SHOPIFY_STOREFRONT_PRIVATE_TOKEN. It starts with shpat_ — that prefix means it's a Shopify Admin API token, not a public storefront token. It is never used in your code, but it exists in the file.

Action required before anything else:

Go to Shopify Admin → Settings → Apps & Sales Channels
Find the app that generated that token and revoke/delete it
Then delete that line from your .env.local
Even though .env.local is gitignored and won't be committed, rotating unused credentials before a deploy is good hygiene.

Environment Variables on Vercel: What to Add
When you set up the Vercel project, go to Project Settings → Environment Variables and add these three:

Variable	Keep the NEXT_PUBLIC_ prefix?
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN	Yes
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN	Yes
NEXT_PUBLIC_SITE_URL	Yes — and this one is currently missing
Do not add the non-prefixed duplicates (SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN) — they are unused.

The NEXT_PUBLIC_ Question
Keep the prefix exactly as-is. The code in src/lib/shopify/client.ts references process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN by those exact names. If you rename them in Vercel, Shopify calls will break.

Is it safe for the Storefront token to be public? Yes — Shopify designed the Storefront API token to be used in browser code. It's read-only (browse products, manage a cart). It cannot touch admin functions, orders, or other customers' data. This is different from the shpat_ admin token which must never be public.

The Missing Variable: NEXT_PUBLIC_SITE_URL
Your code uses this in the sitemap, robots.txt, and SEO metadata across many pages, but it's not in your .env.local. You need to add it in Vercel:

For the preview deploy: use your Vercel preview URL (e.g. https://studiofile.vercel.app)
For production: https://studiofile.vercel.app
Without it, your sitemap and og:url tags will generate broken/empty URLs.

Everything Else Looks Good
.env.local is properly in .gitignore — secrets won't leak via git
Customer auth uses httpOnly cookies — secure
Security headers are configured in next.config.ts (CSP, HSTS, X-Frame-Options)
The soft-launch redirect (/ → /coming-soon) is still active — your team can navigate directly to any page by URL
Quick Deploy Checklist
Revoke the shpat_ token in Shopify admin
Delete that line from .env.local
Import the repo in Vercel
Add the 3 env vars above (with NEXT_PUBLIC_ prefixes)
Deploy → share the preview URL