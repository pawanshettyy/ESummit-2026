# Supabase Database Setup Guide

Your E-Summit 2026 backend is now configured to use Supabase PostgreSQL database! 🎉

## ⚙️ Configuration Complete

✅ `.env` file updated with Supabase connection strings  
✅ `prisma/schema.prisma` updated to support connection pooling

## 🔑 Next Steps

### 1. Add Your Database Password

Open `.env` and replace `[YOUR-PASSWORD]` with your actual Supabase database password:

```env
# Replace [YOUR-PASSWORD] with your actual password from Supabase Dashboard
DATABASE_URL="postgresql://postgres.bhfwyseibrirhponhecl:YOUR_ACTUAL_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.bhfwyseibrirhponhecl:YOUR_ACTUAL_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

**Where to find your password:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Under **Connection string**, click **Connection pooling**
5. Copy the password or reset it if needed

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

### 3. Run Database Migrations

This will create all 10 tables in your Supabase database:

```bash
npm run prisma:migrate dev --name init
```

When prompted for migration name, just press Enter (it will use "init").

### 4. Verify Database Connection

Start the development server:

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running in development mode on port 3000
📍 API: http://localhost:3000/api/v1
💚 Health: http://localhost:3000/api/v1/health
```

### 5. Test the API

```bash
curl http://localhost:3000/api/v1/health
```

## 📊 What's Different with Supabase?

### Connection Pooling
- **DATABASE_URL** (Port 6543): Used by Prisma Client for all queries
- Uses PgBouncer for connection pooling
- Efficient for serverless environments
- Handles multiple concurrent connections

### Direct Connection
- **DIRECT_URL** (Port 5432): Used only for migrations
- Direct connection to PostgreSQL
- Required for schema changes
- Not used during runtime

### Benefits
✅ Better performance with connection pooling  
✅ Handles more concurrent connections  
✅ Ideal for serverless deployments  
✅ Auto-scaling database  
✅ Built-in database UI (Supabase Table Editor)  

## 🗄️ View Your Data

After migrations, you can view your database tables in Supabase:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Table Editor** in the sidebar
4. You'll see all 10 tables:
   - users
   - passes
   - transactions
   - events
   - event_registrations
   - check_ins
   - admin_users
   - audit_logs
   - notifications (if created)
   - sponsors

## 🛠️ Useful Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate dev

# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Reset database (CAUTION: Deletes all data)
npm run prisma:migrate reset
```

## 🔒 Security Notes

⚠️ **Never commit your `.env` file to Git!**  
✅ The `.env` file is already in `.gitignore`  
✅ Share credentials securely with team members  
✅ Use different credentials for production  

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Check if `[YOUR-PASSWORD]` is replaced with actual password
- Verify your internet connection
- Check Supabase project is not paused

### Error: "Connection pool timeout"
- Supabase free tier has connection limits
- Upgrade plan if needed
- Check for open connections

### Error: "Migration failed"
- Make sure you're using `DIRECT_URL` for migrations
- Check database permissions
- Try resetting with `npm run prisma:migrate reset`

## 📈 Supabase Dashboard Features

Explore these in your Supabase dashboard:

- **Table Editor**: View/edit data directly
- **SQL Editor**: Run custom queries
- **Database**: Connection strings, extensions
- **Authentication**: Built-in auth (can integrate later)
- **Storage**: File storage (for QR codes in Phase 2)
- **Logs**: Database logs and queries

## 🚀 Ready to Go!

Once you've:
1. ✅ Added your password to `.env`
2. ✅ Run `npm run prisma:generate`
3. ✅ Run `npm run prisma:migrate dev`
4. ✅ Start server with `npm run dev`

You're ready to start testing the authentication APIs!

---

**Next:** See `API_TESTING.md` for testing the authentication endpoints.
