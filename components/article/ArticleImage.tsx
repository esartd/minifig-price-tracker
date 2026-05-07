interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
}

export default function ArticleImage({ src, alt, caption, priority = false }: ArticleImageProps) {
  return (
    <figure style={{
      margin: '48px 0',
      width: '100%',
    }}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '12px',
          display: 'block',
          marginBottom: caption ? '16px' : '0',
        }}
      />
      {caption && (
        <figcaption style={{
          fontSize: '14px',
          color: '#737373',
          textAlign: 'center',
          lineHeight: '1.5',
        }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
