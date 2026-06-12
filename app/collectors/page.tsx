'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  UsersIcon,
  TrophyIcon,
  ClockIcon,
  SparklesIcon,
  UserCircleIcon,
  CubeIcon,
  ArchiveBoxIcon,
  ArrowRightIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';

function tx(translations: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((obj: any, key) => obj?.[key], translations) as string | undefined;
}

interface CollectorCard {
  profileSlug: string;
  username: string | null;
  displayName: string;
  image: string | null;
  memberSince: string;
  stats: { totalMinifigs: number; totalSets: number; totalItems: number };
}

interface ThemeLeader {
  theme: string;
  user: CollectorCard;
  count: number;
}

interface CommunityStats {
  totalCollectors: number;
  totalItemsTracked: number;
  longestTenured: CollectorCard[];
  biggestCollections: CollectorCard[];
  mostDiverse: CollectorCard[];
  newestMembers: CollectorCard[];
  spotlight: CollectorCard[];
  themeLeaders: ThemeLeader[];
}

// Colour per username (consistent across renders)
const PALETTE = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#f97316','#06b6d4','#6366f1'];
function avatarColor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function avatarSrc(image: string | null): string | null {
  if (!image) return null;
  // If it looks like an avatar key (no slashes, no http), build the path
  if (!image.startsWith('http') && !image.startsWith('/')) return `/avatars/${image}.png`;
  return image;
}

function Avatar({ user, size = 48 }: { user: CollectorCard; size?: number }) {
  const [err, setErr] = useState(false);
  const initials = user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const src = avatarSrc(user.image);
  const color = avatarColor(user.profileSlug);
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, position: 'relative', overflow: 'hidden', border: '2px solid #e5e5e5' }}>
      {/* Initials always rendered underneath */}
      <div style={{
        position: 'absolute', inset: 0, backgroundColor: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: size > 40 ? '17px' : '12px',
      }}>
        {initials}
      </div>
      {/* Avatar image on top — hides itself on error */}
      {src && !err && (
        <img src={src} alt={user.displayName} width={size} height={size}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          onError={() => setErr(true)} />
      )}
    </div>
  );
}

function SpotlightCard({ user }: { user: CollectorCard }) {
  const year = new Date(user.memberSince).getFullYear();
  return (
    <Link href={`/collectors/${user.profileSlug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px',
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
          cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', height: '100%', boxSizing: 'border-box',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.09)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = ''; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar user={user} size={48} />
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.displayName}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#a3a3a3' }}>{user.username ? `@${user.username} · ` : ''}member since {year}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {[
            { icon: <CubeIcon style={{ width: 13, height: 13 }} />, value: user.stats.totalMinifigs, label: 'minifigs' },
            { icon: <ArchiveBoxIcon style={{ width: 13, height: 13 }} />, value: user.stats.totalSets, label: 'sets' },
          ].map(s => (
            <div key={s.label} style={{
              backgroundColor: '#fafafa', borderRadius: '8px', padding: '8px 10px',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <span style={{ color: '#a3a3a3' }}>{s.icon}</span>
              <span style={{ fontWeight: 700, fontSize: '13px', color: '#171717' }}>{s.value.toLocaleString()}</span>
              <span style={{ fontSize: '11px', color: '#737373' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600 }}>View collection</span>
          <ArrowRightIcon style={{ width: 12, height: 12, color: '#3b82f6' }} />
        </div>
      </div>
    </Link>
  );
}

function RankRow({ user, rank, suffix }: { user: CollectorCard; rank: number; suffix?: string }) {
  const year = new Date(user.memberSince).getFullYear();
  const medalColors: Record<number, { bg: string; text: string }> = {
    1: { bg: '#fef3c7', text: '#d97706' },
    2: { bg: '#f3f4f6', text: '#6b7280' },
    3: { bg: '#fde8d8', text: '#c2410c' },
  };
  const medal = medalColors[rank] ?? { bg: '#f5f5f5', text: '#a3a3a3' };
  return (
    <Link href={`/collectors/${user.profileSlug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', transition: 'background 0.1s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#fafafa'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = ''; }}
      >
        <span style={{
          width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 700,
          backgroundColor: medal.bg, color: medal.text,
        }}>{rank}</span>
        <Avatar user={user} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.displayName}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#a3a3a3' }}>since {year}</p>
        </div>
        {suffix && (
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#171717', flexShrink: 0 }}>{suffix}</span>
        )}
      </div>
    </Link>
  );
}

function RankCard({ title, icon, color, users, getSuffix }: {
  title: string; icon: React.ReactNode; color: string;
  users: CollectorCard[]; getSuffix?: (u: CollectorCard) => string;
}) {
  if (!users.length) return null;
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 30, height: 30, borderRadius: '8px', backgroundColor: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: '13px', color: '#171717' }}>{title}</span>
      </div>
      <div style={{ padding: '6px 4px' }}>
        {users.map((u, i) => (
          <RankRow key={u.profileSlug} user={u} rank={i + 1} suffix={getSuffix?.(u)} />
        ))}
      </div>
    </div>
  );
}

