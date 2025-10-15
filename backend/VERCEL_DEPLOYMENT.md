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
JWT_REFRESH_SECRET=your_jwt_refresh_secret
QR_SECRET_KEY=your_qr_secret

FRONTEND_URL=https://your-frontend.vercel.app

# Optional - if using Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### 4. Deploy

```bash
# Option 1: Deploy via Vercel CLI
npm i -g vercel
vercel

# Option 2: Connect GitHub repo to Vercel Dashboard
# - Go to vercel.com
# - Import your repository
# - Set root directory to "backend"
# - Add environment variables
# - Deploy
```

### 5. Post-Deployment

1. **Update Frontend API URL:**
   - In your frontend project, update `src/lib/api.ts`
   - Change `API_BASE_URL` to your Vercel backend URL

2. **Update Clerk Webhook:**
   - Go to Clerk Dashboard → Webhooks
   - Update endpoint URL to: `https://your-backend.vercel.app/api/v1/webhook/clerk`

3. **Test Endpoints:**
   ```bash
   # Health check
   curl https://your-backend.vercel.app/api/v1/health
   
   # Root endpoint
   curl https://your-backend.vercel.app/
   ```

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` has `?pgbouncer=true&connection_limit=1` for serverless
- Use connection pooling URL (port 6543)
- Use direct URL (port 5432) for migrations only

### Prisma Issues
- Vercel automatically runs `prisma generate` during build
- Migrations are applied via `vercel-build` script
- Check Vercel build logs for Prisma errors

### Cold Start Issues
- First request may be slow (serverless cold start)
- Consider using Vercel's Edge Functions or upgrading plan for better performance

### CORS Issues
- Ensure `FRONTEND_URL` environment variable is set correctly
- Update CORS origin in backend if needed

## Alternative: Deploy to Railway (Recommended for Long-Running Servers)

If you face issues with Vercel's serverless limitations, consider Railway:

1. Go to railway.app
2. Connect GitHub repository
3. Select backend folder
4. Add environment variables
5. Railway will auto-detect and deploy

Railway is better for:
- Long-running connections
- Websockets
- Background jobs
- Better Prisma support
