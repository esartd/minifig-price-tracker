import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function main() {
  console.log('🚀 Running Article CMS migration...');

  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Article\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`slug\` VARCHAR(191) NOT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'draft',
        \`featured\` BOOLEAN NOT NULL DEFAULT false,
        \`contentBlocks\` LONGTEXT NOT NULL,
        \`readTimeMinutes\` INT NULL,
        \`category\` VARCHAR(191) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        \`publishedAt\` DATETIME(3) NULL,
        \`translations\` TEXT NOT NULL,

        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`Article_slug_key\`(\`slug\`),
        INDEX \`Article_slug_idx\`(\`slug\`),
        INDEX \`Article_status_idx\`(\`status\`),
        INDEX \`Article_featured_idx\`(\`featured\`),
        INDEX \`Article_publishedAt_idx\`(\`publishedAt\`),
        INDEX \`Article_category_idx\`(\`category\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    console.log('✅ Article table created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
