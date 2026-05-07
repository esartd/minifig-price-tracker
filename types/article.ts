export type ArticleBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'amazon-products'
  | 'callout'
  | 'comparison'
  | 'list'
  | 'divider'
  | 'code'
  | 'video';

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
  images: {
    imageId: string;
    imageUrl: string;
    alt: string;
    caption?: string;
    height?: number; // Height in pixels (crops from center)
    objectPosition?: string; // CSS object-position (e.g., 'center', 'top', '50% 30%')
  }[];
  columns: 1 | 2 | 3; // Number of columns (1 = single image)
}

export interface AmazonProductsBlock extends BaseBlock {
  type: 'amazon-products';
  products: {
    asin: string;
    title: string;
    imageUrl: string;
    price?: string;
  }[];
  columns: 1 | 2 | 3; // Number of columns
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
  icon?: string; // Heroicon component name (e.g., 'RocketLaunchIcon')
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

export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  code: string;
  caption?: string;
  showLineNumbers?: boolean;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  platform: 'youtube' | 'vimeo' | 'other';
  videoUrl: string;
  videoId: string;
  caption?: string;
}

export type ArticleBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | AmazonProductsBlock
  | CalloutBlock
  | ComparisonBlock
  | ListBlock
  | DividerBlock
  | CodeBlock
  | VideoBlock;

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
