'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LegoBox } from '@/types';

function SetCard({ set }: { set: LegoBox }) {
  const [currentImageUrl, setCurrentImageUrl] = useState(set.image_url || '');
  const [showFallback, setShowFallback] = useState(!set.image_url);

  const handleImageError = () => {
    // Try fallback: ON -> SN (Original New -> Standard New)
    if (currentImageUrl.includes('/ON/')) {
      setCurrentImageUrl(currentImageUrl.replace('/ON/', '/SN/'));
    } else {
      setShowFallback(true);
    }
  };

  return (
    <Link
      href={`/sets/${set.box_no}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e5e5e5',
        transition: 'all 0.2s',
        cursor: 'pointer',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e5e5e5';
      }}>
        {/* Image */}
        <div style={{
          height: '200px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {!showFallback ? (
            <Image
              key={currentImageUrl}
              src={currentImageUrl}
              alt={set.name}
              width={180}
              height={180}
              style={{ objectFit: 'contain', maxHeight: '180px' }}
              unoptimized
              onError={handleImageError}
            />
          ) : (
            <div style={{ fontSize: '72px', opacity: 0.3 }}>📦</div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <div style={{
            fontSize: '12px',
            color: '#3b82f6',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            {set.box_no}
          </div>

          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '8px',
            lineHeight: '1.4',
            minHeight: '42px'
          }}>
            {set.name}
          </h3>

          <div style={{
            fontSize: '12px',
            color: '#737373'
          }}>
            {set.year_released && `Year: ${set.year_released}`}
            {set.weight && ` • Weight: ${set.weight}g`}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SetsBrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sets, setSets] = useState<LegoBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [themeFilter, setThemeFilter] = useState(searchParams.get('theme') || '');

  useEffect(() => {
    loadSets();
  }, [searchQuery, themeFilter]);

  const loadSets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (themeFilter) params.set('theme', themeFilter);
      params.set('limit', '100');

      const response = await fetch(`/api/boxes/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSets(data.data);
      }
    } catch (error) {
      console.error('Error loading sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (themeFilter) params.set('theme', themeFilter);
    router.push(`/sets/browse?${params.toString()}`);
  };

  return (
    <>
      <style jsx>{`
        .responsive-padding {
          padding: 16px !important;
        }

        @media (min-width: 768px) {
          .responsive-padding {
            padding: 24px !important;
          }
        }

        @media (min-width: 1024px) {
          .responsive-padding {
            padding: 32px !important;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }} className="responsive-padding">
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#171717'
            }}>
              Browse LEGO Sets
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: '#737373',
              marginBottom: '16px'
            }}>
              Search and explore LEGO sets from all themes
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or set number..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              />
            </form>

            {/* Quick Links */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/sets-themes"
                style={{
                  padding: '10px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Browse by Theme
              </Link>
              {themeFilter && (
                <button
                  onClick={() => {
                    setThemeFilter('');
                    router.push('/sets/browse');
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    color: '#525252',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    minHeight: '44px'
                  }}
                >
                  Clear Theme Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }} className="responsive-padding">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', color: '#525252' }}>Searching...</div>
            </div>
          ) : sets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#737373' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                No sets found
              </div>
              <div style={{ fontSize: '16px' }}>
                Try adjusting your search or browse by theme
              </div>
            </div>
          ) : (
            <>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#171717'
              }}>
                Found {sets.length} sets
                {themeFilter && ` in ${themeFilter}`}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {sets.map(set => (
                  <SetCard key={set.box_no} set={set} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function SetsBrowsePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '18px', color: '#525252' }}>Loading...</div>
        </div>
      </div>
    }>
      <SetsBrowseContent />
    </Suspense>
  );
}
