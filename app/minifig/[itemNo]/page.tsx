'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AddToCollectionForm from '@/components/search/AddToCollectionForm';

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
  const [characterVariants, setCharacterVariants] = useState<any[]>([]);
  const [themeMinifigs, setThemeMinifigs] = useState<any[]>([]);
  const [collectionItem, setCollectionItem] = useState<any>(null);
  const [checkingCollection, setCheckingCollection] = useState(true);

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
          `/api/inventory/temp-pricing?itemNo=${itemNo}`
        );
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
          setPricing({
            sixMonthAverage: 0,
            currentAverage: 0,
            currentLowest: 0,
            suggestedPrice: 0,
            loading: false
          });
        }
      } catch (err) {
        setPricing({
          sixMonthAverage: 0,
          currentAverage: 0,
          currentLowest: 0,
          suggestedPrice: 0,
          loading: false
        });
      }
    };

    fetchPricing();
  }, [itemNo]);

  // Check if item is in collection
  useEffect(() => {
    if (!itemNo || !session) {
      setCheckingCollection(false);
      return;
    }

    const checkCollection = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();

        if (data.success && data.data) {
          const found = data.data.find((item: any) => item.minifigure_no === itemNo);
          setCollectionItem(found || null);
        }
      } catch (err) {
        console.error('Error checking collection:', err);
      } finally {
        setCheckingCollection(false);
      }
    };

    checkCollection();
  }, [itemNo, session]);

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
      const response = await fetch('/api/inventory', {
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
        setCollectionItem(data.data);
        setError('');
      } else {
        // Show specific error message from API
        if (response.status === 401) {
          setError('Please sign in to add items to your inventory');
        } else if (response.status === 409) {
          setError('This minifigure is already in your inventory');
        } else {
          setError(data.error || 'Failed to add to inventory');
        }
      }
    } catch (err: any) {
      console.error('Add to inventory error:', err);
      setError(err.message || 'Failed to add to inventory. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!collectionItem || !session) return;

    try {
      const response = await fetch(`/api/inventory/${collectionItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
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

    if (!confirm('Remove this minifigure from your inventory?')) return;

    try {
      const response = await fetch(`/api/inventory/${collectionItem.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCollectionItem(null);
      }
    } catch (err) {
      console.error('Error removing from inventory:', err);
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

  // Clean up minifig name for display
  const getDisplayName = (fullName: string): { title: string; subtitle?: string } => {
    // Decode HTML entities
    const decodeHTML = (html: string) => {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    };

    let cleaned = decodeHTML(fullName);

    // Remove theme prefix (e.g., "Star Wars - " or "Dragon Knights - ")
    cleaned = cleaned.replace(/^[^-]+-\s*/, '');

    // Split at first comma to separate main name from details
    const parts = cleaned.split(',');

    if (parts.length > 1) {
      return {
        title: parts[0].trim(),
        subtitle: parts.slice(1).join(',').trim()
      };
    }

    // If no comma, check for parentheses
    const parenMatch = cleaned.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (parenMatch) {
      return {
        title: parenMatch[1].trim(),
        subtitle: parenMatch[2].trim()
      };
    }

    return { title: cleaned.trim() };
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
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="minifig-main-content-wrapper" style={{ padding: '0 16px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
                padding: '16px',
                minHeight: 'auto',
                borderRight: 'none'
              }}
            >
              {minifig.image_url ? (
                <img
                  src={minifig.image_url}
                  alt={minifig.name}
                  className="minifig-main-image"
                  style={{ maxHeight: '200px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div className="text-6xl">🧱</div>
              )}
            </div>

            {/* Details Section */}
            <div className="minifig-details-section" style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 16px 24px'
            }}>
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                {/* Theme Badge */}
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#3b82f6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {getThemeName(minifig.category_id)}
                  </span>
                </div>

                <h1 style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  color: '#171717',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.3',
                  marginBottom: '4px'
                }}>
                  {getDisplayName(minifig.name).title}
                </h1>
                {getDisplayName(minifig.name).subtitle && (
                  <p style={{
                    fontSize: '13px',
                    color: '#737373',
                    lineHeight: '1.4',
                    marginBottom: '8px'
                  }}>
                    {getDisplayName(minifig.name).subtitle}
                  </p>
                )}
                <p style={{
                  fontSize: '14px',
                  color: '#737373',
                  fontFamily: 'monospace',
                  marginBottom: '16px'
                }}>
                  {minifig.no}
                </p>

                {/* Pricing Row */}
                {pricing.loading ? (
                  <div style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: '#737373'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      margin: '0 auto 12px',
                      border: '3px solid #e5e5e5',
                      borderTop: '3px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}></div>
                    <p style={{ fontSize: '14px' }}>Loading pricing...</p>
                  </div>
                ) : pricing.suggestedPrice > 0 ? (
                  <div className="minifig-pricing-row" style={{
                    display: 'flex',
                    width: '100%',
                    marginBottom: '0px',
                    alignItems: 'stretch'
                  }}>
                    {/* Qty Weighted Average */}
                    <div className="pricing-item pricing-item-1" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start'
                    }}>
                      <p style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        color: '#737373',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        marginBottom: '6px',
                        height: '14px',
                        lineHeight: '14px',
                        whiteSpace: 'nowrap'
                      }}>
                        Qty Avg
                      </p>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#171717',
                        letterSpacing: '-0.01em',
                        lineHeight: '1'
                      }}>
                        ${pricing.sixMonthAverage.toFixed(2)}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="pricing-divider" style={{
                      width: '1px',
                      background: '#e5e5e5'
                    }}></div>

                    {/* Simple Average */}
                    <div className="pricing-item pricing-item-2" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start'
                    }}>
                      <p style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        color: '#737373',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        marginBottom: '6px',
                        height: '14px',
                        lineHeight: '14px',
                        whiteSpace: 'nowrap'
                      }}>
                        Simple Avg
                      </p>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#171717',
                        letterSpacing: '-0.01em',
                        lineHeight: '1'
                      }}>
                        ${pricing.currentAverage.toFixed(2)}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="pricing-divider" style={{
                      width: '1px',
                      background: '#e5e5e5'
                    }}></div>

                    {/* Lowest Listing */}
                    <div className="pricing-item pricing-item-3" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start'
                    }}>
                      <p style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        color: '#737373',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        marginBottom: '6px',
                        height: '14px',
                        lineHeight: '14px',
                        whiteSpace: 'nowrap'
                      }}>
                        Lowest
                      </p>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#171717',
                        letterSpacing: '-0.01em',
                        lineHeight: '1'
                      }}>
                        ${pricing.currentLowest.toFixed(2)}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="pricing-divider" style={{
                      width: '1px',
                      background: '#e5e5e5'
                    }}></div>

                    {/* Suggested Price */}
                    <div className="pricing-item pricing-item-4 pricing-suggested" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start'
                    }}>
                      <p style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        color: '#3b82f6',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        marginBottom: '8px',
                        height: '15px',
                        lineHeight: '15px',
                        whiteSpace: 'nowrap'
                      }}>
                        Suggested
                      </p>
                      <p style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#3b82f6',
                        letterSpacing: '-0.01em',
                        lineHeight: '1'
                      }}>
                        ${pricing.suggestedPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '24px',
                    textAlign: 'center',
                    background: '#fafafa',
                    borderRadius: '8px',
                    color: '#737373',
                    fontSize: '14px'
                  }}>
                    No pricing data available
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                background: '#e5e5e5',
                marginTop: '16px',
                marginBottom: '16px'
              }}></div>

              {/* Inventory Section */}
              <div>
                {checkingCollection ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#737373' }}>
                    Checking inventory...
                  </div>
                ) : collectionItem ? (
                  <>
                    <h2 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#171717',
                      marginBottom: '16px'
                    }}>
                      In Your Inventory
                    </h2>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      {/* Quantity Stepper */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#ffffff'
                      }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (collectionItem.quantity > 1) {
                              handleUpdateQuantity(collectionItem.quantity - 1);
                            }
                          }}
                          disabled={collectionItem.quantity <= 1}
                          style={{
                            width: '44px',
                            minWidth: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: collectionItem.quantity > 1 ? '#ffffff' : '#f5f5f5',
                            border: 'none',
                            borderRight: '1px solid #e5e5e5',
                            cursor: collectionItem.quantity > 1 ? 'pointer' : 'not-allowed',
                            color: collectionItem.quantity > 1 ? '#171717' : '#a3a3a3',
                            transition: 'all 0.2s',
                            fontSize: '20px',
                            fontWeight: '600',
                            padding: 0,
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            if (collectionItem.quantity > 1) e.currentTarget.style.background = '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            if (collectionItem.quantity > 1) e.currentTarget.style.background = '#ffffff';
                          }}
                        >
                          −
                        </button>

                        <div style={{
                          minWidth: '60px',
                          height: '44px',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#171717',
                          background: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          userSelect: 'none',
                          padding: '0 16px'
                        }}>
                          {collectionItem.quantity}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (collectionItem.quantity < 9999) {
                              handleUpdateQuantity(collectionItem.quantity + 1);
                            }
                          }}
                          disabled={collectionItem.quantity >= 9999}
                          style={{
                            width: '44px',
                            minWidth: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: collectionItem.quantity < 9999 ? '#ffffff' : '#f5f5f5',
                            border: 'none',
                            borderLeft: '1px solid #e5e5e5',
                            cursor: collectionItem.quantity < 9999 ? 'pointer' : 'not-allowed',
                            color: collectionItem.quantity < 9999 ? '#171717' : '#a3a3a3',
                            transition: 'all 0.2s',
                            fontSize: '20px',
                            fontWeight: '600',
                            padding: 0,
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            if (collectionItem.quantity < 9999) e.currentTarget.style.background = '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            if (collectionItem.quantity < 9999) e.currentTarget.style.background = '#ffffff';
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this item from your inventory?')) {
                            handleRemoveFromCollection();
                          }
                        }}
                        style={{
                          width: '44px',
                          minWidth: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#737373',
                          background: '#ffffff',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.2s',
                          padding: 0,
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                          e.currentTarget.style.color = '#dc2626';
                          e.currentTarget.style.borderColor = '#fca5a5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.color = '#737373';
                          e.currentTarget.style.borderColor = '#e5e5e5';
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#171717',
                      marginBottom: '16px'
                    }}>
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
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
    </div>
  );
}
