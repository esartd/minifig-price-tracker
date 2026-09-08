const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client-hostinger');

let prisma;

// Initialize Prisma only once (singleton pattern for Next.js)
function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Entries are namespaced by build ID so a deploy invalidates them for free.
//
// Why: this cache lives in MySQL, so it outlives the .next directory it was
// built from. On 2026-09-08 that meant a correct, freshly deployed build kept
// serving the PREVIOUS build's /robots.txt, /icon.svg and /favicon.ico -- the
// files on disk were right, the bytes on the wire were months old, and no
// number of PM2 restarts helped because nothing on the server was stale. Only
// a manual DELETE fixed it, twice.
//
// Prefixing the key means old-build rows simply stop matching. No schema
// change, no deploy-script step to forget, and nothing to remember by hand.
const BUILD_ID = (() => {
  try {
    return fs
      .readFileSync(path.join(process.cwd(), '.next', 'BUILD_ID'), 'utf8')
      .trim();
  } catch {
    // A missing BUILD_ID means we cannot tell builds apart. Treat every
    // process start as its own generation rather than risk serving another
    // build's bytes -- a cold cache is cheap, a wrong favicon is not.
    return `nobuildid-${process.pid}-${Date.now()}`;
  }
})();

// Next.js omits `revalidate` for fully static routes. The old code stored
// those with expires_at = null, which this handler's own get() treats as
// "never expires" -- the second half of the bug above.
const DEFAULT_TTL_SECONDS = 60 * 60;

let pruned = false;

/** Drop rows left behind by previous builds. Runs once per process. */
async function pruneOldBuilds(client) {
  if (pruned) return;
  pruned = true;
  try {
    const { count } = await client.isrCache.deleteMany({
      where: { key: { not: { startsWith: `${BUILD_ID}:` } } },
    });
    if (count > 0) {
      console.log(`[cache] pruned ${count} entries from previous builds`);
    }
  } catch (error) {
    // Pruning is housekeeping; a failure here must not take the cache down.
    console.error('Cache PRUNE error:', error);
  }
}

module.exports = class PrismaCacheHandler {
  constructor(options) {
    this.options = options;
  }

  scoped(key) {
    return `${BUILD_ID}:${key}`;
  }

  async get(key) {
    try {
      const prisma = getPrismaClient();
      pruneOldBuilds(prisma);

      const scopedKey = this.scoped(key);
      const cached = await prisma.isrCache.findUnique({
        where: { key: scopedKey },
      });

      if (!cached) {
        return null;
      }

      // Check if expired
      if (cached.expires_at && cached.expires_at < new Date()) {
        // Delete expired entry
        await prisma.isrCache.delete({ where: { key: scopedKey } });
        return null;
      }

      return {
        lastModified: cached.last_modified.getTime(),
        // Revive serialized Buffers (JSON.stringify turns a Buffer into
        // {type: 'Buffer', data: [...]}) back into real Buffer instances.
        // Without this, binary route bodies (e.g. favicon.ico, icon.svg)
        // come back as plain objects and get coerced to the string
        // "[object Object]" when Next.js writes the response.
        value: JSON.parse(cached.value, (key, value) => {
          if (
            value &&
            typeof value === 'object' &&
            value.type === 'Buffer' &&
            Array.isArray(value.data)
          ) {
            return Buffer.from(value.data);
          }
          return value;
        }),
      };
    } catch (error) {
      console.error('Cache GET error:', error);
      return null;
    }
  }

  async set(key, data, ctx) {
    try {
      const prisma = getPrismaClient();
      const scopedKey = this.scoped(key);
      const ttlSeconds =
        typeof ctx?.revalidate === 'number' && ctx.revalidate > 0
          ? ctx.revalidate
          : DEFAULT_TTL_SECONDS;
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

      await prisma.isrCache.upsert({
        where: { key: scopedKey },
        update: {
          value: JSON.stringify(data),
          last_modified: new Date(),
          expires_at: expiresAt,
          tags: ctx.tags || [],
        },
        create: {
          key: scopedKey,
          value: JSON.stringify(data),
          last_modified: new Date(),
          expires_at: expiresAt,
          tags: ctx.tags || [],
        },
      });
    } catch (error) {
      console.error('Cache SET error:', error);
    }
  }

  async revalidateTag(tag) {
    try {
      const prisma = getPrismaClient();
      // Delete all entries with this tag
      await prisma.isrCache.deleteMany({
        where: {
          tags: {
            has: tag,
          },
        },
      });
    } catch (error) {
      console.error('Cache REVALIDATE TAG error:', error);
    }
  }
};
