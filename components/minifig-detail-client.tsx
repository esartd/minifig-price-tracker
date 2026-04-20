'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AddToCollectionForm from '@/components/search/AddToCollectionForm';
import ListingGeneratorForm from '@/components/listing-generator-form';
import Breadcrumbs from '@/components/Breadcrumbs';
import SetAdCard from '@/components/SetAdCard';
import MoveDialog from '@/components/MoveDialog';
import { getSensitiveImageStyles } from '@/lib/minifig-filters';
import { formatPrice } from '@/lib/format-price';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

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
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pricing, setPricing] = useState<{
    sixMonthAverage: number;
    currentAverage: number;
    currentLowest: number;
    suggestedPrice: number;
    currencyCode?: string;
    loading: boolean;
  }>({
    sixMonthAverage: 0,
    currentAverage: 0,
    currentLowest: 0,
    suggestedPrice: 0,
    currencyCode: 'USD',
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
  const [showMoveToInventoryDialog, setShowMoveToInventoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'inventory' | 'collection' | null>(null);
  const [moveSuccess, setMoveSuccess] = useState(false);
  const [lastMovedItem, setLastMovedItem] = useState<{ id: string; direction: 'to-collection' | 'to-inventory' } | null>(null);

  // Independent quantity controls for "Add to Collection/Inventory" sections
  const [addToCollectionQty, setAddToCollectionQty] = useState(1);
  const [addToCollectionLoading, setAddToCollectionLoading] = useState(false);
  const [addToInventoryQty, setAddToInventoryQty] = useState(1);
  const [addToInventoryLoading, setAddToInventoryLoading] = useState(false);

  // Initialize condition from URL query parameter
  const [condition, setCondition] = useState<'new' | 'used'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const conditionParam = params.get('condition');
      return conditionParam === 'used' ? 'used' : 'new';
    }
    return 'new';
  });

  // Wishlist state
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Dismiss notification on click
  useEffect(() => {
    if (!moveSuccess) return;

    const handleClick = () => {
      setMoveSuccess(false);
      setLastMovedItem(null);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [moveSuccess]);

  // Update condition when URL changes (e.g., when navigating from collection)
  useEffect(() => {
    const conditionParam = searchParams.get('condition');
    const newCondition = conditionParam === 'used' ? 'used' : 'new';
    setCondition(newCondition);
  }, [searchParams]); // Only depend on searchParams, not condition (avoids loop)

  const [featuredSets, setFeaturedSets] = useState<any[]>([]);

  // Fetch pricing on client-side (user-driven, not pre-generated)
  useEffect(() => {
    // Skip pricing fetch on localhost
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      setPricing({ ...pricing, loading: false });
      return;
    }

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
            currencyCode: data.pricing.currencyCode || 'USD',
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

  // Update URL when condition changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('condition', condition);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [condition, router, searchParams]);

  // Clear success message when condition changes
  useEffect(() => {
    setSuccessMessage('');
    setError('');
  }, [condition]);

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

  // Function to refresh collections data - useCallback to prevent infinite loops
  const refreshCollections = useCallback(async () => {
    if (!session) return;

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
    }
  }, [session, minifig.no, condition]);

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

  // Check if item is in wishlist
  useEffect(() => {
    if (!session) return;

    const checkWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist');
        const data = await response.json();

        if (data.success) {
          const found = data.data.some((item: any) => item.minifigure_no === minifig.no);
          setIsInWishlist(found);
        }
      } catch (err) {
        console.error('Error checking wishlist:', err);
      }
    };

    checkWishlist();
  }, [minifig.no, session]);

  const handleToggleWishlist = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist');
        const data = await response.json();

        if (data.success) {
          const item = data.data.find((item: any) => item.minifigure_no === minifig.no);
          if (item) {
            const deleteResponse = await fetch(`/api/wishlist/${item.id}`, { method: 'DELETE' });
            if (deleteResponse.ok) {
              setIsInWishlist(false);
            }
          }
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            minifigure_no: minifig.no,
            minifigure_name: minifig.name,
            image_url: minifig.image_url
          })
        });

        const data = await response.json();

        if (response.ok) {
          setIsInWishlist(true);
          // Trigger header dropdown to open and highlight wishlist
          window.dispatchEvent(new Event('wishlistAdded'));
        } else {
          console.error('Failed to add to wishlist:', data.error);
          setError(data.error || 'Failed to add to wishlist');
          setTimeout(() => setError(''), 3000);
        }
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      setError('Failed to update wishlist');
      setTimeout(() => setError(''), 3000);
    } finally {
      setWishlistLoading(false);
    }
  };

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
        await refreshCollections();
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
        await refreshCollections();
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

    setSuccessMessage('');
    setError('');

    // Optimistic update - update UI immediately
    setCollectionItem({ ...collectionItem, quantity: newQuantity });

    // Also update the allInventoryItems array for the header indicator
    setAllInventoryItems(prev =>
      prev.map(item =>
        item.id === collectionItem.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // API call in background
    try {
      const response = await fetch(`/api/inventory/${collectionItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      if (!data.success) {
        // Revert on failure
        await refreshCollections();
        setError('Failed to update quantity');
      }
    } catch (err) {
      // Revert on error
      await refreshCollections();
      setError('Failed to update quantity');
    }
  };

  const handleUpdatePersonalQuantity = async (newQuantity: number) => {
    if (!personalCollectionItem || !session) return;

    setSuccessMessage('');
    setError('');

    // Optimistic update - update UI immediately
    setPersonalCollectionItem({ ...personalCollectionItem, quantity: newQuantity });

    // Also update the allCollectionItems array for the header indicator
    setAllCollectionItems(prev =>
      prev.map(item =>
        item.id === personalCollectionItem.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // API call in background
    try {
      const response = await fetch(`/api/personal-collection/${personalCollectionItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      if (!data.success) {
        // Revert on failure
        await refreshCollections();
        setError('Failed to update quantity');
      }
    } catch (err) {
      // Revert on error
      await refreshCollections();
      setError('Failed to update quantity');
    }
  };

  const handleRemoveFromCollection = async () => {
    if (!collectionItem || !session) return;

    setSuccessMessage('');
    setError('');

    try {
      const response = await fetch(`/api/inventory/${collectionItem.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await refreshCollections();
      }
    } catch (err) {
      console.error('Error removing:', err);
    }
  };

  // Handlers for standalone "Add to Collection/Inventory" sections
  const handleAddToCollectionFromSection = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setAddToCollectionLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/personal-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minifigure_no: minifig.no,
          minifigure_name: minifig.name,
          quantity: addToCollectionQty,
          condition: condition,
          image_url: minifig.image_url,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await refreshCollections();
        setSuccessMessage(`Added ${addToCollectionQty} ${condition} to Your Collection!`);
        setAddToCollectionQty(1); // Reset
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
      setAddToCollectionLoading(false);
    }
  };

  const handleAddToInventoryFromSection = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setAddToInventoryLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minifigure_no: minifig.no,
          minifigure_name: minifig.name,
          quantity: addToInventoryQty,
          condition: condition,
          image_url: minifig.image_url,
          sixMonthAverage: pricing.sixMonthAverage,
          currentAverage: pricing.currentAverage,
          currentLowest: pricing.currentLowest,
          suggestedPrice: pricing.suggestedPrice,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await refreshCollections();
        setSuccessMessage(`Added ${addToInventoryQty} ${condition} to Your Inventory!`);
        setAddToInventoryQty(1); // Reset
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
      setAddToInventoryLoading(false);
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
                  {/* Year Badge and Heart Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '8px',
                    marginTop: 0
                  }}>
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: '500',
                      color: '#3b82f6',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      flex: '0 1 auto',
                      minWidth: 0
                    }}>
                      {minifig.year_released && minifig.year_released !== '?' ? minifig.year_released : 'Year Unknown'}
                    </span>
                    <button
                      onClick={handleToggleWishlist}
                      disabled={wishlistLoading}
                      style={{
                        width: '32px',
                        height: '32px',
                        minWidth: '32px',
                        minHeight: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isInWishlist ? '#f5f5f5' : '#ffffff',
                        border: `2px solid ${isInWishlist ? '#171717' : '#e5e5e5'}`,
                        borderRadius: '50%',
                        cursor: wishlistLoading ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                        opacity: wishlistLoading ? 0.6 : 1,
                        padding: 0
                      }}
                      onMouseEnter={(e) => {
                        if (!wishlistLoading) {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.borderColor = '#171717';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        if (!isInWishlist) {
                          e.currentTarget.style.borderColor = '#e5e5e5';
                        }
                      }}
                    >
                      {isInWishlist ? (
                        <HeartSolid style={{ width: '18px', height: '18px', color: '#171717' }} />
                      ) : (
                        <HeartOutline style={{ width: '18px', height: '18px', color: '#737373' }} />
                      )}
                    </button>
                  </div>

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
                        {allInventoryItems.length > 0 && (
                          <span>
                            Inventory: {allInventoryItems
                              .sort((a, b) => a.condition === 'new' ? -1 : 1)
                              .map((item: any) => `${item.quantity}x ${item.condition === 'new' ? 'New' : 'Used'}`)
                              .join(', ')}
                          </span>
                        )}
                        {allCollectionItems.length > 0 && (
                          <span>
                            Collection: {allCollectionItems
                              .sort((a, b) => a.condition === 'new' ? -1 : 1)
                              .map((item: any) => `${item.quantity}x ${item.condition === 'new' ? 'New' : 'Used'}`)
                              .join(', ')}
                          </span>
                        )}
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
                          {formatPrice(pricing.sixMonthAverage, pricing.currencyCode || 'USD', true)}
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
                          {formatPrice(pricing.currentAverage, pricing.currencyCode || 'USD', true)}
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
                          {formatPrice(pricing.currentLowest, pricing.currencyCode || 'USD', true)}
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
                          {formatPrice(pricing.suggestedPrice, pricing.currencyCode || 'USD', true)}
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
                      No sellers available in your region
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
                      {/* State 1: Neither Inventory nor Collection exists - Initial Add */}
                      {!collectionItem && !personalCollectionItem && (
                        <div>
                          <h2 style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: '600',
                            color: '#171717',
                            marginTop: 0,
                            marginBottom: '16px'
                          }}>
                            Add This Minifigure
                          </h2>

                          {/* Quantity Selector */}
                          <div style={{ marginBottom: '12px' }}>
                            <label style={{
                              display: 'block',
                              fontSize: 'var(--text-sm)',
                              fontWeight: '500',
                              color: '#525252',
                              marginBottom: '8px'
                            }}>
                              Quantity
                            </label>
                            <div className="quantity-stepper" style={{ flex: 1 }}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (quantity > 1) setQuantity(quantity - 1);
                                }}
                                disabled={quantity <= 1}
                                style={{
                                  width: '44px',
                                  minWidth: '44px',
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
                                  fontWeight: '600',
                                  padding: 0,
                                  flexShrink: 0,
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (quantity > 1) e.currentTarget.style.background = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                  if (quantity > 1) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                −
                              </button>

                              <input
                                type="number"
                                min="1"
                                max="9999"
                                value={quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val >= 1 && val <= 9999) {
                                    setQuantity(val);
                                  }
                                }}
                                onFocus={(e) => e.target.select()}
                                style={{
                                  flex: 1,
                                  minWidth: '40px',
                                  height: '44px',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: '600',
                                  color: '#171717',
                                  background: '#ffffff',
                                  border: 'none',
                                  textAlign: 'center',
                                  padding: '0 8px',
                                  outline: 'none',
                                  MozAppearance: 'textfield',
                                  WebkitAppearance: 'none',
                                  appearance: 'none'
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  if (quantity < 9999) setQuantity(quantity + 1);
                                }}
                                disabled={quantity >= 9999}
                                style={{
                                  width: '44px',
                                  minWidth: '44px',
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
                                  fontWeight: '600',
                                  padding: 0,
                                  flexShrink: 0,
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (quantity < 9999) e.currentTarget.style.background = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                  if (quantity < 9999) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Two Buttons: Add to Inventory and Add to Collection */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px'
                          }}>
                            <button
                              onClick={() => handleAddToCollection(quantity)}
                              disabled={addLoading}
                              style={{
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: addLoading ? '#a3a3a3' : '#3b82f6',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: 'var(--text-sm)',
                                fontWeight: '600',
                                cursor: addLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                if (!addLoading) e.currentTarget.style.background = '#2563eb';
                              }}
                              onMouseLeave={(e) => {
                                if (!addLoading) e.currentTarget.style.background = '#3b82f6';
                              }}
                            >
                              + Inventory
                            </button>

                            <button
                              onClick={() => handleAddToPersonalCollection(quantity)}
                              disabled={addPersonalLoading}
                              style={{
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: addPersonalLoading ? '#a3a3a3' : '#3b82f6',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: 'var(--text-sm)',
                                fontWeight: '600',
                                cursor: addPersonalLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                if (!addPersonalLoading) e.currentTarget.style.background = '#2563eb';
                              }}
                              onMouseLeave={(e) => {
                                if (!addPersonalLoading) e.currentTarget.style.background = '#3b82f6';
                              }}
                            >
                              + Collection
                            </button>
                          </div>
                        </div>
                      )}

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

                          <input
                            type="number"
                            min="1"
                            max="9999"
                            value={collectionItem.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1 && val <= 9999) {
                                handleUpdateQuantity(val);
                              }
                            }}
                            onFocus={(e) => e.target.select()}
                            style={{
                              flex: 1,
                              minWidth: '40px',
                              height: '44px',
                              fontSize: 'var(--text-base)',
                              fontWeight: '600',
                              color: '#171717',
                              background: '#ffffff',
                              border: 'none',
                              textAlign: 'center',
                              padding: '0 8px',
                              outline: 'none',
                              MozAppearance: 'textfield',
                              WebkitAppearance: 'none',
                              appearance: 'none'
                            }}
                          />

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
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (collectionItem.quantity === 1) {
                              setSuccessMessage('');
                              setError('');
                              try {
                                const response = await fetch(`/api/inventory/${collectionItem.id}/move-to-collection`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ quantity: 1 })
                                });
                                if (response.ok) {
                                  await refreshCollections();
                                  setLastMovedItem({ id: collectionItem.id, direction: 'to-collection' });
                                  setMoveSuccess(true);
                                  setTimeout(() => {
                                    setMoveSuccess(false);
                                    setLastMovedItem(null);
                                  }, 10000);
                                }
                              } catch (err) {
                                setError('Failed to move item');
                              }
                            } else {
                              setShowMoveDialog(true);
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
                            setDeleteTarget('inventory');
                            setShowDeleteDialog(true);
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

                        {/* Success message for inventory actions */}
                        {successMessage && successMessage.includes('Inventory') && (
                          <div style={{
                            marginTop: '16px',
                            padding: '12px 16px',
                            background: '#d1fae5',
                            border: '1px solid #6ee7b7',
                            borderRadius: '8px',
                            fontSize: 'var(--text-sm)',
                            color: '#065f46',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px'
                          }}>
                            <span>✓ {successMessage}</span>
                            <button
                              onClick={() => setSuccessMessage('')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#065f46',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                transition: 'all 0.2s',
                                flexShrink: 0
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#059669';
                                e.currentTarget.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.color = '#065f46';
                              }}
                              title="Close"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* Generate Listing - part of inventory section */}
                        <div style={{ marginTop: '16px' }}>
                          <ListingGeneratorForm
                            item={collectionItem}
                            onSuccess={(listing) => {
                              alert('Listing saved!');
                            }}
                            onOpen={() => {
                              setSuccessMessage('');
                              setError('');
                            }}
                          />
                        </div>
                        </>
                      )}

                      {/* Add to Collection Section - Only show when inventory exists but collection doesn't */}
                      {collectionItem && !personalCollectionItem && (
                        <div style={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e5e5e5',
                          padding: '20px',
                          marginTop: '24px'
                        }}>
                          <h2 style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: '600',
                            color: '#171717',
                            marginBottom: '16px',
                            marginTop: '0'
                          }}>
                            Add to Your Collection?
                          </h2>

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
                            <div className="quantity-stepper">
                              <button
                                type="button"
                                onClick={() => setAddToCollectionQty(Math.max(1, addToCollectionQty - 1))}
                                disabled={addToCollectionQty <= 1}
                                style={{
                                  width: '44px',
                                  minWidth: '44px',
                                  height: '44px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: addToCollectionQty > 1 ? '#ffffff' : '#f5f5f5',
                                  border: 'none',
                                  borderRight: '1px solid #e5e5e5',
                                  cursor: addToCollectionQty > 1 ? 'pointer' : 'not-allowed',
                                  color: addToCollectionQty > 1 ? '#171717' : '#a3a3a3',
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: '600',
                                  padding: 0,
                                  flexShrink: 0,
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (addToCollectionQty > 1) e.currentTarget.style.background = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                  if (addToCollectionQty > 1) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                −
                              </button>

                              <input
                                type="number"
                                min="1"
                                max="9999"
                                value={addToCollectionQty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val >= 1 && val <= 9999) {
                                    setAddToCollectionQty(val);
                                  }
                                }}
                                onFocus={(e) => e.target.select()}
                                style={{
                                  flex: '1',
                                  minWidth: '40px',
                                  height: '44px',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: '600',
                                  color: '#171717',
                                  background: '#ffffff',
                                  border: 'none',
                                  textAlign: 'center',
                                  padding: '0 8px',
                                  outline: 'none',
                                  appearance: 'none'
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => setAddToCollectionQty(Math.min(9999, addToCollectionQty + 1))}
                                disabled={addToCollectionQty >= 9999}
                                style={{
                                  width: '44px',
                                  minWidth: '44px',
                                  height: '44px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: addToCollectionQty < 9999 ? '#ffffff' : '#f5f5f5',
                                  border: 'none',
                                  borderLeft: '1px solid #e5e5e5',
                                  cursor: addToCollectionQty < 9999 ? 'pointer' : 'not-allowed',
                                  color: addToCollectionQty < 9999 ? '#171717' : '#a3a3a3',
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: '600',
                                  padding: 0,
                                  flexShrink: 0,
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (addToCollectionQty < 9999) e.currentTarget.style.background = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                  if (addToCollectionQty < 9999) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={handleAddToCollectionFromSection}
                            disabled={addToCollectionLoading}
                            style={{
                              width: '100%',
                              height: '44px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              background: '#ffffff',
                              color: addToCollectionLoading ? '#a3a3a3' : '#3b82f6',
                              border: addToCollectionLoading ? '2px solid #d4d4d4' : '2px solid #3b82f6',
                              borderRadius: '8px',
                              fontSize: 'var(--text-sm)',
                              fontWeight: '600',
                              cursor: addToCollectionLoading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (!addToCollectionLoading) {
                                e.currentTarget.style.background = '#eff6ff';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!addToCollectionLoading) {
                                e.currentTarget.style.background = '#ffffff';
                              }
                            }}
                          >
                            {addToCollectionLoading ? 'Adding...' : '+ Add to Collection'}
                          </button>

                          {/* Success message for this section */}
                          {successMessage && successMessage.includes('Collection') && (
                            <div style={{
                              background: '#dbeafe',
                              border: '1px solid #93c5fd',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: 'var(--text-sm)',
                              color: '#1e40af',
                              fontWeight: '500',
                              marginTop: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px'
                            }}>
                              <span>✓ {successMessage}</span>
                              <button
                                onClick={() => setSuccessMessage('')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#1e40af',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '4px',
                                  transition: 'all 0.2s',
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#3b82f6';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'none';
                                  e.currentTarget.style.color = '#1e40af';
                                }}
                                title="Close"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
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
                            In Your Collection
                          </h2>

                          <div className="inventory-actions-container">
                            {/* Quantity Stepper */}
                            <div className="quantity-stepper">
                              <button
                                type="button"
                                onClick={() => {
                                  if (personalCollectionItem.quantity > 1) {
                                    handleUpdatePersonalQuantity(personalCollectionItem.quantity - 1);
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

                              <input
                                type="number"
                                min="1"
                                max="9999"
                                value={personalCollectionItem.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val >= 1 && val <= 9999) {
                                    handleUpdatePersonalQuantity(val);
                                  }
                                }}
                                onFocus={(e) => e.target.select()}
                                style={{
                                  flex: 1,
                                  minWidth: '40px',
                                  height: '44px',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: '600',
                                  color: '#171717',
                                  background: '#ffffff',
                                  border: 'none',
                                  textAlign: 'center',
                                  padding: '0 8px',
                                  outline: 'none',
                                  MozAppearance: 'textfield',
                                  WebkitAppearance: 'none',
                                  appearance: 'none'
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  if (personalCollectionItem.quantity < 9999) {
                                    handleUpdatePersonalQuantity(personalCollectionItem.quantity + 1);
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
                                if (personalCollectionItem.quantity === 1) {
                                  setSuccessMessage('');
                                  setError('');
                                  try {
                                    const response = await fetch(`/api/personal-collection/${personalCollectionItem.id}/move-to-inventory`, {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ quantity: 1 })
                                    });
                                    if (response.ok) {
                                      await refreshCollections();
                                      setLastMovedItem({ id: personalCollectionItem.id, direction: 'to-inventory' });
                                      setMoveSuccess(true);
                                      setTimeout(() => {
                                        setMoveSuccess(false);
                                        setLastMovedItem(null);
                                      }, 10000);
                                    }
                                  } catch (err) {
                                    setError('Failed to move item');
                                  }
                                } else {
                                  setShowMoveToInventoryDialog(true);
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget('collection');
                                setShowDeleteDialog(true);
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

                          {/* Success message for collection actions */}
                          {successMessage && successMessage.includes('Collection') && (
                            <div style={{
                              marginTop: '16px',
                              padding: '12px 16px',
                              background: '#d1fae5',
                              border: '1px solid #6ee7b7',
                              borderRadius: '8px',
                              fontSize: 'var(--text-sm)',
                              color: '#065f46',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px'
                            }}>
                              <span>✓ {successMessage}</span>
                              <button
                                onClick={() => setSuccessMessage('')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#065f46',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '4px',
                                  transition: 'all 0.2s',
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#059669';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'none';
                                  e.currentTarget.style.color = '#065f46';
                                }}
                                title="Close"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Add to Inventory Section - Only show when collection exists but inventory doesn't */}
                      {personalCollectionItem && !collectionItem && (
                        <div style={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e5e5e5',
                          padding: '20px',
                          marginTop: '24px'
                        }}>
                          <h2 style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: '600',
                            color: '#171717',
                            marginBottom: '16px',
                            marginTop: '0'
                          }}>
                            Add to Your Inventory?
                          </h2>

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
                            <div className="quantity-stepper">
                              <button
                                type="button"
                                onClick={() => setAddToInventoryQty(Math.max(1, addToInventoryQty - 1))}
                                disabled={addToInventoryQty <= 1}
                                style={{
                                  width: '44px',
                                  minWidth: '44px',
                                  height: '44px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: addToInventoryQty > 1 ? '#ffffff' : '#f5f5f5',
                                  border: 'none',
                                  borderRight: '1px solid #e5e5e5',
                                  cursor: addToInventoryQty > 1 ? 'pointer' : 'not-allowed',
                                  color: addToInventoryQty > 1 ? '#171717' : '#a3a3a3',
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: '600',
                                  padding: 0,
                                  flexShrink: 0,
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (addToInventoryQty > 1) e.currentTarget.style.background = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                  if (addToInventoryQty > 1) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                −
                              </button>

                              <input
                                type="number"
                                min="1"
                                max="9999"
                                value={addToInventoryQty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val >= 1 && val <= 9999) {
                                    setAddToInventoryQty(val);
                                  }
                                }}
                                onFocus={(e) => e.target.select()}
                                style={{
                                  flex: '1',
                                  minWidth: '40px',
                                  height: '44px',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: '600',
                                  color: '#171717',
                                  background: '#ffffff',
                                  border: 'none',
                                  textAlign: 'center',
                                  padding: '0 8px',
                                  outline: 'none',
                                  appearance: 'none'
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => setAddToInventoryQty(Math.min(9999, addToInventoryQty + 1))}
                                disabled={addToInventoryQty >= 9999}
                                style={{
                                  width: '44px',
                                  minWidth: '44px',
                                  height: '44px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: addToInventoryQty < 9999 ? '#ffffff' : '#f5f5f5',
                                  border: 'none',
                                  borderLeft: '1px solid #e5e5e5',
                                  cursor: addToInventoryQty < 9999 ? 'pointer' : 'not-allowed',
                                  color: addToInventoryQty < 9999 ? '#171717' : '#a3a3a3',
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: '600',
                                  padding: 0,
                                  flexShrink: 0,
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (addToInventoryQty < 9999) e.currentTarget.style.background = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                  if (addToInventoryQty < 9999) e.currentTarget.style.background = '#ffffff';
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={handleAddToInventoryFromSection}
                            disabled={addToInventoryLoading}
                            style={{
                              width: '100%',
                              height: '44px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              background: addToInventoryLoading ? '#a3a3a3' : '#3b82f6',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: 'var(--text-sm)',
                              fontWeight: '600',
                              cursor: addToInventoryLoading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (!addToInventoryLoading) e.currentTarget.style.background = '#2563eb';
                            }}
                            onMouseLeave={(e) => {
                              if (!addToInventoryLoading) e.currentTarget.style.background = '#3b82f6';
                            }}
                          >
                            {addToInventoryLoading ? 'Adding...' : '+ Add to Inventory'}
                          </button>

                          {/* Success message for this section */}
                          {successMessage && successMessage.includes('Inventory') && (
                            <div style={{
                              background: '#d1fae5',
                              border: '1px solid #6ee7b7',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: 'var(--text-sm)',
                              color: '#065f46',
                              fontWeight: '500',
                              marginTop: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px'
                            }}>
                              <span>✓ {successMessage}</span>
                              <button
                                onClick={() => setSuccessMessage('')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#065f46',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '4px',
                                  transition: 'all 0.2s',
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#059669';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'none';
                                  e.currentTarget.style.color = '#065f46';
                                }}
                                title="Close"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </>
                  )}
                </div>

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
            setSuccessMessage('');
            setError('');
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

      {/* Move to Inventory Dialog */}
      {showMoveToInventoryDialog && personalCollectionItem && (
        <MoveDialog
          isOpen={true}
          onClose={() => setShowMoveToInventoryDialog(false)}
          itemName={minifig.name}
          maxQuantity={personalCollectionItem.quantity}
          direction="to-inventory"
          onConfirm={async (quantity) => {
            setSuccessMessage('');
            setError('');
            try {
              const response = await fetch(`/api/personal-collection/${personalCollectionItem.id}/move-to-inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
              });
              if (response.ok) {
                await refreshCollections();
                setSuccessMessage(`Moved ${quantity} to Inventory!`);
              }
            } catch (err) {
              setError('Failed to move item');
            }
            setShowMoveToInventoryDialog(false);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && deleteTarget && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => {
              setShowDeleteDialog(false);
              setDeleteTarget(null);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.2)',
              zIndex: 1000
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#171717'
            }}>
              Delete from {deleteTarget === 'inventory' ? 'Inventory' : 'Collection'}?
            </h2>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: '#737373',
              marginBottom: '24px'
            }}>
              This action cannot be undone.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteTarget(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: '#171717',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowDeleteDialog(false);
                  setSuccessMessage('');
                  setError('');

                  if (deleteTarget === 'inventory') {
                    await handleRemoveFromCollection();
                  } else {
                    try {
                      const response = await fetch(`/api/personal-collection/${personalCollectionItem!.id}`, {
                        method: 'DELETE'
                      });
                      if (response.ok) {
                        await refreshCollections();
                        setSuccessMessage('Removed from personal collection');
                      }
                    } catch (err) {
                      setError('Failed to delete item');
                    }
                  }

                  setDeleteTarget(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: '#ffffff',
                  backgroundColor: '#dc2626',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* Success Notification */}
      {moveSuccess && lastMovedItem && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          background: '#10b981',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: 'var(--text-sm)',
          fontWeight: '600',
          zIndex: 1000,
          animation: 'slideIn 0.2s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span>Moved 1 minifigure</span>
          <button
            onClick={async () => {
              setMoveSuccess(false);
              try {
                const endpoint = lastMovedItem.direction === 'to-collection'
                  ? '/api/personal-collection/move-to-inventory'
                  : '/api/inventory/move-to-collection';

                const body = lastMovedItem.direction === 'to-collection'
                  ? { minifigure_no: minifig.no, condition, quantity: 1 }
                  : { minifigure_no: minifig.no, condition, quantity: 1 };

                const response = await fetch(endpoint, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body)
                });

                if (response.ok) {
                  await refreshCollections();
                }
              } catch (err) {
                console.error('Failed to undo move:', err);
              }
              setLastMovedItem(null);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
