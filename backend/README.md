# E-Summit 2026 Backend API

Backend server for E-Summit 2026 event management platform built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- ✅ **User Authentication** - JWT-based auth with access & refresh tokens
- ✅ **Type Safety** - Full TypeScript support with Prisma ORM
- ✅ **Database** - PostgreSQL with Prisma migrations
- ✅ **Security** - Helmet, CORS, rate limiting, password hashing
- ✅ **Validation** - Request validation with Zod schemas
- ✅ **Logging** - Winston logger with file & console transport
- 🔄 **Payment Integration** - Razorpay (Phase 2)
- 🔄 **QR Code System** - Generation & scanning (Phase 2)
- 🔄 **Email Service** - SendGrid/AWS SES (Phase 2)

## 📋 Prerequisites

Before running the backend, ensure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Server
NODE_ENV=development
PORT=5000

# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/esummit2026"

# JWT Secrets - Generate strong secrets in production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Set up PostgreSQL database

**Option A: Local PostgreSQL**

```bash
# Create database
createdb esummit2026

# Or using psql
psql -U postgres
CREATE DATABASE esummit2026;
\q
```

**Option B: Docker PostgreSQL**

```bash
docker run --name esummit-postgres \
  -e POSTGRES_DB=esummit2026 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

### 4. Run Prisma migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate
```

### 5. (Optional) Seed the database

```bash
npm run prisma:seed
```

## 🎯 Running the Server

### Development mode (with auto-reload)

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check

```
GET /api/v1/health
```

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| GET | `/api/v1/auth/profile` | Get user profile | Yes |
| PUT | `/api/v1/auth/profile` | Update user profile | Yes |
| POST | `/api/v1/auth/logout` | Logout user | Yes |

### Example: Register User

**Request:**
```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "phone": "9876543210",
  "college": "Thakur College of Engineering",
  "yearOfStudy": "3rd Year",
  "rollNumber": "CS123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "fullName": "John Doe",
      "phone": "9876543210",
      "college": "Thakur College of Engineering",
      "yearOfStudy": "3rd Year",
      "rollNumber": "CS123",
      "createdAt": "2026-01-15T10:00:00.000Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": "1h"
  }
}
```

### Example: Login User

**Request:**
```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123"
}
```

### Example: Get Profile (Protected)

**Request:**
```bash
GET http://localhost:5000/api/v1/auth/profile
Authorization: Bearer <your-access-token>
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Prisma client & connection
│   │   └── index.ts      # App config
│   ├── controllers/      # Route controllers
│   │   └── auth.controller.ts
│   ├── services/         # Business logic
│   │   └── auth.service.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   └── index.ts
│   ├── validators/       # Zod schemas
│   │   └── auth.validator.ts
│   ├── utils/            # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── hash.util.ts
│   │   ├── response.util.ts
│   │   └── logger.util.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── logs/                 # Log files
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

Test the API using:

- **Thunder Client** (VS Code extension)
- **Postman**
- **cURL**

### cURL Examples

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'

# Get Profile (replace <TOKEN> with actual token)
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

## 📦 Database Schema

The database includes 10 tables:

1. **users** - User accounts
2. **passes** - Event passes (Gold, Silver, Platinum, Group)
3. **transactions** - Payment records
4. **events** - Competitions, workshops, speakers
5. **event_registrations** - User event registrations
6. **check_ins** - Entry check-ins via QR scan
7. **admin_users** - Admin accounts
8. **audit_logs** - Admin action logs
9. **notifications** - Email/SMS notifications
10. **sponsors** - Sponsor information

View schema: `backend/prisma/schema.prisma`

## 🔐 Security Features

- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Authentication** - Access & refresh tokens
- ✅ **Rate Limiting** - 100 requests per 15 minutes
- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin protection
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Protection** - Prisma ORM

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server with auto-reload

# Build
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production server

# Prisma
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed database with sample data

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Access token secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_EXPIRES_IN` | Access token expiry | 1h |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## 🚧 Roadmap

### Phase 1 (✅ COMPLETED)
- [x] Project setup
- [x] Database schema
- [x] Authentication system
- [x] User management

### Phase 2 (🔄 IN PROGRESS)
- [ ] Pass booking system
- [ ] Razorpay payment integration
- [ ] QR code generation
- [ ] Email notifications

### Phase 3 (📅 PLANNED)
- [ ] Event management
- [ ] Event registration
- [ ] Admin panel APIs
- [ ] Analytics endpoints

### Phase 4 (📅 PLANNED)
- [ ] QR scanning system
- [ ] Check-in tracking
- [ ] Real-time notifications
- [ ] Performance optimization

## 📖 Documentation

- [Backend Architecture](../BACKEND_ARCHITECTURE.md)
- [QR Code System](../QR_CODE_SYSTEM.md)
- [Implementation Guide](../IMPLEMENTATION_GUIDE.md)

## 🤝 Contributing

1. Create a new branch for your feature
2. Make changes and test thoroughly
3. Ensure code passes lint checks
4. Submit pull request

## 📄 License

MIT License - E-Summit 2026

## 🆘 Troubleshooting

### Database connection error

```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

### Prisma migration errors

```bash
# Reset database (CAUTION: Deletes all data)
npm run prisma:migrate:reset

# Generate Prisma Client
npm run prisma:generate
```

### Port already in use

```bash
# Change PORT in .env file
PORT=5001
```

---

**Built with ❤️ for E-Summit 2026**
