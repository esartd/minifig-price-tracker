# Local Development Setup

This guide shows you how to safely develop features locally without touching production.

## Why Local Development?

**NEVER touch production database during development.** 

After the April 17, 2026 incident where production data was accidentally wiped, we now require:
- ✅ Separate local database for testing
- ✅ Test all features locally first
- ✅ Only push to production after thorough testing

## Setup Steps

### 1. Switch to Local SQLite Database

```bash
# Backup current schema
cp prisma/schema.prisma prisma/schema-production.prisma

# Use local development schema
cp prisma/schema-local.prisma prisma/schema.prisma

# Create local database
npx prisma migrate dev --name init_local

# Open Prisma Studio to view local data
npx prisma studio
```

### 2. Verify .env.local Exists

The `.env.local` file should already be created with:
```
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

This tells Next.js to use the local SQLite database instead of production.

### 3. Start Development Server

```bash
npm run dev
```

Your app now runs on `http://localhost:3000` using the **local database**.

### 4. Add Test Data

Since the local database is empty:

1. Create a test user account
2. Add some test minifigs to your collection
3. Test all features locally

## Switching Between Local and Production

### Work Locally (Development)
```bash
# Use local schema
cp prisma/schema-local.prisma prisma/schema.prisma

# Local database
DATABASE_URL="file:./dev.db"

# Start dev server
npm run dev
```

### Deploy to Production
```bash
# Switch back to production schema
cp prisma/schema-production.prisma prisma/schema.prisma

# Commit and push
git add prisma/schema.prisma
git commit -m "Update schema"
git push origin main
```

## Key Differences

| Feature | Local (SQLite) | Production (PostgreSQL) |
|---------|----------------|-------------------------|
| Database | `dev.db` file | Neon hosted |
| Environment | `development` | `production` |
| Bricklink API | Blocked | Active |
| Risk | Zero | Real users affected |

## Safety Rules

1. ✅ **Always test locally first**
2. ✅ **Never run `npx prisma db push` on production**
3. ✅ **Never use `--accept-data-loss` flag**
4. ✅ **Verify in Prisma Studio before pushing**
5. ✅ **Check git status before committing schema**

## Current Task: Regional Currency

Now that local dev is set up, we can safely implement:
1. User currency preferences (USD, GBP, EUR, CAD, AUD)
2. Regional pricing from Bricklink API
3. Currency detection banner
4. Settings UI for currency selection

All tested locally before touching production!

## Troubleshooting

**"Database is locked" error:**
- Close Prisma Studio
- Restart dev server

**Changes not showing:**
- Check you're using the right schema file
- Run `npx prisma generate` after schema changes

**Want to reset local database:**
```bash
rm prisma/dev.db
npx prisma migrate dev --name reset
```

---

**Never again will we touch production during development.**
