# Medusa + Next.js Setup — Restore Guide

## What's in this backup

- `backup-medusa-backend/` — Medusa v2 backend (Stripe + Supabase S3 configured)
- `backup-medusa-storefront/` — Next.js storefront (Medusa starter)

## Prerequisites

- Node.js v24 (via nvm)
- PostgreSQL installed
- Accounts on: Stripe, Supabase, Railway

## Steps to restore in a new repo

### 1. Create your repo and copy folders

- Create a new GitHub repo and clone it locally
- Copy `backup-medusa-backend/` into the repo as `backend/`
- Copy `backup-medusa-storefront/` into the repo as `storefront/`

### 2. Create a new PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE medusa-yournewproject;"
```

### 3. Update backend/.env

Update these two lines with your new project name and fresh secrets:
```
DATABASE_URL=postgres://postgres@localhost/medusa-yournewproject
JWT_SECRET=changethistosomethingrand om
COOKIE_SECRET=changethistosomethingrand om
```

Keep all other values (Stripe keys, Supabase keys) as they are.

### 4. Install backend dependencies

```bash
cd backend
npm install
npm run build
npx medusa db:migrate
```

### 5. Start the backend

```bash
npm run dev
```

Admin will be at http://localhost:9000/app
Create your admin account on first run.

### 6. Activate Stripe in admin

- Go to Settings → Regions → your region
- Edit → Payment Providers → select Stripe → save

### 7. Install storefront dependencies

```bash
cd ../storefront
npm install
npm run dev
```

Storefront will be at http://localhost:8000

## Notes

- Resend/email not configured — needs domain first
- Images hosted on Supabase (Paris region)
- Stripe in test mode — activate with real keys when ready to launch