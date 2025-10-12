# 🚀 Quick Start Guide - Payment System Setup

## What Was Implemented

### ✅ Backend (Completed)

1. **New Routes:** `backend/src/routes/payment.routes.ts`
   - Create Razorpay orders
   - Verify payments
   - Handle failures
   - Process refunds
   - Get transaction status

2. **Enhanced Webhooks:** `backend/src/routes/webhook.routes.ts`
   - Razorpay webhook handler
   - Automatic transaction updates
   - Pass cancellation on refund

3. **Validation Updates:** `backend/src/routes/pass.routes.ts`
   - Pending transaction checks
   - Duplicate purchase prevention
   - Enhanced error messages

### ⏳ Frontend (Needs Update)

**File to Update:** `src/components/pass-booking.tsx`

The commented section (lines 268-342) needs to be uncommented and configured.

---

## 🏃 Quick Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install razorpay
```

### Step 2: Add Environment Variables

**Backend:** `backend/.env`

```env
# Add these new variables:
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx
```

### Step 3: Get Razorpay Keys

1. Sign up at https://razorpay.com/
2. Dashboard → Settings → API Keys
3. Generate Test Keys (for development)
4. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`
5. Settings → Webhooks → Create Webhook
   - URL: `http://localhost:5000/api/v1/webhooks/razorpay`
   - Events: `payment.captured`, `payment.failed`, `refund.processed`
   - Copy **Webhook Secret** → `RAZORPAY_WEBHOOK_SECRET`

### Step 4: Update Frontend

**File:** `src/utils/razorpay.ts`

Replace `YOUR_RAZORPAY_KEY_ID` with your actual key:

```typescript
export const RAZORPAY_KEY_ID = 'rzp_test_xxxxxxxxx'; // Your actual key
```

### Step 5: Restart Server

```bash
cd backend
npm run dev
```

---

## 🧪 Testing the Payment System

### Test with Test Mode

**Test Cards:**
```
✅ Success: 4111 1111 1111 1111
❌ Failure: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
Name: Test User
```

### Test Flow

1. **Go to Pass Booking Page**
   ```
   http://localhost:5173/booking
   ```

2. **Select a Pass** (e.g., Platinum Pass - ₹799)

3. **Fill User Details**
   - Name, Email, Phone
   - College info (optional)
   - Add-ons (optional)

4. **Click "Pay"**

5. **Choose Payment Method:**
   - **For Testing:** Currently bypasses payment (creates pass directly)
   - **For Production:** Will open Razorpay modal

### Verify Everything Works

✅ **Success Path:**
1. Pass created in database
2. Transaction marked 'completed'
3. QR code generated
4. Redirect to success page
5. Can download pass PDF
6. Can download invoice PDF

❌ **Failure Prevention:**
1. Try to book second pass → Error: "You already have a pass"
2. Try with invalid data → Validation errors
3. Try without login → Redirected to login

---

## 🔄 Switching from Test to Production Mode

### Current Mode: TEST (Bypasses Payment)

**File:** `src/components/pass-booking.tsx` (Lines 268-342)

Currently using:
```typescript
// TEMPORARY: Direct Pass Creation (For Testing QR Codes)
await fetch("http://localhost:5000/api/v1/passes/create", {
  method: "POST",
  // Creates pass without payment
});
```

### Production Mode: RAZORPAY

To enable real payments:

1. **Comment out** the test code (lines 289-373)
2. **Uncomment** the Razorpay code (lines 268-287)
3. **Update Razorpay Key** in the code:

```typescript
const options = {
  key: 'rzp_test_xxxxxxxxx', // ← Replace with your key
  amount: orderData.data.amount,
  // ...
};
```

---

## 📊 How It Works Now

### Backend Flow

```
1. POST /payment/create-order
   ├─ Validate user
   ├─ Check existing pass ✅ NEW
   ├─ Check pending transactions ✅ NEW
   ├─ Create Razorpay order
   └─ Create transaction (status: pending)

2. User Pays (Razorpay Modal)
   ├─ Success → returns payment_id, signature
   └─ Failure → modal dismissed

3. POST /payment/verify-and-create-pass
   ├─ Verify signature ✅ Security
   ├─ Check double-purchase ✅ NEW
   ├─ Generate pass ID & QR code
   ├─ Create pass
   ├─ Update transaction (status: completed)
   └─ Return pass + transaction

4. POST /payment/payment-failed (if cancelled)
   └─ Update transaction (status: failed)
```

### Security Features

✅ **Signature Verification**
- Prevents payment tampering
- Uses HMAC-SHA256

✅ **One Pass Per User**
- Database-level check
- Prevents duplicates

✅ **Race Condition Handling**
- Atomic transactions
- Status checks

✅ **Failed Payment Tracking**
- Records all attempts
- Allows retry

---

## 🐛 Troubleshooting

### Issue: "Order creation failed"

**Cause:** Invalid Razorpay keys

**Fix:**
```bash
# Check backend/.env has correct keys
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Restart server
npm run dev
```

### Issue: "Payment verification failed"

**Cause:** Signature mismatch

**Fix:**
- Ensure RAZORPAY_KEY_SECRET is correct
- Don't modify payment response
- Check for network issues

### Issue: "You already have a pass"

**Cause:** User already purchased a pass

**Fix:**
- This is intentional (one pass per user)
- Check user dashboard
- For testing: Delete pass from database

```sql
-- TESTING ONLY - Delete user's passes
DELETE FROM passes WHERE user_id = '...';
DELETE FROM transactions WHERE user_id = '...';
```

### Issue: "Transaction not found"

**Cause:** Order ID mismatch

**Fix:**
- Create new order
- Don't reuse old order IDs
- Check transaction table for status

---

## 📝 API Quick Reference

### Create Order
```bash
curl -X POST http://localhost:5000/api/v1/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "clerkUserId": "user_xxx",
    "passType": "Platinum Pass",
    "price": 799,
    "hasMeals": true
  }'
```

### Verify Payment
```bash
curl -X POST http://localhost:5000/api/v1/payment/verify-and-create-pass \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "signature_xxx"
  }'
```

### Get Transaction
```bash
curl http://localhost:5000/api/v1/payment/transaction/uuid-xxx
```

### Initiate Refund (Admin)
```bash
curl -X POST http://localhost:5000/api/v1/payment/refund \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "uuid-xxx",
    "reason": "User requested refund"
  }'
```

---

## 🎯 Next Steps

1. **Install Razorpay package:**
   ```bash
   cd backend && npm install razorpay
   ```

2. **Add environment variables** (see Step 2)

3. **Get Razorpay test keys** (see Step 3)

4. **Test the flow:**
   - Create order
   - Check transaction in database
   - Verify pass creation

5. **When ready for production:**
   - Get live keys from Razorpay
   - Update frontend code
   - Configure production webhook

---

## 📚 Documentation

- **Full Payment Guide:** `docs/PAYMENT_INTEGRATION.md`
- **Implementation Checklist:** `docs/IMPLEMENTATION_CHECKLIST.md`
- **API Routes:** `backend/src/routes/payment.routes.ts`

---

**Status:** ✅ Backend Complete | ⏳ Frontend Setup Required  
**Estimated Setup Time:** 15 minutes  
**Testing Time:** 30 minutes
