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
            dangerouslySetInnerHTML={{ __html: marked.parseInline(block.text) }}
          />
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
              <li key={idx} style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: marked(item) }} />
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

      case 'cta-button':
        const alignment = block.alignment || 'center';
        const style = block.style || 'primary';
        const size = block.size || 'large';

        const sizeStyles = {
          small: { padding: '10px 20px', fontSize: '14px' },
          medium: { padding: '12px 28px', fontSize: '15px' },
          large: { padding: '16px 40px', fontSize: '17px' },
        };

        const styleColors = {
          primary: { background: '#3b82f6', color: '#ffffff', hoverBg: '#2563eb' },
          secondary: { background: '#f3f4f6', color: '#171717', hoverBg: '#e5e7eb' },
        };

        return (
          <div
            key={block.id}
            style={{
              display: 'flex',
              justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
              margin: '32px 0',
            }}
          >
            <a
              href={block.url}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...sizeStyles[size],
                background: styleColors[style].background,
                color: styleColors[style].color,
                borderRadius: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = styleColors[style].hoverBg;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = styleColors[style].background;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {block.text}
            </a>
          </div>
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
                href={`https://www.amazon.com/dp/${product.asin}?tag=ericksu0c-20`}
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
