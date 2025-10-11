# E-Summit 2026 - Backend Architecture Plan

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Folder Structure](#folder-structure)
7. [Authentication &amp; Authorization](#authentication--authorization)
8. [Payment Integration](#payment-integration)
9. [Deployment Strategy](#deployment-strategy)
10. [Security Considerations](#security-considerations)

---

## 🎯 Overview

The E-Summit 2026 backend system will handle:

- User authentication and authorization (attendees, admins, speakers)
- Event pass booking and payment processing (Razorpay integration)
- Event management (listings, schedules, registrations)
- Admin panel operations (participant management, QR scanning, analytics)
- Real-time check-in system
- Email notifications and confirmations
- Analytics and reporting

---

## 🛠️ Technology Stack

### Core Technologies

- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js 4.x (or Fastify for better performance)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16.x (primary) + Redis 7.x (caching/sessions)
- **ORM**: Prisma 5.x (type-safe database access)
- **Authentication**: JWT (access tokens) + Refresh tokens
- **Payment Gateway**: Razorpay SDK
- **Email Service**: SendGrid / AWS SES
- **File Storage**: AWS S3 / Cloudinary (for QR codes, certificates)
- **Validation**: Zod (runtime type validation)
- **API Documentation**: Swagger/OpenAPI 3.0

### Additional Tools

- **Rate Limiting**: express-rate-limit
- **Logging**: Winston + Morgan
- **Monitoring**: Sentry (error tracking), Prometheus (metrics)
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier
- **Process Manager**: PM2 (production)
- **Container**: Docker + Docker Compose

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│              (Already built - see /src folder)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTPS/REST API
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Load Balancer (Nginx)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │ API    │    │ API    │    │ API    │
   │ Server │    │ Server │    │ Server │
   │   1    │    │   2    │    │   3    │
   └────┬───┘    └────┬───┘    └────┬───┘
        │             │             │
        └─────────────┼─────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌────────────┐ ┌─────────┐ ┌──────────┐
   │ PostgreSQL │ │  Redis  │ │   S3     │
   │  Database  │ │  Cache  │ │ Storage  │
   └────────────┘ └─────────┘ └──────────┘
```

### Microservices (Optional - Phase 2)

- **Auth Service**: Handles authentication/authorization
- **Payment Service**: Razorpay integration and transaction management
- **Event Service**: Event CRUD, schedules, registrations
- **Notification Service**: Email/SMS notifications
- **Analytics Service**: Data aggregation and reporting

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
Users ──────< Passes >────── Events
  │                            │
  │                            │
  └──< AdminRoles              └──< EventRegistrations
       │                            │
       └──< AuditLogs               └──< CheckIns

Passes ──< Transactions
       │
       └──< QRCodes
```

### Core Tables

#### 1. **users**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for OAuth users
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  college VARCHAR(255),
  year_of_study VARCHAR(50),
  roll_number VARCHAR(100),
  auth_provider VARCHAR(50) DEFAULT 'email', -- 'email', 'google', 'github'
  email_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

#### 2. **passes**

```sql
CREATE TABLE passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pass_type VARCHAR(100) NOT NULL, -- 'Gold', 'Silver', 'Platinum', 'Group'
  pass_id VARCHAR(50) UNIQUE NOT NULL, -- 'ESUMMIT-2026-XXXXX'
  price DECIMAL(10,2) NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Cancelled', 'Refunded'
  
  -- Add-ons
  has_meals BOOLEAN DEFAULT false,
  has_merchandise BOOLEAN DEFAULT false,
  has_workshop_access BOOLEAN DEFAULT false,
  
  -- Payment info
  transaction_id UUID REFERENCES transactions(id),
  
  -- QR Code
  qr_code_url TEXT,
  qr_code_data TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_passes_user_id ON passes(user_id);
CREATE INDEX idx_passes_pass_id ON passes(pass_id);
CREATE INDEX idx_passes_status ON passes(status);
```

#### 3. **transactions**

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  pass_id UUID REFERENCES passes(id),
  
  -- Razorpay data
  razorpay_order_id VARCHAR(255) UNIQUE,
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  payment_method VARCHAR(50), -- 'upi', 'card', 'netbanking'
  
  metadata JSONB, -- Store additional payment details
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_razorpay_order_id ON transactions(razorpay_order_id);
```

#### 4. **events**

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'competitions', 'workshops', 'speakers', 'hackathon', 'networking'
  
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue VARCHAR(255) NOT NULL,
  
  -- Competition-specific
  prize_amount DECIMAL(10,2),
  eligibility TEXT,
  rules JSONB,
  judges JSONB,
  prerequisites TEXT,
  registration_deadline TIMESTAMP,
  
  -- Workshop/Speaker specific
  speaker_name VARCHAR(255),
  speaker_bio TEXT,
  speaker_image_url TEXT,
  
  max_participants INT,
  current_participants INT DEFAULT 0,
  
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
```

#### 5. **event_registrations**

```sql
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  pass_id UUID REFERENCES passes(id),
  
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'attended', 'cancelled'
  
  team_members JSONB, -- For team events
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, event_id)
);

CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
```

#### 6. **check_ins**

```sql
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_id UUID NOT NULL REFERENCES passes(id),
  user_id UUID NOT NULL REFERENCES users(id),
  event_id UUID REFERENCES events(id), -- NULL for venue entry
  
  check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  check_in_type VARCHAR(50) NOT NULL, -- 'venue_entry', 'event_entry'
  scanned_by UUID REFERENCES admin_users(id),
  location VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_check_ins_pass_id ON check_ins(pass_id);
CREATE INDEX idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX idx_check_ins_event_id ON check_ins(event_id);
CREATE INDEX idx_check_ins_time ON check_ins(check_in_time);
```

#### 7. **admin_users**

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'Super Admin', 'Event Manager', 'Scanner Operator', 'Analytics Viewer'
  
  permissions JSONB, -- {"participants": true, "scanner": true, ...}
  
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES admin_users(id)
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
```

#### 8. **audit_logs**

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL, -- 'check_in', 'refund', 'edit_pass', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'pass', 'user', 'event', etc.
  entity_id UUID NOT NULL,
  
  changes JSONB, -- Before/after data
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### 9. **notifications**

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'in_app'
  subject VARCHAR(255),
  message TEXT NOT NULL,
  
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP,
  error_message TEXT,
  
  metadata JSONB, -- Template data, etc.
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

#### 10. **sponsors**

```sql
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  tier VARCHAR(50) NOT NULL, -- 'title', 'platinum', 'gold', 'silver', 'bronze'
  description TEXT,
  
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sponsors_tier ON sponsors(tier);
CREATE INDEX idx_sponsors_display_order ON sponsors(display_order);
```

---

## 🔌 API Endpoints

### Base URL: `https://api.esummit2026.com/v1`

### Authentication Endpoints

#### POST `/auth/register`

Register a new user account

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "phone": "+91 98765 43210",
  "college": "TCET Mumbai"
}
```

#### POST `/auth/login`

User login

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

#### POST `/auth/refresh`

Refresh access token

#### POST `/auth/forgot-password`

Send password reset email

#### POST `/auth/reset-password`

Reset password with token

#### POST `/auth/verify-email`

Verify email with token

#### POST `/auth/logout`

Logout user (invalidate refresh token)

---

### User Endpoints

#### GET `/users/me`

Get current user profile (Authenticated)

#### PUT `/users/me`

Update user profile (Authenticated)

#### GET `/users/me/passes`

Get user's purchased passes (Authenticated)

#### GET `/users/me/events`

Get user's registered events (Authenticated)

---

### Pass Booking Endpoints

#### GET `/passes/types`

Get all available pass types with pricing

```json
[
  {
    "id": "gold",
    "name": "Gold Pass",
    "price": 499,
    "originalPrice": 699,
    "features": ["..."],
    "available": true
  }
]
```

#### POST `/passes/create-order`

Create Razorpay order for pass purchase (Authenticated)

```json
{
  "passType": "platinum",
  "addons": {
    "meals": true,
    "merchandise": false,
    "workshop": true
  }
}
```

**Response:**

```json
{
  "orderId": "order_xxx",
  "amount": 179900,
  "currency": "INR",
  "key": "rzp_live_xxx"
}
```

#### POST `/passes/verify-payment`

Verify Razorpay payment and create pass (Authenticated)

```json
{
  "orderId": "order_xxx",
  "paymentId": "pay_xxx",
  "signature": "signature_xxx"
}
```

#### GET `/passes/:passId`

Get pass details by pass ID (Authenticated)

#### GET `/passes/:passId/qr-code`

Download QR code for pass (Authenticated)

#### POST `/passes/:passId/cancel`

Cancel pass and request refund (Authenticated)

---

### Event Endpoints

#### GET `/events`

Get all events (with filters)

```
Query params:
  ?category=competitions
  &date=2026-03-15
  &status=upcoming
  &search=hackathon
```

#### GET `/events/:eventId`

Get event details by ID

#### POST `/events/:eventId/register`

Register for an event (Authenticated)

```json
{
  "teamMembers": [
    {
      "name": "Member 1",
      "email": "member1@example.com"
    }
  ]
}
```

#### DELETE `/events/:eventId/register`

Cancel event registration (Authenticated)

#### GET `/events/schedule`

Get complete event schedule

```json
{
  "2026-03-15": [
    {
      "id": "uuid",
      "title": "Opening Ceremony",
      "startTime": "09:00",
      "endTime": "10:00",
      "venue": "Main Auditorium"
    }
  ]
}
```

---

### Admin Endpoints (Requires Admin Auth)

#### POST `/admin/auth/login`

Admin login

```json
{
  "email": "admin@esummit.com",
  "password": "AdminPass123!"
}
```

#### GET `/admin/dashboard/stats`

Get dashboard statistics

```json
{
  "totalRegistrations": 2547,
  "revenue": 1850000,
  "activePasses": 2401,
  "checkInsToday": 1234,
  "passDistribution": {...}
}
```

#### GET `/admin/participants`

Get all participants (with filters)

```
Query params:
  ?search=john
  &passType=platinum
  &status=active
  &page=1
  &limit=50
```

#### GET `/admin/participants/:userId`

Get participant details

#### PUT `/admin/participants/:userId`

Update participant details

#### POST `/admin/check-in`

Check-in a participant via QR code

```json
{
  "passId": "ESUMMIT-2026-ABC123",
  "eventId": "uuid", // optional
  "location": "Main Entrance"
}
```

#### GET `/admin/check-ins`

Get all check-ins (with filters)

#### POST `/admin/refund/:passId`

Process refund for a pass

#### GET `/admin/analytics/export`

Export participant data as CSV

#### GET `/admin/audit-logs`

Get audit logs

---

### Admin User Management (Super Admin only)

#### GET `/admin/users`

Get all admin users

#### POST `/admin/users`

Create new admin user

```json
{
  "email": "scanner@esummit.com",
  "fullName": "Scanner Operator",
  "role": "Scanner Operator",
  "password": "TempPass123!"
}
```

#### PUT `/admin/users/:adminId`

Update admin user

#### DELETE `/admin/users/:adminId`

Deactivate admin user

---

### Sponsor Endpoints

#### GET `/sponsors`

Get all sponsors grouped by tier

#### GET `/sponsors/:sponsorId`

Get sponsor details

---

### Notification Endpoints

#### POST `/notifications/send` (Admin only)

Send notification to users

```json
{
  "recipientIds": ["uuid1", "uuid2"],
  "type": "email",
  "subject": "Event Reminder",
  "message": "...",
  "template": "event_reminder"
}
```

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection config
│   │   ├── redis.ts             # Redis connection config
│   │   ├── razorpay.ts          # Razorpay config
│   │   ├── email.ts             # Email service config
│   │   ├── s3.ts                # AWS S3 config
│   │   └── index.ts             # Export all configs
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── pass.controller.ts
│   │   ├── event.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── sponsor.controller.ts
│   │   └── notification.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts      # Authentication logic
│   │   ├── user.service.ts      # User CRUD operations
│   │   ├── pass.service.ts      # Pass booking logic
│   │   ├── payment.service.ts   # Razorpay integration
│   │   ├── event.service.ts     # Event management
│   │   ├── qr.service.ts        # QR code generation
│   │   ├── email.service.ts     # Email sending
│   │   ├── sms.service.ts       # SMS sending
│   │   ├── analytics.service.ts # Analytics & reporting
│   │   └── export.service.ts    # CSV/PDF export
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── admin.middleware.ts  # Admin role check
│   │   ├── validate.middleware.ts # Request validation
│   │   ├── rateLimit.middleware.ts
│   │   ├── error.middleware.ts  # Global error handler
│   │   └── logger.middleware.ts # Request logging
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── pass.routes.ts
│   │   ├── event.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── sponsor.routes.ts
│   │   └── index.ts             # Combine all routes
│   │
│   ├── models/ (Prisma)
│   │   └── schema.prisma        # Prisma schema definition
│   │
│   ├── validators/
│   │   ├── auth.validator.ts    # Zod schemas for auth
│   │   ├── user.validator.ts
│   │   ├── pass.validator.ts
│   │   ├── event.validator.ts
│   │   └── admin.validator.ts
│   │
│   ├── utils/
│   │   ├── jwt.util.ts          # JWT helpers
│   │   ├── hash.util.ts         # Password hashing
│   │   ├── email.template.ts    # Email templates
│   │   ├── qr.generator.ts      # QR code generation
│   │   ├── logger.util.ts       # Winston logger setup
│   │   ├── error.util.ts        # Custom error classes
│   │   └── helpers.ts           # Common helper functions
│   │
│   ├── types/
│   │   ├── express.d.ts         # Express type extensions
│   │   ├── models.ts            # Custom type definitions
│   │   └── api.ts               # API request/response types
│   │
│   ├── jobs/ (Optional - Background jobs)
│   │   ├── emailQueue.ts        # Email sending queue
│   │   ├── analyticsQueue.ts   # Analytics processing
│   │   └── cleanupQueue.ts      # Data cleanup
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── integration/
│   │   │   ├── auth.test.ts
│   │   │   ├── pass.test.ts
│   │   │   └── event.test.ts
│   │   └── setup.ts             # Test setup & teardown
│   │
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── seed.ts                  # Seed data
│
├── scripts/
│   ├── generateQR.ts            # Generate QR codes
│   ├── sendReminders.ts         # Send event reminders
│   └── cleanup.ts               # Data cleanup scripts
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── docs/
│   ├── API.md                   # API documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── DEVELOPMENT.md           # Development setup
│
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
├── README.md
└── LICENSE
```

---

## � QR Code Generation & Scanning System

### Overview

Each pass will have a **unique, secure QR code** that contains encrypted booking information. This QR code will be used for:
- Venue entry check-in
- Event-specific check-ins
- Verification of pass authenticity
- Tracking attendance

### QR Code Generation Flow

```
User Completes Payment
       ↓
Backend Verifies Payment
       ↓
Create Pass Record in Database
       ↓
Generate Unique Pass ID (e.g., ESUMMIT-2026-ABC123)
       ↓
Create QR Code Data (Encrypted JSON)
       ↓
Generate QR Code Image
       ↓
Upload to S3/Cloud Storage
       ↓
Store QR URL in Database
       ↓
Send Confirmation Email with QR Code
       ↓
User Downloads/Saves QR Code
```

### QR Code Data Structure

The QR code will contain **encrypted JSON** to prevent tampering:

```typescript
// Original data (before encryption)
interface QRCodeData {
  passId: string;           // "ESUMMIT-2026-ABC123"
  userId: string;           // UUID of the user
  passType: string;         // "Platinum", "Gold", etc.
  userName: string;         // "John Doe"
  email: string;            // "john@example.com"
  validFrom: string;        // ISO timestamp
  validUntil: string;       // ISO timestamp
  checksum: string;         // SHA256 hash for verification
}

// Encrypted QR data (what's stored in QR)
const qrData = encrypt(JSON.stringify(qrCodeData), QR_SECRET_KEY);
// Result: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Implementation - QR Generation Service

```typescript
// src/services/qr.service.ts

import QRCode from 'qrcode';
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const QR_SECRET_KEY = process.env.QR_SECRET_KEY!;
const QR_ALGORITHM = 'aes-256-gcm';

export class QRService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  /**
   * Encrypt QR code data
   */
  private encryptQRData(data: object): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      QR_ALGORITHM,
      Buffer.from(QR_SECRET_KEY, 'hex'),
      iv
    );

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine iv + authTag + encrypted data
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt QR code data (for scanning)
   */
  decryptQRData(encryptedData: string): any {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

    const decipher = crypto.createDecipheriv(
      QR_ALGORITHM,
      Buffer.from(QR_SECRET_KEY, 'hex'),
      Buffer.from(ivHex, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  /**
   * Generate checksum for data integrity
   */
  private generateChecksum(data: object): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Generate QR code for a pass
   */
  async generateQRCode(pass: {
    id: string;
    passId: string;
    userId: string;
    passType: string;
    user: { fullName: string; email: string };
  }): Promise<{ qrCodeUrl: string; qrCodeData: string }> {
    // Prepare QR data
    const validFrom = new Date();
    const validUntil = new Date('2026-03-17'); // Event end date

    const qrData = {
      passId: pass.passId,
      userId: pass.userId,
      passType: pass.passType,
      userName: pass.user.fullName,
      email: pass.user.email,
      validFrom: validFrom.toISOString(),
      validUntil: validUntil.toISOString(),
      checksum: '',
    };

    // Generate checksum
    qrData.checksum = this.generateChecksum(qrData);

    // Encrypt the data
    const encryptedData = this.encryptQRData(qrData);

    // Generate QR code image (PNG)
    const qrCodeBuffer = await QRCode.toBuffer(encryptedData, {
      errorCorrectionLevel: 'H', // High error correction
      type: 'png',
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Upload to S3
    const fileName = `qr-codes/${pass.passId}.png`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: qrCodeBuffer,
        ContentType: 'image/png',
        ACL: 'public-read',
      })
    );

    const qrCodeUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    return {
      qrCodeUrl,
      qrCodeData: encryptedData,
    };
  }

  /**
   * Validate QR code data
   */
  async validateQRCode(encryptedData: string): Promise<{
    valid: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // Decrypt data
      const qrData = this.decryptQRData(encryptedData);

      // Verify checksum
      const { checksum, ...dataWithoutChecksum } = qrData;
      const expectedChecksum = this.generateChecksum(dataWithoutChecksum);

      if (checksum !== expectedChecksum) {
        return { valid: false, error: 'QR code has been tampered with' };
      }

      // Check validity dates
      const now = new Date();
      const validFrom = new Date(qrData.validFrom);
      const validUntil = new Date(qrData.validUntil);

      if (now < validFrom) {
        return { valid: false, error: 'QR code is not yet valid' };
      }

      if (now > validUntil) {
        return { valid: false, error: 'QR code has expired' };
      }

      return { valid: true, data: qrData };
    } catch (error) {
      return { valid: false, error: 'Invalid QR code format' };
    }
  }
}
```

### QR Code Scanning Flow

```
Admin Opens Scanner App
       ↓
Camera Scans QR Code
       ↓
Frontend Extracts Encrypted Data
       ↓
POST /admin/check-in with encrypted data
       ↓
Backend Decrypts & Validates QR
       ↓
Check Pass Status in Database
       ↓
Verify Not Already Checked In (for specific event)
       ↓
Create Check-In Record
       ↓
Update Statistics
       ↓
Return Success + User Details
       ↓
Display on Scanner Screen
```

### Check-In API Implementation

```typescript
// src/controllers/admin.controller.ts

import { Request, Response } from 'express';
import { QRService } from '../services/qr.service';
import { prisma } from '../config/database';

export class AdminController {
  private qrService: QRService;

  constructor() {
    this.qrService = new QRService();
  }

  /**
   * Check-in a participant via QR code
   * POST /admin/check-in
   */
  async checkIn(req: Request, res: Response) {
    try {
      const { qrData, eventId, location } = req.body;
      const adminId = req.user!.id; // From auth middleware

      // 1. Validate QR code
      const validation = await this.qrService.validateQRCode(qrData);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
        });
      }

      const qrInfo = validation.data;

      // 2. Get pass from database
      const pass = await prisma.passes.findUnique({
        where: { passId: qrInfo.passId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              college: true,
            },
          },
        },
      });

      if (!pass) {
        return res.status(404).json({
          success: false,
          error: 'Pass not found',
        });
      }

      // 3. Check pass status
      if (pass.status !== 'Active') {
        return res.status(400).json({
          success: false,
          error: `Pass is ${pass.status.toLowerCase()}`,
        });
      }

      // 4. Check if already checked in (for venue entry, allow multiple; for events, once only)
      const checkInType = eventId ? 'event_entry' : 'venue_entry';

      if (eventId) {
        const existingCheckIn = await prisma.checkIns.findFirst({
          where: {
            passId: pass.id,
            eventId: eventId,
            checkInType: 'event_entry',
          },
        });

        if (existingCheckIn) {
          return res.status(400).json({
            success: false,
            error: 'Already checked in for this event',
            checkInTime: existingCheckIn.checkInTime,
          });
        }

        // Verify user is registered for the event
        const registration = await prisma.eventRegistrations.findFirst({
          where: {
            userId: pass.userId,
            eventId: eventId,
            status: 'registered',
          },
        });

        if (!registration) {
          return res.status(400).json({
            success: false,
            error: 'Not registered for this event',
          });
        }
      }

      // 5. Create check-in record
      const checkIn = await prisma.checkIns.create({
        data: {
          passId: pass.id,
          userId: pass.userId,
          eventId: eventId || null,
          checkInType,
          scannedBy: adminId,
          location: location || 'Main Entrance',
        },
      });

      // 6. Update event registration status if event check-in
      if (eventId) {
        await prisma.eventRegistrations.updateMany({
          where: {
            userId: pass.userId,
            eventId: eventId,
          },
          data: {
            status: 'attended',
          },
        });
      }

      // 7. Create audit log
      await prisma.auditLogs.create({
        data: {
          adminUserId: adminId,
          action: 'check_in',
          entityType: 'pass',
          entityId: pass.id,
          changes: {
            checkInType,
            eventId,
            location,
            timestamp: new Date(),
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      });

      // 8. Return success response
      return res.status(200).json({
        success: true,
        message: 'Check-in successful',
        checkIn: {
          id: checkIn.id,
          checkInTime: checkIn.checkInTime,
          type: checkInType,
        },
        participant: {
          name: pass.user.fullName,
          email: pass.user.email,
          phone: pass.user.phone,
          college: pass.user.college,
          passType: pass.passType,
          passId: pass.passId,
        },
      });
    } catch (error) {
      console.error('Check-in error:', error);
      return res.status(500).json({
        success: false,
        error: 'Check-in failed',
      });
    }
  }

  /**
   * Get check-in history for a pass
   * GET /admin/check-ins/:passId
   */
  async getCheckInHistory(req: Request, res: Response) {
    try {
      const { passId } = req.params;

      const pass = await prisma.passes.findUnique({
        where: { passId },
      });

      if (!pass) {
        return res.status(404).json({
          success: false,
          error: 'Pass not found',
        });
      }

      const checkIns = await prisma.checkIns.findMany({
        where: { passId: pass.id },
        include: {
          event: {
            select: {
              title: true,
              venue: true,
            },
          },
          scannedByAdmin: {
            select: {
              fullName: true,
            },
          },
        },
        orderBy: { checkInTime: 'desc' },
      });

      return res.status(200).json({
        success: true,
        checkIns,
      });
    } catch (error) {
      console.error('Error fetching check-in history:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch check-in history',
      });
    }
  }
}
```

### Frontend Scanner Implementation

You can build a **Progressive Web App (PWA)** for QR scanning using the device camera:

```typescript
// Scanner component using react-qr-scanner

import { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';

export function QRScanner() {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (data: any) => {
    if (data && scanning) {
      setScanning(false);

      try {
        // Send to backend for validation and check-in
        const response = await axios.post(
          '/api/v1/admin/check-in',
          {
            qrData: data.text,
            location: 'Main Entrance',
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
          }
        );

        setResult(response.data);

        // Show success for 3 seconds, then resume scanning
        setTimeout(() => {
          setScanning(true);
          setResult(null);
        }, 3000);
      } catch (error: any) {
        setResult({
          success: false,
          error: error.response?.data?.error || 'Check-in failed',
        });

        setTimeout(() => {
          setScanning(true);
          setResult(null);
        }, 3000);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="qr-scanner">
      <h2>Scan Participant QR Code</h2>

      {scanning ? (
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%', maxWidth: 500 }}
        />
      ) : (
        <div className="scan-result">
          {result?.success ? (
            <div className="success">
              <h3>✓ Check-in Successful</h3>
              <p><strong>Name:</strong> {result.participant.name}</p>
              <p><strong>Pass Type:</strong> {result.participant.passType}</p>
              <p><strong>Pass ID:</strong> {result.participant.passId}</p>
              <p><strong>Time:</strong> {new Date(result.checkIn.checkInTime).toLocaleString()}</p>
            </div>
          ) : (
            <div className="error">
              <h3>✗ Check-in Failed</h3>
              <p>{result?.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### NPM Packages Required

```bash
# Backend
npm install qrcode crypto
npm install @aws-sdk/client-s3

# Frontend (for scanner app)
npm install react-qr-scanner
# or
npm install html5-qrcode
```

### Security Best Practices

1. **Encryption**: Always encrypt QR data with AES-256-GCM
2. **Checksum**: Include SHA256 hash to detect tampering
3. **Expiry**: QR codes expire after event end date
4. **One-time check-in**: Events allow only one check-in per pass
5. **Rate limiting**: Limit scan API calls to prevent abuse
6. **Audit logs**: Track all check-in activities
7. **HTTPS only**: Never transmit QR data over HTTP

### QR Code Email Template

```html
<!-- Email sent after successful payment -->
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>🎉 E-Summit 2026 - Pass Confirmation</h2>
  
  <p>Dear {{userName}},</p>
  
  <p>Your {{passType}} Pass has been confirmed!</p>
  
  <div style="text-align: center; padding: 20px; background: #f5f5f5;">
    <img src="{{qrCodeUrl}}" alt="QR Code" style="width: 300px; height: 300px;" />
    <p><strong>Pass ID: {{passId}}</strong></p>
  </div>
  
  <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;">
    <strong>Important:</strong>
    <ul>
      <li>Save this QR code on your phone</li>
      <li>Present it at the venue entrance</li>
      <li>Do not share with others</li>
      <li>Valid from: March 15-17, 2026</li>
    </ul>
  </div>
  
  <p><a href="{{downloadUrl}}" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Download QR Code</a></p>
</div>
```

### Testing the QR System

```bash
# Generate test QR code
curl -X POST http://localhost:3000/api/v1/passes/generate-qr \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"passId": "ESUMMIT-2026-TEST001"}'

# Test QR validation
curl -X POST http://localhost:3000/api/v1/admin/check-in \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "encrypted_qr_data_here",
    "location": "Main Entrance"
  }'
```

---

## �🔐 Authentication & Authorization

### JWT Strategy

- **Access Token**: Short-lived (15 minutes), stored in memory
- **Refresh Token**: Long-lived (7 days), stored in httpOnly cookie
- **Token Payload**:
  ```json
  {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "user" // or "admin"
  }
  ```

### Admin Roles & Permissions

```typescript
enum AdminRole {
  SUPER_ADMIN = 'Super Admin',      // Full access
  EVENT_MANAGER = 'Event Manager',  // Manage participants, events, analytics
  SCANNER_OPERATOR = 'Scanner Operator', // Only check-in access
  ANALYTICS_VIEWER = 'Analytics Viewer'  // Read-only analytics
}

interface RolePermissions {
  participants: boolean;
  scanner: boolean;
  analytics: boolean;
  export: boolean;
  edit: boolean;
}
```

### Security Measures

- Password hashing with **bcrypt** (10 rounds)
- Rate limiting: 100 requests/15min per IP
- CORS configuration for frontend domain only
- Helmet.js for security headers
- SQL injection prevention via Prisma ORM
- XSS protection via input sanitization
- CSRF protection for state-changing operations

---

## 💳 Payment Integration

### Razorpay Flow

1. **Frontend**: User selects pass → calls `POST /passes/create-order`
2. **Backend**: Creates Razorpay order → returns `order_id`
3. **Frontend**: Opens Razorpay checkout with `order_id`
4. **User**: Completes payment
5. **Frontend**: Receives payment response → calls `POST /passes/verify-payment`
6. **Backend**:
   - Verifies payment signature
   - Creates pass record
   - Generates QR code
   - Sends confirmation email
   - Returns pass details

### Webhook Handler

```typescript
POST /webhooks/razorpay
// Handle payment events: payment.captured, payment.failed, refund.created
```

---

## 🚀 Deployment Strategy

### Recommended Infrastructure

#### Option 1: Cloud VPS (DigitalOcean/AWS EC2)

- **Server**: 2 vCPU, 4GB RAM (scalable)
- **Database**: Managed PostgreSQL (DigitalOcean/AWS RDS)
- **Cache**: Managed Redis
- **Storage**: AWS S3 / DigitalOcean Spaces
- **CDN**: Cloudflare
- **SSL**: Let's Encrypt (automatic renewal)

#### Option 2: Serverless (AWS Lambda + API Gateway)

- Lower cost for variable traffic
- Auto-scaling
- Pay-per-use model

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
on: [push]
jobs:
  test:
    - Run linting
    - Run unit tests
    - Run integration tests
  
  build:
    - Build Docker image
    - Push to registry
  
  deploy:
    - Deploy to staging (on develop branch)
    - Deploy to production (on main branch)
```

### Environment Variables

```env
# Server
NODE_ENV=production
PORT=3000
API_URL=https://api.esummit2026.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/esummit
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Email
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@esummit2026.com

# AWS S3
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_BUCKET_NAME=esummit-2026

# SMS (Optional)
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Frontend URL
FRONTEND_URL=https://esummit2026.com
```

---

## 🔒 Security Considerations

### Input Validation

- Use Zod for runtime type checking
- Sanitize all user inputs
- Validate file uploads (size, type)

### Database Security

- Use parameterized queries (Prisma handles this)
- Implement row-level security (RLS)
- Regular backups (automated daily)
- Encrypt sensitive data at rest

### API Security

- HTTPS only (enforce TLS 1.2+)
- Rate limiting per endpoint
- API key rotation policy
- Monitor for suspicious activity

### Admin Access

- 2FA for admin accounts (recommended)
- Audit logs for all admin actions
- IP whitelisting for admin panel
- Session timeout after inactivity

### GDPR Compliance

- Data retention policy
- User data export functionality
- Right to deletion mechanism
- Privacy policy and consent forms

---

## 📊 Monitoring & Logging

### Metrics to Track

- API response times
- Error rates
- Active user sessions
- Payment success/failure rates
- Database query performance
- Cache hit/miss rates

### Logging Strategy

```typescript
// Winston logger levels
{
  error: 0,   // System errors
  warn: 1,    // Warning conditions
  info: 2,    // Informational messages
  http: 3,    // HTTP requests
  debug: 4    // Debug information
}
```

### Alerts

- Payment failures (immediate)
- Server errors (immediate)
- High error rate (5 min)
- Database connection issues (immediate)
- Disk space warnings (daily)

---

## 🧪 Testing Strategy

### Test Coverage Goals

- Unit tests: 80%+ coverage
- Integration tests: Critical paths
- E2E tests: Main user flows

### Test Types

```typescript
// Unit tests
describe('PassService', () => {
  it('should create pass after payment verification', async () => {
    // Test logic
  });
});

// Integration tests
describe('POST /passes/verify-payment', () => {
  it('should create pass and send email', async () => {
    // Test API endpoint
  });
});
```

---

## 📈 Scalability Considerations

### Current Phase (MVP)

- Single server deployment
- ~5,000 concurrent users
- ~10,000 total registrations

### Future Scaling (if needed)

- Horizontal scaling (multiple API servers)
- Database read replicas
- Redis cluster
- CDN for static assets
- Load balancer (Nginx/AWS ALB)
- Microservices architecture

---

## 🎯 Development Roadmap

### Phase 1: Core Backend (Week 1-2)

- [ ] Database setup (PostgreSQL + Prisma)
- [ ] Authentication system
- [ ] User management
- [ ] Basic API structure

### Phase 2: Pass Booking (Week 3)

- [ ] Razorpay integration
- [ ] Pass creation logic
- [ ] QR code generation
- [ ] Email notifications

### Phase 3: Events (Week 4)

- [ ] Event CRUD operations
- [ ] Event registration
- [ ] Schedule management

### Phase 4: Admin Panel (Week 5)

- [ ] Admin authentication
- [ ] Participant management
- [ ] QR scanner API
- [ ] Analytics endpoints

### Phase 5: Testing & Deployment (Week 6)

- [ ] Unit & integration tests
- [ ] Load testing
- [ ] Security audit
- [ ] Production deployment

---

## 📝 Next Steps

1. **Set up development environment**

   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express prisma @prisma/client typescript ts-node
   npm install -D @types/node @types/express
   npx tsc --init
   npx prisma init
   ```
2. **Create initial Prisma schema** (see Database Schema section)
3. **Set up basic Express server** (see Folder Structure)
4. **Implement authentication** (JWT + bcrypt)
5. **Connect Razorpay sandbox** for testing
6. **Build API endpoints** incrementally

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Author**: E-Summit 2026 Development Team
