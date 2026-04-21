'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SetAdCard from '@/components/SetAdCard';
import MoveDialog from '@/components/MoveDialog';
import { formatPrice } from '@/lib/format-price';

// TODO: Add PriceHistoryChart support for sets (requires SetPriceHistory schema)

interface SetData {
  box_no: string;
  name: string;
  category_id: number;
  category_name: string;
  year_released: string | null;
  weight: string;
  image_url: string;
}

interface SetDetailClientProps {
  set: SetData;
  themeSets: Array<{ box_no: string; name: string; image_url: string }>;
  sameYearSets: Array<{ box_no: string; name: string; image_url: string }>;
}

export default function SetDetailClient({ set, themeSets, sameYearSets }: SetDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
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

  const [inventoryItem, setInventoryItem] = useState<any>(null);
  const [personalCollectionItem, setPersonalCollectionItem] = useState<any>(null);
  const [checkingCollection, setCheckingCollection] = useState(true);
  const [allInventoryItems, setAllInventoryItems] = useState<any[]>([]);
  const [allCollectionItems, setAllCollectionItems] = useState<any[]>([]);

  const [addToInventoryQty, setAddToInventoryQty] = useState(1);
  const [addToInventoryLoading, setAddToInventoryLoading] = useState(false);
  const [addToCollectionQty, setAddToCollectionQty] = useState(1);
  const [addToCollectionLoading, setAddToCollectionLoading] = useState(false);

  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showMoveToInventoryDialog, setShowMoveToInventoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'inventory' | 'collection' | null>(null);
  const [moveSuccess, setMoveSuccess] = useState(false);
  const [lastMovedItem, setLastMovedItem] = useState<{ id: string; direction: 'to-collection' | 'to-inventory' } | null>(null);

  // Wishlist state (TODO: Add WishlistSetItem to schema)
  // const [isInWishlist, setIsInWishlist] = useState(false);
  // const [wishlistLoading, setWishlistLoading] = useState(false);

  const [condition, setCondition] = useState<'new' | 'used'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const conditionParam = params.get('condition');
      return conditionParam === 'used' ? 'used' : 'new';
    }
    return 'new';
  });

  const [featuredSets, setFeaturedSets] = useState<any[]>([]);

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

  // Update condition when URL changes
  useEffect(() => {
    const conditionParam = searchParams.get('condition');
    const newCondition = conditionParam === 'used' ? 'used' : 'new';
    setCondition(newCondition);
  }, [searchParams]);

  // Fetch pricing on client-side
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      setPricing({ ...pricing, loading: false });
      return;
    }

    const fetchPricing = async () => {
      try {
        const response = await fetch(`/api/set-pricing/temp?boxNo=${set.box_no}&condition=${condition}`);
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
  }, [set.box_no, condition]);

  // Update URL when condition changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('condition', condition);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [condition, router, searchParams]);

  // Clear messages when condition changes
  useEffect(() => {
    setSuccessMessage('');
    setError('');
  }, [condition]);

  // Fetch 3 random sets from this theme
  useEffect(() => {
    const fetchFeaturedSets = async () => {
      try {
        const mainTheme = set.category_name.split('/')[0].trim();
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
  }, [set.category_name]);

  // Function to refresh collections data
  const refreshCollections = useCallback(async () => {
    if (!session) return;

    try {
      const inventoryResponse = await fetch('/api/set-inventory');
      const inventoryData = await inventoryResponse.json();

      if (inventoryData.success && inventoryData.data) {
        const allItems = inventoryData.data.filter((item: any) =>
          item.box_no === set.box_no
        );
        setAllInventoryItems(allItems);

        const found = allItems.find((item: any) => item.condition === condition);
        setInventoryItem(found || null);
      }

      const personalResponse = await fetch('/api/set-personal-collection');
      const personalData = await personalResponse.json();

      if (personalData.success && personalData.data) {
        const allItems = personalData.data.filter((item: any) =>
          item.box_no === set.box_no
        );
        setAllCollectionItems(allItems);

        const found = allItems.find((item: any) => item.condition === condition);
        setPersonalCollectionItem(found || null);
      }
    } catch (err) {
      console.error('Error checking collections:', err);
    }
  }, [session, set.box_no, condition]);

  // Check collections on mount and when condition changes
  useEffect(() => {
    if (!session) {
      setCheckingCollection(false);
      return;
    }

    const checkCollections = async () => {
      try {
        await refreshCollections();
      } catch (err) {
        console.error('Error checking collections:', err);
      } finally {
        setCheckingCollection(false);
      }
    };

    checkCollections();
  }, [set.box_no, condition, session, refreshCollections]);

  // TODO: Implement wishlist for sets (requires WishlistSetItem schema)
  // Check if item is in wishlist
  // useEffect(() => {
  //   if (!session) return;
  //   const checkWishlist = async () => {
  //     try {
  //       const response = await fetch('/api/wishlist-sets');
  //       const data = await response.json();
  //       if (data.success) {
  //         const found = data.data.some((item: any) => item.box_no === set.box_no);
  //         setIsInWishlist(found);
  //       }
  //     } catch (err) {
  //       console.error('Error checking wishlist:', err);
  //     }
  //   };
  //   checkWishlist();
  // }, [set.box_no, session]);

  // const handleToggleWishlist = async () => {
  //   if (!session) {
  //     router.push('/auth/signin');
  //     return;
  //   }
  //   setWishlistLoading(true);
  //   try {
  //     if (isInWishlist) {
  //       const response = await fetch('/api/wishlist-sets');
  //       const data = await response.json();
  //       if (data.success) {
  //         const item = data.data.find((item: any) => item.box_no === set.box_no);
  //         if (item) {
  //           const deleteResponse = await fetch(`/api/wishlist-sets/${item.id}`, { method: 'DELETE' });
  //           if (deleteResponse.ok) {
  //             setIsInWishlist(false);
  //           }
  //         }
  //       }
  //     } else {
  //       const response = await fetch('/api/wishlist-sets', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           box_no: set.box_no,
  //           set_name: set.name,
  //           image_url: set.image_url
  //         })
  //       });
  //       const data = await response.json();
  //       if (response.ok) {
  //         setIsInWishlist(true);
  //         window.dispatchEvent(new Event('wishlistAdded'));
  //       } else {
  //         console.error('Failed to add to wishlist:', data.error);
  //         setError(data.error || 'Failed to add to wishlist');
  //         setTimeout(() => setError(''), 3000);
  //       }
  //     }
  //   } catch (err) {
  //     console.error('Error toggling wishlist:', err);
  //     setError('Failed to update wishlist');
  //     setTimeout(() => setError(''), 3000);
  //   } finally {
  //     setWishlistLoading(false);
  //   }
  // };

  const handleAddToInventory = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setAddToInventoryLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/set-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          box_no: set.box_no,
          quantity: addToInventoryQty,
          condition
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`Added ${addToInventoryQty}x to inventory!`);
        await refreshCollections();
        setAddToInventoryQty(1);
      } else {
        setError(data.error || 'Failed to add set');
      }
    } catch (err) {
      setError('Failed to add set');
    } finally {
      setAddToInventoryLoading(false);
    }
  };

  const handleAddToCollection = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setAddToCollectionLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/set-personal-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          box_no: set.box_no,
          quantity: addToCollectionQty,
          condition
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`Added ${addToCollectionQty}x to collection!`);
        await refreshCollections();
        setAddToCollectionQty(1);
      } else {
        setError(data.error || 'Failed to add set');
      }
    } catch (err) {
      setError('Failed to add set');
    } finally {
      setAddToCollectionLoading(false);
    }
  };

  const handleUpdateInventoryQuantity = async (newQuantity: number) => {
    if (!inventoryItem || !session) return;

    setSuccessMessage('');
    setError('');

    // Optimistic update
    setInventoryItem({ ...inventoryItem, quantity: newQuantity });
    setAllInventoryItems(prev =>
      prev.map(item =>
        item.id === inventoryItem.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      const response = await fetch(`/api/set-inventory/${inventoryItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      if (!data.success) {
        await refreshCollections();
        setError('Failed to update quantity');
      }
    } catch (err) {
      await refreshCollections();
      setError('Failed to update quantity');
    }
  };

  const handleUpdatePersonalQuantity = async (newQuantity: number) => {
    if (!personalCollectionItem || !session) return;

    setSuccessMessage('');
    setError('');

    // Optimistic update
    setPersonalCollectionItem({ ...personalCollectionItem, quantity: newQuantity });
    setAllCollectionItems(prev =>
      prev.map(item =>
        item.id === personalCollectionItem.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      const response = await fetch(`/api/set-personal-collection/${personalCollectionItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      if (!data.success) {
        await refreshCollections();
        setError('Failed to update quantity');
      }
    } catch (err) {
      await refreshCollections();
      setError('Failed to update quantity');
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!inventoryItem || !session) return;

    setSuccessMessage('');
    setError('');

    try {
      const response = await fetch(`/api/set-inventory/${inventoryItem.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await refreshCollections();
        setShowDeleteDialog(false);
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Error removing:', err);
      setError('Failed to remove from inventory');
    }
  };

  const handleRemoveFromCollection = async () => {
    if (!personalCollectionItem || !session) return;

    setSuccessMessage('');
    setError('');

    try {
      const response = await fetch(`/api/set-personal-collection/${personalCollectionItem.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await refreshCollections();
        setShowDeleteDialog(false);
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Error removing:', err);
      setError('Failed to remove from collection');
    }
  };

  const handleMoveToCollection = async (quantityToMove: number) => {
    if (!inventoryItem || !session) return;

    try {
      const response = await fetch(`/api/set-inventory/${inventoryItem.id}/move-to-collection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: quantityToMove }),
      });

      const data = await response.json();

      if (data.success) {
        await refreshCollections();
        setMoveSuccess(true);
        setLastMovedItem({ id: inventoryItem.id, direction: 'to-collection' });
        setShowMoveDialog(false);
      } else {
        setError(data.error || 'Failed to move');
      }
    } catch (err) {
      setError('Failed to move to collection');
    }
  };

  const handleMoveToInventory = async (quantityToMove: number) => {
    if (!personalCollectionItem || !session) return;

    try {
      const response = await fetch(`/api/set-personal-collection/${personalCollectionItem.id}/move-to-inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: quantityToMove }),
      });

      const data = await response.json();

      if (data.success) {
        await refreshCollections();
        setMoveSuccess(true);
        setLastMovedItem({ id: personalCollectionItem.id, direction: 'to-inventory' });
        setShowMoveToInventoryDialog(false);
      } else {
        setError(data.error || 'Failed to move');
      }
    } catch (err) {
      setError('Failed to move to inventory');
    }
  };

  const parentTheme = set.category_name.split(' / ')[0].trim();
  const subcategory = set.category_name.split(' / ').slice(1).join(' / ');

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

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 1024px) {
          .grid-layout {
            grid-template-columns: 1fr 1.2fr;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        {/* Success Notification */}
        {moveSuccess && lastMovedItem && (
          <div style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: '#10b981',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            animation: 'slideDown 0.3s ease-out',
            maxWidth: '90vw'
          }}>
            ✓ Moved to {lastMovedItem.direction === 'to-collection' ? 'Collection' : 'Inventory'}! Click anywhere to dismiss.
          </div>
        )}

        {/* Breadcrumbs */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }} className="responsive-padding">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Set Themes', href: '/sets-themes' },
              { label: parentTheme, href: `/sets-themes/${encodeURIComponent(parentTheme)}` },
              { label: set.name }
            ]} />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }} className="responsive-padding">
          <div className="grid-layout">
            {/* Left Column: Image */}
            <div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e5e5e5',
                position: 'relative'
              }}>
                {/* TODO: Add Wishlist Button when WishlistSetItem schema is added */}

                <Image
                  src={set.image_url}
                  alt={set.name}
                  width={400}
                  height={400}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  unoptimized
                />
              </div>
            </div>

            {/* Right Column: Details */}
            <div>
              {/* Title */}
              <h1 style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: '700',
                color: '#171717',
                marginBottom: '8px'
              }}>
                {set.name}
              </h1>

              <div style={{ fontSize: '14px', color: '#737373', marginBottom: '16px' }}>
                <Link href={`/sets-themes/${encodeURIComponent(parentTheme)}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                  {parentTheme}
                </Link>
                {subcategory && ` / ${subcategory}`}
                <div>Box No: {set.box_no} • Year: {set.year_released} • Weight: {set.weight}g</div>
              </div>

              {/* Condition Selector */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#171717' }}>Condition:</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setCondition('new')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: condition === 'new' ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                      background: condition === 'new' ? '#eff6ff' : 'white',
                      color: condition === 'new' ? '#3b82f6' : '#525252',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      minHeight: '44px'
                    }}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setCondition('used')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: condition === 'used' ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                      background: condition === 'used' ? '#eff6ff' : 'white',
                      color: condition === 'used' ? '#3b82f6' : '#525252',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      minHeight: '44px'
                    }}
                  >
                    Used
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e5e5',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#171717' }}>
                  BrickLink Pricing
                </h3>
                {pricing.loading ? (
                  <div style={{ color: '#737373' }}>Loading pricing...</div>
                ) : pricing.suggestedPrice > 0 ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#737373', marginBottom: '4px' }}>6-Month Avg</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#171717' }}>
                          {formatPrice(pricing.sixMonthAverage, pricing.currencyCode)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#737373', marginBottom: '4px' }}>Current Avg</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#171717' }}>
                          {formatPrice(pricing.currentAverage, pricing.currencyCode)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#737373', marginBottom: '4px' }}>Current Lowest</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#171717' }}>
                          {formatPrice(pricing.currentLowest, pricing.currencyCode)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#737373', marginBottom: '4px' }}>Suggested Price</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>
                          {formatPrice(pricing.suggestedPrice, pricing.currencyCode)}
                        </div>
                      </div>
                    </div>

                    {/* TODO: Add Price History Chart for sets */}
                  </>
                ) : (
                  <div style={{ color: '#737373' }}>No pricing data available</div>
                )}
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div style={{
                  padding: '12px 16px',
                  background: '#dcfce7',
                  color: '#166534',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {successMessage}
                </div>
              )}
              {error && (
                <div style={{
                  padding: '12px 16px',
                  background: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {error}
                </div>
              )}

              {/* Inventory Status - with edit controls */}
              {inventoryItem && (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e5e5',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#171717' }}>
                      In Your Inventory (For Sale)
                    </h3>
                    <div style={{
                      padding: '4px 12px',
                      background: '#eff6ff',
                      color: '#3b82f6',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {condition}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#737373', marginBottom: '8px' }}>Quantity</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => handleUpdateInventoryQuantity(Math.max(1, inventoryItem.quantity - 1))}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          border: '1px solid #e5e5e5',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#525252'
                        }}
                      >
                        −
                      </button>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#171717',
                        minWidth: '40px',
                        textAlign: 'center'
                      }}>
                        {inventoryItem.quantity}
                      </div>
                      <button
                        onClick={() => handleUpdateInventoryQuantity(inventoryItem.quantity + 1)}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          border: '1px solid #e5e5e5',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#525252'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowMoveDialog(true)}
                      style={{
                        flex: '1 1 auto',
                        minWidth: '140px',
                        padding: '12px 20px',
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        minHeight: '44px'
                      }}
                    >
                      Move to Collection
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget('inventory');
                        setShowDeleteDialog(true);
                      }}
                      style={{
                        flex: '1 1 auto',
                        minWidth: '100px',
                        padding: '12px 20px',
                        background: 'white',
                        color: '#ef4444',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        minHeight: '44px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Personal Collection Status - with edit controls */}
              {personalCollectionItem && (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e5e5',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#171717' }}>
                      In Your Collection (To Keep)
                    </h3>
                    <div style={{
                      padding: '4px 12px',
                      background: '#dcfce7',
                      color: '#10b981',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {condition}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#737373', marginBottom: '8px' }}>Quantity</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => handleUpdatePersonalQuantity(Math.max(1, personalCollectionItem.quantity - 1))}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          border: '1px solid #e5e5e5',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#525252'
                        }}
                      >
                        −
                      </button>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#171717',
                        minWidth: '40px',
                        textAlign: 'center'
                      }}>
                        {personalCollectionItem.quantity}
                      </div>
                      <button
                        onClick={() => handleUpdatePersonalQuantity(personalCollectionItem.quantity + 1)}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          border: '1px solid #e5e5e5',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#525252'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowMoveToInventoryDialog(true)}
                      style={{
                        flex: '1 1 auto',
                        minWidth: '140px',
                        padding: '12px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        minHeight: '44px'
                      }}
                    >
                      Move to Inventory
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget('collection');
                        setShowDeleteDialog(true);
                      }}
                      style={{
                        flex: '1 1 auto',
                        minWidth: '100px',
                        padding: '12px 20px',
                        background: 'white',
                        color: '#ef4444',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        minHeight: '44px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Inventory */}
              {session && !inventoryItem && (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e5e5',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#171717' }}>
                    Add to Inventory (For Sale)
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="number"
                      min="1"
                      value={addToInventoryQty}
                      onChange={(e) => setAddToInventoryQty(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{
                        width: '80px',
                        padding: '10px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        minHeight: '44px'
                      }}
                    />
                    <button
                      onClick={handleAddToInventory}
                      disabled={addToInventoryLoading}
                      style={{
                        flex: '1 1 auto',
                        minWidth: '140px',
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: addToInventoryLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: addToInventoryLoading ? 0.5 : 1,
                        fontSize: '14px',
                        minHeight: '44px'
                      }}
                    >
                      {addToInventoryLoading ? 'Adding...' : 'Add to Inventory'}
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Collection */}
              {session && !personalCollectionItem && (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e5e5'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#171717' }}>
                    Add to Collection (To Keep)
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="number"
                      min="1"
                      value={addToCollectionQty}
                      onChange={(e) => setAddToCollectionQty(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{
                        width: '80px',
                        padding: '10px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        minHeight: '44px'
                      }}
                    />
                    <button
                      onClick={handleAddToCollection}
                      disabled={addToCollectionLoading}
                      style={{
                        flex: '1 1 auto',
                        minWidth: '140px',
                        padding: '10px 20px',
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: addToCollectionLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: addToCollectionLoading ? 0.5 : 1,
                        fontSize: '14px',
                        minHeight: '44px'
                      }}
                    >
                      {addToCollectionLoading ? 'Adding...' : 'Add to Collection'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Featured Sets Section */}
          {featuredSets.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: '700', marginBottom: '24px', color: '#171717' }}>
                Featured {parentTheme} Sets
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {featuredSets.map((setAd) => (
                  <SetAdCard
                    key={setAd.setNumber || setAd.box_no}
                    setNumber={setAd.setNumber || setAd.box_no}
                    setName={setAd.name}
                    imageUrl={setAd.imageUrl || setAd.image_url}
                    year={setAd.year || (setAd.year_released ? parseInt(setAd.year_released) : undefined)}
                    amazonUrl={setAd.amazonUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Related Sets Section */}
          {themeSets.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: '700', marginBottom: '24px', color: '#171717' }}>
                More from {parentTheme}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '24px'
              }}>
                {themeSets.map(s => (
                  <Link key={s.box_no} href={`/sets/${s.box_no}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #e5e5e5',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                      <div style={{ padding: '16px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
                        <Image
                          src={s.image_url}
                          alt={s.name}
                          width={160}
                          height={160}
                          style={{ objectFit: 'contain', maxHeight: '160px' }}
                          unoptimized
                        />
                      </div>
                      <div style={{ padding: '16px', borderTop: '1px solid #e5e5e5' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#171717', marginBottom: '4px' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#737373' }}>
                          {s.box_no}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Move Dialog - Inventory to Collection */}
      {showMoveDialog && inventoryItem && (
        <MoveDialog
          isOpen={true}
          onClose={() => setShowMoveDialog(false)}
          itemName={set.name}
          maxQuantity={inventoryItem.quantity}
          direction="to-collection"
          onConfirm={handleMoveToCollection}
        />
      )}

      {/* Move Dialog - Collection to Inventory */}
      {showMoveToInventoryDialog && personalCollectionItem && (
        <MoveDialog
          isOpen={true}
          onClose={() => setShowMoveToInventoryDialog(false)}
          itemName={set.name}
          maxQuantity={personalCollectionItem.quantity}
          direction="to-inventory"
          onConfirm={handleMoveToInventory}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && deleteTarget && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={() => {
          setShowDeleteDialog(false);
          setDeleteTarget(null);
        }}>
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#171717' }}>
              Remove from {deleteTarget === 'inventory' ? 'Inventory' : 'Collection'}?
            </h3>
            <p style={{ fontSize: '14px', color: '#737373', marginBottom: '24px', lineHeight: '1.5' }}>
              This will permanently remove this set from your {deleteTarget === 'inventory' ? 'inventory' : 'collection'}.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteTarget(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  color: '#525252',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  minHeight: '44px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={deleteTarget === 'inventory' ? handleRemoveFromInventory : handleRemoveFromCollection}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  minHeight: '44px'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
