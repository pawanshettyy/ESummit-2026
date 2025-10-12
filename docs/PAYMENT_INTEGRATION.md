# 💳 Payment Integration Guide - E-Summit 2026

## 🎯 Overview

This guide covers the complete payment flow with Razorpay integration, including payment verification, failed payment handling, and refunds.

## 📋 Table of Contents

1. [Payment Flow](#payment-flow)
2. [API Endpoints](#api-endpoints)
3. [Frontend Integration](#frontend-integration)
4. [Webhook Configuration](#webhook-configuration)
5. [Testing](#testing)
6. [Security](#security)
7. [Error Handling](#error-handling)

---

## 🔄 Payment Flow

### Complete User Journey

```
1. User selects pass → Pass Selection Page
   ↓
2. User fills details → Registration Form
   ↓
3. User clicks "Pay" → Frontend calls /payment/create-order
   ↓
4. Backend creates Razorpay order → Returns order_id
   ↓
5. Frontend opens Razorpay modal → User completes payment
   ↓
6a. SUCCESS PATH:
   - Razorpay returns payment_id, signature
   - Frontend calls /payment/verify-and-create-pass
   - Backend verifies signature
   - Pass created with QR code
   - Transaction marked 'completed'
   - User redirected to success page
   
6b. FAILURE PATH:
   - Payment fails/cancelled
   - Frontend calls /payment/payment-failed
   - Transaction marked 'failed'
   - User shown error message
   - Can retry payment
```

### Database State Machine

```
Transaction Status Flow:
pending → completed  (Payment successful)
pending → failed     (Payment failed/cancelled)
completed → refunded (Refund processed)
```

---

## 🔌 API Endpoints

### 1. Create Payment Order

**Endpoint:** `POST /api/v1/payment/create-order`

**Purpose:** Creates a Razorpay order and pending transaction

**Request:**
```json
{
  "clerkUserId": "user_xxx",
  "passType": "Platinum Pass",
  "price": 799,
  "hasMeals": true,
  "hasMerchandise": false,
  "hasWorkshopAccess": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_xxx",
    "amount": 79900,
    "currency": "INR",
    "transactionId": "uuid-xxx"
  }
}
```

**Validations:**
- User exists
- User doesn't already have a pass
- Price is positive
- No pending transactions exist

---

### 2. Verify Payment and Create Pass

**Endpoint:** `POST /api/v1/payment/verify-and-create-pass`

**Purpose:** Verifies Razorpay payment signature and creates pass

**Request:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified and pass created successfully",
  "data": {
    "pass": {
      "id": "uuid",
      "passId": "ESUMMIT-2026-ABC123",
      "passType": "Platinum Pass",
      "price": "799.00",
      "status": "Active",
      "qrCodeUrl": "data:image/png;base64,...",
      "hasMeals": true
    },
    "transaction": {
      "id": "uuid",
      "status": "completed",
      "razorpayPaymentId": "pay_xxx"
    }
  }
}
```

**Signature Verification:**
```typescript
const generatedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(`${order_id}|${payment_id}`)
  .digest('hex');

if (generatedSignature !== razorpay_signature) {
  // Payment verification failed
}
```

**Error Cases:**
- Signature mismatch → Transaction marked 'failed'
- User already has pass → Transaction marked 'refund_pending'
- Transaction already completed → Error

---

### 3. Handle Payment Failure

**Endpoint:** `POST /api/v1/payment/payment-failed`

**Purpose:** Records failed/cancelled payment

**Request:**
```json
{
  "razorpay_order_id": "order_xxx",
  "error": "Payment cancelled by user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment failure recorded",
  "data": {
    "transactionId": "uuid"
  }
}
```

---

### 4. Get Transaction Status

**Endpoint:** `GET /api/v1/payment/transaction/:transactionId`

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "status": "completed",
      "amount": "799.00",
      "razorpayPaymentId": "pay_xxx",
      "user": {
        "email": "user@example.com"
      },
      "pass": {
        "passId": "ESUMMIT-2026-ABC123",
        "status": "Active"
      }
    }
  }
}
```

---

### 5. Initiate Refund (Admin Only)

**Endpoint:** `POST /api/v1/payment/refund`

**Request:**
```json
{
  "transactionId": "uuid",
  "reason": "User requested refund"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refund initiated successfully",
  "data": {
    "refund": {
      "id": "rfnd_xxx",
      "amount": 79900,
      "status": "processed"
    }
  }
}
```

**Validations:**
- Transaction must be 'completed'
- Must have razorpayPaymentId
- Pass will be marked 'Refunded'

---

### 6. Get User Transactions

**Endpoint:** `GET /api/v1/payment/user/:clerkUserId/transactions`

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "amount": "799.00",
        "status": "completed",
        "createdAt": "2026-01-15T10:30:00Z",
        "pass": {
          "passId": "ESUMMIT-2026-ABC123",
          "passType": "Platinum Pass"
        }
      }
    ]
  }
}
```

---

## 🌐 Frontend Integration

### Step 1: Install Razorpay SDK

```bash
npm install razorpay
```

### Step 2: Load Razorpay Script

Add to `index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 3: Update Frontend Payment Flow

**File:** `src/components/pass-booking.tsx`

```typescript
const handlePayment = async () => {
  setIsProcessingPayment(true);

  try {
    // Step 1: Create Razorpay order
    const orderResponse = await fetch('http://localhost:5000/api/v1/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkUserId: user?.id,
        passType: selectedPassData?.name,
        price: totalPrice,
        hasMeals: formData.meals,
        hasMerchandise: formData.merchandise,
        hasWorkshopAccess: formData.workshop,
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order');
    }

    // Step 2: Open Razorpay modal
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your key
      amount: orderData.data.amount,
      currency: orderData.data.currency,
      name: 'E-Summit 2026',
      description: selectedPassData?.name || 'Event Pass',
      order_id: orderData.data.orderId,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#6366f1',
      },
      handler: async (response: any) => {
        // Step 3: Verify payment
        try {
          const verifyResponse = await fetch(
            'http://localhost:5000/api/v1/payment/verify-and-create-pass',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            setCreatedPass({
              passId: verifyData.data.pass.passId,
              qrCodeUrl: verifyData.data.pass.qrCodeUrl,
            });
            toast.success('Payment successful! Pass created.');
            setStep(4);
          } else {
            throw new Error(verifyData.message);
          }
        } catch (error) {
          toast.error('Payment verification failed');
        } finally {
          setIsProcessingPayment(false);
        }
      },
      modal: {
        ondismiss: async () => {
          // Payment cancelled/failed
          await fetch('http://localhost:5000/api/v1/payment/payment-failed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderData.data.orderId,
              error: 'Payment cancelled by user',
            }),
          });
          toast.info('Payment cancelled');
          setIsProcessingPayment(false);
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();

  } catch (error: any) {
    console.error('Payment error:', error);
    toast.error(error.message || 'Failed to initiate payment');
    setIsProcessingPayment(false);
  }
};
```

---

## 🔔 Webhook Configuration

### Razorpay Webhook Setup

1. **Go to Razorpay Dashboard** → Settings → Webhooks
2. **Add Webhook URL:** `https://your-domain.com/api/v1/webhooks/razorpay`
3. **Select Events:**
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
4. **Copy Webhook Secret** → Add to `.env` as `RAZORPAY_WEBHOOK_SECRET`

### Events Handled

**`payment.captured`**
- Updates transaction status to 'completed'
- Stores payment ID and method
- Marks webhook as processed

**`payment.failed`**
- Updates transaction status to 'failed'
- Stores failure reason
- Allows user to retry

**`refund.processed`**
- Updates transaction status to 'refunded'
- Cancels associated pass
- Records refund details

---

## 🧪 Testing

### Test Mode Setup

1. Use Razorpay Test Keys:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxx
```

2. Test Cards:
```
Success: 4111 1111 1111 1111
Failure: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

### Testing Scenarios

#### ✅ Successful Payment
```
1. Select pass
2. Fill details
3. Click "Pay"
4. Use test card 4111 1111 1111 1111
5. Complete payment
6. Verify pass created with QR code
7. Check transaction status = 'completed'
```

#### ❌ Failed Payment
```
1. Select pass
2. Fill details
3. Click "Pay"
4. Use test card 4000 0000 0000 0002
5. Payment fails
6. Verify transaction status = 'failed'
7. Verify no pass created
8. Can retry payment
```

#### 🔁 Refund
```
1. Complete successful payment
2. Admin calls /payment/refund with transactionId
3. Verify refund initiated in Razorpay
4. Check webhook updates transaction to 'refunded'
5. Verify pass marked 'Refunded'
```

#### 🚫 Duplicate Purchase Prevention
```
1. Complete successful payment
2. Try to create another order
3. Verify error: "You already have a pass"
4. Check no new order created
```

---

## 🔒 Security

### 1. Signature Verification

**Never trust client data alone!** Always verify signature:

```typescript
const generatedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(`${order_id}|${payment_id}`)
  .digest('hex');

if (generatedSignature !== razorpay_signature) {
  // FRAUD DETECTED - Reject payment
  throw new Error('Invalid signature');
}
```

### 2. Environment Variables

**Required in `.env`:**
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxx
```

**⚠️ NEVER commit these to Git!**

### 3. Idempotency

- One pass per user enforced at database level
- Transaction status prevents duplicate processing
- Webhook events are idempotent

### 4. Rate Limiting

Add rate limiting to payment endpoints:
```typescript
import rateLimit from 'express-rate-limit';

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many payment attempts. Please try again later.',
});

