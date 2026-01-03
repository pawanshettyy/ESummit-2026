# Admin Panel 403 Error - Fix Guide

## Problem Summary
The admin panel is returning 403 (Forbidden) errors because the user accessing it doesn't have the required `adminRole` set in their Clerk account's public metadata.

## Root Cause
The backend checks for admin authorization in two ways:
1. **Admin Secret** (for development/import scripts)
2. **Clerk User Public Metadata** (for production admin panel access)

In production, the Clerk token is being sent, but the user's account lacks the `adminRole` property in their public metadata, causing the authorization check to fail.

## Solution

### Step 1: Set Admin Role in Clerk Dashboard

1. Go to your **Clerk Dashboard**: https://dashboard.clerk.com/
2. Navigate to your application
3. Go to **Users** section
4. Find the user who should have admin access
5. Click on the user to view their details
6. Scroll to **Public Metadata** section
7. Add the following JSON:

```json
{
  "adminRole": "core"
}
```

**Valid roles:**
- `"core"` - Full admin access (all features)
- `"jc"` - Joint Coordinator (stats, users, events, passes, claims)
- `"oc"` - Organizing Committee (stats, users, events only)

### Step 2: Save and Refresh

1. Click **Save** in Clerk Dashboard
2. The user should sign out and sign in again on the frontend
3. The admin panel should now work

### Step 3: Verify Access

After setting the metadata:
1. Open browser DevTools Console
2. Navigate to the admin panel
3. Check the console logs - you should see authentication success
4. All admin endpoints should return data instead of 403

## Alternative: Use Admin Secret (Development Only)

For local development/testing, you can use the admin secret:

1. Set the header `x-admin-secret: esummit2026-admin-import` in your API calls
2. OR use the query parameter `?adminSecret=esummit2026-admin-import`

**⚠️ This is NOT recommended for production use!**

## Checking Current Status

### Check Clerk Metadata via API
You can check if a user has the correct metadata by calling:
```
GET https://api.tcetesummit.in/api/v1/admin/debug-admin-secret
Authorization: Bearer <clerk-token>
```

This will return whether the user has admin access.

### Check Backend Logs
After deploying the updated code, check your Vercel/server logs for messages like:
- `"Admin authorized via Clerk public metadata"`
- `"Admin authorization failed: user does not have required adminRole"`

These logs will show exactly why authorization is failing.

## Updated Features

The code now includes:
1. **Better error messages** - 403 responses now explain what's missing
2. **Enhanced logging** - Backend logs show why authorization failed
3. **User-friendly toast notifications** - Frontend shows clear error messages
4. **Debug information** - Logs include user email, metadata keys, and role values

## Setting Multiple Admin Users

To add multiple admin users, repeat Step 1 for each user, setting appropriate roles:

```json
// Core team member (full access)
{"adminRole": "core"}

// Joint Coordinator (most features)
{"adminRole": "jc"}

// Organizing Committee (limited access)
{"adminRole": "oc"}
```

## Organization-Based Access (Alternative)

If you're using Clerk Organizations, users with these org roles will also get access:
- `"org:admin"` → Treated as "core"
- `"admin"` → Treated as "core"

## Troubleshooting

### Still getting 403 after setting metadata?
1. User must sign out and sign back in
2. Clear browser cache/cookies
3. Check Clerk Dashboard to verify metadata was saved
4. Check browser console for error messages

### Can't access Clerk Dashboard?
Contact the Clerk account owner to add the metadata for you.

### Need emergency access?
Deploy with environment variable `ADMIN_IMPORT_SECRET` and use the secret in API calls (but this is insecure for production).

## Security Notes

- Never commit admin secrets to git
- Always use Clerk metadata for production admin access
- Rotate admin secrets regularly
- Monitor admin access logs for unauthorized attempts
- Use different admin secrets for different environments

## Next Steps

1. ✅ Set `adminRole` in Clerk Dashboard
2. ✅ User signs out and back in
3. ✅ Test admin panel access
4. ✅ Monitor logs for any issues
5. ✅ Add other admin users as needed