function ThemeLeaderCard({ leader }: { leader: ThemeLeader }) {
  const [err, setErr] = useState(false);
  const initials = leader.user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Link href={`/collectors/${leader.user.profileSlug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '14px',
          padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', transition: 'transform 0.12s, box-shadow 0.12s',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = ''; }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
          backgroundColor: avatarColor(leader.user.profileSlug) + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TagIcon style={{ width: 18, height: 18, color: avatarColor(leader.user.profileSlug) }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {leader.theme}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {avatarSrc(leader.user.image) && !err ? (
              <Image src={avatarSrc(leader.user.image)!} alt={leader.user.displayName} width={18} height={18} unoptimized
                style={{ borderRadius: '50%', objectFit: 'cover' }} onError={() => setErr(true)} />
            ) : (
              <div style={{
                width: 18, height: 18, borderRadius: '50%', backgroundColor: avatarColor(leader.user.profileSlug),
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px', fontWeight: 700,
              }}>{initials}</div>
            )}
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {leader.user.displayName}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#171717' }}>{leader.count}</p>
          <p style={{ margin: 0, fontSize: '10px', color: '#a3a3a3' }}>minifigs</p>
        </div>
      </div>
    </Link>
  );
}

function SearchResultCard({ user }: { user: CollectorCard }) {
  return <SpotlightCard user={user} />;
}

export default function CollectorsPage() {
  const { translations } = useTranslation();

  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [searchResults, setSearchResults] = useState<CollectorCard[]>([]);
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/community-stats')
      .then(r => r.json())
      .then(j => { if (j.success) setStats(j.data); })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); setSearchLoading(false); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/collectors?search=${encodeURIComponent(q)}&page=1`);
      const j = await res.json();
      if (j.success) setSearchResults(j.data.collectors);
    } catch { /* ignore */ }
    finally { setSearchLoading(false); }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    if (searchRef.current) clearTimeout(searchRef.current);
    if (!q.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    searchRef.current = setTimeout(() => doSearch(q), 350);
  };

  const isSearching = search.trim().length > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        padding: '72px 24px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '20px', marginBottom: '20px',
            backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#c084fc' }} />
            <span style={{ fontSize: '12px', color: '#c084fc', fontWeight: 600, letterSpacing: '0.04em' }}>Community</span>
          </div>

          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Explore Collectors
          </h1>
          <p style={{ margin: '0 0 32px', fontSize: '16px', color: '#94a3b8', lineHeight: 1.6 }}>
            Discover what LEGO fans are building around the world
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto' }}>
            <MagnifyingGlassIcon style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              width: 18, height: 18, color: '#94a3b8', pointerEvents: 'none',
            }} />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name or username…"
              style={{
                width: '100%', padding: '15px 20px 15px 48px',
                borderRadius: '14px', border: '1px solid rgba(255,255,255,0.14)',
                backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff',
                fontSize: '15px', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.7)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.13)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>

          {/* Quick stats */}
          {stats && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '36px', flexWrap: 'wrap' }}>
              {[
                { value: stats.totalCollectors, label: 'Collectors' },
                { value: stats.totalItemsTracked, label: 'Items Tracked' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value.toLocaleString()}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Search results overlay ── */}
      {isSearching && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
          {searchLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '16px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ height: '140px', backgroundColor: '#f0f0f0', borderRadius: '12px', animation: 'pulse 1.4s ease-in-out infinite' }} />
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#a3a3a3' }}>
              <UserCircleIcon style={{ width: 40, height: 40, margin: '0 auto 10px', display: 'block' }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No collectors found for "{search}"</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '16px' }}>
              {searchResults.map(c => <SearchResultCard key={c.profileSlug} user={c} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Discovery content (hidden during search) ── */}
      {!isSearching && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 64px' }}>

          {/* Spotlight */}
          {!statsLoading && stats && stats.spotlight.length > 0 && (
            <section style={{ marginBottom: '56px' }}>
              <SectionHeader icon={<SparklesIcon style={{ width: 18, height: 18 }} />} color="#8b5cf6" title="Featured Collectors" sub="Changes each visit" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px,1fr))', gap: '16px' }}>
                {stats.spotlight.map(u => <SpotlightCard key={u.profileSlug} user={u} />)}
              </div>
            </section>
          )}

          {/* Leaderboards */}
          {!statsLoading && stats && (stats.longestTenured.length > 0 || stats.biggestCollections.length > 0 || stats.mostDiverse.length > 0) && (
            <section style={{ marginBottom: '56px' }}>
              <SectionHeader icon={<TrophyIcon style={{ width: 18, height: 18 }} />} color="#f59e0b" title="Leaderboards" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '16px' }}>
                <RankCard title="Longest Members" icon={<ClockIcon style={{ width: 15, height: 15 }} />} color="#3b82f6"
                  users={stats.longestTenured} />
                <RankCard title="Biggest Collections" icon={<TrophyIcon style={{ width: 15, height: 15 }} />} color="#f59e0b"
                  users={stats.biggestCollections} getSuffix={u => `${u.stats.totalItems.toLocaleString()} items`} />
                {stats.mostDiverse.length > 0 && (
                  <RankCard title="Most Diverse" icon={<SparklesIcon style={{ width: 15, height: 15 }} />} color="#8b5cf6"
                    users={stats.mostDiverse} getSuffix={u => `${u.stats.totalMinifigs}f + ${u.stats.totalSets}s`} />
                )}
              </div>
            </section>
          )}

          {/* Theme Leaders */}
          {!statsLoading && stats && stats.themeLeaders.length > 0 && (
            <section style={{ marginBottom: '56px' }}>
              <SectionHeader icon={<TagIcon style={{ width: 18, height: 18 }} />} color="#ec4899" title="Top Collector by Theme" sub="Who has the most minifigs per theme" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '12px' }}>
                {stats.themeLeaders.map(l => <ThemeLeaderCard key={l.theme} leader={l} />)}
              </div>
            </section>
          )}

          {/* Recently Joined */}
          {!statsLoading && stats && stats.newestMembers.length > 0 && (
            <section>
              <SectionHeader icon={<UsersIcon style={{ width: 18, height: 18 }} />} color="#10b981" title="Recently Joined" />
              <div style={{
                backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px',
                padding: '8px 4px',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))',
              }}>
                {stats.newestMembers.map(u => <MiniRow key={u.profileSlug} user={u} />)}
              </div>
            </section>
          )}

          {/* Loading skeleton */}
          {statsLoading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '16px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: '160px', backgroundColor: '#f0f0f0', borderRadius: '12px', animation: 'pulse 1.4s ease-in-out infinite' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, color, title, sub }: { icon: React.ReactNode; color: string; title: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#171717' }}>{title}</h2>
      {sub && <span style={{ fontSize: '12px', color: '#a3a3a3' }}>{sub}</span>}
    </div>
  );
}

function MiniRow({ user }: { user: CollectorCard }) {
  return (
    <Link href={`/collectors/${user.profileSlug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', transition: 'background 0.1s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#fafafa'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = ''; }}
      >
        <Avatar user={user} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName}</p>
          <p style={{ margin: 0, fontSize: '11px', color: '#a3a3a3' }}>{user.username ? `@${user.username}` : 'Collector'}</p>
        </div>
        <span style={{ fontSize: '11px', color: '#a3a3a3', flexShrink: 0 }}>{user.stats.totalItems} items</span>
      </div>
    </Link>
  );
}
