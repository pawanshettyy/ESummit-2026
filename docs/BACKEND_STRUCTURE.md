# Backend Folder Structure - Quick Reference

```
ESummit-2026/
├── frontend/                          # ← Your existing React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                           # ← New backend directory
    │
    ├── src/
    │   │
    │   ├── config/                    # Configuration files
    │   │   ├── database.ts           # PostgreSQL connection
    │   │   ├── redis.ts              # Redis cache setup
    │   │   ├── razorpay.ts           # Razorpay credentials
    │   │   ├── email.ts              # Email service (SendGrid)
    │   │   ├── s3.ts                 # AWS S3 file storage
    │   │   └── index.ts
    │   │
    │   ├── controllers/               # Request handlers
    │   │   ├── auth.controller.ts    # Login, register, logout
    │   │   ├── user.controller.ts    # User profile management
    │   │   ├── pass.controller.ts    # Pass booking & management
    │   │   ├── event.controller.ts   # Event CRUD & registrations
    │   │   ├── admin.controller.ts   # Admin panel operations
    │   │   ├── sponsor.controller.ts # Sponsor management
    │   │   └── notification.controller.ts
    │   │
    │   ├── services/                  # Business logic layer
    │   │   ├── auth.service.ts       # Authentication logic
    │   │   ├── user.service.ts       # User operations
    │   │   ├── pass.service.ts       # Pass creation, QR generation
    │   │   ├── payment.service.ts    # Razorpay integration
    │   │   ├── event.service.ts      # Event management
    │   │   ├── qr.service.ts         # QR code generation
    │   │   ├── email.service.ts      # Email sending
    │   │   ├── sms.service.ts        # SMS notifications
    │   │   ├── analytics.service.ts  # Analytics & stats
    │   │   └── export.service.ts     # CSV/PDF export
    │   │
    │   ├── middleware/                # Express middleware
    │   │   ├── auth.middleware.ts    # JWT verification
    │   │   ├── admin.middleware.ts   # Admin role check
    │   │   ├── validate.middleware.ts # Zod validation
    │   │   ├── rateLimit.middleware.ts # Rate limiting
    │   │   ├── error.middleware.ts   # Error handler
    │   │   └── logger.middleware.ts  # Request logging
    │   │
    │   ├── routes/                    # API route definitions
    │   │   ├── auth.routes.ts        # /auth/*
    │   │   ├── user.routes.ts        # /users/*
    │   │   ├── pass.routes.ts        # /passes/*
    │   │   ├── event.routes.ts       # /events/*
    │   │   ├── admin.routes.ts       # /admin/*
    │   │   ├── sponsor.routes.ts     # /sponsors/*
    │   │   └── index.ts              # Combine routes
    │   │
    │   ├── validators/                # Zod schema validators
    │   │   ├── auth.validator.ts
    │   │   ├── user.validator.ts
    │   │   ├── pass.validator.ts
    │   │   ├── event.validator.ts
    │   │   └── admin.validator.ts
    │   │
    │   ├── utils/                     # Helper utilities
    │   │   ├── jwt.util.ts           # JWT sign/verify
    │   │   ├── hash.util.ts          # bcrypt password hashing
    │   │   ├── email.template.ts     # HTML email templates
    │   │   ├── qr.generator.ts       # QR code creation
    │   │   ├── logger.util.ts        # Winston logger
    │   │   ├── error.util.ts         # Custom error classes
    │   │   └── helpers.ts            # Common functions
    │   │
    │   ├── types/                     # TypeScript definitions
    │   │   ├── express.d.ts          # Express extensions
    │   │   ├── models.ts             # Model types
    │   │   └── api.ts                # API types
    │   │
    │   ├── jobs/                      # Background jobs (optional)
    │   │   ├── emailQueue.ts         # Email queue worker
    │   │   ├── analyticsQueue.ts     # Analytics processing
    │   │   └── cleanupQueue.ts       # Data cleanup
    │   │
    │   ├── tests/                     # Test files
    │   │   ├── unit/
    │   │   │   ├── services/
    │   │   │   └── utils/
    │   │   ├── integration/
    │   │   │   ├── auth.test.ts
    │   │   │   ├── pass.test.ts
    │   │   │   └── event.test.ts
    │   │   └── setup.ts
    │   │
    │   ├── app.ts                     # Express app configuration
    │   └── server.ts                  # Server entry point
    │
    ├── prisma/                        # Prisma ORM
    │   ├── schema.prisma             # Database schema
    │   ├── migrations/               # DB migration files
    │   │   └── 20260101000000_init/
    │   └── seed.ts                   # Seed data script
    │
    ├── scripts/                       # Utility scripts
    │   ├── generateQR.ts             # Bulk QR generation
    │   ├── sendReminders.ts          # Event reminders
    │   └── cleanup.ts                # Data cleanup
    │
    ├── docker/                        # Docker configuration
    │   ├── Dockerfile
    │   ├── docker-compose.yml
    │   └── nginx.conf
    │
    ├── docs/                          # Documentation
    │   ├── API.md                    # API docs
    │   ├── DEPLOYMENT.md             # Deploy guide
    │   └── DEVELOPMENT.md            # Setup guide
    │
    ├── .env.example                   # Environment variables template
    ├── .gitignore
    ├── .eslintrc.js
    ├── .prettierrc
    ├── tsconfig.json
    ├── package.json
    ├── README.md
    └── LICENSE
```

