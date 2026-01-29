# E-Summit 2026 - The Beginning of Legacy

A full-stack event management platform for E-Summit 2026, TCET Mumbai's first-ever Entrepreneurship Summit. Built to handle pass booking, QR-based check-in, and event management for a two-day summit uniting visionaries, investors, and students.

## 🎯 Project Overview

E-Summit 2026 is TCET's inaugural Entrepreneurship Summit, organized by Axios EDIC. Inspired by IIT Bombay's E-Summit, it aims to foster innovation, connect academia with industry, and create funding opportunities for startups.

**Event Details:**
- **Dates:** February 2-3, 2026 (Coming Soon!)
- **Venue:** Thakur College of Engineering and Technology, Mumbai
- **Expected Attendance:** 5,000+ participants
- **Theme:** "The Beginning of Legacy" - Fostering innovation and entrepreneurship

## ✨ Key Features

- **🔐 Secure Authentication:** Clerk-based authentication with role management
- **💳 Payment Integration:** KonfHub payment gateway with webhook verification
- **🎫 Pass Management:** Multiple pass types (Pixel, Silicon, Quantum, TCET Student)
- **📱 Responsive Design:** Mobile-first design with modern UI components
- **⚡ Performance:** Optimized with Vite, lazy loading, and code splitting
- **📊 Analytics:** Vercel Analytics and Speed Insights integration
- **🛡️ Security:** Rate limiting, CORS, Helmet.js, input validation
- **🗄️ Database:** PostgreSQL with Prisma ORM and connection pooling
- **🚀 Serverless:** Vercel serverless functions for backend API

## 🛠 Tech Stack

**Frontend:** React 18.3.1, TypeScript 5.9.3, Vite 6.3.6, Tailwind CSS, Shadcn UI, Framer Motion 11.11.17  
**Backend:** Node.js 18+, Express 4.21.2, TypeScript 5.7.2, PostgreSQL, Prisma ORM 6.19.0  
**Authentication:** Clerk (@clerk/clerk-react 5.58.0, @clerk/backend 2.25.1)  
**Payments:** KonfHub API Integration  
**Deployment:** Vercel (Frontend & Backend)  
**Monitoring:** Vercel Analytics 1.6.1, Vercel Speed Insights 1.1.0  
**UI Libraries:** Radix UI, Lucide React 0.487.0, Recharts 2.15.2, Sonner 2.0.3

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/esummit-2026.git
   cd esummit-2026
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   npm run dev
   ```
   Access at: `http://localhost:5173`

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```
## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Scripts
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript and generate Prisma client
npm run start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prepare-production # Prepare application for production deployment
```

## 📁 Project Structure

```
ESummit-2026/
├── src/                    # Frontend (React + Vite)
│   ├── components/         # UI Components
│   │   ├── accentricity/   # Custom UI components & animations
│   │   ├── events/         # Event-specific components
│   │   ├── figma/          # Figma-generated components
│   │   ├── magicui/        # Animation components
│   │   └── ui/             # Shadcn UI components
│   ├── lib/                # Utilities and API client
│   ├── styles/             # Global styles & Tailwind config
│   └── utils/              # Helper functions
├── backend/                # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── middleware/     # Express middleware (auth, rate limiting, CORS)
│   │   ├── routes/         # API routes (users, passes, webhooks)
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions (crypto, JWT, logger)
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database schema and migrations
│   ├── scripts/            # Utility scripts (prepare-production.ts)
│   └── api/                # Vercel serverless functions
├── docs/                   # Documentation
├── public/                 # Static assets (manifest, sitemap, etc.)
├── assets/                 # Build assets and media
├── dist/                   # Build output
└── package.json            # Frontend dependencies & scripts
```

## 🔧 Backend Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database (Supabase PostgreSQL)
# Connection pooling for Prisma Client (Port 6543)
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for migrations (Port 5432)
DIRECT_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# JWT Secrets (Optional - for legacy support)
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_min_32_characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
# ALLOWED_ORIGINS=https://www.tcetesummit.in,https://tcetesummit.in

