import { ReactNode } from 'react';

interface ArticleSectionProps {
  children: ReactNode;
}

export function ArticleHeading({ children }: ArticleSectionProps) {
  return (
    <h2 style={{
      fontSize: '28px',
      fontWeight: '700',
      margin: '48px 0 20px',
      lineHeight: '1.3',
      color: '#171717',
    }}>
      {children}
    </h2>
  );
}

export function ArticleSubheading({ children }: ArticleSectionProps) {
  return (
    <h3 style={{
      fontSize: '22px',
      fontWeight: '600',
      margin: '40px 0 16px',
      lineHeight: '1.4',
      color: '#171717',
    }}>
      {children}
    </h3>
  );
}

export function ArticleParagraph({ children }: ArticleSectionProps) {
  return (
    <p style={{
      fontSize: '18px',
      lineHeight: '1.75',
      color: '#3c4043',
      margin: '24px 0',
    }}>
      {children}
    </p>
  );
}

export function ArticleList({ children }: ArticleSectionProps) {
  return (
    <ul style={{
      fontSize: '18px',
      lineHeight: '1.75',
      color: '#3c4043',
      margin: '24px 0',
      paddingLeft: '40px',
    }}>
      {children}
    </ul>
  );
}

export function ArticleListItem({ children }: ArticleSectionProps) {
  return (
    <li style={{
      margin: '12px 0',
      lineHeight: '1.75',
    }}>
      {children}
    </li>
  );
}
