'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon, UsersIcon } from '@heroicons/react/24/outline';
import CollectorCard from '@/components/CollectorCard';
import CommunityStats from '@/components/CommunityStats';
import { useTranslation } from '@/components/TranslationProvider';

function tx(translations: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((obj: any, key) => obj?.[key], translations) as string | undefined;
}

interface Collector {
  username: string;
  displayName: string;
  image: string | null;
  memberSince: string;
  stats: { totalMinifigs: number; totalSets: number; totalItems: number };
}

interface CommunityStatsData {
  totalCollectors: number;
  totalItemsTracked: number;
  longestTenured: { displayName: string; username: string; memberSince: string } | null;
  largestMinifigCollection: { displayName: string; username: string; count: number } | null;
}

interface Pagination {
  page: number;
  totalPages: number;
  totalCount: number;
}

export default function CollectorsPage() {
  const { translations } = useTranslation();
  const t = (path: string) => tx(translations, path);

  const [communityStats, setCommunityStats] = useState<CommunityStatsData | null>(null);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/community-stats')
      .then((r) => r.json())
      .then((json) => { if (json.success) setCommunityStats(json.data); })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const fetchCollectors = useCallback(
    async (q: string, p: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p) });
        if (q) params.set('search', q);
        const res = await fetch(`/api/collectors?${params}`);
        const json = await res.json();
        if (json.success) {
          setCollectors(json.data.collectors);
          setPagination(json.data.pagination);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCollectors(search, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    setPage(1);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => fetchCollectors(q, 1), 350);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1d1d1f 0%, #3b3b3f 100%)',
          padding: '64px 24px 48px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            marginBottom: '20px',
          }}
        >
          <UsersIcon style={{ width: '14px', height: '14px', color: '#d4d4d4' }} />
          <span style={{ fontSize: 'var(--text-xs)', color: '#d4d4d4', fontWeight: 500 }}>
            {t('collectors.directory.badge') || 'Community'}
          </span>
        </div>

        <h1
          style={{
            margin: '0 0 12px',
            fontSize: 'var(--text-4xl)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          {t('collectors.directory.title') || 'Collector Community'}
        </h1>
        <p
          style={{
            margin: '0 auto',
            maxWidth: '480px',
            fontSize: 'var(--text-base)',
            color: '#a3a3a3',
            lineHeight: 1.6,
          }}
        >
          {t('collectors.directory.subtitle') || 'Explore collections from LEGO fans around the world'}
        </p>
      </div>

      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Community stats */}
        {!statsLoading && communityStats && (
          <div style={{ marginBottom: '40px' }}>
            <CommunityStats stats={communityStats} />
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              position: 'relative',
              maxWidth: '480px',
            }}
          >
            <MagnifyingGlassIcon
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#a3a3a3',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={t('collectors.directory.searchPlaceholder') || 'Search collectors by name...'}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                backgroundColor: '#fff',
                fontSize: 'var(--text-sm)',
                color: '#171717',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {pagination && (
            <p style={{ margin: '8px 0 0', fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>
              {pagination.totalCount.toLocaleString()} {t('collectors.directory.collectorsFound') || 'collectors'}
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '160px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '12px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : collectors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#a3a3a3' }}>
            <UsersIcon style={{ width: '48px', height: '48px', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ margin: 0, fontSize: 'var(--text-base)' }}>
              {search
                ? (t('collectors.directory.noResults') || 'No collectors found')
                : (t('collectors.directory.empty') || 'No public collectors yet')}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {collectors.map((c) => (
              <CollectorCard key={c.username} {...c} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '40px',
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                backgroundColor: '#fff',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: 'var(--text-sm)',
                color: page === 1 ? '#a3a3a3' : '#171717',
              }}
            >
              Previous
            </button>

            <span style={{ fontSize: 'var(--text-sm)', color: '#737373' }}>
              {page} / {pagination.totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              style={{
                padding: '8px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                backgroundColor: '#fff',
                cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                fontSize: 'var(--text-sm)',
                color: page >= pagination.totalPages ? '#a3a3a3' : '#171717',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