# KonfHub Integration (Payment Processing & Attendee Data)
KONFHUB_API_KEY=your_konfhub_api_key
KONFHUB_API_URL=https://api.konfhub.com
KONFHUB_WEBHOOK_SECRET=your_konfhub_webhook_secret
KONFHUB_EVENT_ID=your_event_id

# KonfHub Pass/Button IDs (from your KonfHub dashboard)
KONFHUB_PIXEL_PASS_ID=your_pixel_pass_button_id
KONFHUB_SILICON_PASS_ID=your_silicon_pass_button_id
KONFHUB_QUANTUM_PASS_ID=your_quantum_pass_button_id
KONFHUB_TCET_STUDENT_PASS_ID=your_tcet_student_pass_button_id

# KonfHub Auto-Sync (Optional - defaults to true)
# KONFHUB_AUTO_SYNC=false
```

### Database Setup

The project uses **Supabase PostgreSQL** with connection pooling for optimal performance.

**Option 1: Supabase (Recommended)**
1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection details for both pooled and direct connections
5. Update your `.env` file with the Supabase URLs

**Option 2: Local PostgreSQL**
```bash
createdb esummit2026
```

**Option 3: Docker**
```bash
docker run --name esummit-postgres \
  -e POSTGRES_DB=esummit2026 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

## 🗄️ Database Schema

### Core Tables

**Users Table:**
- User profiles with Clerk authentication
- Academic and professional information
- Booking and verification status

**Passes Table:**
- Event pass purchases and management
- KonfHub integration data
- Payment and ticket information
- Workshop access control

### Key Relationships
- Each User can have multiple Passes
- Passes are linked to KonfHub payment data
- Real-time synchronization via webhooks

### API Endpoints

The backend provides RESTful APIs for:

#### Health & Status
- `GET /health` - API health check and status

#### User Management
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile information

#### Pass Management
- `GET /passes` - Get user's purchased passes
- `POST /passes` - Create a new pass (payment processing)
- `GET /passes/:id` - Get specific pass details

#### Webhooks
- `POST /webhooks/konfhub` - Handle KonfHub payment webhooks for pass verification

#### Authentication
- Handled by Clerk (frontend integration)
- Webhook endpoint for Clerk user synchronization

## � Deployment

### Frontend Deployment (Vercel)
The frontend is configured for automatic deployment on Vercel:
- Connect your GitHub repository to Vercel
- Set root directory to `/` (project root)
- Build command: `npm run build`
- Output directory: `dist`

### Backend Deployment (Vercel)
The backend is configured for serverless deployment on Vercel:
- Connect your GitHub repository to Vercel
- Set root directory to `backend`
- Build command: `npm run vercel-build`
- Add all environment variables from `.env` to Vercel project settings

### Environment Variables for Production
Update the following for production:
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
DATABASE_URL=your_production_supabase_connection_string
```

### Database Migration for Production
```bash
# Run migrations on production database
npm run prisma:migrate
```

## 📚 Documentation

- [Backend Setup](./docs/BACKEND_SETUP.md)
- [Backend Architecture](./docs/BACKEND_ARCHITECTURE.md)

## 🤝 Development Workflow

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or Supabase)
- Git

### Local Development Setup
1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd esummit-2026
   npm install
   cd backend && npm install
   ```

2. **Environment setup:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env with your database and API keys
   ```

3. **Database setup:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   cd backend && npm run dev
   ```

### Code Quality
- **Linting:** ESLint configuration in backend
- **Formatting:** Prettier for consistent code style
- **TypeScript:** Strict type checking enabled
- **Testing:** Jest setup for unit tests

## 🤝 Contributing

This project is developed by the Axios EDIC team at TCET. For contributions or issues, please contact the development team.

## 📄 License

Proprietary software. All rights reserved.

---

**Built with ❤️ for E-Summit 2026**
