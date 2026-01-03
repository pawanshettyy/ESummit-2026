# Quick Clerk Metadata Check

Run this in your browser console on tcetesummit.in:

```javascript
// Get Clerk user object
const user = window.Clerk?.user;

console.log('=== CLERK USER INFO ===');
console.log('User ID:', user?.id);
console.log('Email:', user?.primaryEmailAddress?.emailAddress);
console.log('Public Metadata:', user?.publicMetadata);
console.log('Admin Role:', user?.publicMetadata?.adminRole);
console.log('Has admin role?', !!user?.publicMetadata?.adminRole);
console.log('Role value:', JSON.stringify(user?.publicMetadata?.adminRole));
console.log('All metadata keys:', Object.keys(user?.publicMetadata || {}));
```

**Expected output if correctly configured:**
```
User ID: user_xxxxx
Email: your@email.com
Public Metadata: { adminRole: "core" }
Admin Role: core
Has admin role?: true
Role value: "core"
All metadata keys: ["adminRole"]
```

**If adminRole is missing:**
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Click your application
3. Go to Users
4. Find and click your user
5. Scroll to "Public metadata" section
6. Click "Edit"
7. Add exactly this (nothing more, nothing less):
```json
{
  "adminRole": "core"
}
```
8. Click Save
9. Sign out completely from tcetesummit.in
10. Sign in again
11. Run the check script again
