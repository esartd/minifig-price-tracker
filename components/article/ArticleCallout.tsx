import { ReactNode } from 'react';

interface ArticleCalloutProps {
  children: ReactNode;
  type?: 'info' | 'tip' | 'warning';
}

export default function ArticleCallout({ children, type = 'info' }: ArticleCalloutProps) {
  const styles = {
    info: {
      background: '#f0f7ff',
      border: '1px solid #bfdbfe',
      color: '#1e40af',
    },
    tip: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#166534',
    },
    warning: {
      background: '#fffbeb',
      border: '1px solid #fde68a',
      color: '#92400e',
    },
  };

  const currentStyle = styles[type];

  return (
    <div style={{
      ...currentStyle,
      padding: '24px',
      borderRadius: '12px',
      margin: '32px 0',
      fontSize: '16px',
      lineHeight: '1.6',
    }}>
      {children}
    </div>
  );
}
