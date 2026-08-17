const { PrismaClient } = require('@prisma/client-hostinger');

let prisma;

// Initialize Prisma only once (singleton pattern for Next.js)
function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

module.exports = class PrismaCacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    try {
      const prisma = getPrismaClient();
      const cached = await prisma.isrCache.findUnique({
        where: { key },
      });

      if (!cached) {
        return null;
      }

      // Check if expired
      if (cached.expires_at && cached.expires_at < new Date()) {
        // Delete expired entry
        await prisma.isrCache.delete({ where: { key } });
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
      const { revalidate } = ctx;
      const expiresAt = revalidate
        ? new Date(Date.now() + revalidate * 1000)
        : null;

      await prisma.isrCache.upsert({
        where: { key },
        update: {
          value: JSON.stringify(data),
          last_modified: new Date(),
          expires_at: expiresAt,
          tags: ctx.tags || [],
        },
        create: {
          key,
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
