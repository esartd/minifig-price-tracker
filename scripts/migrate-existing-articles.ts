import { PrismaClient } from '@prisma/client-hostinger';
import translationsEn from '../translations-backup/en.json';
import translationsDe from '../translations-backup/de.json';
import translationsFr from '../translations-backup/fr.json';
import translationsEs from '../translations-backup/es.json';
import { ArticleBlock } from '../types/article';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

function parseMarkdownToBlocks(content: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  const lines = content.split('\n');
  let currentParagraph: string[] = [];
  let blockId = 1;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('\n').trim();
      if (text) {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'paragraph',
          text,
        });
      }
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines between blocks
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Heading (##, ###)
    if (trimmed.startsWith('###')) {
      flushParagraph();
      blocks.push({
        id: `block-${blockId++}`,
        type: 'heading',
        level: 3,
        text: trimmed.replace(/^###\s*/, ''),
      });
      continue;
    }

    if (trimmed.startsWith('##')) {
      flushParagraph();
      blocks.push({
        id: `block-${blockId++}`,
        type: 'heading',
        level: 2,
        text: trimmed.replace(/^##\s*/, ''),
      });
      continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      flushParagraph();
      blocks.push({
        id: `block-${blockId++}`,
        type: 'divider',
      });
      continue;
    }

    // Unordered list items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      const items: string[] = [trimmed.replace(/^[-*]\s*/, '')];

      // Collect consecutive list items
      let i = lines.indexOf(line) + 1;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (nextLine.startsWith('- ') || nextLine.startsWith('* ')) {
          items.push(nextLine.replace(/^[-*]\s*/, ''));
          i++;
        } else {
          break;
        }
      }

      blocks.push({
        id: `block-${blockId++}`,
        type: 'list',
        ordered: false,
        items,
      });

      // Skip the processed lines
      lines.splice(lines.indexOf(line), i - lines.indexOf(line));
      continue;
    }

    // Bold lines that could be callouts
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 100) {
      flushParagraph();
      blocks.push({
        id: `block-${blockId++}`,
        type: 'callout',
        calloutType: 'tip',
        content: trimmed,
      });
      continue;
    }

    // Regular paragraph line
    currentParagraph.push(line);
  }

  // Flush any remaining paragraph
  flushParagraph();

  return blocks;
}

async function main() {
  console.log('🚀 Migrating existing articles to database...\n');

  const articlesData = [
    {
      slug: 'most-valuable-lego-minifigures-2026',
      en: translationsEn.guideArticles['most-valuable-lego-minifigures-2026'],
      de: translationsDe.guideArticles['most-valuable-lego-minifigures-2026'],
      fr: translationsFr.guideArticles['most-valuable-lego-minifigures-2026'],
      es: translationsEs.guideArticles['most-valuable-lego-minifigures-2026'],
    },
    {
      slug: 'figtracker-vs-bricklink',
      en: translationsEn.guideArticles['figtracker-vs-bricklink'],
      de: translationsDe.guideArticles['figtracker-vs-bricklink'],
      fr: translationsFr.guideArticles['figtracker-vs-bricklink'],
      es: translationsEs.guideArticles['figtracker-vs-bricklink'],
    },
  ];

  for (const articleData of articlesData) {
    console.log(`📝 Processing: ${articleData.slug}`);

    // Parse English content to blocks
    const contentBlocks = parseMarkdownToBlocks(articleData.en.content);
    console.log(`   ✓ Parsed ${contentBlocks.length} blocks`);

    // Create translations array
    const translations = [
      {
        locale: 'en',
        title: articleData.en.title,
        description: articleData.en.description,
      },
      {
        locale: 'de',
        title: articleData.de.title,
        description: articleData.de.description,
      },
      {
        locale: 'fr',
        title: articleData.fr.title,
        description: articleData.fr.description,
      },
      {
        locale: 'es',
        title: articleData.es.title,
        description: articleData.es.description,
      },
    ];

    // Check if article already exists
    const existing = await prisma.article.findUnique({
      where: { slug: articleData.slug }
    });

    if (existing) {
      console.log(`   ⚠️  Article already exists, updating...`);
      await prisma.article.update({
        where: { slug: articleData.slug },
        data: {
          contentBlocks: JSON.stringify(contentBlocks),
          translations: JSON.stringify(translations),
          status: 'published',
          featured: true,
          category: 'Guide',
          readTimeMinutes: parseInt(articleData.en.readTime.match(/\d+/)?.[0] || '10'),
          publishedAt: new Date('2026-04-24'),
        }
      });
    } else {
      console.log(`   ✓ Creating new article...`);
      await prisma.article.create({
        data: {
          slug: articleData.slug,
          contentBlocks: JSON.stringify(contentBlocks),
          translations: JSON.stringify(translations),
          status: 'published',
          featured: true,
          category: 'Guide',
          readTimeMinutes: parseInt(articleData.en.readTime.match(/\d+/)?.[0] || '10'),
          publishedAt: new Date('2026-04-24'),
        }
      });
    }

    console.log(`   ✅ ${articleData.slug} migrated!\n`);
  }

  console.log('✨ Migration complete!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
