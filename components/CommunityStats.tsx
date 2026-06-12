'use client';

import Link from 'next/link';
import {
  UsersIcon,
  CubeTransparentIcon,
  TrophyIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';

function tx(translations: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((obj, key) => obj?.[key], translations as any) as string | undefined;
}

interface CommunityStatsData {
  totalCollectors: number;
  totalItemsTracked: number;
  longestTenured: { displayName: string; username: string; memberSince: string } | null;
  largestMinifigCollection: { displayName: string; username: string; count: number } | null;
}

interface CommunityStatsProps {
  stats: CommunityStatsData;
}

export default function CommunityStats({ stats }: CommunityStatsProps) {
  const { translations } = useTranslation();

  const longestYear = stats.longestTenured
    ? new Date(stats.longestTenured.memberSince).getFullYear()
    : null;

  const cards = [
    {
      icon: UsersIcon,
      label: tx(translations, 'collectors.directory.totalCollectors') || 'Total Collectors',
      value: stats.totalCollectors.toLocaleString(),
      description: tx(translations, 'collectors.directory.totalCollectorsDesc') || 'Active community members',
      color: '#3b82f6',
      bg: '#eff6ff',
      href: null as string | null,
    },
    {
      icon: CubeTransparentIcon,
      label: tx(translations, 'collectors.directory.totalItemsTracked') || 'Items Tracked',
      value: stats.totalItemsTracked.toLocaleString(),
      description: tx(translations, 'collectors.directory.totalItemsDesc') || 'Minifigures & sets logged',
      color: '#8b5cf6',
      bg: '#f5f3ff',
      href: null as string | null,
    },
    {
      icon: TrophyIcon,
      label: tx(translations, 'collectors.directory.longestTenured') || 'Longest Member',
      value: stats.longestTenured?.displayName || '—',
      description: longestYear ? `Since ${longestYear}` : '',
      color: '#f59e0b',
      bg: '#fffbeb',
      href: stats.longestTenured ? `/collectors/${stats.longestTenured.username}` : null,
    },
    {
      icon: SparklesIcon,
      label: tx(translations, 'collectors.directory.largestCollection') || 'Biggest Collection',
      value: stats.largestMinifigCollection?.displayName || '—',
      description: stats.largestMinifigCollection
        ? `${stats.largestMinifigCollection.count.toLocaleString()} minifigs`
        : '',
      color: '#10b981',
      bg: '#ecfdf5',
      href: stats.largestMinifigCollection
        ? `/collectors/${stats.largestMinifigCollection.username}`
        : null,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}
    >
      {cards.map(({ icon: Icon, label, value, description, color, bg, href }) => {
        const content = (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              transition: href ? 'transform 0.15s ease, box-shadow 0.15s ease' : undefined,
              cursor: href ? 'pointer' : 'default',
            }}
            onMouseEnter={
              href
                ? (e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      '0 4px 16px rgba(0,0,0,0.08)';
                  }
                : undefined
            }
            onMouseLeave={
              href
                ? (e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }
                : undefined
            }
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon style={{ width: '20px', height: '20px', color }} />
            </div>
            <div>
              <p
                style={{
                  margin: '0 0 2px 0',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {label}
              </p>
              <p
                style={{
                  margin: '0 0 4px 0',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: '#171717',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </p>
              {description && (
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>
                  {description}
                </p>
              )}
            </div>
          </div>
        );

        return href ? (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            {content}
          </Link>
        ) : (
          <div key={label}>{content}</div>
        );
      })}
    </div>
  );
}
