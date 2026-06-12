'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  UserCircleIcon,
  CalendarIcon,
  CubeIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import PublicCollectionList from '@/components/PublicCollectionList';
import { useTranslation } from '@/components/TranslationProvider';

function tx(translations: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((obj: any, key) => obj?.[key], translations) as string | undefined;
}

const PALETTE = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#f97316','#06b6d4','#6366f1'];
function hashColor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function ProfileAvatar({ profile }: { profile: { displayName: string; image: string | null; profileSlug: string } }) {
  const [err, setErr] = useState(false);
  const initials = profile.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const color = hashColor(profile.profileSlug);
  const src = profile.image
    ? (profile.image.startsWith('http') || profile.image.startsWith('/') ? profile.image : `/avatars/${profile.image}.png`)
    : null;
  return (
    <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #e5e5e5', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '24px' }}>
        {initials}
      </div>
      {src && !err && (
        <img src={src} alt={profile.displayName} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setErr(true)} />
      )}
    </div>
  );
}

type Tab = 'minifigInventory' | 'minifigPersonal' | 'setInventory' | 'setPersonal';

interface ProfileData {
  profile: {
    profileSlug: string;
    username: string | null;
    displayName: string;
    image: string | null;
    memberSince: string;
    stats: { totalMinifigs: number; totalSets: number; totalItems: number };
  };
  collections: {
    minifigInventory: any[];
    minifigPersonal: any[];
    setInventory: any[];
    setPersonal: any[];
  };
}

export default function CollectorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { data: session } = useSession();
  const { translations } = useTranslation();
  const t = (path: string) => tx(translations, path);

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('minifigInventory');

  useEffect(() => {
    fetch(`/api/collectors/${username}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(json.error || 'Failed to load profile');
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [username]);

  const isOwnProfile = session?.user?.id === data?.profile.profileSlug || session?.user?.username === data?.profile.username;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'minifigInventory', label: t('collectors.profile.tabs.minifigInventory') || 'Minifig Inventory' },
    { key: 'minifigPersonal', label: t('collectors.profile.tabs.minifigCollection') || 'Minifig Collection' },
    { key: 'setInventory', label: t('collectors.profile.tabs.setInventory') || 'Set Inventory' },
    { key: 'setPersonal', label: t('collectors.profile.tabs.setCollection') || 'Set Collection' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #e5e5e5', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    const isPrivate = error.toLowerCase().includes('private');
    const isNotFound = error.toLowerCase().includes('not found');

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          {isPrivate ? (
            <LockClosedIcon style={{ width: '48px', height: '48px', color: '#a3a3a3', margin: '0 auto 16px' }} />
          ) : (
            <UserCircleIcon style={{ width: '48px', height: '48px', color: '#a3a3a3', margin: '0 auto 16px' }} />
          )}
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: '#171717', margin: '0 0 8px 0' }}>
            {isPrivate
              ? (t('collectors.profile.empty.privateProfile') || 'This profile is private')
              : (t('collectors.profile.notFound') || 'Collector not found')}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: '#737373', margin: '0 0 24px 0' }}>
            {isPrivate
              ? "This collector's profile is not public."
              : "We couldn't find a collector with that username."}
          </p>
          <Link
            href="/collectors"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#171717',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            Browse Collectors
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { profile, collections } = data;
  const memberYear = new Date(profile.memberSince).getFullYear();
  const activeItems = collections[activeTab] || [];
  const activeType = activeTab.startsWith('set') ? 'set' : 'minifig';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Profile header */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <ProfileAvatar profile={profile} />

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#171717' }}>
                  {profile.displayName}
                </h1>
                {isOwnProfile && (
                  <Link
                    href="/account"
                    style={{
                      padding: '4px 12px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '20px',
                      fontSize: 'var(--text-xs)',
                      color: '#737373',
                      textDecoration: 'none',
                    }}
                  >
                    Edit profile
                  </Link>
                )}
              </div>
              {profile.username && (
                <p style={{ margin: '4px 0 12px', fontSize: 'var(--text-sm)', color: '#737373' }}>
                  @{profile.username}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a3a3a3', fontSize: 'var(--text-xs)' }}>
                <CalendarIcon style={{ width: '14px', height: '14px' }} />
                <span>
                  {(t('collectors.profile.memberSince') || 'Member since {date}').replace('{date}', String(memberYear))}
                </span>
              </div>
            </div>

            {/* Stat counters */}
            <div style={{ display: 'flex', gap: '24px', flexShrink: 0 }}>
              {[
                { value: profile.stats.totalMinifigs, label: t('collectors.profile.totalMinifigs') || 'Minifigs' },
                { value: profile.stats.totalSets, label: t('collectors.profile.totalSets') || 'Sets' },
                { value: profile.stats.totalItems, label: t('collectors.profile.totalItems') || 'Total' },
              ].map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#171717' }}>
                    {value.toLocaleString()}
                  </p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: '#737373' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '0', overflowX: 'auto' }}>
          {tabs.map((tab) => {
            const count = collections[tab.key]?.length ?? 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '14px 16px',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #171717' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? '#171717' : '#737373',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {tab.label}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 6px',
                    borderRadius: '10px',
                    backgroundColor: activeTab === tab.key ? '#171717' : '#f5f5f5',
                    color: activeTab === tab.key ? '#fff' : '#737373',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection list */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px' }}>
        <PublicCollectionList items={activeItems} type={activeType} />
      </div>
    </div>
  );
}
