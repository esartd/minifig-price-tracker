# Database Setup Guide

Your minifig price tracker has been migrated from JSON files to PostgreSQL with Prisma! 🎉

## What Changed

- ✅ **`lib/database.ts`** - Now uses Prisma instead of file I/O
- ✅ **Prisma schema** created at `prisma/schema.prisma`
- ✅ **Prisma client** generated and ready to use
- ✅ **All API routes** work exactly the same (no changes needed!)
- ✅ **All components** work exactly the same (no changes needed!)

## Local Development Setup

### Option 1: Use Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Copy the connection string from Vercel
4. Create a `.env` file in the project root:
   ```env
   DATABASE_URL="your-postgres-url-from-vercel"
   ```

### Option 2: Use Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/minifig_tracker?schema=public"
```

Replace `username` and `password` with your PostgreSQL credentials.

### Option 3: Use Docker (Quick Setup)

```bash
# Start a PostgreSQL container
docker run --name minifig-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Add to .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
```

## Initialize the Database

After setting up your `DATABASE_URL`, run:

```bash
# Push the schema to your database
npm run db:push

# This creates the CollectionItem table
```

## Migrate Existing Data (Optional)

If you have existing data in `data/collection.json`, you can migrate it:

1. The migration will happen automatically on first use, OR
2. Keep the JSON file as a backup - the new system starts fresh

## Verify Everything Works

```bash
# Start the dev server
npm run dev

# Test in browser at http://localhost:3000
# Try adding a minifig, editing, deleting
```

## Useful Commands

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Generate Prisma client (after schema changes)
npm run db:generate

# Create a migration
npm run db:migrate

# Push schema without migration
npm run db:push
```

## Production Deployment on Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Migrate to Postgres database"
   git push
   ```

2. **Create Vercel Postgres Database:**
   - In Vercel dashboard → Storage → Create Database → Postgres
   - Vercel automatically adds `DATABASE_URL` to your project

3. **Deploy:**
   - Vercel will auto-deploy on push
   - The build process includes `prisma generate`
   - Your database is ready to use!

4. **Initialize Production Database:**
   ```bash
   # After first deploy, push the schema
   npx prisma db push --accept-data-loss
   ```

## Environment Variables

Your `.env` file should contain:

```env
DATABASE_URL="postgresql://..."

# Your existing Bricklink credentials (unchanged)
BRICKLINK_CONSUMER_KEY="..."
BRICKLINK_CONSUMER_SECRET="..."
BRICKLINK_TOKEN_VALUE="..."
BRICKLINK_TOKEN_SECRET="..."
```

## Troubleshooting

**Error: "Can't reach database server"**
- Check your `DATABASE_URL` is correct
- Make sure PostgreSQL is running (if local)
- Verify network access to database

**Error: "Table does not exist"**
- Run `npm run db:push` to create tables

**TypeScript errors about Prisma Client**
- Run `npm run db:generate` to regenerate types

## What's Next?

Your app is now production-ready! You can:

1. Deploy to Vercel with confidence
2. Scale to multiple users
3. Add user authentication (future enhancement)
4. Never worry about data loss again

## Files Modified

- `lib/database.ts` - Prisma implementation
- `package.json` - Added Prisma scripts
- `prisma/schema.prisma` - Database schema
- `lib/prisma.ts` - Prisma client singleton

## Files You Can Delete (Optional)

After verifying everything works:
- `data/collection.json` (keep as backup for now)
- You can remove the `uuid` package from dependencies (Prisma handles UUIDs)

---

**Need help?** Check the Prisma docs: https://www.prisma.io/docs
