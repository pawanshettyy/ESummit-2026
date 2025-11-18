# E-Summit 2026

A full-stack event management platform for E-Summit 2026 at Thakur College of Engineering and Technology. Features include pass booking, QR-based check-in, event management, and comprehensive admin dashboard.

## Project Overview

This platform manages the complete event lifecycle:

- **Pass Booking**: Multiple pass types (Gold, Silver, Platinum, Group) with Razorpay payment integration
- **QR Code System**: AES-256-GCM encrypted QR codes for secure check-in
- **Event Management**: Competitions, workshops, keynotes, and networking events
- **Admin Dashboard**: Real-time analytics, participant management, QR scanning, and reporting
- **User Dashboard**: Pass viewing, event registration, and schedule access

## Project Structure

```
ESummit-2026/
├── src/                          # Frontend (React + Vite + TypeScript)
│   ├── components/               # UI components
│   │   ├── homepage.tsx
│   │   ├── events-listing.tsx
│   │   ├── pass-booking.tsx
│   │   ├── admin-panel.tsx
│   │   └── ...
│   └── utils/                    # Utilities
│
├── backend/                      # Backend (Node.js + Express + TypeScript + Prisma)
│   ├── src/                      # Source code
│   │   ├── config/               # Configuration
│   │   ├── controllers/          # Route controllers
│   │   ├── services/             # Business logic
│   │   ├── middleware/           # Express middleware
│   │   ├── routes/               # API routes
│   │   ├── validators/           # Zod schemas
│   │   ├── utils/                # Utilities
│   │   └── types/                # TypeScript types
│   ├── prisma/                   # Database schema
│   ├── package.json
│   └── README.md                 # Backend documentation
│
├── docs/                         # Documentation
│   ├── BACKEND_ARCHITECTURE.md   # Complete backend plan
│   ├── QR_CODE_SYSTEM.md        # QR implementation guide
│   ├── QR_FLOW_DIAGRAM.md       # Visual QR flow
│   └── IMPLEMENTATION_GUIDE.md  # Step-by-step guide
│
└── README.md                     # This file
```

## Quick Start

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend: `http://localhost:5173`

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

Backend API: `http://localhost:5000`

**Documentation**:

- [backend/README.md](./backend/README.md) - Backend API reference
- [BACKEND_ARCHITECTURE.md](./docs/BACKEND_ARCHITECTURE.md) - System architecture
- [IMPLEMENTATION_GUIDE.md](./docs/IMPLEMENTATION_GUIDE.md) - Development roadmap

## QR Code System

### Workflow

1. **Booking**: User completes booking → Backend generates encrypted QR code → Stored in database
2. **Check-in**: User presents QR code → Admin scans → System validates → Entry logged

### Features

- AES-256-GCM encryption with SHA-256 checksum
- Pass validation (Active/Cancelled/Refunded)
- Multi-event scanning (up to 30 events per pass)
- 30-minute cooldown per event to prevent duplicates
- General entry mode for venue access
- Complete audit trail with timestamps
- Camera and manual entry support
- Real-time admin panel updates

### Implementation Status

- QR code generation on pass creation
- QR scanner with camera support
- Manual entry with pass ID validation
- Event-specific check-ins
- Check-in history tracking
- PDF pass with embedded QR code
- Dynamic PDF invoice generation

## Payment Integration

- **Gateway**: Razorpay
- **Current Status**: Direct pass creation (development mode)
- **Supported Methods**: UPI, Cards, Net Banking, Wallets
- **Security**: Payment signature verification, webhook handling

## Database Schema

### Core Tables

- `users` - User accounts and profiles
- `passes` - Pass purchases with QR codes
- `transactions` - Payment records
- `events` - Event listings
- `event_registrations` - User event registrations
- `check_ins` - QR scan records
- `admin_users` - Admin accounts with role-based access

See [BACKEND_ARCHITECTURE.md](./docs/BACKEND_ARCHITECTURE.md#database-schema) for complete schema details.

## Security

- JWT authentication (access + refresh tokens)
- Password hashing (bcrypt)
- Rate limiting (100 requests per 15 minutes per IP)
- CORS configuration
- Input validation (Zod schemas)
- SQL injection prevention (Prisma ORM)
- XSS protection
- Encrypted QR codes

## Features

### User Features

- Browse events and speakers
- Book passes (multiple types)
- Personal dashboard with pass access
- QR code for entry
- Download pass as PDF
- Download payment invoice
- Register for specific events
- View event schedule

### Admin Features

- Real-time dashboard (auto-refresh every 3 seconds)
- Participant management
- QR code scanner (camera + manual entry)
- Multi-event check-in system
- Event ID generator
- Analytics and reporting
- Export participant data (CSV)
- Role-based access control (4 roles)
- Pass type distribution charts
- College-wise statistics
- PDF pass generation
- PDF invoice generation

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Razorpay SDK

### Backend

- Node.js + Express
- TypeScript
- PostgreSQL + Prisma
- Clerk Authentication
- QR Code Generation (qrcode library)
- AES-256-GCM Encryption
- PDFKit (PDF generation)
- JWT tokens
- Zod validation
- Winston logging

## Event Details

- **Name**: E-Summit 2026
- **Venue**: Thakur College of Engineering and Technology, Kandivali East, Mumbai - 400101
- **Dates**: January 23-24, 2026 (2 Days)
- **Expected Attendance**: 5,000+ participants

## Development Status

### Completed

**Frontend**

- Homepage, events listing, speakers showcase
- Team page, venue information
- Pass booking UI, admin panel UI, user dashboard UI

**Backend Foundation**

- Database setup (PostgreSQL + Prisma)
- 10-table schema with relationships
- Authentication system (Clerk integration)
- Request validation (Zod), error handling, logging
- Security middleware (helmet, CORS, rate limiting)

**Core Features**

- Pass booking system
- QR code generation (AES-256-GCM encryption)
- User dashboard with pass display
- Admin panel with role-based access
- Multi-event check-in system (up to 30 events per pass)
- QR Scanner (camera + manual entry)
- Event ID generator
- Real-time admin dashboard (auto-refresh)
- Check-in status tracking
- Pass distribution analytics
- College-wise statistics
- CSV export functionality
- PDF pass and invoice generation

**Advanced Features**

- Event management APIs (CRUD)
- Check-in APIs with cooldown system
- Admin statistics endpoints
- Silent background data refresh

### In Progress

- Razorpay payment integration (production mode)
- Email notifications with QR codes
- Seed 30 events to database
- WebSocket for real-time updates

### Planned

- End-to-end testing
- Performance optimization
- Security audit
- Mobile responsiveness testing
- Admin role management UI
- Audit log viewer
- Deployment (Backend: DigitalOcean/AWS, Frontend: Vercel/Netlify)
- Domain configuration and SSL
- Monitoring and load testing

## Environment Variables

Create `.env` file in backend:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/esummit2026

## Environment Variables

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/esummit2026

# JWT
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_key_here

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# QR Code
QR_SECRET_KEY=generate_using_crypto_64_chars

# AWS S3
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_BUCKET_NAME=esummit-qr-codes

# Email
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@esummit2026.com
```

## Testing

```bash
# Frontend
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests

# Backend
cd backend
npm run test        # Run all tests
npm run test:watch  # Watch mode
```

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

Last Updated: November 2025
