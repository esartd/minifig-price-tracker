'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FireIcon } from '@heroicons/react/24/solid';

interface TrendingMinifig {
  no: string;
  name: string;
  categoryName: string;
  yearReleased: string | null;
  imageUrl: string;
  userCount: number;
}

export default function TrendingMinifigs() {
  const [trending, setTrending] = useState<TrendingMinifig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trending/minifigs')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success && data.data) {
          setTrending(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load trending:', err);
        // Silently fail - don't show section if API is down
        setLoading(false);
        setTrending([]);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (trending.length === 0) {
    return null;
  }

  return (
    <div style={{
      marginTop: '64px',
      padding: '32px 24px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px'
      }}>
        <FireIcon style={{ width: '28px', height: '28px', color: '#f59e0b' }} />
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: '#171717',
          margin: 0
        }}>
          Trending This Week
        </h2>
      </div>
      <p style={{
        fontSize: 'var(--text-base)',
        color: '#737373',
        marginBottom: '32px',
        marginTop: '8px'
      }}>
        Most tracked minifigures by FigTracker users
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '16px'
      }}>
        {trending.map((minifig) => (
          <Link
            key={minifig.no}
            href={`/minifigs/${minifig.no}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              border: '1px solid #e5e5e5'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e5e5';
            }}
          >
            <div style={{
              width: '100%',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Image
                src={minifig.imageUrl}
                alt={`${minifig.name} - ${minifig.no}`}
                width={100}
                height={120}
                style={{
                  maxWidth: '100%',
                  maxHeight: '120px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                unoptimized
              />
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: '#737373',
              marginBottom: '4px'
            }}>
              {minifig.no}
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: '#171717',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '34px'
            }}>
              {minifig.name}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: '#a3a3a3',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <FireIcon style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
              {minifig.userCount} tracking
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
