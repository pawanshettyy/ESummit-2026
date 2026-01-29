# Backend Architecture Overview

## 🏗️ System Architecture

E-Summit 2026 backend is built with Node.js/Express, PostgreSQL, and Prisma ORM. It handles user authentication via Clerk, pass management with KonfHub integration, and provides RESTful APIs for the frontend application.

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Clerk
- **Payments**: KonfHub integration
- **Validation**: Built-in request validation
- **Logging**: Winston logger

## 📊 Database Schema

### User Model
- **id**: UUID primary key
- **email**: Unique email address
- **phone**: Optional phone number
- **fullName, firstName, lastName**: User name fields
- **is_active**: Account status (default: true)
- **imageUrl**: Profile image URL
- **college, yearOfStudy, rollNumber, branch**: Academic information
- **startup_name, startup_stage, industry**: Startup information
- **company_name, designation, company_size**: Professional information
- **createdAt, updatedAt, lastLogin**: Timestamps
- **bookingId**: Unique booking identifier
- **bookingVerified**: Booking verification status
- **clerkUserId**: Clerk authentication ID
- **passes**: One-to-many relationship with Pass model

### Pass Model
- **id**: UUID primary key
- **userId**: Foreign key to User
- **passType**: Type of pass (e.g., "Student", "Professional")
- **passId**: Unique pass identifier
- **bookingId**: Booking reference
- **konfhubTicketId, konfhubOrderId**: KonfHub integration IDs
- **konfhubData**: JSON data from KonfHub
- **isThakurStudent**: Special flag for Thakur students
- **price**: Pass price
- **purchaseDate**: Purchase timestamp
- **ticketDetails**: JSON ticket information
- **status**: Pass status (default: "Active")
- **hasWorkshopAccess**: Workshop access flag
- **createdAt, updatedAt**: Timestamps

## 🔐 Security Features

- Clerk authentication with secure token management
- Rate limiting (100 req/15min)
- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- CORS protection
- Helmet.js security headers

## 🚀 Key Features

- **User Management**: Integration with Clerk for authentication
- **Pass Management**: Creation and management of event passes
- **Webhook Handling**: KonfHub webhook processing for payments
- **Health Monitoring**: API health check endpoints

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions
│   ├── app.ts           # Express app setup
│   └── index.ts         # Server entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # DB migrations
└── scripts/             # Utility scripts
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - API health status

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile

### Passes
- `GET /passes` - Get user's passes
- `POST /passes` - Create a new pass
- `GET /passes/:id` - Get specific pass details

### Webhooks
- `POST /webhooks/konfhub` - Handle KonfHub payment webhooks

## 📋 Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/esummit2026
JWT_SECRET=your_jwt_secret
KONFHUB_API_KEY=your_api_key
QR_SECRET_KEY=64_char_hex_key
```

## 🚀 Deployment

- **Frontend**: Vercel
- **Backend**: DigitalOcean/AWS
- **Database**: Managed PostgreSQL
- **CDN**: For static assets

---

*For detailed implementation, see the source code.*
