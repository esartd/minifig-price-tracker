'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format-price';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

function getTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

function detectLocale(): string {
  if (typeof window === 'undefined') return 'en';
  const host = window.location.hostname;
  if (host.startsWith('de.')) return 'de';
  if (host.startsWith('fr.')) return 'fr';
  if (host.startsWith('es.')) return 'es';
  return 'en';
}

interface SharedCollection {
  userName: string;
  collectionItems: any[];
  inventoryItems: any[];
  currency: string;
  showDecimals: boolean;
}

export default function SharedCollectionPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [data, setData] = useState<SharedCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'collection' | 'inventory'>('collection');
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  useEffect(() => {
    loadSharedCollection();
  }, [token]);

  const t = getTranslations(locale).sharedCollection;

  const loadSharedCollection = async () => {
    try {
      const response = await fetch(`/api/collection/shared/${token}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || t.collectionNotAvailable);
      }
    } catch (err) {
      setError(t.collectionNotAvailable);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e5e5',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <p style={{
            fontSize: 'var(--text-xl)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '12px'
          }}>
            {t.collectionNotAvailable}
          </p>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            marginBottom: '24px'
          }}>
            {error}
          </p>
          <Link
            href="/search"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            {t.browseMinifigures}
          </Link>
        </div>
      </div>
    );
  }

  const items = view === 'collection' ? data.collectionItems : data.inventoryItems;
  const totalValue = items.reduce((sum, item) => {
    const price = item.pricing?.suggestedPrice || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 16px',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}>
          {data.userName}'s {view === 'collection' ? t.collection : t.inventory}
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          marginBottom: '16px'
        }}>
          {t.itemsCount.replace('{count}', items.length.toString()).replace('{plural}', items.length !== 1 ? 's' : '')} • {t.totalValue.replace('{value}', formatPrice(totalValue, data.currency, data.showDecimals))}
        </p>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setView('collection')}
            style={{
              padding: '10px 20px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: view === 'collection' ? '#ffffff' : '#737373',
              background: view === 'collection' ? '#3b82f6' : '#ffffff',
              border: '1px solid',
              borderColor: view === 'collection' ? '#3b82f6' : '#e5e5e5',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {t.collection} ({data.collectionItems.length})
          </button>
          <button
            onClick={() => setView('inventory')}
            style={{
              padding: '10px 20px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: view === 'inventory' ? '#ffffff' : '#737373',
              background: view === 'inventory' ? '#3b82f6' : '#ffffff',
              border: '1px solid',
              borderColor: view === 'inventory' ? '#3b82f6' : '#e5e5e5',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {t.forSale} ({data.inventoryItems.length})
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#fafafa',
          borderRadius: '12px'
        }}>
          <p style={{ fontSize: 'var(--text-base)', color: '#737373' }}>
            {t.noItemsInCollection.replace('{view}', view === 'collection' ? t.collection.toLowerCase() : t.inventory.toLowerCase())}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px'
        }}>
          {items.map((item: any) => (
            <Link
              key={item.id}
              href={`/minifigs/${item.minifigure_no}`}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e5e5',
                padding: '16px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#d4d4d4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}
            >
              <div style={{
                width: '100%',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                background: '#ffffff',
                borderRadius: '8px'
              }}>
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.minifigure_name}
                    width={140}
                    height={175}
                    style={{
                      width: 'auto',
                      height: '160px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '48px' }}>🧱</span>
                )}
              </div>
              <h3 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '6px',
                lineHeight: '1.4',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {item.minifigure_name}
              </h3>
              <p style={{
                fontSize: 'var(--text-xs)',
                color: '#737373',
                fontFamily: 'monospace',
                marginBottom: '8px'
              }}>
                {item.minifigure_no}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 'var(--text-sm)'
              }}>
                <span style={{
                  color: '#737373',
                  textTransform: 'capitalize'
                }}>
                  {item.condition === 'used' ? t.used : t.new} • {t.qty}: {item.quantity}
                </span>
              </div>
              {item.pricing?.suggestedPrice > 0 && (
                <div style={{
                  marginTop: '8px',
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  color: '#171717'
                }}>
                  {formatPrice(item.pricing.suggestedPrice, data.currency, data.showDecimals)}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '60px',
        textAlign: 'center',
        padding: '32px',
        background: '#fafafa',
        borderRadius: '12px'
      }}>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          marginBottom: '16px'
        }}>
          {t.trackYourCollection}
        </p>
        <Link
          href="/search"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#3b82f6',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          {t.startYourCollection}
        </Link>
      </div>
    </div>
  );
}