---

## 🎯 Key Files Explained

### Entry Points
- **`src/server.ts`** - Starts HTTP server, connects to DB
- **`src/app.ts`** - Express app setup with middleware & routes

### Database
- **`prisma/schema.prisma`** - All database tables & relationships
- **`prisma/migrations/`** - Version-controlled schema changes
- **`prisma/seed.ts`** - Initial data (admin user, sample events)

### Core Logic
- **`controllers/`** - Handle HTTP requests, call services
- **`services/`** - Business logic (payment, QR codes, emails)
- **`middleware/`** - Authentication, validation, logging
- **`routes/`** - API endpoint definitions

### Data Flow Example
```
Client Request
     ↓
routes/pass.routes.ts (POST /passes/verify-payment)
     ↓
middleware/auth.middleware.ts (verify JWT)
     ↓
middleware/validate.middleware.ts (validate body with Zod)
     ↓
controllers/pass.controller.ts (handle request)
     ↓
services/payment.service.ts (verify Razorpay signature)
     ↓
services/pass.service.ts (create pass record)
     ↓
services/qr.service.ts (generate QR code)
     ↓
services/email.service.ts (send confirmation email)
     ↓
Response to Client
```

---

## 📦 Essential npm Packages

### Core
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.3.3",
    "@prisma/client": "^5.8.0",
    "prisma": "^5.8.0",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1"
  }
}
```

### Authentication
```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### Payment
```json
{
  "dependencies": {
    "razorpay": "^2.9.2"
  }
}
```

### Email & SMS
```json
{
  "dependencies": {
    "@sendgrid/mail": "^8.1.0",
    "twilio": "^4.19.3"
  }
}
```

### QR Code
```json
{
  "dependencies": {
    "qrcode": "^1.5.3",
    "@types/qrcode": "^1.5.5"
  }
}
```

### Validation & Security
```json
{
  "dependencies": {
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "cors": "^2.8.5"
  }
}
```

### Logging & Monitoring
```json
{
  "dependencies": {
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    "@sentry/node": "^7.91.0"
  }
}
```

### Redis
```json
{
  "dependencies": {
    "ioredis": "^5.3.2"
  }
}
```

### Testing
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@types/jest": "^29.5.11",
    "@types/supertest": "^6.0.2",
    "ts-jest": "^29.1.1"
  }
}
```

---

## 🚀 Quick Start Commands

```bash
# 1. Create backend directory
mkdir backend && cd backend

# 2. Initialize Node.js project
npm init -y

# 3. Install dependencies
npm install express typescript @prisma/client prisma dotenv
npm install -D @types/node @types/express ts-node nodemon

# 4. Initialize TypeScript
npx tsc --init

# 5. Initialize Prisma
npx prisma init

# 6. Create folder structure
mkdir -p src/{config,controllers,services,middleware,routes,validators,utils,types,tests}

# 7. Start development server
npm run dev
```

---

## 🔧 package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

---

## 🌐 API Base Structure

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import errorMiddleware from './middleware/error.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorMiddleware);

export default app;
```

```typescript
// src/server.ts
import app from './app';
import { prisma } from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

---

## 📊 Database Tables Summary

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | email, password_hash, full_name |
| `passes` | Event passes | pass_id, user_id, pass_type, price |
| `transactions` | Payment records | razorpay_order_id, amount, status |
| `events` | Event listings | title, category, date, venue |
| `event_registrations` | Event sign-ups | user_id, event_id, status |
| `check_ins` | Venue/event check-ins | pass_id, check_in_time, scanned_by |
| `admin_users` | Admin accounts | email, role, permissions |
| `audit_logs` | Admin action logs | admin_user_id, action, changes |
| `notifications` | Email/SMS queue | user_id, type, status |
| `sponsors` | Sponsor info | name, tier, logo_url |

---

## 🔐 Authentication Flow

```
Registration:
1. POST /auth/register → Hash password → Create user → Send verification email
2. User clicks email link → POST /auth/verify-email → Mark email_verified=true

Login:
1. POST /auth/login → Verify password → Generate JWT tokens
2. Return { accessToken, refreshToken, user }

Protected Requests:
1. Client sends: Authorization: Bearer <accessToken>
2. Middleware verifies JWT → Attach user to req.user → Next()

Token Refresh:
1. POST /auth/refresh with refreshToken
2. Verify refresh token → Generate new accessToken
```

---

## 💡 Best Practices

✅ **Do:**
- Use environment variables for secrets
- Validate all inputs with Zod
- Hash passwords with bcrypt
- Use Prisma transactions for multi-step operations
- Log all errors with Winston
- Write tests for critical flows
- Document APIs with Swagger

❌ **Don't:**
- Store passwords in plain text
- Skip input validation
- Expose internal errors to clients
- Use `SELECT *` queries
- Hardcode configuration values
- Skip database indexes on foreign keys

---

## 🎓 Learning Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Express Best Practices**: https://expressjs.com/en/advanced/best-practice-security.html
- **Razorpay API**: https://razorpay.com/docs/api
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

---

**Ready to build? Start with the main `BACKEND_ARCHITECTURE.md` file!**