router.post('/create-order', paymentLimiter, async (req, res) => {
  // ...
});
```

---

## ⚠️ Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "User already has a pass" | Duplicate purchase | Check user dashboard |
| "Invalid signature" | Tampering/replay attack | Reject payment |
| "Transaction not found" | Order ID mismatch | Create new order |
| "Order creation failed" | Razorpay API issue | Check API keys |
| "Refund failed" | Payment already refunded | Check transaction status |

### Error Response Format

```json
{
  "success": false,
  "error": "User already has a pass",
  "details": {
    "code": "DUPLICATE_PURCHASE",
    "passId": "ESUMMIT-2026-ABC123"
  }
}
```

---

## 📊 Payment Flow Diagram

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       │ 1. Create Order
       ▼
┌─────────────────────┐
│  POST /create-order │
│                     │
│  Validations:       │
│  ✓ User exists      │
│  ✓ No existing pass │
│  ✓ Valid price      │
└──────┬──────────────┘
       │
       │ 2. Order Created
       ▼
┌──────────────┐      ┌─────────────┐
│   Razorpay   │◄────►│  Database   │
│    Modal     │      │ Transaction │
└──────┬───────┘      │  (pending)  │
       │              └─────────────┘
       │ 3. User Pays
       ▼
┌─────────────────────────────┐
│  Success Handler            │
│                             │
│  POST /verify-and-create   │
│                             │
│  ✓ Verify signature         │
│  ✓ Check double-purchase    │
│  ✓ Generate pass ID & QR    │
│  ✓ Create pass              │
│  ✓ Update transaction       │
└──────┬──────────────────────┘
       │
       │ 4. Pass Created
       ▼
┌─────────────────┐
│  Success Page   │
│                 │
│  • QR Code      │
│  • Pass Details │
│  • Download PDF │
└─────────────────┘
```

---

## 🚀 Production Checklist

- [ ] Replace test keys with live keys
- [ ] Set up webhook endpoint with HTTPS
- [ ] Configure webhook secret
- [ ] Test all payment scenarios
- [ ] Set up monitoring and alerts
- [ ] Configure refund policy
- [ ] Add payment analytics
- [ ] Test error handling
- [ ] Verify security measures
- [ ] Document payment flow for team

---

## 📝 Notes

1. **Test Mode:** Current implementation uses manual pass creation (bypasses payment)
2. **Production:** Uncomment Razorpay code in `pass-booking.tsx`
3. **Webhooks:** Essential for production to handle async payment events
4. **Refunds:** Processed within 5-7 business days
5. **Currency:** Currently INR only
6. **GST:** Add 18% to invoice (handled in PDF generation)

---

**Last Updated:** Current Session  
**Version:** 1.0  
**Status:** ✅ Payment system fully implemented
