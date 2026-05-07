import { ArticleBlock } from '@/types/article';

/**
 * Calculate reading time based on content blocks
 * Average reading speed: 225 words per minute
 */
export function calculateReadTime(blocks: ArticleBlock[]): number {
  let wordCount = 0;

  blocks.forEach(block => {
    switch (block.type) {
      case 'heading':
        wordCount += block.text.split(/\s+/).length;
        break;
      case 'paragraph':
        wordCount += block.text.split(/\s+/).length;
        break;
      case 'list':
        block.items.forEach(item => {
          wordCount += item.split(/\s+/).length;
        });
        break;
      case 'callout':
        wordCount += block.content.split(/\s+/).length;
        break;
      case 'comparison':
        block.items.forEach(item => {
          wordCount += item.title.split(/\s+/).length;
          item.pros.forEach(pro => wordCount += pro.split(/\s+/).length);
          item.cons.forEach(con => wordCount += con.split(/\s+/).length);
        });
        break;
      // Images and dividers don't add to word count
    }
  });

  // Calculate minutes, minimum 1 minute
  const minutes = Math.max(1, Math.ceil(wordCount / 225));
  return minutes;
}

/**
 * Extract table of contents from heading blocks
 */
export interface TOCItem {
  id: string;
  level: number;
  text: string;
}

export function generateTableOfContents(blocks: ArticleBlock[]): TOCItem[] {
  return blocks
    .filter(block => block.type === 'heading' && (block.level === 2 || block.level === 3))
    .map(block => ({
      id: block.id,
      level: (block as any).level,
      text: (block as any).text,
    }));
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
