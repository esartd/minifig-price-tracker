export type ArticleBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'callout'
  | 'comparison'
  | 'list'
  | 'divider';

export interface BaseBlock {
  id: string;
  type: ArticleBlockType;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  imageId: string;
  imageUrl: string;
  alt: string;
  caption?: string;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  calloutType: 'info' | 'tip' | 'warning';
  content: string;
}

export interface ComparisonItem {
  title: string;
  pros: string[];
  cons: string[];
  icon?: string;
}

export interface ComparisonBlock extends BaseBlock {
  type: 'comparison';
  items: ComparisonItem[];
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  ordered: boolean;
  items: string[];
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export type ArticleBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | CalloutBlock
  | ComparisonBlock
  | ListBlock
  | DividerBlock;

export interface ArticleData {
  id?: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  contentBlocks: ArticleBlock[];
  readTimeMinutes?: number;
  category?: string;
  translations: {
    locale: string;
    title: string;
    description: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  }[];
}
