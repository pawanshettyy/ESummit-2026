# TCET Student Pass Setup Guide

This guide explains how to set up the TCET student pass feature with unique code assignment.

## Overview

The TCET Student Pass feature allows students with `@tcetmumbai.in` email addresses to:
- Access a special free pass booking section in their dashboard
- Receive a unique 6-digit code (from 100000 to 102499)
- Book their pass through KonfHub with their assigned code

## Database Setup

### 1. Run Prisma Migration

First, generate and apply the database migration to create the `tcet_codes` table:

```bash
cd backend
npx prisma migrate dev --name add_tcet_codes
```

This will:
- Create the `tcet_codes` table in your database
- Generate the Prisma Client with the new TcetCode model

### 2. Seed TCET Codes

Populate the database with 2,500 unique codes (100000-102499):

```bash
cd backend
npx tsx scripts/seed-tcet-codes.ts
```

This will insert all codes into the database. Each code:
- Is unique (6 digits)
- Starts as unassigned
- Can be assigned to exactly one user

## Backend Changes

### New Files Created:

1. **`backend/src/controllers/tcet.controller.ts`**
   - `assignTcetCode`: Assigns a unique code to a user
   - `getUserTcetCode`: Retrieves the user's assigned code
   - `getTcetCodeStats`: Gets statistics about code usage

2. **`backend/src/routes/tcet.routes.ts`**
   - POST `/api/tcet/assign/:userId` - Assign code
   - GET `/api/tcet/code/:userId` - Get user's code
   - GET `/api/tcet/stats` - Get code statistics

3. **`backend/scripts/seed-tcet-codes.ts`**
   - Script to populate codes in the database

### Modified Files:

1. **`backend/prisma/schema.prisma`**
   - Added `TcetCode` model

2. **`backend/src/routes/index.ts`**
   - Added TCET routes to the API

## Frontend Changes

### Modified Files:

1. **`src/components/user-dashboard.tsx`**
   - Added email domain check for TCET students
   - Conditional rendering of TCET Student Pass tab
   - Code assignment logic
   - KonfHub widget integration
   - Toast notifications for user feedback

## How It Works

### For TCET Students (@tcetmumbai.in):

1. **Login**: Student signs up/logs in with their TCET email
2. **Dashboard Access**: They see the "TCET Student Pass" tab
3. **Code Assignment**:
   - When they click "Book TCET Students Pass (Free)", a unique code is assigned
   - If they already have a code, it's retrieved and displayed
4. **Booking**:
   - KonfHub widget opens in a modal
   - Their unique code is displayed prominently
   - They complete the booking on KonfHub using this code

### For Non-TCET Students:

- The TCET Student Pass tab is hidden
- They only see the "My Schedule" tab
- No code assignment occurs

## API Endpoints

### Assign Code
```
POST /api/tcet/assign/:userId
Response: { success: true, data: { code: "100000", assignedAt: "..." } }
```

### Get User Code
```
GET /api/tcet/code/:userId
Response: { success: true, data: { code: "100000", assignedAt: "..." } }
```

### Get Statistics
```
GET /api/tcet/stats
Response: { 
  success: true, 
  data: { 
    total: 2500, 
    assigned: 150, 
    available: 2350 
  } 
}
```

## Code Assignment Logic

1. **Check for existing code**: Before assigning, check if user already has a code
2. **Find available code**: Query for the first unassigned code (ordered by code value)
3. **Assign atomically**: Update the code record with user ID and timestamp
4. **Return code**: Send the 6-digit code to the frontend

## Testing

### 1. Test with TCET Email

Create a Clerk account with an email ending in `@tcetmumbai.in`:
- Go to dashboard
- Verify "TCET Student Pass" tab appears
- Click "Book TCET Students Pass (Free)"
- Verify code is assigned and displayed
- Verify KonfHub widget opens

### 2. Test with Non-TCET Email

Create a Clerk account with any other email:
- Go to dashboard
- Verify "TCET Student Pass" tab does NOT appear
- Only "My Schedule" tab is visible

### 3. Test Code Assignment

- First booking: New code should be assigned
- Subsequent visits: Same code should be retrieved
- Multiple users: Each should get a unique code

## Troubleshooting

### Prisma Client Errors

If you see "Property 'tcetCode' does not exist":
```bash
cd backend
npx prisma generate
```

### No Codes Available

If all 2,500 codes are assigned:
- Check statistics: GET `/api/tcet/stats`
- Consider expanding the code range in the schema
- Or manually reset assignments for testing

### KonfHub Widget Not Loading

- Check that the event ID is correct: `tcet-esummit26`
- Verify KonfHub widget script loads
- Check browser console for errors

## Production Considerations

1. **Code Pool Size**: Currently 2,500 codes (100000-102499). Adjust if needed.
2. **Rate Limiting**: Consider adding rate limits to prevent abuse
3. **Analytics**: Track code assignment rates and booking completion
4. **Monitoring**: Set up alerts when codes are running low
5. **Backup**: Regularly backup the `tcet_codes` table

## Environment Variables

Ensure these are set in your `.env`:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
VITE_API_BASE_URL="http://localhost:3000/api"
```

## Quick Start Commands

```bash
# Backend setup
cd backend
npm install
npx prisma migrate dev --name add_tcet_codes
npx prisma generate
npx tsx scripts/seed-tcet-codes.ts
npm run dev

# Frontend setup
cd ..
npm install
npm run dev
```

## Support

For issues or questions:
- Check the backend logs for API errors
- Use the `/api/tcet/stats` endpoint to monitor code usage
- Review Prisma Studio for database inspection: `npx prisma studio`
