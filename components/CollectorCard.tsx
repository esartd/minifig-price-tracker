'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UserCircleIcon, CubeIcon, StarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';

// Convenience helper for optional translation keys
function tx(translations: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((obj, key) => obj?.[key], translations as any) as string | undefined;
}

interface CollectorCardProps {
  username: string;
  displayName: string;
  image: string | null;
  memberSince: string;
  stats: {
    totalMinifigs: number;
    totalSets: number;
    totalItems: number;
  };
}

export default function CollectorCard({ username, displayName, image, memberSince, stats }: CollectorCardProps) {
  const { t, translations } = useTranslation();

  const joinYear = new Date(memberSince).getFullYear();

  return (
    <Link href={`/collectors/${username}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
          (e.currentTarget as HTMLDivElement).style.borderColor = '#d4d4d4';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e5e5';
        }}
      >
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {image ? (
              <Image src={image} alt={displayName} width={48} height={48} style={{ objectFit: 'cover' }} />
            ) : (
              <UserCircleIcon style={{ width: '32px', height: '32px', color: '#a3a3a3' }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: '#171717',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </p>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#737373' }}>
              @{username}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700, color: '#171717' }}>
              {stats.totalMinifigs.toLocaleString()}
            </p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: '#737373' }}>
              {tx(translations, 'collectors.profile.totalMinifigs') || 'Minifigs'}
            </p>
          </div>
          <div style={{ width: '1px', backgroundColor: '#e5e5e5' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700, color: '#171717' }}>
              {stats.totalSets.toLocaleString()}
            </p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: '#737373' }}>
              {tx(translations, 'collectors.profile.totalSets') || 'Sets'}
            </p>
          </div>
          <div style={{ width: '1px', backgroundColor: '#e5e5e5' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700, color: '#3b82f6' }}>
              {stats.totalItems.toLocaleString()}
            </p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: '#737373' }}>
              {tx(translations, 'collectors.profile.totalItems') || 'Total'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>
          {(tx(translations, 'collectors.directory.memberSince') || 'Member since {date}').replace('{date}', String(joinYear))}
        </p>
      </div>
    </Link>
  );
}
