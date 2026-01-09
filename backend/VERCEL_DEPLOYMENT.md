# Backend Deployment Guide for Vercel

## Prerequisites
- Vercel account
- Supabase database credentials
- Clerk authentication keys

## Deployment Steps

### 1. Install Dependencies Locally
```bash
cd backend
npm install
```

### 2. Vercel Project Settings

**Root Directory:** `backend`

**Build Command:** (leave empty, Vercel will auto-detect)

**Output Directory:** (leave empty)

**Install Command:** `npm install`

### 3. Environment Variables (Add in Vercel Dashboard)

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

JWT_SECRET=your_jwt_secret
# Vercel deployment docs removed

Continuous deployment configuration and Vercel deployment guides were removed from this repository. If you need to re-enable Vercel-based CD, restore the original documentation and the workflows under `.github/workflows/`.
FRONTEND_URL=https://your-frontend.vercel.app
