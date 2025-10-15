# Quick Start Guide - Backend Setup

Follow these steps to get the backend running:

## Step 1: Create .env file

```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/esummit2026"
```

Replace:
- `postgres` - your PostgreSQL username
- `yourpassword` - your PostgreSQL password
- `localhost:5432` - your PostgreSQL host and port
- `esummit2026` - database name

## Step 2: Create PostgreSQL Database

### Option A: Using psql command line

```bash
psql -U postgres
```

Then in psql:
```sql
CREATE DATABASE esummit2026;
\q
```

### Option B: Using createdb command

```bash
createdb -U postgres esummit2026
```

### Option C: Using Docker

```bash
docker run --name esummit-postgres \
  -e POSTGRES_DB=esummit2026 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

Then update your DATABASE_URL:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/esummit2026"
```

## Step 3: Generate Prisma Client & Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

This will:
- Generate TypeScript types from Prisma schema
- Create all 10 database tables
- Set up indexes and relationships

## Step 4: Start the Development Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running in development mode on port 5000
📍 API: http://localhost:5000/api/v1
💚 Health: http://localhost:5000/api/v1/health
```

## Step 5: Test the API

### Test 1: Health Check

Open browser or use curl:
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "success": true,
  "message": "E-Summit 2026 API is running",
  "timestamp": "2026-01-15T10:00:00.000Z"
}
```

### Test 2: Register User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "fullName": "Test User",
    "phone": "9876543210",
    "college": "Thakur College"
  }'
```

### Test 3: Login User

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Save the `accessToken` from the response!

### Test 4: Get Profile (Protected Route)

```bash
curl http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

Replace `YOUR_ACCESS_TOKEN_HERE` with the token from login.

## 🎉 Success!

If all tests pass, your backend is ready! Phase 1 is complete.

## Next Steps

- Frontend integration with backend APIs
- Phase 2: Payment integration & QR code generation
- Admin panel development

## Troubleshooting

### Database connection fails

1. Check PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Verify DATABASE_URL format:
   ```
   postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
   ```

3. Test connection manually:
   ```bash
   psql "postgresql://postgres:postgres@localhost:5432/esummit2026"
   ```

### Prisma errors

1. Delete and regenerate:
   ```bash
   rm -rf node_modules/.prisma
   npm run prisma:generate
   ```

2. Reset database (CAUTION: Deletes all data):
   ```bash
   npx prisma migrate reset
   ```

### Port 5000 already in use

Change PORT in `.env`:
```env
PORT=5001
```

---

**Need help?** Check `backend/README.md` for detailed documentation.
