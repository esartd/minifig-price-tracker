# Fix: Can't Sign Up - Database Not Running

## The Issue
Your database server isn't running at `localhost:51217`, which is why sign-up fails.

## Quick Fix Options

### Option 1: Use Vercel Postgres (Recommended - Free & Easy)

1. **Sign up for Vercel** (free): https://vercel.com/signup

2. **Create a Postgres database**:
   - Go to https://vercel.com/dashboard
   - Click "Storage" tab
   - Click "Create Database"
   - Choose "Postgres"
   - Select free plan
   - Click "Create"

3. **Copy the connection string**:
   - In your new database, go to ".env.local" tab
   - Copy the `POSTGRES_URL` value

4. **Update your `.env.local`**:
   ```env
   DATABASE_URL="paste-the-postgres-url-here"
   ```

5. **Run the migration**:
   ```bash
   npm run db:migrate
   ```

6. **Done!** Sign up should work now.

---

### Option 2: Use Local Postgres with Docker

If you have Docker installed:

```bash
# Start Postgres in Docker
docker run --name minifig-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

# Update .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Run migration
npm run db:migrate
```

---

### Option 3: Use SQLite (Simplest - No Setup)

**Easiest option** - just use a local file:

1. **Update your `.env.local`**:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. **Update `prisma/schema.prisma`** - change line 9 from:
   ```prisma
   provider = "postgresql"
   ```
   to:
   ```prisma
   provider = "sqlite"
   ```

3. **Run migration**:
   ```bash
   npm run db:migrate
   ```

4. **Restart dev server**:
   ```bash
   npm run dev
   ```

---

## Which Option Should You Choose?

- **For testing locally**: Use SQLite (Option 3) - zero setup
- **For production**: Use Vercel Postgres (Option 1) - free & scalable
- **For local development**: Use Docker Postgres (Option 2) - if you have Docker

## After Setting Up

Once your database is running, you can:

1. ✅ **Sign up** at http://localhost:3000/auth/signup
2. ✅ **Start adding minifigs** to your collection
3. ✅ **Restore old data** with `npm run restore-collection` (if you had data before)

## Current Error in Logs

```
Can't reach database server at `localhost:51217`
```

This means your old database config is pointing to a server that's not running. Follow one of the options above to fix it!
