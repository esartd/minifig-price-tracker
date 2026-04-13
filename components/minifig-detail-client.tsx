'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import AddToCollectionForm from '@/components/search/AddToCollectionForm';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import ListingGeneratorForm from '@/components/listing-generator-form';

interface MinifigData {
  no: string;
  name: string;
  category_id: number;
  category_name: string;
  year_released: string | null;
  image_url: string;
  weight_grams: number | null;
}

interface MinifigDetailClientProps {
  minifig: MinifigData;
  related: Array<{ no: string; name: string; image_url: string }>;
}

export default function MinifigDetailClient({ minifig, related }: MinifigDetailClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState('');
  const [pricing, setPricing] = useState<{
    sixMonthAverage: number;
    currentAverage: number;
    currentLowest: number;
    suggestedPrice: number;
    loading: boolean;
  }>({
    sixMonthAverage: 0,
    currentAverage: 0,
    currentLowest: 0,
    suggestedPrice: 0,
    loading: true
  });
  const [collectionItem, setCollectionItem] = useState<any>(null);
  const [checkingCollection, setCheckingCollection] = useState(true);

  // Fetch pricing on client-side (user-driven, not pre-generated)
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`/api/inventory/temp-pricing?itemNo=${minifig.no}`);
        const data = await response.json();

        if (data.success && data.pricing) {
          setPricing({
            sixMonthAverage: data.pricing.sixMonthAverage || 0,
            currentAverage: data.pricing.currentAverage || 0,
            currentLowest: data.pricing.currentLowest || 0,
            suggestedPrice: data.pricing.suggestedPrice || 0,
            loading: false
          });
        } else {
          setPricing({ ...pricing, loading: false });
        }
      } catch (err) {
        setPricing({ ...pricing, loading: false });
      }
    };

    fetchPricing();
  }, [minifig.no]);

  // Check if item is in collection
  useEffect(() => {
    if (!session) {
      setCheckingCollection(false);
      return;
    }

    const checkCollection = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();

        if (data.success && data.data) {
          const found = data.data.find((item: any) => item.minifigure_no === minifig.no);
          setCollectionItem(found || null);
        }
      } catch (err) {
        console.error('Error checking collection:', err);
      } finally {
        setCheckingCollection(false);
      }
    };

    checkCollection();
  }, [minifig.no, session]);

  const handleAddToCollection = async (quantity: number) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setAddLoading(true);
    setError('');

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minifigure_no: minifig.no,
          minifigure_name: minifig.name,
          quantity,
          condition: 'new',
          image_url: minifig.image_url,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCollectionItem(data.data);
      } else {
        if (response.status === 401) {
          setError('Please sign in to add items');
        } else if (response.status === 409) {
          setError('Already in inventory');
        } else {
          setError(data.error || 'Failed to add');
        }
      }
    } catch (err: any) {
      setError('Failed to add to inventory');
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!collectionItem || !session) return;

    try {
      const response = await fetch(`/api/inventory/${collectionItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      if (data.success) {
        setCollectionItem(data.data);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveFromCollection = async () => {
    if (!collectionItem || !session) return;
    if (!confirm('Remove from inventory?')) return;

    try {
      const response = await fetch(`/api/inventory/${collectionItem.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCollectionItem(null);
      }
    } catch (err) {
      console.error('Error removing:', err);
    }
  };

  // Clean display name
  const getDisplayName = (fullName: string) => {
    let cleaned = fullName.replace(/^[^-]+-\s*/, '');
    const parts = cleaned.split(',');

    if (parts.length > 1) {
      return {
        title: parts[0].trim(),
        subtitle: parts.slice(1).join(',').trim()
      };
    }

    return { title: cleaned.trim() };
  };

  // Product schema for SEO
  const productSchema = pricing.suggestedPrice > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: minifig.name,
    description: `LEGO Minifigure ${minifig.name} (${minifig.no})`,
    image: minifig.image_url,
    sku: minifig.no,
    brand: { '@type': 'Brand', name: 'LEGO' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: pricing.currentLowest.toFixed(2),
      highPrice: pricing.sixMonthAverage.toFixed(2),
      offerCount: '1',
      availability: 'https://schema.org/InStock',
      url: `https://figtracker.ericksu.com/minifigs/${minifig.no}`,
    },
  } : null;

  const displayName = getDisplayName(minifig.name);

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '64px' }}>
      {/* Schema.org structured data */}
      {productSchema && (
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      {/* Back button */}
      <div style={{ padding: 'var(--space-2)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: 'var(--space-2)' }}>
          <button
            onClick={() => router.back()}
            style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '0 var(--space-2)', marginTop: 'var(--space-3)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            padding: 'var(--space-3)'
          }}>
            {/* Image */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <img
                src={minifig.image_url}
                alt={minifig.name}
                style={{ maxHeight: '300px', width: 'auto' }}
              />
            </div>

            {/* Header */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ marginBottom: 'var(--space-1)' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#3b82f6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {minifig.category_name}
                </span>
                {minifig.year_released && (
                  <span style={{
                    marginLeft: 'var(--space-2)',
                    fontSize: '11px',
                    color: '#737373'
                  }}>
                    {minifig.year_released}
                  </span>
                )}
              </div>

              <h1 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#171717',
                marginBottom: 'var(--space-1)',
                lineHeight: '1.2'
              }}>
                {displayName.title}
              </h1>

              {displayName.subtitle && (
                <p style={{ fontSize: '14px', color: '#737373', marginBottom: 'var(--space-1)' }}>
                  {displayName.subtitle}
                </p>
              )}

              <p style={{ fontSize: '14px', color: '#737373', fontFamily: 'monospace' }}>
                {minifig.no}
              </p>
            </div>

            {/* Pricing */}
            {pricing.loading ? (
              <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: '#737373' }}>
                Loading pricing...
              </div>
            ) : pricing.suggestedPrice > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-4)'
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#737373', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                    Qty Avg
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#171717' }}>
                    ${pricing.sixMonthAverage.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#737373', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                    Simple Avg
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#171717' }}>
                    ${pricing.currentAverage.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#737373', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                    Lowest
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#171717' }}>
                    ${pricing.currentLowest.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#3b82f6', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                    Suggested
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>
                    ${pricing.suggestedPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Price history */}
            {collectionItem && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <PriceHistoryChart minifigure_no={minifig.no} condition="new" />
              </div>
            )}

            {/* Inventory section */}
            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 'var(--space-3)' }}>
              {checkingCollection ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3)', color: '#737373' }}>
                  Checking inventory...
                </div>
              ) : collectionItem ? (
                <>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
                    In Your Inventory
                  </h2>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <div style={{
                      display: 'flex',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => collectionItem.quantity > 1 && handleUpdateQuantity(collectionItem.quantity - 1)}
                        disabled={collectionItem.quantity <= 1}
                        style={{
                          width: '44px',
                          height: '44px',
                          border: 'none',
                          borderRight: '1px solid #e5e5e5',
                          background: collectionItem.quantity > 1 ? '#fff' : '#f5f5f5',
                          cursor: collectionItem.quantity > 1 ? 'pointer' : 'not-allowed'
                        }}
                      >
                        −
                      </button>
                      <div style={{ minWidth: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
                        {collectionItem.quantity}
                      </div>
                      <button
                        onClick={() => handleUpdateQuantity(collectionItem.quantity + 1)}
                        style={{
                          width: '44px',
                          height: '44px',
                          border: 'none',
                          borderLeft: '1px solid #e5e5e5',
                          background: '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleRemoveFromCollection}
                      style={{
                        padding: '0 var(--space-2)',
                        height: '44px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <ListingGeneratorForm
                      item={collectionItem}
                      onSuccess={(listing) => alert('Listing saved!')}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
                    Add to Inventory
                  </h2>
                  <AddToCollectionForm
                    onAdd={handleAddToCollection}
                    loading={addLoading}
                    session={session}
                  />
                </>
              )}
            </div>

            {error && (
              <div style={{
                marginTop: 'var(--space-3)',
                padding: 'var(--space-2)',
                background: '#fee2e2',
                borderRadius: '8px',
                color: '#991b1b'
              }}>
                {error}
              </div>
            )}

            {/* View on Bricklink */}
            <a
              href={`https://www.bricklink.com/catalogPG.asp?M=${minifig.no}&ColorID=0`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                marginTop: 'var(--space-3)',
                padding: 'var(--space-2)',
                textAlign: 'center',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#525252',
                fontWeight: '600'
              }}
            >
              View on Bricklink →
            </a>
          </div>

          {/* Related minifigs */}
          {related.length > 0 && (
            <div style={{ marginTop: 'var(--space-6)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: 'var(--space-3)' }}>
                Related Variants
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 'var(--space-3)'
              }}>
                {related.map((r) => (
                  <a
                    key={r.no}
                    href={`/minifigs/${r.no}`}
                    style={{
                      display: 'block',
                      padding: 'var(--space-2)',
                      background: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #e5e5e5',
                      textDecoration: 'none',
                      color: '#171717',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={r.image_url} alt={r.name} style={{ width: '100%', height: 'auto', marginBottom: 'var(--space-1)' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>{r.name.split(',')[0]}</p>
                    <p style={{ fontSize: '11px', color: '#737373', fontFamily: 'monospace' }}>{r.no}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bricklink attribution */}
      <div style={{
        marginTop: 'var(--space-6)',
        padding: 'var(--space-3)',
        textAlign: 'center',
        fontSize: '12px',
        color: '#737373'
      }}>
        The term 'BrickLink' is a trademark of the LEGO Group BrickLink. This application uses the BrickLink API but is not endorsed or certified by LEGO BrickLink, Inc.
      </div>
    </div>
  );
}
