'use client';

import { ArticleBlock } from '@/types/article';
import { marked } from 'marked';

interface ArticleRendererProps {
  blocks: ArticleBlock[];
}

export function ArticleRenderer({ blocks }: ArticleRendererProps) {
  const renderBlock = (block: ArticleBlock) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level}` as 'h1' | 'h2' | 'h3';
        return (
          <HeadingTag
            key={block.id}
            style={{
              fontSize: block.level === 1 ? '32px' : block.level === 2 ? '28px' : '22px',
              fontWeight: block.level === 3 ? '600' : '700',
              margin: block.level === 1 ? '56px 0 24px' : block.level === 2 ? '48px 0 20px' : '40px 0 16px',
              lineHeight: block.level === 1 ? '1.2' : block.level === 2 ? '1.3' : '1.4',
              color: '#171717',
            }}
          >
            {block.text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <div
            key={block.id}
            style={{
              fontSize: 'var(--text-base)',
              lineHeight: '1.8',
              color: '#404040',
              marginBottom: '24px',
            }}
            dangerouslySetInnerHTML={{ __html: marked(block.text) }}
          />
        );

      case 'image':
        return (
          <div
            key={block.id}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${block.columns}, 1fr)`,
              gap: '16px',
              margin: '32px 0',
            }}
          >
            {block.images.map((img, idx) => (
              <div key={idx} style={{ overflow: 'hidden', borderRadius: '8px' }}>
                <img
                  src={img.imageUrl}
                  alt={img.alt}
                  style={{
                    width: '100%',
                    height: img.height ? `${img.height}px` : 'auto',
                    objectFit: img.height ? 'cover' : 'contain',
                    objectPosition: img.objectPosition || 'center',
                  }}
                />
                {img.caption && (
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: '#737373',
                    marginTop: '8px',
                    textAlign: 'center',
                  }}>
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag
            key={block.id}
            style={{
              fontSize: 'var(--text-base)',
              lineHeight: '1.8',
              color: '#404040',
              marginBottom: '24px',
              paddingLeft: '24px',
            }}
          >
            {block.items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
            ))}
          </ListTag>
        );

      case 'callout':
        const bgColors = {
          info: '#eff6ff',
          warning: '#fef3c7',
          tip: '#d1fae5',
          danger: '#fee2e2',
        };
        const borderColors = {
          info: '#3b82f6',
          warning: '#f59e0b',
          tip: '#10b981',
          danger: '#ef4444',
        };
        return (
          <div
            key={block.id}
            style={{
              background: bgColors[block.calloutType],
              border: `1px solid ${borderColors[block.calloutType]}`,
              borderRadius: '12px',
              padding: '20px',
              margin: '24px 0',
              fontSize: 'var(--text-base)',
              lineHeight: '1.7',
            }}
            dangerouslySetInnerHTML={{ __html: marked(block.content) }}
          />
        );

      case 'divider':
        return (
          <hr
            key={block.id}
            style={{
              border: 'none',
              borderTop: '1px solid #e5e5e5',
              margin: '48px 0',
            }}
          />
        );

      case 'amazon-products':
        return (
          <div
            key={block.id}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${block.columns}, 1fr)`,
              gap: '16px',
              margin: '32px 0',
            }}
          >
            {block.products.map((product, idx) => (
              <a
                key={idx}
                href={`https://www.amazon.com/dp/${product.asin}?tag=YOUR_AFFILIATE_TAG`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  height: '280px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                }}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#171717',
                    marginBottom: '8px',
                    lineHeight: '1.4',
                  }}>
                    {product.title}
                  </div>
                  {product.price && (
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#171717',
                      marginBottom: '12px',
                    }}>
                      {product.price}
                    </div>
                  )}
                  <div style={{
                    background: '#FF9900',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                    Buy on Amazon
                  </div>
                </div>
              </a>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '16px 24px 80px',
    }}>
      {blocks.map(renderBlock)}
    </div>
  );
}
