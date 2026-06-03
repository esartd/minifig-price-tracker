# Schema Protection System

This project has **automatic safeguards** to prevent accidentally deploying the wrong database schema to production.

## ⚡ Quick Command

**To deploy your changes:**
```bash
npm run deploy "Your commit message"
```

That's it! One command does everything safely.

## 🛡️ Protection Layers

### 1. **Build-Time Validation**
Every time you build for production, the schema is automatically validated.

```bash
npm run build
```

**What it checks:**
- ✅ PostgreSQL provider (not SQLite)
- ✅ @db.Text on description fields
- ❌ Fails build if wrong provider

**Where it runs:**
- Locally when you run `npm run build`
- **Automatically on Vercel** during deployment

### 2. **Git Pre-Push Hook**
Before pushing to `main` or `master`, git automatically validates the schema.

```bash
git push origin main
```

**What happens:**
- Checks schema provider
- Blocks push if SQLite is detected
- Shows fix instructions

### 3. **Manual Validation**
You can manually check your schema anytime:

```bash
npm run validate-schema
```

## 📋 Local Development Workflow

### Using SQLite Locally (Recommended)

**Setup:**
```bash
# 1. Switch to SQLite for local testing
# Edit prisma/schema.prisma:
#   - Change provider to "sqlite"
#   - Remove @db.Text from description field

# 2. Push schema to local database
npx prisma db push

# 3. Start dev server
npm run dev
```

**When Ready to Deploy:**
```bash
# Simple one-command deploy
npm run deploy "Your commit message"

# That's it! It automatically:
# - Restores production schema
# - Stages all changes
# - Commits with your message
# - Pushes to main (with validation)
```

### Using PostgreSQL Locally

If you have local PostgreSQL, keep the production schema and set your local DATABASE_URL to your PostgreSQL instance.

## 🚨 What If I Forget?

**Don't worry!** The protection system has your back:

1. **If you try to build:** ❌ Build fails with clear error message
2. **If you try to push:** ❌ Git blocks the push and shows fix instructions
3. **If somehow it reaches Vercel:** ❌ Vercel build fails (won't deploy)

## 🔧 Fixing a Blocked Push

If git blocks your push, just use the deploy command:

```bash
npm run deploy "Your commit message"
```

Or manually:
```bash
# 1. Restore the production schema
git restore prisma/schema.prisma

# 2. Verify it's correct
cat prisma/schema.prisma | grep 'provider'
# Should show: provider = "postgresql"

# 3. Try pushing again
git push origin main
```

## 📝 Files Involved

- `scripts/validate-schema.js` - Validation logic
- `.git/hooks/pre-push` - Git hook (auto-runs on push)
- `package.json` - Build script includes validation
- `prisma/schema.prisma` - Database schema

## ⚠️ Important Notes

- The `.git/hooks/pre-push` file is **local only** (not in git)
- If you clone the repo fresh, you'll need to recreate the hook
- The build validation works automatically (runs on Vercel)

## 🎯 TL;DR

**You can safely:**
- Switch to SQLite locally for testing
- Forget to switch back

**The system will:**
- ✅ Stop you from pushing wrong schema
- ✅ Stop builds with wrong schema
- ✅ Show clear fix instructions

**Production will never:**
- ❌ Get SQLite schema
- ❌ Deploy with wrong config
- ❌ Break unexpectedly
