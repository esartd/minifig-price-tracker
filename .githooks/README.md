# Git Hooks

This directory contains git hooks that enforce safe development practices.

## Installation

Run this once after cloning the repository:

```bash
./.githooks/install.sh
```

## Hooks

### pre-commit

**Prevents Prisma schema changes on main branch**

This hook blocks commits that modify any Prisma schema file (`prisma/schema*.prisma`) when you're on the `main` or `master` branch.

**Why?** Schema changes must be tested on feature branches with local databases before merging to main. Committing schema changes directly to main can break production instantly if the database hasn't been migrated yet.

**Example error:**

```
❌ ERROR: Cannot commit Prisma schema changes directly to main branch!

📋 Database schema changes must be done on a feature branch to prevent breaking production.

To fix this:
  1. Create a feature branch:
     git checkout -b feature/your-feature-name

  2. Commit your changes there:
     git add prisma/schema.prisma
     git commit -m 'Add schema changes'

  3. Test locally with migrations before merging to main
```

## Bypassing Hooks (DON'T DO THIS)

You can bypass hooks with `git commit --no-verify`, but **please don't**. These hooks exist because we've had production incidents from not following this workflow.

If you think a hook is wrong, update the hook instead of bypassing it.

## Adding New Hooks

1. Add the hook file to `.githooks/`
2. Make it executable: `chmod +x .githooks/your-hook`
3. Run `.githooks/install.sh` to install it
4. Commit the hook file to the repository
5. Update this README
