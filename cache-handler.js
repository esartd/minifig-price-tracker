const { PrismaClient } = require('@prisma/client-hostinger');

const prisma = new PrismaClient();

module.exports = class PrismaCacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    try {
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
        value: JSON.parse(cached.value),
      };
    } catch (error) {
      console.error('Cache GET error:', error);
      return null;
    }
  }

  async set(key, data, ctx) {
    try {
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
