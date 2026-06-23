'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useTranslation } from './TranslationProvider';
import type { RecommendedSet } from '@/app/api/trending/sets/route';

const AFFILIATE_TAG = 'ericksu0c-20';

function getAmazonLink(boxNo: string, name: string): string {
  const cleanNo = boxNo.replace(/-\d+$/, '');
  return `https://www.amazon.com/s?k=${encodeURIComponent(`LEGO ${cleanNo} ${name}`)}&tag=${AFFILIATE_TAG}`;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export default function RecommendedSets() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [sets, setSets] = useState<RecommendedSet[]>([]);
  const [personalized, setPersonalized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cacheKey = session?.user?.id ? `recs_sets_${session.user.id}` : 'recs_sets_anon';

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          setSets(data.data);
          setPersonalized(data.personalized);
          setLoading(false);
          return;
        }
      }
    } catch {
      // sessionStorage unavailable (SSR or private mode)
    }

    fetch('/api/trending/sets')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSets(data.data);
          setPersonalized(data.personalized);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
          } catch {
            // ignore storage errors
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session?.user?.id]);

  if (!loading && sets.length === 0) return null;

  const title = personalized
    ? (t('recommended.title') || 'Recommended For You')
    : (t('recommended.popularTitle') || 'Popular Sets');

  const subtitle = personalized
    ? (t('recommended.subtitle') || 'Based on themes you collect')
    : (t('recommended.popularSubtitle') || 'Sets collectors love right now');

  return (
    <>
      <style jsx>{`
        .recommended-sets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .recommended-sets-grid {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 900px) {
          .recommended-sets-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .recommended-sets-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .rec-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e5e5e5;
          transition: all 0.2s;
          width: 100%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: grid;
          grid-template-rows: auto 1fr auto;
          height: 100%;
        }

        .rec-card:hover {
          border-color: #d4d4d4;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .skeleton-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e5e5e5;
          height: 320px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <section style={{
        padding: '60px 20px 80px',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e5e5e5',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.01em',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            {subtitle}
          </p>

          <div className="recommended-sets-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton-card" style={{ backgroundColor: '#f5f5f5' }} />
                ))
              : sets.map((set) => {
                  const amazonLink = getAmazonLink(set.box_no, set.name);
                  const mainTheme = set.category_name?.split(' / ')[0] || set.category_name;
                  const availabilityColor = set.availability === 'available' ? '#059669' : '#d97706';
                  const availabilityBg = set.availability === 'available' ? '#d1fae5' : '#fef3c7';
                  const availabilityLabel = set.availability === 'available'
                    ? (t('recommended.availableNow') || 'Available Now')
                    : (t('recommended.retiringSoon') || 'Retiring Soon');

                  return (
                    <div key={set.box_no} className="rec-card">
                      {/* Availability badge */}
                      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: '600',
                          color: availabilityColor,
                          backgroundColor: availabilityBg,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}>
                          {availabilityLabel}
                        </span>
                        {mainTheme && (
                          <span style={{
                            fontSize: 'var(--text-xs)',
                            color: '#737373',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginLeft: 'auto',
                          }}>
                            {mainTheme}
                          </span>
                        )}
                      </div>

                      {/* Image */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1',
                        marginBottom: '16px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}>
                        <Image
                          src={set.imageUrl}
                          alt={set.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
                          style={{ objectFit: 'contain', padding: '12px' }}
                          unoptimized
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Text */}
                      <div>
                        <h3 style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: '600',
                          color: '#171717',
                          marginBottom: '4px',
                          lineHeight: '1.3',
                        }}>
                          {set.name}
                        </h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: '#737373', marginBottom: '0' }}>
                          {t('recommended.affiliate') || 'Affiliate'} • {set.box_no.replace(/-\d+$/, '')}
                        </p>
                      </div>

                      {/* Amazon button */}
                      <button
                        onClick={async () => {
                          try {
                            await fetch('/api/track-click', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                platform: 'amazon',
                                productType: 'set',
                                productId: set.box_no,
                                productName: set.name,
                                redirectUrl: amazonLink,
                              }),
                            });
                          } catch {
                            // non-critical
                          }
                          window.open(amazonLink, '_blank', 'noopener,noreferrer');
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '10px 20px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: '600',
                          color: '#ffffff',
                          background: 'linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'center',
                          marginTop: '16px',
                        }}
                      >
                        {t('recommended.shopAmazon') || 'Shop on Amazon'}
                      </button>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>
    </>
  );
}
