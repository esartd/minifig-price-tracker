#!/bin/bash
#
# Runs ON the production VPS. This is the whole deploy.
#
# Why it exists: the old pipeline ran `npm run build` straight over the live
# `.next` directory while the running server was still serving out of it.
# Every JavaScript filename changes between builds, so for the one to two
# minutes the build took, browsers asked for files that had just been deleted
# and got Next's "a client-side exception has occurred" screen.
#
# This builds into a scratch directory and swaps it in at the end, so the
# breakage window shrinks from the whole build to the PM2 restart — a few
# seconds. It also carries the previous build's static assets forward, which
# means tabs opened before the deploy keep working rather than breaking on
# their next click.
#
# Invoked by the restricted deploy SSH key. Keep it idempotent and keep it
# quiet on success; the key's forced command means this output is all the
# operator sees.

set -euo pipefail

APP_DIR="/var/www/figtracker"
BUILD_DIR=".next-build"
LIVE_DIR=".next"
PREVIOUS_DIR=".next-previous"
PM2_APP="figtracker"

cd "$APP_DIR"

# `next build` rewrites tsconfig.json's include array to cover whichever
# distDir it was given. Committing .next-build/types keeps it stable, but if
# a future Next version reorders the list again the working tree goes dirty
# and this pull fails with "local changes would be overwritten". tsconfig is
# never edited on the server, so discarding any local change is safe.
echo "==> Pulling latest code"
git checkout -- tsconfig.json 2>/dev/null || true
git pull

echo "==> Installing dependencies"
npm install --production

echo "==> Applying database migrations"
npx prisma migrate deploy

# postinstall only regenerates the separate schema-hostinger client.
echo "==> Regenerating Prisma client"
npx prisma generate

# Any half-finished build from a previous failed run would be swapped in
# below, so clear it before starting rather than after.
rm -rf "$BUILD_DIR"

# tsconfig.json includes .next/types/**/*.ts, which is correct locally (there
# .next IS the build being typechecked) but wrong here: we build into
# .next-build, so .next/types always belongs to the PREVIOUS build. Delete a
# page and the stale declaration still names it, and the typecheck fails with
# "typeof import('../../../../app/<deleted>/page.js')" — a build that cannot
# succeed until the file is gone. These are typechecker declarations only; the
# running server serves out of .next/server and .next/static and never reads
# them, so removing them mid-flight is safe.
rm -rf "$LIVE_DIR/types"

echo "==> Building into $BUILD_DIR (live site still served from $LIVE_DIR)"
NEXT_DIST_DIR="$BUILD_DIR" npm run build

if [ ! -d "$BUILD_DIR" ]; then
  echo "!! Build produced no $BUILD_DIR — leaving the running site untouched" >&2
  exit 1
fi

# Carry the old chunks forward. A browser still holding the previous page asks
# for its own filenames; keeping them means it keeps working instead of
# hitting the error boundary. -n so the new build always wins on collisions.
if [ -d "$LIVE_DIR/static" ]; then
  echo "==> Carrying previous static assets forward for already-open tabs"
  cp -rn "$LIVE_DIR/static/." "$BUILD_DIR/static/" 2>/dev/null || true
fi

echo "==> Swapping $BUILD_DIR into place"
rm -rf "$PREVIOUS_DIR"
if [ -d "$LIVE_DIR" ]; then
  mv "$LIVE_DIR" "$PREVIOUS_DIR"
fi
mv "$BUILD_DIR" "$LIVE_DIR"

echo "==> Restarting $PM2_APP"
if ! pm2 restart "$PM2_APP" --update-env; then
  echo "!! Restart failed — rolling back to the previous build" >&2
  rm -rf "$LIVE_DIR"
  mv "$PREVIOUS_DIR" "$LIVE_DIR"
  pm2 restart "$PM2_APP" --update-env
  exit 1
fi

# Kept until the next deploy rather than deleted now: if the new build turns
# out to be broken, .next-previous is the fastest way back.
echo "==> Deployment complete"
pm2 status "$PM2_APP"
