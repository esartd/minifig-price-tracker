'use client';

import { ArticleBlock } from '@/types/article';
import { marked } from 'marked';
import { SocialShare } from '@/components/article/SocialShare';
import { slugify } from '@/lib/article-utils';
import * as HeroiconsOutline from '@heroicons/react/24/outline';

interface ArticlePreviewProps {
  blocks: ArticleBlock[];
  title?: string;
  author?: string;
}

export function ArticlePreview({ blocks, title, author }: ArticlePreviewProps) {
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
              fontSize: '18px',
              lineHeight: '1.75',
              color: '#3c4043',
              margin: '24px 0',
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
              margin: '48px 0',
            }}
          >
            {block.images.map((image, i) => (
              <figure key={i} style={{ margin: 0 }}>
                <div
                  style={{
                    width: '100%',
                    height: image.height ? `${image.height}px` : 'auto',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    marginBottom: image.caption ? '16px' : '0',
                  }}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: image.height ? '100%' : 'auto',
                      objectFit: image.height ? 'cover' : 'contain',
                      objectPosition: image.objectPosition || 'center',
                      display: 'block',
                    }}
                  />
                </div>
                {image.caption && (
                  <figcaption
                    style={{
                      fontSize: '14px',
                      color: '#737373',
                      textAlign: 'center',
                      lineHeight: '1.5',
                    }}
                  >
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
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
            {block.products.map((product, i) => (
              <a
                key={i}
                href={`https://www.amazon.com/dp/${product.asin}?tag=ericksu0c-20`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {product.imageUrl && (
                  <div style={{
                    width: '100%',
                    height: '280px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    background: '#ffffff',
                  }}>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                      }}
                    />
                  </div>
                )}
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#171717', marginBottom: '8px', lineHeight: '1.4' }}>
                  {product.title}
                </div>
                {product.price && (
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '12px' }}>
                    {product.price}
                  </div>
                )}
                <div style={{
                  marginTop: 'auto',
                  padding: '10px 16px',
                  background: '#FF9900',
                  color: '#000000',
                  textAlign: 'center',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  Buy on Amazon
                </div>
              </a>
            ))}
          </div>
        );

      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag
            key={block.id}
            style={{
              fontSize: '18px',
              lineHeight: '1.75',
              color: '#3c4043',
              margin: '24px 0',
              paddingLeft: '40px',
            }}
          >
            {block.items.map((item, i) => (
              <li key={i} style={{ margin: '12px 0', lineHeight: '1.75' }}>
                {item}
              </li>
            ))}
          </ListTag>
        );

      case 'callout':
        const styles = {
          info: { background: '#f0f7ff', border: '1px solid #bfdbfe', color: '#1e40af' },
          tip: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' },
          warning: { background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' },
        };
        const currentStyle = styles[block.calloutType];

        return (
          <div
            key={block.id}
            style={{
              ...currentStyle,
              padding: '24px',
              borderRadius: '12px',
              margin: '32px 0',
              fontSize: '16px',
              lineHeight: '1.6',
            }}
            dangerouslySetInnerHTML={{ __html: marked(block.content) }}
          />
        );

      case 'comparison':
        return (
          <div
            key={block.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '24px',
              margin: '48px 0',
            }}
          >
            {block.items.map((item, index) => (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '32px',
                }}
              >
                {item.icon && (() => {
                  const IconComponent = (HeroiconsOutline as any)[item.icon];
                  return IconComponent ? (
                    <IconComponent style={{ marginBottom: '16px', width: '40px', height: '40px', color: '#3b82f6' }} />
                  ) : null;
                })()}
                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#171717',
                    marginBottom: '24px',
                  }}
                >
                  {item.title}
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#166534',
                      marginBottom: '12px',
                    }}
                  >
                    ✓ Pros
                  </h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {item.pros.map((pro, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: '15px',
                          color: '#3c4043',
                          marginBottom: '8px',
                          lineHeight: '1.5',
                        }}
                      >
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#b91c1c',
                      marginBottom: '12px',
                    }}
                  >
                    ✗ Cons
                  </h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {item.cons.map((con, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: '15px',
                          color: '#3c4043',
                          marginBottom: '8px',
                          lineHeight: '1.5',
                        }}
                      >
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );

      case 'divider':
        return (
          <hr
            key={block.id}
            style={{
              border: 'none',
              borderTop: '1px solid #e5e5e5',
              margin: '56px 0',
            }}
          />
        );

      case 'code':
        return (
          <div key={block.id} style={{ margin: '32px 0' }}>
            <pre
              style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '24px',
                borderRadius: '12px',
                overflow: 'auto',
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              }}
            >
              <code>{block.code}</code>
            </pre>
            {block.caption && (
              <p
                style={{
                  fontSize: '14px',
                  color: '#737373',
                  marginTop: '12px',
                  textAlign: 'center',
                }}
              >
                {block.caption}
              </p>
            )}
          </div>
        );

      case 'video':
        return (
          <div key={block.id} style={{ margin: '48px 0' }}>
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '12px',
              }}
            >
              <iframe
                src={
                  block.platform === 'youtube'
                    ? `https://www.youtube.com/embed/${block.videoId}`
                    : block.platform === 'vimeo'
                    ? `https://player.vimeo.com/video/${block.videoId}`
                    : block.videoUrl
                }
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {block.caption && (
              <p
                style={{
                  fontSize: '14px',
                  color: '#737373',
                  marginTop: '16px',
                  textAlign: 'center',
                  lineHeight: '1.5',
                }}
              >
                {block.caption}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <article style={{ minHeight: '100vh', background: 'white' }}>
      {/* Article Header */}
      <header
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '40px 24px 32px',
          textAlign: 'left',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: '700',
            color: '#171717',
            lineHeight: '1.2',
            marginBottom: '20px',
          }}
        >
          {title || 'Article Preview'}
        </h1>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            marginBottom: '16px',
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {author || 'FigTracker Team'} · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · 5 min read
        </div>

        <SocialShare
          title={title || 'Article Preview'}
          url={`https://figtracker.com/articles/${slugify(title || 'article')}`}
          position="top"
        />

        <div style={{ borderBottom: '1px solid #e5e5e5', marginTop: '16px', marginBottom: '24px' }} />
      </header>

      {/* Article Content */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '16px 24px 80px',
        }}
      >
        {blocks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#737373' }}>
            <p style={{ fontSize: '16px' }}>Start adding blocks to see the preview</p>
          </div>
        ) : (
          <>
            {blocks.map(renderBlock)}

            {/* Bottom Social Share Buttons */}
            <SocialShare
              title={title || 'Article Preview'}
              url={`https://figtracker.com/articles/${slugify(title || 'article')}`}
              position="bottom"
            />
          </>
        )}
      </div>
    </article>
  );
}
