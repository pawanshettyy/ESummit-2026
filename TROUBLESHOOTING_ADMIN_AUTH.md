# Admin Auth Troubleshooting Guide

## Current Issue: 403 Errors Despite Having Admin Role

You're experiencing 403 errors even though you claim to have the `adminRole: "core"` set in Clerk. Let's diagnose this step by step.

## Diagnostic Steps

### Step 1: Verify Clerk Token is Being Sent

Open browser DevTools (F12) → Network tab:
1. Reload the admin panel
2. Check any request to `api.tcetesummit.in/api/v1/admin/*`
3. Look at **Request Headers**
4. Verify `Authorization: Bearer eyJ...` header exists

**If missing:** Frontend auth is broken. Check Clerk setup on frontend.

### Step 2: Test Backend Directly

1. **Get your Clerk token:**
   - Open browser console (F12) on tcetesummit.in
   - Run: `await window.Clerk?.session?.getToken()`
   - Copy the token

2. **Open the test page:**
   - Open: [test-admin-auth.html](file:///c:/Users/Pawan%20Shetty/ESummit-2026/test-admin-auth.html)
   - Paste your token
   - Click "Test Clerk Auth"

3. **Check the response:**
   ```json
   {
     "success": true,
     "userId": "user_xxx",
     "email": "your@email.com",
     "adminRole": "core" or "NOT SET",
     "hasRequiredRole": true or false
   }
   ```

### Step 3: Interpret Results

#### Case A: `adminRole: "NOT SET"`
**Problem:** Clerk metadata not set correctly

**Solutions:**
1. Go to Clerk Dashboard → Users → Your User
2. Click "Public metadata" section
3. Ensure it looks EXACTLY like this:
   ```json
   {
     "adminRole": "core"
   }
   ```
4. **Common mistakes:**
   - Wrong key name: `admin_role` or `role` instead of `adminRole`
   - Wrong value: `"CORE"` or `Core` instead of `"core"`
   - Set in private metadata instead of public metadata
   - Set in unsafe metadata instead of public metadata

#### Case B: `adminRole: "core"` but still 403
**Problem:** Backend environment variables

**Check these:**
1. Backend has `CLERK_SECRET_KEY` environment variable set
2. Backend has `CLERK_PUBLISHABLE_KEY` environment variable set
3. Keys match your Clerk Dashboard keys (not expired/revoked)

**Verify in Vercel:**
```
Settings → Environment Variables → Check:
- CLERK_SECRET_KEY = sk_live_... or sk_test_...
- CLERK_PUBLISHABLE_KEY = pk_live_... or pk_test_...
```

#### Case C: No userId found
**Problem:** Clerk middleware not processing token

**Check:**
1. Backend is receiving the Authorization header
2. CLERK_SECRET_KEY matches the key that signed the token
3. Token is not expired (Clerk tokens expire after 1 hour)

**Fix:** Sign out and sign back in to get a fresh token

### Step 4: Check Backend Logs

If deployed on Vercel:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click latest deployment → View Function Logs
3. Look for these messages:
   ```
   Admin authorized via Clerk public metadata
   OR
   Admin authorization failed: user does not have required adminRole
   ```

## Common Issues & Fixes

### Issue 1: Token Expired
**Symptom:** Worked before, now doesn't
**Fix:** Sign out and sign in again

### Issue 2: Wrong Environment
**Symptom:** Works in development, not production
**Fix:** Check production Clerk keys in Vercel match production Clerk app

### Issue 3: Metadata Not Syncing
**Symptom:** Set metadata but still not working
**Fix:**
1. Clear all browser cookies/storage for tcetesummit.in
2. Sign out completely
3. Wait 1 minute
4. Sign in again
5. Check token contains metadata: JWT decode your token at jwt.io

### Issue 4: Using Test Keys in Production
**Symptom:** Everything looks right but fails
**Fix:** Ensure using `pk_live_` and `sk_live_` keys in production, not `pk_test_` keys

## Quick Fix Commands

### Test your current setup:
```bash
# In backend directory
cd backend

# Check environment variables are set
node -e "require('dotenv').config(); console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY?.slice(0, 10) + '...');"
node -e "require('dotenv').config(); console.log('CLERK_PUBLISHABLE_KEY:', process.env.CLERK_PUBLISHABLE_KEY?.slice(0, 10) + '...');"
```

### Emergency Admin Access (Development Only):
If you need immediate access for testing:
```bash
# Set this in Vercel Environment Variables:
ADMIN_IMPORT_SECRET=your-secret-here

# Then in browser console:
localStorage.setItem('adminSecret', 'your-secret-here');

# Then API calls will use: x-admin-secret header
```

**⚠️ Remove this after fixing Clerk metadata!**

## Still Not Working?

### Option 1: Check JWT Token Content
1. Copy your Clerk token
2. Go to https://jwt.io
3. Paste token in "Encoded" field
4. Look at the payload - does it have `sub` (subject/userId)?
5. Is the token expired? Check `exp` timestamp

### Option 2: Bypass Clerk Temporarily
**For testing only - DO NOT use in production:**

Add this to your frontend `getAuthHeaders()` function temporarily:
```typescript
headers['x-admin-secret'] = 'esummit2026-admin-import';
```

If this works, the problem is definitely with Clerk configuration.

## Correct Clerk Setup Checklist

- [ ] User exists in Clerk Dashboard
- [ ] User's email matches the logged-in email
- [ ] Public metadata has `adminRole` key (exact spelling)
- [ ] `adminRole` value is `"core"`, `"jc"`, or `"oc"` (lowercase)
- [ ] Saved the metadata changes
- [ ] User signed out and back in after changes
- [ ] Backend has CLERK_SECRET_KEY environment variable
- [ ] Backend has CLERK_PUBLISHABLE_KEY environment variable
- [ ] Using same Clerk app in frontend and backend (same publishable key)
- [ ] Using live keys in production, not test keys

## Contact Support

If all else fails, check:
1. Clerk Dashboard → Configure → API Keys - ensure keys are active
2. Clerk Dashboard → Configure → Sessions - check session lifetime
3. Vercel deployment logs for any Clerk-related errors
4. Browser console for Clerk errors

## Debugging Tools Added

I've added these endpoints for debugging:
- `GET /api/v1/admin/debug-clerk-auth` - Shows your Clerk user data and metadata
- `GET /api/v1/admin/debug-admin-secret` - Shows authentication method detection

Use these with your Clerk token to diagnose issues.
