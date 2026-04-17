'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AddToCollectionForm from '@/components/search/AddToCollectionForm';
import ListingGeneratorForm from '@/components/listing-generator-form';
import Breadcrumbs from '@/components/Breadcrumbs';
import SetAdCard from '@/components/SetAdCard';
import MoveDialog from '@/components/MoveDialog';
import { getSensitiveImageStyles } from '@/lib/minifig-filters';

// Lazy load PriceHistoryChart (only loads when in inventory)
const PriceHistoryChart = dynamic(() => import('@/components/PriceHistoryChart'), {
  loading: () => <div style={{ padding: '24px', textAlign: 'center', color: '#737373' }}>Loading chart...</div>,
  ssr: false
});

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
  variants: Array<{ no: string; name: string; image_url: string }>;
  similarSets: Array<{ no: string; name: string; image_url: string }>;
}

export default function MinifigDetailClient({ minifig, variants, similarSets }: MinifigDetailClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
  const [personalCollectionItem, setPersonalCollectionItem] = useState<any>(null);
  const [checkingCollection, setCheckingCollection] = useState(true);
  const [allInventoryItems, setAllInventoryItems] = useState<any[]>([]);
  const [allCollectionItems, setAllCollectionItems] = useState<any[]>([]);
  const [addPersonalLoading, setAddPersonalLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showMoveDialog, setShowMoveDialog] = useState(false);

  // Initialize condition from URL query parameter
  const [condition, setCondition] = useState<'new' | 'used'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const conditionParam = params.get('condition');
      return conditionParam === 'used' ? 'used' : 'new';
    }
    return 'new';
  });

  const [featuredSets, setFeaturedSets] = useState<any[]>([]);

  // Fetch pricing on client-side (user-driven, not pre-generated)
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`/api/inventory/temp-pricing?itemNo=${minifig.no}&condition=${condition}`);
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
  }, [minifig.no, condition]);

  // Fetch 3 random sets from this theme (last 2 years)
  useEffect(() => {
    const fetchFeaturedSets = async () => {
      try {
        // Extract main theme from category_name (e.g., "Star Wars" from "Star Wars / Episode 1")
        const mainTheme = minifig.category_name.split('/')[0].trim();
        const response = await fetch(`/api/sets/random?theme=${encodeURIComponent(mainTheme)}&count=3`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setFeaturedSets(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch featured sets:', err);
      }
    };

    fetchFeaturedSets();
  }, [minifig.category_name]);

  // Check if item is in inventory and personal collection (for selected condition)
  useEffect(() => {
    if (!session) {
      setCheckingCollection(false);
      return;
    }

    const checkCollections = async () => {
      try {
        // Check inventory
        const inventoryResponse = await fetch('/api/inventory');
        const inventoryData = await inventoryResponse.json();

        if (inventoryData.success && inventoryData.data) {
          // Store all items for this minifig (both conditions)
          const allItems = inventoryData.data.filter((item: any) =>
            item.minifigure_no === minifig.no
          );
          setAllInventoryItems(allItems);

          // Find current condition item
          const found = allItems.find((item: any) => item.condition === condition);
          setCollectionItem(found || null);
        }

        // Check personal collection
        const personalResponse = await fetch('/api/personal-collection');
        const personalData = await personalResponse.json();

        if (personalData.success && personalData.data) {
          // Store all items for this minifig (both conditions)
          const allItems = personalData.data.filter((item: any) =>
            item.minifigure_no === minifig.no
          );
          setAllCollectionItems(allItems);

          // Find current condition item
          const found = allItems.find((item: any) => item.condition === condition);
          setPersonalCollectionItem(found || null);
        }
      } catch (err) {
        console.error('Error checking collections:', err);
      } finally {
        setCheckingCollection(false);
      }
    };

    checkCollections();
  }, [minifig.no, condition, session]);

  const handleAddToCollection = async (quantity: number) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setAddLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minifigure_no: minifig.no,
          minifigure_name: minifig.name,
          quantity,
          condition: condition,
          image_url: minifig.image_url,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCollectionItem(data.data);
        setSuccessMessage(`Added ${quantity} ${condition} to Inventory!`);
        setQuantity(1);
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

  const handleAddToPersonalCollection = async (quantity: number) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setAddPersonalLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/personal-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minifigure_no: minifig.no,
          minifigure_name: minifig.name,
          quantity,
          condition: condition,
          image_url: minifig.image_url,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPersonalCollectionItem(data.data);
        setSuccessMessage(`Added ${quantity} ${condition} to Your Collection!`);
        setQuantity(1);
      } else {
        if (response.status === 401) {
          setError('Please sign in to add items');
        } else if (response.status === 409) {
          setError('Already in personal collection');
        } else {
          setError(data.error || 'Failed to add');
        }
      }
    } catch (err: any) {
      setError('Failed to add to personal collection');
    } finally {
      setAddPersonalLoading(false);
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

  // Display name as-is from BrickLink (no modifications)
  const getDisplayName = (fullName: string) => {
    const parts = fullName.split(',');

    if (parts.length > 1) {
      return {
        title: parts[0].trim(),
        subtitle: parts.slice(1).join(',').trim()
      };
    }

    return { title: fullName.trim() };
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
    <div className="min-h-screen minifig-detail-page" style={{ backgroundColor: '#fafafa', paddingBottom: '80px' }}>
      {/* Product Schema JSON-LD */}
      {productSchema && (
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      {/* Navigation */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '24px' }}>
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={(() => {
              const breadcrumbs: Array<{ label: string; href?: string }> = [
                { label: 'Home', href: '/' },
                { label: 'Themes', href: '/themes' },
              ];

              // Parse category_name (e.g., "Star Wars / Episode 1" or "Agents")
              const parts = minifig.category_name.split(' / ');
              const theme = parts[0];
              const subcategory = parts.length > 1 ? parts.slice(1).join(' / ') : null;

              // Add theme link
              breadcrumbs.push({
                label: theme,
                href: `/themes/${encodeURIComponent(theme)}`
              });

              // Add subcategory link if exists
              if (subcategory) {
                breadcrumbs.push({
                  label: subcategory,
                  href: `/themes/${encodeURIComponent(theme)}/${encodeURIComponent(subcategory)}`
                });
              }

              // Add current minifig (no link)
              breadcrumbs.push({ label: minifig.no });

              return breadcrumbs;
            })()}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="minifig-main-content-wrapper" style={{ padding: '0 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="minifig-card-wrapper">
            <div className="minifig-detail-grid">
              {/* Image Section */}
              <div
                className="minifig-image-container"
              >
                <div className="minifig-sticky-wrapper" style={{
                  width: '200px',
                  height: '250px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <Image
                    src={minifig.image_url}
                    alt={minifig.name}
                    className="minifig-main-image"
                    width={200}
                    height={250}
                    style={{
                      maxHeight: '250px',
                      maxWidth: '200px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      ...getSensitiveImageStyles(minifig.no, minifig.name)
                    }}
                    unoptimized
                    priority
                  />
                </div>
              </div>

              {/* Details Section */}
              <div className="minifig-details-section" style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px'
              }}>
                {/* Header */}
                <div style={{ marginBottom: '24px', marginTop: 0 }}>
                  {/* Year Badge */}
                  {minifig.year_released && (
                    <div style={{ marginBottom: '8px', marginTop: 0 }}>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: '500',
                        color: '#3b82f6',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {minifig.year_released}
                      </span>
                    </div>
                  )}

                  <h1 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.3',
                    marginBottom: '4px'
                  }}>
                    {displayName.title}
                  </h1>
                  {displayName.subtitle && (
                    <p style={{
                      fontSize: 'var(--text-xs)',
                      color: '#737373',
                      lineHeight: '1.4',
                      marginBottom: '8px'
                    }}>
                      {displayName.subtitle}
                    </p>
                  )}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: '#737373',
                      fontFamily: 'inherit',
                      margin: 0
                    }}>
                      {minifig.no}
                    </p>

                    {/* Show what user owns */}
                    {session && (allInventoryItems.length > 0 || allCollectionItems.length > 0) && (
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: '#737373',
                        display: 'flex',
                        gap: '8px'
                      }}>
                        {allInventoryItems.map((item: any) => (
                          <span key={item.id}>
                            Inventory: {item.quantity}x {item.condition === 'new' ? 'New' : 'Used'}
                          </span>
                        ))}
                        {allCollectionItems.map((item: any) => (
                          <span key={item.id}>
                            Collection: {item.quantity}x {item.condition === 'new' ? 'New' : 'Used'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Condition Toggle */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '16px',
                    padding: '4px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    width: 'fit-content'
                  }}>
                    <button
                      onClick={() => setCondition('new')}
                      style={{
                        padding: '8px 16px',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '600',
                        color: condition === 'new' ? '#ffffff' : '#525252',
                        background: condition === 'new' ? '#3b82f6' : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      New
                    </button>
                    <button
                      onClick={() => setCondition('used')}
                      style={{
                        padding: '8px 16px',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '600',
                        color: condition === 'used' ? '#ffffff' : '#525252',
                        background: condition === 'used' ? '#3b82f6' : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Used
                    </button>
                  </div>

                  {/* Pricing Row */}
                  {pricing.loading ? (
                    <div style={{
                      padding: '32px',
                      textAlign: 'center',
                      color: '#737373'
                    }}>
                      <div style={{
                        width: 'var(--icon-xl)',
                        height: 'var(--icon-xl)',
                        margin: '0 auto 12px',
                        border: '3px solid #e5e5e5',
                        borderTop: '3px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></div>
                      <p style={{ fontSize: 'var(--text-sm)' }}>Loading pricing...</p>
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
                          fontSize: 'clamp(9px, 2vw, 10px)',
                          fontWeight: '500',
                          color: '#737373',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          marginBottom: '6px',
                          lineHeight: '1.2'
                        }}>
                          Qty Avg
                        </p>
                        <p style={{
                          fontSize: 'clamp(16px, 3.5vw, 18px)',
                          fontWeight: '700',
                          color: '#171717',
                          letterSpacing: '-0.01em',
                          lineHeight: '1.2'
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
                          fontSize: 'clamp(9px, 2vw, 10px)',
                          fontWeight: '500',
                          color: '#737373',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          marginBottom: '6px',
                          lineHeight: '1.2'
                        }}>
                          Simple Avg
                        </p>
                        <p style={{
                          fontSize: 'clamp(16px, 3.5vw, 18px)',
                          fontWeight: '700',
                          color: '#171717',
                          letterSpacing: '-0.01em',
                          lineHeight: '1.2'
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
                          fontSize: 'clamp(9px, 2vw, 10px)',
                          fontWeight: '500',
                          color: '#737373',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          marginBottom: '6px',
                          lineHeight: '1.2'
                        }}>
                          Lowest
                        </p>
                        <p style={{
                          fontSize: 'clamp(16px, 3.5vw, 18px)',
                          fontWeight: '700',
                          color: '#171717',
                          letterSpacing: '-0.01em',
                          lineHeight: '1.2'
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
                          fontSize: 'clamp(9px, 2vw, 11px)',
                          fontWeight: '500',
                          color: '#3b82f6',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          marginBottom: '8px',
                          lineHeight: '1.2'
                        }}>
                          Suggested
                        </p>
                        <p style={{
                          fontSize: 'clamp(18px, 4vw, 20px)',
                          fontWeight: '700',
                          color: '#3b82f6',
                          letterSpacing: '-0.01em',
                          lineHeight: '1.2'
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
                      fontSize: 'var(--text-sm)'
                    }}>
                      No pricing data available
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: '#e5e5e5',
                  marginTop: '24px',
                  marginBottom: '16px'
                }}></div>

                {/* Inventory Section */}
                <div>
                  {checkingCollection ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#737373' }}>
                      Checking collections...
                    </div>
                  ) : (
                    <>
                      {/* Inventory Section */}
                      {collectionItem && (
                        <>
                          <h2 style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: '600',
                            color: '#171717',
                            marginBottom: '16px'
                          }}>
                            In Your Inventory
                          </h2>

                      <div className="inventory-actions-container">
                        {/* Quantity Stepper */}
                        <div className="quantity-stepper">
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
                              fontSize: 'var(--text-lg)',
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
                            flex: 1,
                            minWidth: '40px',
                            height: '44px',
                            fontSize: 'var(--text-base)',
                            fontWeight: '600',
                            color: '#171717',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            userSelect: 'none',
                            padding: '0 8px'
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
                              fontSize: 'var(--text-lg)',
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

                        {/* Move and Delete Buttons */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMoveDialog(true);
                          }}
                          style={{
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#737373',
                            background: '#ffffff',
                            border: '1px solid #e5e5e5',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.2s'
                          }}
                          title="Move to Your Collection"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#eff6ff';
                            e.currentTarget.style.color = '#3b82f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.color = '#737373';
                          }}
                        >
                          <svg width="var(--icon-sm)" height="var(--icon-sm)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this item from your inventory?')) {
                              handleRemoveFromCollection();
                            }
                          }}
                          className="inventory-delete-btn"
                        >
                          <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span className="inventory-delete-text">Remove from Inventory</span>
                        </button>
                      </div>
                        </>
                      )}

                      {/* Your Collection Section */}
                      {personalCollectionItem && (
                        <>
                          <h2 style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: '600',
                            color: '#171717',
                            marginTop: collectionItem ? '32px' : '0',
                            marginBottom: '16px'
                          }}>
                            In Your Your Collection
                          </h2>

                          <div className="inventory-actions-container">
                            {/* Quantity Stepper */}
                            <div className="quantity-stepper">
                              <button
                                type="button"
                                onClick={async () => {
                                  if (personalCollectionItem.quantity > 1) {
                                    try {
                                      const response = await fetch(`/api/personal-collection/${personalCollectionItem.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ quantity: personalCollectionItem.quantity - 1 })
                                      });
                                      if (response.ok) {
                                        const data = await response.json();
                                        setPersonalCollectionItem(data.data);
                                      }
                                    } catch (err) {
                                      setError('Failed to update quantity');
                                    }
                                  }
                                }}
                                disabled={personalCollectionItem.quantity <= 1}
                                style={{
                                  width: '44px',
                                  minWidth: '44px',
                                  height: '44px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: personalCollectionItem.quantity > 1 ? '#ffffff' : '#f5f5f5',
                                  border: 'none',
                                  borderRight: '1px solid #e5e5e5',
                                  cursor: personalCollectionItem.quantity > 1 ? 'pointer' : 'not-allowed',
                                  color: personalCollectionItem.quantity > 1 ? '#171717' : '#a3a3a3',
                                  transition: 'all 0.2s',
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: '600',
                                  padding: 0,
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                  if (personalCollectionItem.quantity > 1) e.currentTarget.style.background = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                  if (personalCollectionItem.quantity > 1) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                −
                              </button>

                              <div style={{
                                flex: 1,
                                minWidth: '40px',
                                height: '44px',
                                fontSize: 'var(--text-base)',
                                fontWeight: '600',
                                color: '#171717',
                                background: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                userSelect: 'none',
                                padding: '0 8px'
                              }}>
                                {personalCollectionItem.quantity}
                              </div>

                              <button
                                type="button"
                                onClick={async () => {
                                  if (personalCollectionItem.quantity < 9999) {
                                    try {
                                      const response = await fetch(`/api/personal-collection/${personalCollectionItem.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ quantity: personalCollectionItem.quantity + 1 })
                                      });
                                      if (response.ok) {
                                        const data = await response.json();
                                        setPersonalCollectionItem(data.data);
                                        setSuccessMessage('Added 1 more!');
                                      }
                                    } catch (err) {
                                      setError('Failed to update quantity');
                                    }
                                  }
                                }}
                                disabled={personalCollectionItem.quantity >= 9999}
                                style={{
                                  width: '44px',
                                  minWidth: '44px',
                                  height: '44px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: personalCollectionItem.quantity < 9999 ? '#ffffff' : '#f5f5f5',
                                  border: 'none',
                                  borderLeft: '1px solid #e5e5e5',
                                  cursor: personalCollectionItem.quantity < 9999 ? 'pointer' : 'not-allowed',
                                  color: personalCollectionItem.quantity < 9999 ? '#171717' : '#a3a3a3',
                                  transition: 'all 0.2s',
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: '600',
                                  padding: 0,
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                  if (personalCollectionItem.quantity < 9999) e.currentTarget.style.background = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                  if (personalCollectionItem.quantity < 9999) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                +
                              </button>
                            </div>

                            {/* Move and Delete Buttons */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const moveQty = prompt(`How many to move to Inventory? (Max: ${personalCollectionItem.quantity})`, '1');
                                if (moveQty) {
                                  const qty = parseInt(moveQty);
                                  if (qty > 0 && qty <= personalCollectionItem.quantity) {
                                    try {
                                      const response = await fetch(`/api/personal-collection/${personalCollectionItem.id}/move-to-inventory`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ quantity: qty })
                                      });
                                      if (response.ok) {
                                        // Refresh both collections
                                        const [invRes, colRes] = await Promise.all([
                                          fetch('/api/inventory'),
                                          fetch('/api/personal-collection')
                                        ]);
                                        const invData = await invRes.json();
                                        const colData = await colRes.json();

                                        const updatedInv = invData.data?.find((item: any) => item.minifigure_no === minifig.no);
                                        const updatedCol = colData.data?.find((item: any) => item.minifigure_no === minifig.no);

                                        setCollectionItem(updatedInv || null);
                                        setPersonalCollectionItem(updatedCol || null);
                                        setSuccessMessage(`Moved ${qty} to Inventory!`);
                                      }
                                    } catch (err) {
                                      setError('Failed to move item');
                                    }
                                  }
                                }
                              }}
                              style={{
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#737373',
                                background: '#ffffff',
                                border: '1px solid #e5e5e5',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.2s'
                              }}
                              title="Move to Inventory"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f0fdf4';
                                e.currentTarget.style.color = '#22c55e';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.color = '#737373';
                              }}
                            >
                              <svg width="var(--icon-sm)" height="var(--icon-sm)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm('Delete this item from your personal collection?')) {
                                  try {
                                    const response = await fetch(`/api/personal-collection/${personalCollectionItem.id}`, {
                                      method: 'DELETE'
                                    });
                                    if (response.ok) {
                                      setPersonalCollectionItem(null);
                                      setSuccessMessage('Removed from personal collection');
                                    }
                                  } catch (err) {
                                    setError('Failed to delete item');
                                  }
                                }
                              }}
                              className="inventory-delete-btn"
                            >
                              <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              <span className="inventory-delete-text">Remove from Your Collection</span>
                            </button>
                          </div>
                        </>
                      )}

                      {/* Add Buttons Section - Show if either is not in collections */}
                      {(!collectionItem || !personalCollectionItem) && (
                        <>
                          {/* Show quantity selector only when NEITHER collection has the item */}
                          {!collectionItem && !personalCollectionItem ? (
                            <>
                              <h2 style={{
                                fontSize: 'var(--text-base)',
                                fontWeight: '600',
                                color: '#171717',
                                marginBottom: '16px'
                              }}>
                                Add to Collection
                              </h2>

                              {/* Quantity Selector */}
                              <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                  display: 'block',
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: '500',
                                  color: '#525252',
                                  marginBottom: '8px'
                                }}>
                                  Quantity
                                </label>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  border: '1px solid #e5e5e5',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  width: 'fit-content'
                                }}>
                                  <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    style={{
                                      width: '44px',
                                      height: '44px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: quantity > 1 ? '#ffffff' : '#f5f5f5',
                                      border: 'none',
                                      borderRight: '1px solid #e5e5e5',
                                      cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                                      color: quantity > 1 ? '#171717' : '#a3a3a3',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: '600'
                                    }}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={quantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      if (!isNaN(val) && val >= 1 && val <= 9999) {
                                        setQuantity(val);
                                      } else if (e.target.value === '') {
                                        setQuantity(1);
                                      }
                                    }}
                                    style={{
                                      width: '60px',
                                      height: '44px',
                                      fontSize: 'var(--text-base)',
                                      fontWeight: '600',
                                      color: '#171717',
                                      background: '#ffffff',
                                      border: 'none',
                                      textAlign: 'center',
                                      outline: 'none'
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setQuantity(Math.min(9999, quantity + 1))}
                                    disabled={quantity >= 9999}
                                    style={{
                                      width: '44px',
                                      height: '44px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: quantity < 9999 ? '#ffffff' : '#f5f5f5',
                                      border: 'none',
                                      borderLeft: '1px solid #e5e5e5',
                                      cursor: quantity < 9999 ? 'pointer' : 'not-allowed',
                                      color: quantity < 9999 ? '#171717' : '#a3a3a3',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: '600'
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Two buttons side by side */}
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px'
                              }}>
                                <button
                                  onClick={() => handleAddToCollection(quantity)}
                                  disabled={addLoading}
                                  style={{
                                    padding: '14px 20px',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    background: addLoading ? '#a3a3a3' : '#3b82f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: addLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!addLoading) e.currentTarget.style.background = '#2563eb';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!addLoading) e.currentTarget.style.background = '#3b82f6';
                                  }}
                                >
                                  {addLoading ? 'Adding...' : '+ Inventory'}
                                </button>
                                <button
                                  onClick={() => handleAddToPersonalCollection(quantity)}
                                  disabled={addPersonalLoading}
                                  style={{
                                    padding: '14px 20px',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    background: addPersonalLoading ? '#a3a3a3' : '#3b82f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: addPersonalLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!addPersonalLoading) e.currentTarget.style.background = '#2563eb';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!addPersonalLoading) e.currentTarget.style.background = '#3b82f6';
                                  }}
                                >
                                  {addPersonalLoading ? 'Adding...' : '+ Collection'}
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Single button, no quantity selector - just add 1 */}
                              {!collectionItem && (
                                <button
                                  onClick={() => handleAddToCollection(1)}
                                  disabled={addLoading}
                                  style={{
                                    width: '100%',
                                    padding: '16px 32px',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    background: addLoading ? '#a3a3a3' : '#3b82f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: addLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    marginTop: '24px'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!addLoading) e.currentTarget.style.background = '#2563eb';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!addLoading) e.currentTarget.style.background = '#3b82f6';
                                  }}
                                >
                                  {addLoading ? 'Adding...' : '+ Add to Inventory'}
                                </button>
                              )}
                              {!personalCollectionItem && (
                                <button
                                  onClick={() => handleAddToPersonalCollection(1)}
                                  disabled={addPersonalLoading}
                                  style={{
                                    width: '100%',
                                    padding: '16px 32px',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    background: addPersonalLoading ? '#a3a3a3' : '#3b82f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: addPersonalLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    marginTop: '24px'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!addPersonalLoading) e.currentTarget.style.background = '#2563eb';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!addPersonalLoading) e.currentTarget.style.background = '#3b82f6';
                                  }}
                                >
                                  {addPersonalLoading ? 'Adding...' : '+ Add to Your Collection'}
                                </button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Listing Generator */}
                {collectionItem && (
                  <ListingGeneratorForm
                    item={collectionItem}
                    onSuccess={(listing) => {
                      alert('Listing saved!');
                    }}
                  />
                )}

                {successMessage && (
                  <div style={{
                    marginTop: '24px',
                    padding: '16px 20px',
                    background: '#d1fae5',
                    border: '1px solid #6ee7b7',
                    borderRadius: '8px',
                    fontSize: 'var(--text-sm)',
                    color: '#065f46',
                    fontWeight: '500'
                  }}>
                    ✓ {successMessage}
                  </div>
                )}

                {error && (
                  <div style={{
                    marginTop: '24px',
                    padding: '16px 20px',
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    fontSize: 'var(--text-sm)',
                    color: '#991b1b',
                    fontWeight: '500'
                  }}>
                    {error}
                  </div>
                )}

                {/* View on Bricklink Button */}
                <a
                  href={`https://www.bricklink.com/catalogPG.asp?M=${minifig.no}&ColorID=0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '16px',
                    padding: '14px 20px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    color: '#525252',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.borderColor = '#d4d4d4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e5e5';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  View on Bricklink
                </a>
              </div>
            </div>
          </div>

          {/* Price History Section */}
          {collectionItem && (
            <div style={{ marginTop: '32px' }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e5e5',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <PriceHistoryChart minifigure_no={minifig.no} condition="new" />
              </div>
            </div>
          )}

          {/* From Similar Sets Section */}
          {similarSets.length > 0 && (
            <div className="minifig-related-section" style={{ marginTop: '32px' }}>
              <h2 className="minifig-related-heading">
                From Similar Sets
              </h2>
              <p className="minifig-related-description">
                Minifigures released around the same time
              </p>
                <div className="minifig-related-grid">
                  {similarSets.map((related) => (
                    <a
                      key={related.no}
                      href={`/minifigs/${related.no}`}
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
                        <Image
                          src={related.image_url}
                          alt={related.name}
                          width={120}
                          height={150}
                          style={{
                            objectFit: 'contain',
                            ...getSensitiveImageStyles(related.no, related.name)
                          }}
                          unoptimized
                        />
                      </div>
                      <div style={{ padding: '8px 16px 16px' }}>
                        <p style={{
                          fontSize: 'var(--text-sm)',
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
                          fontSize: 'var(--text-xs)',
                          color: '#737373',
                          fontFamily: 'inherit'
                        }}>
                          {related.no}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
            </div>
          )}

          {/* Character Variants Section */}
          {variants.length > 0 && (
            <div className="minifig-related-section" style={{ marginTop: '32px' }}>
              <h2 className="minifig-related-heading">
                Other Variants
              </h2>
              <p className="minifig-related-description">
                Different versions of this character
              </p>
                <div className="minifig-related-grid">
                  {variants.map((variant) => (
                    <a
                      key={variant.no}
                      href={`/minifigs/${variant.no}`}
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
                        <Image
                          src={variant.image_url}
                          alt={variant.name}
                          width={120}
                          height={150}
                          style={{
                            objectFit: 'contain',
                            ...getSensitiveImageStyles(variant.no, variant.name)
                          }}
                          unoptimized
                        />
                      </div>
                      <div style={{ padding: '8px 16px 16px' }}>
                        <p style={{
                          fontSize: 'var(--text-sm)',
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
                          fontSize: 'var(--text-xs)',
                          color: '#737373',
                          fontFamily: 'inherit'
                        }}>
                          {variant.no}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
            </div>
          )}

          {/* Featured Sets Section - Bottom of Page */}
          {featuredSets.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '12px',
                letterSpacing: '-0.02em'
              }}>
                Featured {minifig.category_name.split('/')[0].trim()} Sets
              </h2>
              <p style={{
                fontSize: 'var(--text-base)',
                color: '#737373',
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                Current LEGO sets from this theme
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {featuredSets.map((set: any) => (
                  <SetAdCard
                    key={set.setNumber}
                    setNumber={set.setNumber}
                    setName={set.name}
                    imageUrl={set.imageUrl}
                    year={set.year}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Move Dialog */}
      {showMoveDialog && collectionItem && (
        <MoveDialog
          isOpen={true}
          onClose={() => setShowMoveDialog(false)}
          itemName={minifig.name}
          maxQuantity={collectionItem.quantity}
          direction="to-collection"
          onConfirm={async (quantity) => {
            try {
              const response = await fetch(`/api/inventory/${collectionItem.id}/move-to-collection`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
              });
              if (response.ok) {
                // Refresh both collections
                const [invRes, colRes] = await Promise.all([
                  fetch('/api/inventory'),
                  fetch('/api/personal-collection')
                ]);
                const invData = await invRes.json();
                const colData = await colRes.json();

                const updatedInv = invData.data?.find((item: any) => item.minifigure_no === minifig.no);
                const updatedCol = colData.data?.find((item: any) => item.minifigure_no === minifig.no);

                setCollectionItem(updatedInv || null);
                setPersonalCollectionItem(updatedCol || null);
                setSuccessMessage(`Moved ${quantity} to Your Collection!`);
              }
            } catch (err) {
              setError('Failed to move item');
            }
            setShowMoveDialog(false);
          }}
        />
      )}
    </div>
  );
}
