'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AddToCollectionForm from '@/components/search/AddToCollectionForm';
import PriceDisplay from '@/components/search/PriceDisplay';
import Lightbox from '@/components/search/Lightbox';

interface MinifigPageProps {
  params: Promise<{
    itemNo: string;
  }>;
}

export default function MinifigPage({ params }: MinifigPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [itemNo, setItemNo] = useState<string>('');
  const [minifig, setMinifig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);
  const [pricing, setPricing] = useState<{ suggestedPrice: number; loading: boolean }>({
    suggestedPrice: 0,
    loading: true
  });
  const [characterVariants, setCharacterVariants] = useState<any[]>([]);
  const [themeMinifigs, setThemeMinifigs] = useState<any[]>([]);

  // Unwrap params
  useEffect(() => {
    params.then(p => setItemNo(p.itemNo));
  }, [params]);

  useEffect(() => {
    if (!itemNo) return;

    const fetchMinifig = async () => {
      try {
        const response = await fetch(`/api/minifigs/search?q=${itemNo}`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          setMinifig(data.data[0]);
        } else {
          setError('Minifigure not found');
        }
      } catch (err) {
        setError('Failed to load minifigure');
      } finally {
        setLoading(false);
      }
    };

    fetchMinifig();
  }, [itemNo]);

  // Fetch pricing (always 'new' condition)
  useEffect(() => {
    if (!itemNo) return;

    const fetchPricing = async () => {
      try {
        const response = await fetch(
          `/api/collection/temp-pricing?itemNo=${itemNo}`
        );
        const data = await response.json();

        if (data.success && data.pricing) {
          setPricing({
            suggestedPrice: data.pricing.suggestedPrice,
            loading: false
          });
        } else {
          setPricing({ suggestedPrice: 0, loading: false });
        }
      } catch (err) {
        setPricing({ suggestedPrice: 0, loading: false });
      }
    };

    fetchPricing();
  }, [itemNo]);

  // Fetch related minifigures using dedicated API
  useEffect(() => {
    if (!itemNo) return;

    const fetchRelated = async () => {
      try {
        const response = await fetch(`/api/minifigs/related?itemNo=${itemNo}`);
        const data = await response.json();

        if (data.success) {
          setCharacterVariants(data.variants || []);
          setThemeMinifigs(data.themeMinifigs || []);
        }
      } catch (err) {
        console.error('Error fetching related minifigs:', err);
      }
    };

    fetchRelated();
  }, [itemNo]);

  const handleAddToCollection = async (quantity: number) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setAddLoading(true);
    setError('');

    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        router.push('/collection');
      } else {
        // Show specific error message from API
        if (response.status === 401) {
          setError('Please sign in to add items to your collection');
        } else if (response.status === 409) {
          setError('This minifigure is already in your collection');
        } else {
          setError(data.error || 'Failed to add to collection');
        }
      }
    } catch (err: any) {
      console.error('Add to collection error:', err);
      setError(err.message || 'Failed to add to collection. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const openLightbox = () => {
    if (minifig?.image_url) {
      setLightboxImage({ url: minifig.image_url, name: minifig.name });
    }
  };

  // Map category IDs to theme names
  const getThemeName = (categoryId: number): string => {
    const themes: Record<number, string> = {
      65: 'Star Wars',
      246: 'Harry Potter',
      360: 'Super Heroes',
      501: 'Collectible Minifigures',
      435: 'Ninjago',
      667: 'Disney',
      // Add more as needed
    };
    return themes[categoryId] || 'LEGO';
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fafafa', padding: '80px 16px 16px' }}>
        <div className="max-w-4xl mx-auto">
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            padding: '32px 16px'
          }}>
            <div style={{ textAlign: 'center', color: '#737373' }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !minifig) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fafafa', padding: '80px 16px 16px' }}>
        <div className="max-w-4xl mx-auto">
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            padding: '32px 16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                color: '#dc2626',
                marginBottom: '24px',
                fontSize: '16px'
              }}>
                {error || 'Minifigure not found'}
              </p>
              <button
                onClick={() => router.push('/search')}
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#525252',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
              >
                ← Back to Search
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen minifig-detail-page" style={{ backgroundColor: '#fafafa', overflowX: 'hidden', paddingBottom: '80px' }}>
      {/* Back Button - positioned just below navigation */}
      <div className="minifig-back-button-wrapper" style={{ padding: '0 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '16px' }}>
          <button
            onClick={() => router.back()}
            className="minifig-back-button"
            style={{
              color: '#3b82f6',
              height: '40px',
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Results
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="minifig-main-content-wrapper" style={{ padding: '0 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="minifig-card-wrapper" style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}>
          <div className="minifig-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
            {/* Image Section */}
            <div
              className="minifig-image-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                cursor: 'zoom-in',
                padding: '32px 16px 16px',
                minHeight: '300px'
              }}
              onClick={openLightbox}
            >
              {minifig.image_url ? (
                <img
                  src={minifig.image_url}
                  alt={minifig.name}
                  className="minifig-main-image"
                  style={{ maxHeight: '300px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div className="text-6xl">🧱</div>
              )}
            </div>

            {/* Details Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 16px 32px'
            }}>
              {/* Header */}
              <div style={{ marginBottom: '40px' }}>
                {/* Theme Badge */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#3b82f6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {getThemeName(minifig.category_id)}
                  </span>
                </div>

                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#171717',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                  marginBottom: '12px'
                }}>
                  {minifig.name}
                </h1>
                <p style={{
                  fontSize: '16px',
                  color: '#737373',
                  fontFamily: 'monospace',
                  marginBottom: '24px'
                }}>
                  {minifig.no}
                </p>

                <PriceDisplay
                  loading={pricing.loading}
                  price={pricing.suggestedPrice}
                />
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                background: '#e5e5e5',
                marginBottom: '32px'
              }}></div>

              {/* Add to Inventory Section */}
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '20px'
                }}>
                  Add to Inventory
                </h2>
                <AddToCollectionForm
                  onAdd={handleAddToCollection}
                  loading={addLoading}
                  session={session}
                />
              </div>

              {error && (
                <div style={{
                  marginTop: '32px',
                  padding: '16px 20px',
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#991b1b',
                  fontWeight: '500'
                }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Character Variants Section */}
        {characterVariants.length > 0 && (
          <div className="minifig-related-section" style={{ marginTop: '32px', padding: '0 16px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <h2 className="minifig-related-heading">
                Other Variants
              </h2>
              <p className="minifig-related-description">
                Different versions of this character
              </p>
              <div className="minifig-related-grid">
              {characterVariants.map((variant) => (
                <a
                  key={variant.no}
                  href={`/minifig/${variant.no}`}
                  style={{
                    display: 'block',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e5e5',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="minifig-variant-image">
                    {variant.image_url ? (
                      <img
                        src={variant.image_url}
                        alt={variant.name}
                      />
                    ) : (
                      <div style={{ fontSize: '48px' }}>🧱</div>
                    )}
                  </div>
                  <div style={{ padding: '8px 16px 16px' }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#171717',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.4'
                    }}>
                      {variant.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#737373',
                      fontFamily: 'monospace'
                    }}>
                      {variant.no}
                    </p>
                  </div>
                </a>
              ))}
              </div>
            </div>
          </div>
        )}

        {/* Theme/Set Related Minifigures Section */}
        {themeMinifigs.length > 0 && (
          <div className="minifig-related-section" style={{ marginTop: '32px', padding: '0 16px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <h2 className="minifig-related-heading">
                From Similar Sets
              </h2>
              <p className="minifig-related-description">
                Minifigures released around the same time
              </p>
              <div className="minifig-related-grid">
              {themeMinifigs.map((related) => (
                <a
                  key={related.no}
                  href={`/minifig/${related.no}`}
                  style={{
                    display: 'block',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e5e5',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="minifig-variant-image">
                    {related.image_url ? (
                      <img
                        src={related.image_url}
                        alt={related.name}
                      />
                    ) : (
                      <div style={{ fontSize: '48px' }}>🧱</div>
                    )}
                  </div>
                  <div style={{ padding: '8px 16px 16px' }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#171717',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.4'
                    }}>
                      {related.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#737373',
                      fontFamily: 'monospace'
                    }}>
                      {related.no}
                    </p>
                  </div>
                </a>
              ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox
          imageUrl={lightboxImage.url}
          imageName={lightboxImage.name}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
