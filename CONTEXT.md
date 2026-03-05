# Studiofile — Project Context

## What this is

Premium e-commerce + showcase website for a 3D printing and design studio.
Modular, functional home decor and furniture. Premium brand aesthetic.

## Tech Stack

- **Backend:** Medusa v2 (in /backend)
- **Frontend:** Next.js 14 App Router (in /storefront)
- **Database:** PostgreSQL (local), Railway (production)
- **Image storage:** Supabase Storage (to be configured)
- **Payments:** Stripe (to be configured)
- **Emails:** Resend (to be configured)
- **Frontend hosting:** Vercel
- **Backend hosting:** Railway

## Repo structure

studiofile/
├── backend/        ← Medusa v2 server
├── storefront/     ← Next.js frontend
└── CONTEXT.md

## Design goals

- Premium, art-directed design studio aesthetic
- GSAP animations (kinetic typography, scroll reveals, page transitions)
- Generous whitespace, strong typography, large product imagery
- Avoid generic SaaS/template aesthetics

## Current status

- Medusa backend scaffolded and running locally
- Next.js storefront scaffolded
- Not yet configured: Stripe, Resend, Supabase Storage, Railway deployment
