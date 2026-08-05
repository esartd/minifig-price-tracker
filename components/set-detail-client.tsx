'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/components/TranslationProvider';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SetAdCard from '@/components/SetAdCard';
import MoveDialog from '@/components/MoveDialog';
import ListingGeneratorForm from '@/components/listing-generator-form';
import SetCardImage from '@/components/SetCard';
import AuthRequiredModal from '@/components/AuthRequiredModal';
import SaveCollectionModal from '@/components/SaveCollectionModal';
import { useGuestCollection } from '@/hooks/useGuestCollection';
import { formatPrice } from '@/lib/format-price';
import { getSetAvailability } from '@/lib/set-availability';
import { generateLegoSetLink, generateAmazonLegoSetLink, generateBrickLinkAffiliateLink } from '@/lib/affiliate-links';
import { generateEbaySetLink } from '@/lib/ebay-affiliate-links';
import { trackAffiliateClick } from '@/lib/analytics';
import SetDescription from '@/components/SetDescription';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import PriceAlertButton from '@/components/PriceAlertButton';
import BadgeTooltip from '@/components/BadgeTooltip';

interface SetData {
  box_no: string;
  name: string;
  category_id: number;
  category_name: string;
  year_released: string | null;
  weight: string;
  image_url: string;
  description?: string;
}

interface MinifigData {
  minifig_no: string;
  quantity: number;
  name?: string;
  image_url?: string;
}

interface SetDetailClientProps {
  set: SetData;
  themeSets: Array<{ box_no: string; name: string; image_url: string }>;
  sameYearSets: Array<{ box_no: string; name: string; image_url: string }>;
  closeRangeSets?: Array<{ box_no: string; name: string; image_url: string }>;
  minifigs?: MinifigData[];
}

export default function SetDetailClient({ set, themeSets, sameYearSets, closeRangeSets = [], minifigs = [] }: SetDetailClientProps) {
  const { t, translations } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { addItem: addToGuestCollection, count: guestCollectionCount, total: guestCollectionTotal } = useGuestCollection();
  // How many of each related minifig/set the logged-in user already owns (to keep + for sale
  // combined) - shown as a small grey "×N" badge on the related-item cards below. This page is
  // ISR-cached and shared across visitors, so this has to be fetched client-side per session
  // rather than baked into the server-rendered props.
  const [ownedMinifigQuantities, setOwnedMinifigQuantities] = useState<Record<string, number>>({});
  const [ownedSetQuantities, setOwnedSetQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!session?.user) return;
    const minifigNos = minifigs.map(m => m.minifig_no);
    const boxNos = [...themeSets.map(s => s.box_no), ...closeRangeSets.map(s => s.box_no)];
    if (minifigNos.length === 0 && boxNos.length === 0) return;

    fetch('/api/user/owned-quantities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minifigNos, boxNos })
    })
      .then(res => res.json())
      .then(data => {
        setOwnedMinifigQuantities(data.minifigs || {});
        setOwnedSetQuantities(data.sets || {});
      })
      .catch(() => {}); // Non-critical UI enhancement - fail silently
  }, [session?.user, minifigs, themeSets, closeRangeSets]);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successVariant, setSuccessVariant] = useState<'sell' | 'keep' | null>(null);
  const [pricing, setPricing] = useState<{
    sixMonthAverage: number;
    currentAverage: number;
    currentLowest: number;
    suggestedPrice: number;
    currencyCode?: string;
    loading: boolean;
    unavailable_reason?: 'daily_limit' | 'no_listings';
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

  const [quantity, setQuantity] = useState(1);
  const [addLoading, setAddLoading] = useState(false);
  const [addPersonalLoading, setAddPersonalLoading] = useState(false);
  const [addToCollectionQty, setAddToCollectionQty] = useState(1);
  const [addToCollectionLoading, setAddToCollectionLoading] = useState(false);
  const [addToInventoryQty, setAddToInventoryQty] = useState(1);
  const [addToInventoryLoading, setAddToInventoryLoading] = useState(false);

  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showMoveToInventoryDialog, setShowMoveToInventoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'inventory' | 'collection' | null>(null);
  const [moveSuccess, setMoveSuccess] = useState(false);
  const [lastMovedItem, setLastMovedItem] = useState<{ id: string; direction: 'to-collection' | 'to-inventory' } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSaveCollectionModal, setShowSaveCollectionModal] = useState(false);

  const [condition, setCondition] = useState<'new' | 'used'>('new');

  const [featuredSets, setFeaturedSets] = useState<any[]>([]);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(set.image_url);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!moveSuccess) return;
    const handleClick = () => {
      setMoveSuccess(false);
      setLastMovedItem(null);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [moveSuccess]);

  useEffect(() => {
    const conditionParam = searchParams.get('condition');
    const newCondition = conditionParam === 'used' ? 'used' : 'new';
    setCondition(newCondition);
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      setPricing({ ...pricing, loading: false });
      return;
    }

    const fetchPricing = async () => {
      try {
        // Include user's currency preferences in the API call
        const params = new URLSearchParams({
          boxNo: set.box_no,
          condition
        });

        if (session?.user?.preferredCountryCode) {
          params.set('countryCode', session.user.preferredCountryCode);
        }
        if (session?.user?.preferredRegion) {
          params.set('region', session.user.preferredRegion);
        }

        console.log('[Set Detail] Fetching pricing with params:', params.toString());
        console.log('[Set Detail] Session preferences:', {
          countryCode: session?.user?.preferredCountryCode,
          region: session?.user?.preferredRegion,
          currency: session?.user?.preferredCurrency
        });

        const response = await fetch(`/api/set-pricing/temp?${params.toString()}`);
        const data = await response.json();
        if (data.success && data.pricing) {
          setPricing({
            sixMonthAverage: data.pricing.sixMonthAverage || 0,
            currentAverage: data.pricing.currentAverage || 0,
            currentLowest: data.pricing.currentLowest || 0,
            suggestedPrice: data.pricing.suggestedPrice || 0,
            currencyCode: data.pricing.currencyCode || session?.user?.preferredCurrency || 'USD',
            loading: false,
            unavailable_reason: data.pricing.unavailable_reason,
          });
        } else {
          setPricing({ ...pricing, loading: false });
        }
      } catch (err) {
        setPricing({ ...pricing, loading: false });
      }
    };
    fetchPricing();
  }, [set.box_no, condition, session]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('condition', condition);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [condition, router, searchParams]);

  useEffect(() => {
    setSuccessMessage('');
    setSuccessVariant(null);
    setError('');
  }, [condition]);

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

  // Check if set is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!session?.user?.id) {
        setIsInWishlist(false);
        return;
      }

      try {
        const response = await fetch('/api/set-wishlist');
        const data = await response.json();

        if (data.success && data.data) {
          const wishlistItem = data.data.find((item: any) => item.box_no === set.box_no);
          if (wishlistItem) {
            setIsInWishlist(true);
            setWishlistItemId(wishlistItem.id);
          } else {
            setIsInWishlist(false);
            setWishlistItemId(null);
          }
        }
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };

    checkWishlist();
  }, [session, set.box_no]);

  const handleToggleWishlist = async () => {
    if (!session?.user?.id) {
      setShowAuthModal(true);
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist && wishlistItemId) {
        // Remove from wishlist
        const response = await fetch(`/api/set-wishlist/${wishlistItemId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setIsInWishlist(false);
          setWishlistItemId(null);
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/set-wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            box_no: set.box_no,
            set_name: set.name,
            image_url: set.image_url
          })
        });

        const data = await response.json();
        if (data.success && data.data) {
          setIsInWishlist(true);
          setWishlistItemId(data.data.id);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const refreshCollections = useCallback(async () => {
    if (!session) return;
    try {
      const inventoryResponse = await fetch('/api/set-inventory');
      const inventoryData = await inventoryResponse.json();
      if (inventoryData.success && inventoryData.data) {
        const allItems = inventoryData.data.filter((item: any) => item.box_no === set.box_no);
        setAllInventoryItems(allItems);
        const found = allItems.find((item: any) => item.condition === condition);
        setInventoryItem(found || null);
      }

      const personalResponse = await fetch('/api/set-personal-collection');
      const personalData = await personalResponse.json();
      if (personalData.success && personalData.data) {
        const allItems = personalData.data.filter((item: any) => item.box_no === set.box_no);
        setAllCollectionItems(allItems);
        const found = allItems.find((item: any) => item.condition === condition);
        setPersonalCollectionItem(found || null);
      }
    } catch (err) {
      console.error('Error checking collections:', err);
    }
  }, [session, set.box_no, condition]);

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

  const handleAddToInventory = async (qty: number) => {
    if (!session) {
      // Add to guest collection
      const added = addToGuestCollection({
        itemNo: set.box_no,
        itemType: 'set',
        name: set.name,
        imageUrl: set.image_url,
        price: pricing.suggestedPrice || pricing.currentAverage || 0,
        condition: condition,
        quantity: qty,
        action: 'sell'
      });

      if (added) {
        setSuccessMessage(t('setDetail.messages.addedToGuestCollection', { quantity: qty, plural: qty === 1 ? '' : 's' }));
        setTimeout(() => setSuccessMessage(''), 3000);

        // Show save collection modal after 3+ items
        if (guestCollectionCount >= 3) {
          setTimeout(() => setShowSaveCollectionModal(true), 1000);
        }
      }
      return;
    }
    setAddLoading(true);
    setError('');
    setSuccessMessage('');
    setSuccessVariant(null);
    try {
      const response = await fetch('/api/set-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ box_no: set.box_no, quantity: qty, condition })
      });
      const data = await response.json();
      if (data.success) {
        await refreshCollections();
        setSuccessMessage(t('setDetail.messages.addedToInventory', { quantity: qty, condition: t(`setDetail.condition.${condition}`) }));
        setSuccessVariant('sell');
        setQuantity(1);
      } else {
        setError(data.error || t('setDetail.errors.failedToAdd'));
      }
    } catch (err) {
      setError(t('setDetail.errors.failedToAddToInventory'));
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddToPersonalCollection = async (qty: number) => {
    if (!session) {
      // Add to guest collection
      const added = addToGuestCollection({
        itemNo: set.box_no,
        itemType: 'set',
        name: set.name,
        imageUrl: set.image_url,
        price: pricing.suggestedPrice || pricing.currentAverage || 0,
        condition: condition,
        quantity: qty,
        action: 'keep'
      });

      if (added) {
        setSuccessMessage(t('setDetail.messages.addedToGuestCollection', { quantity: qty, plural: qty === 1 ? '' : 's' }));
        setTimeout(() => setSuccessMessage(''), 3000);

        // Show save collection modal after 3+ items
        if (guestCollectionCount >= 3) {
          setTimeout(() => setShowSaveCollectionModal(true), 1000);
        }
      }
      return;
    }
    setAddPersonalLoading(true);
    setError('');
    setSuccessMessage('');
    setSuccessVariant(null);
    try {
      const response = await fetch('/api/set-personal-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ box_no: set.box_no, quantity: qty, condition })
      });
      const data = await response.json();
      if (data.success) {
        await refreshCollections();
        setSuccessMessage(t('setDetail.messages.addedToCollection', { quantity: qty, condition: t(`setDetail.condition.${condition}`) }));
        setSuccessVariant('keep');
        setQuantity(1);
      } else {
        setError(data.error || t('setDetail.errors.failedToAdd'));
      }
    } catch (err) {
      setError(t('setDetail.errors.failedToAddToCollection'));
    } finally {
      setAddPersonalLoading(false);
    }
  };

  const handleAddToCollectionFromSection = async () => {
    if (!session) {
      // Add to guest collection
      const added = addToGuestCollection({
        itemNo: set.box_no,
        itemType: 'set',
        name: set.name,
        imageUrl: set.image_url,
        price: pricing.suggestedPrice || pricing.currentAverage || 0,
        condition: condition,
        quantity: addToCollectionQty,
        action: 'keep'
      });

      if (added) {
        setSuccessMessage(t('setDetail.messages.addedToGuestCollection', { quantity: addToCollectionQty, plural: addToCollectionQty === 1 ? '' : 's' }));
        setTimeout(() => setSuccessMessage(''), 3000);

        // Show save collection modal after 3+ items
        if (guestCollectionCount >= 3) {
          setTimeout(() => setShowSaveCollectionModal(true), 1000);
        }
      }
      return;
    }
    setAddToCollectionLoading(true);
    setError('');
    setSuccessMessage('');
    setSuccessVariant(null);
    try {
      const response = await fetch('/api/set-personal-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ box_no: set.box_no, quantity: addToCollectionQty, condition })
      });
      const data = await response.json();
      if (data.success) {
        await refreshCollections();
        setSuccessMessage(t('setDetail.messages.addedToCollection', { quantity: addToCollectionQty }));
        setSuccessVariant('keep');
        setAddToCollectionQty(1);
      } else {
        setError(data.error || t('setDetail.errors.failedToAdd'));
      }
    } catch (err) {
      setError(t('setDetail.errors.failedToAddToCollection'));
    } finally {
      setAddToCollectionLoading(false);
    }
  };

  const handleAddToInventoryFromSection = async () => {
    if (!session) {
      // Add to guest collection
      const added = addToGuestCollection({
        itemNo: set.box_no,
        itemType: 'set',
        name: set.name,
        imageUrl: set.image_url,
        price: pricing.suggestedPrice || pricing.currentAverage || 0,
        condition: condition,
        quantity: addToInventoryQty,
        action: 'sell'
      });

      if (added) {
        setSuccessMessage(t('setDetail.messages.addedToGuestCollection', { quantity: addToInventoryQty, plural: addToInventoryQty === 1 ? '' : 's' }));
        setTimeout(() => setSuccessMessage(''), 3000);

        // Show save collection modal after 3+ items
        if (guestCollectionCount >= 3) {
          setTimeout(() => setShowSaveCollectionModal(true), 1000);
        }
      }
      return;
    }
    setAddToInventoryLoading(true);
    setError('');
    setSuccessMessage('');
    setSuccessVariant(null);
    try {
      const response = await fetch('/api/set-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ box_no: set.box_no, quantity: addToInventoryQty, condition })
      });
      const data = await response.json();
      if (data.success) {
        await refreshCollections();
        setSuccessMessage(t('setDetail.messages.addedToInventory', { quantity: addToInventoryQty }));
        setSuccessVariant('sell');
        setAddToInventoryQty(1);
      } else {
        setError(data.error || t('setDetail.errors.failedToAdd'));
      }
    } catch (err) {
      setError(t('setDetail.errors.failedToAddToInventory'));
    } finally {
      setAddToInventoryLoading(false);
    }
  };

  const handleUpdateInventoryQuantity = async (newQuantity: number) => {
    if (!inventoryItem || !session) return;
    setSuccessMessage('');
    setSuccessVariant(null);
    setError('');
    setInventoryItem({ ...inventoryItem, quantity: newQuantity });
    setAllInventoryItems(prev => prev.map(item => item.id === inventoryItem.id ? { ...item, quantity: newQuantity } : item));
    try {
      const response = await fetch(`/api/set-inventory/${inventoryItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await response.json();
      if (!data.success) {
        await refreshCollections();
        setError(t('setDetail.errors.failedToUpdate'));
      }
    } catch (err) {
      await refreshCollections();
      setError(t('setDetail.errors.failedToUpdate'));
    }
  };

  const handleUpdatePersonalQuantity = async (newQuantity: number) => {
    if (!personalCollectionItem || !session) return;
    setSuccessMessage('');
    setSuccessVariant(null);
    setError('');
    setPersonalCollectionItem({ ...personalCollectionItem, quantity: newQuantity });
    setAllCollectionItems(prev => prev.map(item => item.id === personalCollectionItem.id ? { ...item, quantity: newQuantity } : item));
    try {
      const response = await fetch(`/api/set-personal-collection/${personalCollectionItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await response.json();
      if (!data.success) {
        await refreshCollections();
        setError(t('setDetail.errors.failedToUpdate'));
      }
    } catch (err) {
      await refreshCollections();
      setError(t('setDetail.errors.failedToUpdate'));
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!inventoryItem || !session) return;
    try {
      const response = await fetch(`/api/set-inventory/${inventoryItem.id}`, { method: 'DELETE' });
      if (response.ok) {
        await refreshCollections();
        setShowDeleteDialog(false);
        setDeleteTarget(null);
      }
    } catch (err) {
      setError(t('setDetail.errors.failedToRemoveInventory'));
    }
  };

  const handleRemoveFromCollection = async () => {
    if (!personalCollectionItem || !session) return;
    try {
      const response = await fetch(`/api/set-personal-collection/${personalCollectionItem.id}`, { method: 'DELETE' });
      if (response.ok) {
        await refreshCollections();
        setShowDeleteDialog(false);
        setDeleteTarget(null);
      }
    } catch (err) {
      setError(t('setDetail.errors.failedToRemoveCollection'));
    }
  };

  const parentTheme = set.category_name.split(' / ')[0].trim();
  const subcategory = set.category_name.split(' / ').slice(1).join(' / ');

  // Get availability status (only current year sets marked as available)
  const availability = getSetAvailability(set.box_no, set.year_released);
  const ebayAffiliateUrl = generateEbaySetLink(set.box_no, set.name);
  const legoAffiliateUrl = generateLegoSetLink(set.box_no);
  const amazonAffiliateUrl = generateAmazonLegoSetLink(set.box_no, set.name);
  const brickLinkUrl = generateBrickLinkAffiliateLink(set.box_no, 'SET');

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {moveSuccess && lastMovedItem && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: '#10b981', color: 'white', padding: '16px 24px', borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)', fontSize: '15px', fontWeight: '600',
          cursor: 'pointer', maxWidth: '90vw'
        }}>
          ✓ {lastMovedItem.direction === 'to-collection' ? t('setDetail.messages.movedToCollection') : t('setDetail.messages.movedToInventory')}
        </div>
      )}

      <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Breadcrumbs items={[
            { label: t('setDetail.breadcrumbs.home'), href: '/' },
            { label: t('setDetail.breadcrumbs.setThemes'), href: '/sets-themes' },
            { label: parentTheme, href: `/sets-themes/${encodeURIComponent(parentTheme)}` },
            { label: set.name }
          ]} />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <div className="minifig-detail-grid" style={{
          marginTop: '24px'
        }}>
          <div className="minifig-image-container">
            <div className="minifig-sticky-wrapper" style={{
              width: '100%',
              maxWidth: '900px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              {!imageError ? (
                <Image
                  src={imageUrl}
                  alt={set.name}
                  width={900}
                  height={900}
                  quality={100}
                  style={{ width: '100%', maxWidth: '900px', height: 'auto', objectFit: 'contain' }}
                  unoptimized
                  priority
                  onError={(e) => {
                    if (imageUrl.includes('/ON/')) {
                      const snUrl = imageUrl.replace('/ON/', '/SN/');
                      if (e.currentTarget.src !== snUrl) {
                        setImageUrl(snUrl);
                        return;
                      }
                    }
                    setImageError(true);
                  }}
                />
              ) : (
                <div style={{ fontSize: '72px', opacity: 0.3 }}>📦</div>
              )}
            </div>
          </div>

          <div className="minifig-details-section">
            {/* Year and Set Number with Wishlist */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', marginTop: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: 'var(--text-xs)', fontWeight: '500', color: '#3b82f6',
                textTransform: 'uppercase', letterSpacing: '0.05em', flexWrap: 'wrap' }}>
                <span>
                  {set.year_released && set.year_released !== '?' ? set.year_released : t('setDetail.meta.yearUnknown')}
                </span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span>
                  {set.box_no}
                </span>
              </div>
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

            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: '#171717', marginBottom: '8px' }}>
              {set.name}
            </h1>

            {set.description && (
              <SetDescription
                description={set.description}
                setName={set.name}
              />
            )}

            {/* Condition Toggle with counts */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', padding: '4px',
              background: '#f5f5f5', borderRadius: '8px', width: 'fit-content' }}>
              {(() => {
                const newCount = session ? [...allInventoryItems, ...allCollectionItems].filter(item => item.condition === 'new').reduce((sum, item) => sum + item.quantity, 0) : 0;
                const usedCount = session ? [...allInventoryItems, ...allCollectionItems].filter(item => item.condition === 'used').reduce((sum, item) => sum + item.quantity, 0) : 0;

                return (
                  <>
                    <button onClick={() => setCondition('new')} style={{
                      padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: '600',
                      color: condition === 'new' ? '#ffffff' : '#525252',
                      background: condition === 'new' ? '#3b82f6' : 'transparent',
                      border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}>
                      {t('setDetail.condition.new')}{newCount > 0 ? ` (${newCount})` : ''}
                    </button>
                    <button onClick={() => setCondition('used')} style={{
                      padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: '600',
                      color: condition === 'used' ? '#ffffff' : '#525252',
                      background: condition === 'used' ? '#3b82f6' : 'transparent',
                      border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}>
                      {t('setDetail.condition.used')}{usedCount > 0 ? ` (${usedCount})` : ''}
                    </button>
                  </>
                );
              })()}
            </div>

            {pricing.loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#737373' }}>
                <p style={{ fontSize: 'var(--text-sm)' }}>{t('setDetail.pricing.loadingPricing')}</p>
              </div>
            ) : pricing.suggestedPrice > 0 ? (
              <div className="minifig-pricing-row pricing-3col" style={{
                display: 'flex', width: '100%', marginBottom: '12px', alignItems: 'stretch'
              }}>
                <div className="pricing-item pricing-item-1" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 'clamp(9px, 2vw, 10px)', fontWeight: '500', color: '#737373',
                    textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>{t('setDetail.pricing.currentAvg')}</p>
                  <p style={{ fontSize: 'clamp(16px, 3.5vw, 18px)', fontWeight: '700', color: '#171717' }}>
                    {formatPrice(pricing.currentAverage, pricing.currencyCode, true)}</p>
                </div>
                <div className="pricing-divider" style={{ width: '1px', background: '#e5e5e5' }}></div>
                <div className="pricing-item pricing-item-2" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 'clamp(9px, 2vw, 10px)', fontWeight: '500', color: '#737373',
                    textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>{t('setDetail.pricing.lowest')}</p>
                  <p style={{ fontSize: 'clamp(16px, 3.5vw, 18px)', fontWeight: '700', color: '#171717' }}>
                    {formatPrice(pricing.currentLowest, pricing.currencyCode, true)}</p>
                </div>
                <div className="pricing-divider" style={{ width: '1px', background: '#e5e5e5' }}></div>
                <div className="pricing-item pricing-item-3" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 'clamp(9px, 2vw, 10px)', fontWeight: '500', color: '#737373',
                    textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>{t('setDetail.pricing.suggested')}</p>
                  <p style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: '700', color: '#3b82f6' }}>
                    {formatPrice(pricing.suggestedPrice, pricing.currencyCode, true)}</p>
                </div>
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', background: '#fafafa',
                borderRadius: '8px', color: '#737373', fontSize: 'var(--text-sm)', marginBottom: '24px' }}>
                {pricing.unavailable_reason === 'daily_limit'
                  ? (t('collection.pricing.pricingDailyLimit') || 'Pricing unavailable right now — check back soon')
                  : (t('collection.pricing.noSellersAvailable') || 'No sellers available')}
              </div>
            )}

            <div style={{ height: '1px', background: '#e5e5e5', marginBottom: '16px' }}></div>

            <div>
              {checkingCollection ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#737373' }}>{t('setDetail.collection.checkingCollections')}</div>
              ) : (
                <>
                  {/* Show add buttons when neither inventory nor collection exists */}
                  {!inventoryItem && !personalCollectionItem && (
                    <div>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717',
                        marginTop: 0, marginBottom: '16px' }}>{t('setDetail.collection.addThisSet')}</h2>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500',
                          color: '#525252', marginBottom: '8px' }}>{t('setDetail.collection.quantity')}</label>
                        <div className="quantity-stepper" style={{ flex: 1 }}>
                          <button type="button" onClick={() => { if (quantity > 1) setQuantity(quantity - 1); }}
                            disabled={quantity <= 1} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              background: quantity > 1 ? '#ffffff' : '#f5f5f5', border: 'none',
                              borderRight: '1px solid #e5e5e5', cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                              color: quantity > 1 ? '#171717' : '#a3a3a3', fontSize: 'var(--text-lg)',
                              fontWeight: '600', padding: 0, flexShrink: 0, transition: 'all 0.2s'
                            }}>−</button>
                          <input type="number" min="1" max="9999" value={quantity}
                            onChange={(e) => { const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1 && val <= 9999) setQuantity(val); }}
                            onFocus={(e) => e.target.select()}
                            style={{ flex: 1, minWidth: '40px', height: '44px', fontSize: 'var(--text-base)',
                              fontWeight: '600', color: '#171717', background: '#ffffff', border: 'none',
                              textAlign: 'center', padding: '0 8px', outline: 'none', appearance: 'none' }} />
                          <button type="button" onClick={() => { if (quantity < 9999) setQuantity(quantity + 1); }}
                            disabled={quantity >= 9999} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              background: quantity < 9999 ? '#ffffff' : '#f5f5f5', border: 'none',
                              borderLeft: '1px solid #e5e5e5', cursor: quantity < 9999 ? 'pointer' : 'not-allowed',
                              color: quantity < 9999 ? '#171717' : '#a3a3a3', fontSize: 'var(--text-lg)',
                              fontWeight: '600', padding: 0, flexShrink: 0, transition: 'all 0.2s'
                            }}>+</button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <button onClick={() => handleAddToInventory(quantity)} disabled={addLoading}
                          style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px', background: addLoading ? '#a3a3a3' : '#3b82f6', color: '#ffffff',
                            border: 'none', borderRadius: '8px', fontSize: 'var(--text-sm)', fontWeight: '600',
                            cursor: addLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                          {t('minifigDetail.toSell')}
                        </button>
                        <button onClick={() => handleAddToPersonalCollection(quantity)} disabled={addPersonalLoading}
                          style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px', background: addPersonalLoading ? '#a3a3a3' : '#3b82f6', color: '#ffffff',
                            border: 'none', borderRadius: '8px', fontSize: 'var(--text-sm)', fontWeight: '600',
                            cursor: addPersonalLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                          {t('minifigDetail.toKeep')}
                        </button>
                      </div>
                    </div>
                  )}

                  {inventoryItem && (
                    <>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717',
                        marginBottom: '16px' }}>{t('minifigDetail.itemsToSell')}</h2>
                      <div className="inventory-actions-container">
                        <div className="quantity-stepper">
                          <button type="button"
                            onClick={() => { if (inventoryItem.quantity > 1) handleUpdateInventoryQuantity(inventoryItem.quantity - 1); }}
                            disabled={inventoryItem.quantity <= 1} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: inventoryItem.quantity > 1 ? '#ffffff' : '#f5f5f5',
                              border: 'none', borderRight: '1px solid #e5e5e5',
                              cursor: inventoryItem.quantity > 1 ? 'pointer' : 'not-allowed',
                              color: inventoryItem.quantity > 1 ? '#171717' : '#a3a3a3', transition: 'all 0.2s',
                              fontSize: 'var(--text-lg)', fontWeight: '600', padding: 0, flexShrink: 0
                            }}>−</button>
                          <input type="number" min="1" max="9999" value={inventoryItem.quantity}
                            onChange={(e) => { const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1 && val <= 9999) handleUpdateInventoryQuantity(val); }}
                            onFocus={(e) => e.target.select()}
                            style={{ flex: 1, minWidth: '40px', height: '44px', fontSize: 'var(--text-base)',
                              fontWeight: '600', color: '#171717', background: '#ffffff', border: 'none',
                              textAlign: 'center', padding: '0 8px', outline: 'none', appearance: 'none' }} />
                          <button type="button"
                            onClick={() => { if (inventoryItem.quantity < 9999) handleUpdateInventoryQuantity(inventoryItem.quantity + 1); }}
                            disabled={inventoryItem.quantity >= 9999} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: inventoryItem.quantity < 9999 ? '#ffffff' : '#f5f5f5',
                              border: 'none', borderLeft: '1px solid #e5e5e5',
                              cursor: inventoryItem.quantity < 9999 ? 'pointer' : 'not-allowed',
                              color: inventoryItem.quantity < 9999 ? '#171717' : '#a3a3a3', transition: 'all 0.2s',
                              fontSize: 'var(--text-lg)', fontWeight: '600', padding: 0, flexShrink: 0
                            }}>+</button>
                        </div>
                        <button onClick={async (e) => {
                          e.stopPropagation();
                          if (inventoryItem.quantity === 1) {
                            try {
                              const response = await fetch(`/api/set-inventory/${inventoryItem.id}/move-to-collection`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ quantity: 1 })
                              });
                              if (response.ok) {
                                await refreshCollections();
                                setLastMovedItem({ id: inventoryItem.id, direction: 'to-collection' });
                                setMoveSuccess(true);
                                setTimeout(() => { setMoveSuccess(false); setLastMovedItem(null); }, 10000);
                              }
                            } catch (err) {
                              setError(t('setDetail.errors.failedToMove'));
                            }
                          } else {
                            setShowMoveDialog(true);
                          }
                        }} style={{
                          width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#737373', background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '8px',
                          cursor: 'pointer', padding: 0, transition: 'all 0.2s'
                        }} title={t('minifigDetail.moveToCollection')}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget('inventory'); setShowDeleteDialog(true); }}
                          className="inventory-delete-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>

                      {/* Generate Listing - part of inventory section */}
                      <div style={{ marginTop: '16px' }}>
                        <ListingGeneratorForm
                          item={{...inventoryItem, minifigure_no: inventoryItem.box_no, minifigure_name: inventoryItem.set_name}}
                          itemType="set"
                          hasMinifigs={minifigs.length > 0}
                          categoryName={set.category_name}
                          onSuccess={(listing) => {
                            alert(t('minifigDetail.listingSaved'));
                          }}
                          onOpen={() => {
                            setSuccessMessage('');
                            setSuccessVariant(null);
                            setError('');
                          }}
                        />
                      </div>

                      {/* Success message for Items to Sell section */}
                      {successMessage && successVariant === 'sell' && (
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
                            onClick={() => { setSuccessMessage(''); setSuccessVariant(null); }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#065f46',
                              cursor: 'pointer',
                              padding: '4px',
                              fontSize: '20px',
                              lineHeight: 1
                            }}>
                            ×
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {inventoryItem && !personalCollectionItem && (
                    <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e5e5',
                      padding: '20px', marginTop: '24px' }}>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717',
                        marginBottom: '16px', marginTop: '0' }}>{t('minifigDetail.addToKeepPrompt')}</h2>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500',
                          color: '#525252', marginBottom: '8px' }}>{t('setDetail.collection.quantity')}</label>
                        <div className="quantity-stepper">
                          <button type="button" onClick={() => setAddToCollectionQty(Math.max(1, addToCollectionQty - 1))}
                            disabled={addToCollectionQty <= 1} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: addToCollectionQty > 1 ? '#ffffff' : '#f5f5f5',
                              border: 'none', borderRight: '1px solid #e5e5e5',
                              cursor: addToCollectionQty > 1 ? 'pointer' : 'not-allowed',
                              color: addToCollectionQty > 1 ? '#171717' : '#a3a3a3', fontSize: 'var(--text-lg)',
                              fontWeight: '600', padding: 0, flexShrink: 0, transition: 'all 0.2s'
                            }}>−</button>
                          <input type="number" min="1" max="9999" value={addToCollectionQty}
                            onChange={(e) => { const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1 && val <= 9999) setAddToCollectionQty(val); }}
                            onFocus={(e) => e.target.select()}
                            style={{ flex: '1', minWidth: '40px', height: '44px', fontSize: 'var(--text-base)',
                              fontWeight: '600', color: '#171717', background: '#ffffff', border: 'none',
                              textAlign: 'center', padding: '0 8px', outline: 'none', appearance: 'none' }} />
                          <button type="button" onClick={() => setAddToCollectionQty(Math.min(9999, addToCollectionQty + 1))}
                            disabled={addToCollectionQty >= 9999} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: addToCollectionQty < 9999 ? '#ffffff' : '#f5f5f5',
                              border: 'none', borderLeft: '1px solid #e5e5e5',
                              cursor: addToCollectionQty < 9999 ? 'pointer' : 'not-allowed',
                              color: addToCollectionQty < 9999 ? '#171717' : '#a3a3a3', fontSize: 'var(--text-lg)',
                              fontWeight: '600', padding: 0, flexShrink: 0, transition: 'all 0.2s'
                            }}>+</button>
                        </div>
                      </div>
                      <button onClick={handleAddToCollectionFromSection} disabled={addToCollectionLoading}
                        style={{ width: '100%', height: '44px', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '8px', background: '#ffffff',
                          color: addToCollectionLoading ? '#a3a3a3' : '#3b82f6',
                          border: addToCollectionLoading ? '2px solid #d4d4d4' : '2px solid #3b82f6',
                          borderRadius: '8px', fontSize: 'var(--text-sm)', fontWeight: '600',
                          cursor: addToCollectionLoading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s' }}>
                        {addToCollectionLoading ? t('setDetail.buttons.adding') : t('setDetail.buttons.addCollection')}
                      </button>
                    </div>
                  )}

                  {personalCollectionItem && (
                    <>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717',
                        marginBottom: '16px', marginTop: inventoryItem ? '24px' : '0' }}>{t('minifigDetail.itemsToKeep')}</h2>
                      <div className="inventory-actions-container">
                        <div className="quantity-stepper">
                          <button type="button"
                            onClick={() => { if (personalCollectionItem.quantity > 1) handleUpdatePersonalQuantity(personalCollectionItem.quantity - 1); }}
                            disabled={personalCollectionItem.quantity <= 1} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: personalCollectionItem.quantity > 1 ? '#ffffff' : '#f5f5f5',
                              border: 'none', borderRight: '1px solid #e5e5e5',
                              cursor: personalCollectionItem.quantity > 1 ? 'pointer' : 'not-allowed',
                              color: personalCollectionItem.quantity > 1 ? '#171717' : '#a3a3a3', transition: 'all 0.2s',
                              fontSize: 'var(--text-lg)', fontWeight: '600', padding: 0, flexShrink: 0
                            }}>−</button>
                          <input type="number" min="1" max="9999" value={personalCollectionItem.quantity}
                            onChange={(e) => { const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1 && val <= 9999) handleUpdatePersonalQuantity(val); }}
                            onFocus={(e) => e.target.select()}
                            style={{ flex: 1, minWidth: '40px', height: '44px', fontSize: 'var(--text-base)',
                              fontWeight: '600', color: '#171717', background: '#ffffff', border: 'none',
                              textAlign: 'center', padding: '0 8px', outline: 'none', appearance: 'none' }} />
                          <button type="button"
                            onClick={() => { if (personalCollectionItem.quantity < 9999) handleUpdatePersonalQuantity(personalCollectionItem.quantity + 1); }}
                            disabled={personalCollectionItem.quantity >= 9999} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: personalCollectionItem.quantity < 9999 ? '#ffffff' : '#f5f5f5',
                              border: 'none', borderLeft: '1px solid #e5e5e5',
                              cursor: personalCollectionItem.quantity < 9999 ? 'pointer' : 'not-allowed',
                              color: personalCollectionItem.quantity < 9999 ? '#171717' : '#a3a3a3', transition: 'all 0.2s',
                              fontSize: 'var(--text-lg)', fontWeight: '600', padding: 0, flexShrink: 0
                            }}>+</button>
                        </div>
                        <button onClick={async (e) => {
                          e.stopPropagation();
                          if (personalCollectionItem.quantity === 1) {
                            try {
                              const response = await fetch(`/api/set-personal-collection/${personalCollectionItem.id}/move-to-inventory`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ quantity: 1 })
                              });
                              if (response.ok) {
                                await refreshCollections();
                                setLastMovedItem({ id: personalCollectionItem.id, direction: 'to-inventory' });
                                setMoveSuccess(true);
                                setTimeout(() => { setMoveSuccess(false); setLastMovedItem(null); }, 10000);
                              }
                            } catch (err) {
                              setError(t('setDetail.errors.failedToMove'));
                            }
                          } else {
                            setShowMoveToInventoryDialog(true);
                          }
                        }} style={{
                          width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#737373', background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '8px',
                          cursor: 'pointer', padding: 0, transition: 'all 0.2s'
                        }} title={t('minifigDetail.moveToInventory')}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget('collection'); setShowDeleteDialog(true); }}
                          className="inventory-delete-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>

                      {/* Success message for Items to Keep section */}
                      {successMessage && successVariant === 'keep' && (
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
                            onClick={() => { setSuccessMessage(''); setSuccessVariant(null); }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#065f46',
                              cursor: 'pointer',
                              padding: '4px',
                              fontSize: '20px',
                              lineHeight: 1
                            }}>
                            ×
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Add to Inventory Section - Only show when collection exists but inventory doesn't */}
                  {personalCollectionItem && !inventoryItem && (
                    <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e5e5',
                      padding: '20px', marginTop: '24px' }}>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717',
                        marginBottom: '16px', marginTop: '0' }}>{t('minifigDetail.addToSellPrompt')}</h2>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500',
                          color: '#525252', marginBottom: '8px' }}>{t('setDetail.collection.quantity')}</label>
                        <div className="quantity-stepper">
                          <button type="button" onClick={() => setAddToInventoryQty(Math.max(1, addToInventoryQty - 1))}
                            disabled={addToInventoryQty <= 1} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: addToInventoryQty > 1 ? '#ffffff' : '#f5f5f5',
                              border: 'none', borderRight: '1px solid #e5e5e5',
                              cursor: addToInventoryQty > 1 ? 'pointer' : 'not-allowed',
                              color: addToInventoryQty > 1 ? '#171717' : '#a3a3a3', fontSize: 'var(--text-lg)',
                              fontWeight: '600', padding: 0, flexShrink: 0, transition: 'all 0.2s'
                            }}>−</button>
                          <input type="number" min="1" max="9999" value={addToInventoryQty}
                            onChange={(e) => { const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1 && val <= 9999) setAddToInventoryQty(val); }}
                            onFocus={(e) => e.target.select()}
                            style={{ flex: '1', minWidth: '40px', height: '44px', fontSize: 'var(--text-base)',
                              fontWeight: '600', color: '#171717', background: '#ffffff', border: 'none',
                              textAlign: 'center', padding: '0 8px', outline: 'none', appearance: 'none' }} />
                          <button type="button" onClick={() => setAddToInventoryQty(Math.min(9999, addToInventoryQty + 1))}
                            disabled={addToInventoryQty >= 9999} style={{
                              width: '44px', minWidth: '44px', height: '44px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: addToInventoryQty < 9999 ? '#ffffff' : '#f5f5f5',
                              border: 'none', borderLeft: '1px solid #e5e5e5',
                              cursor: addToInventoryQty < 9999 ? 'pointer' : 'not-allowed',
                              color: addToInventoryQty < 9999 ? '#171717' : '#a3a3a3', fontSize: 'var(--text-lg)',
                              fontWeight: '600', padding: 0, flexShrink: 0, transition: 'all 0.2s'
                            }}>+</button>
                        </div>
                      </div>
                      <button onClick={handleAddToInventoryFromSection} disabled={addToInventoryLoading}
                        style={{ width: '100%', height: '44px', background: addToInventoryLoading ? '#a3a3a3' : '#3b82f6',
                          color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: 'var(--text-sm)',
                          fontWeight: '600', cursor: addToInventoryLoading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s' }}>
                        {addToInventoryLoading ? t('setDetail.buttons.adding') : t('setDetail.buttons.addInventory')}
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Price Alert Button */}
              {pricing && pricing.suggestedPrice > 0 && (
                <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                  <PriceAlertButton
                    itemNo={set.box_no}
                    itemType="SET"
                    itemName={set.name}
                    condition={condition}
                    currentPrice={pricing.currentLowest}
                    currencyCode={pricing.currencyCode || 'USD'}
                  />
                </div>
              )}

              {/* Where to Buy Section - always show, prioritize by availability */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #e5e5e5'
              }} className="where-to-buy-section">
                <div style={{ marginBottom: '10px' }}>
                  <h3 style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#525252',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: 0,
                    marginBottom: '4px'
                  }} className="where-to-buy-title">
                    {t('setDetail.whereToBuy.title')}
                  </h3>
                  <p style={{
                    fontSize: '10px',
                    color: '#737373',
                    margin: 0
                  }} className="where-to-buy-subtitle">
                    {t('setDetail.whereToBuy.sponsoredLinks')}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }} className="where-to-buy-buttons">
                  {/* eBay Link - Always show */}
                  <Link
                    href={ebayAffiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAffiliateClick('ebay', set.box_no, 'set-detail-page')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fafafa';
                      e.currentTarget.style.borderColor = '#d4d4d4';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E53238" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          color: '#171717',
                          fontSize: 'var(--text-sm)'
                        }}>
                          {t('buyButtons.ebay.name') || 'eBay'}
                        </div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: '#737373'
                        }}>
                          {t('buyButtons.ebay.description') || 'Rare finds & collector deals'}
                        </div>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#E53238" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>

                  {/* Amazon Link - Always show */}
                  <Link
                    href={amazonAffiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackAffiliateClick('amazon', set.box_no, 'set-detail-page')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fafafa';
                      e.currentTarget.style.borderColor = '#d4d4d4';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          color: '#171717',
                          fontSize: 'var(--text-sm)'
                        }}>
                          {t('buyButtons.amazon.name') || 'Amazon'}
                        </div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: '#737373'
                        }}>
                          {t('buyButtons.amazon.description') || 'Fast shipping & easy returns'}
                        </div>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#FF9900" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>

                  {/* BrickLink Link - Always show */}
                  <Link
                    href={brickLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackAffiliateClick('bricklink', set.box_no, 'set-detail-page')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fafafa';
                      e.currentTarget.style.borderColor = '#d4d4d4';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0057A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          color: '#171717',
                          fontSize: 'var(--text-sm)'
                        }}>
                          {t('buyButtons.bricklink.name') || 'BrickLink'}
                        </div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: '#737373'
                        }}>
                          {t('buyButtons.bricklink.description') || 'Largest LEGO marketplace'}
                        </div>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#0057A6" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {minifigs && minifigs.length > 0 && (
          <div style={{ marginTop: '48px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: '24px', color: '#171717' }}>
              {translations.set_detail?.included_minifigs || 'Included Minifigures'} ({minifigs.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
              {minifigs.map(m => (
                <Link key={m.minifig_no} href={`/minifigs/${m.minifig_no}`} style={{ textDecoration: 'none', display: 'flex' }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e5e5e5',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    {ownedMinifigQuantities[m.minifig_no] > 0 && (
                      <BadgeTooltip
                        text={t('setDetail.ownedMinifigBadgeTooltip', { count: ownedMinifigQuantities[m.minifig_no] }) || `You own ${ownedMinifigQuantities[m.minifig_no]} of this minifig`}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: '#e5e5e5',
                          color: '#525252',
                          borderRadius: '12px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: '700',
                          zIndex: 1,
                          cursor: 'help'
                        }}>
                        ×{ownedMinifigQuantities[m.minifig_no]}
                      </BadgeTooltip>
                    )}
                    {m.quantity > 1 && (
                      <BadgeTooltip
                        text={t('setDetail.setContentsBadgeTooltip', { count: m.quantity }) || `This set includes ${m.quantity} of this minifig`}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#3b82f6',
                          color: 'white',
                          borderRadius: '12px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: '700',
                          zIndex: 1,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          cursor: 'help'
                        }}>
                        ×{m.quantity}
                      </BadgeTooltip>
                    )}
                    <div style={{
                      padding: '16px',
                      height: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fafafa'
                    }}>
                      {m.image_url ? (
                        <Image
                          src={m.image_url}
                          alt={m.name || m.minifig_no}
                          width={120}
                          height={150}
                          style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                          unoptimized
                        />
                      ) : (
                        <div style={{ fontSize: '48px', opacity: 0.3 }}>🧑</div>
                      )}
                    </div>
                    <div style={{
                      padding: '12px',
                      borderTop: '1px solid #e5e5e5',
                      minHeight: '70px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#171717',
                        marginBottom: '4px',
                        lineHeight: '1.3',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {m.name || m.minifig_no}
                      </div>
                      <div style={{ fontSize: '11px', color: '#737373', marginTop: 'auto' }}>{m.minifig_no}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {closeRangeSets && closeRangeSets.length > 0 && (
          <div style={{ marginTop: '48px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: '24px', color: '#171717' }}>
              {t('setDetail.relatedSets.title')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
              {closeRangeSets.map(s => (
                <Link key={s.box_no} href={`/sets/${s.box_no}`} style={{ textDecoration: 'none', display: 'flex' }}>
                  <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5',
                    transition: 'transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
                    {ownedSetQuantities[s.box_no] > 0 && (
                      <BadgeTooltip
                        text={t('setDetail.ownedSetBadgeTooltip', { count: ownedSetQuantities[s.box_no] }) || `You own ${ownedSetQuantities[s.box_no]} of this set`}
                        style={{
                          position: 'absolute', top: '8px', right: '8px', background: '#e5e5e5', color: '#525252',
                          borderRadius: '12px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', zIndex: 1, cursor: 'help'
                        }}>
                        ×{ownedSetQuantities[s.box_no]}
                      </BadgeTooltip>
                    )}
                    <div style={{ padding: '16px', height: '180px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', background: '#ffffff' }}>
                      <SetCardImage imageUrl={s.image_url} setName={s.name} width={160} height={160} maxHeight="160px" />
                    </div>
                    <div style={{ padding: '16px', borderTop: '1px solid #e5e5e5', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#171717', marginBottom: '4px', lineHeight: '1.4' }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: '#737373', marginTop: 'auto' }}>{s.box_no}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {themeSets.length > 0 && (
          <div style={{ marginTop: '48px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: '24px', color: '#171717' }}>
              {t('setDetail.newestFrom').replace('{theme}', parentTheme)}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
              {themeSets.map(s => (
                <Link key={s.box_no} href={`/sets/${s.box_no}`} style={{ textDecoration: 'none', display: 'flex' }}>
                  <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5',
                    transition: 'transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
                    {ownedSetQuantities[s.box_no] > 0 && (
                      <BadgeTooltip
                        text={t('setDetail.ownedSetBadgeTooltip', { count: ownedSetQuantities[s.box_no] }) || `You own ${ownedSetQuantities[s.box_no]} of this set`}
                        style={{
                          position: 'absolute', top: '8px', right: '8px', background: '#e5e5e5', color: '#525252',
                          borderRadius: '12px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', zIndex: 1, cursor: 'help'
                        }}>
                        ×{ownedSetQuantities[s.box_no]}
                      </BadgeTooltip>
                    )}
                    <div style={{ padding: '16px', height: '180px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', background: '#ffffff' }}>
                      <SetCardImage imageUrl={s.image_url} setName={s.name} width={160} height={160} maxHeight="160px" />
                    </div>
                    <div style={{ padding: '16px', borderTop: '1px solid #e5e5e5', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#171717', marginBottom: '4px', lineHeight: '1.4' }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: '#737373', marginTop: 'auto' }}>{s.box_no}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showMoveDialog && inventoryItem && (
        <MoveDialog isOpen={true} onClose={() => setShowMoveDialog(false)} itemName={set.name}
          maxQuantity={inventoryItem.quantity} direction="to-collection"
          onConfirm={async (quantityToMove) => {
            try {
              const response = await fetch(`/api/set-inventory/${inventoryItem.id}/move-to-collection`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: quantityToMove })
              });
              if (response.ok) {
                await refreshCollections();
                setMoveSuccess(true);
                setLastMovedItem({ id: inventoryItem.id, direction: 'to-collection' });
                setShowMoveDialog(false);
              }
            } catch (err) {
              setError(t('setDetail.errors.failedToMove'));
            }
          }} />
      )}

      {showMoveToInventoryDialog && personalCollectionItem && (
        <MoveDialog isOpen={true} onClose={() => setShowMoveToInventoryDialog(false)} itemName={set.name}
          maxQuantity={personalCollectionItem.quantity} direction="to-inventory"
          onConfirm={async (quantityToMove) => {
            try {
              const response = await fetch(`/api/set-personal-collection/${personalCollectionItem.id}/move-to-inventory`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: quantityToMove })
              });
              if (response.ok) {
                await refreshCollections();
                setMoveSuccess(true);
                setLastMovedItem({ id: personalCollectionItem.id, direction: 'to-inventory' });
                setShowMoveToInventoryDialog(false);
              }
            } catch (err) {
              setError(t('setDetail.errors.failedToMove'));
            }
          }} />
      )}

      {showDeleteDialog && deleteTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
          onClick={() => { setShowDeleteDialog(false); setDeleteTarget(null); }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px',
            width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#171717' }}>
              {deleteTarget === 'inventory' ? t('minifigDetail.deleteFromSell') : t('minifigDetail.deleteFromKeep')}
            </h3>
            <p style={{ fontSize: '14px', color: '#737373', marginBottom: '24px', lineHeight: '1.5' }}>
              {deleteTarget === 'inventory' ? t('setDetail.delete.messageInventory') : t('setDetail.delete.messageCollection')}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setShowDeleteDialog(false); setDeleteTarget(null); }}
                style={{ flex: 1, padding: '12px', background: 'white', color: '#525252', border: '1px solid #e5e5e5',
                  borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', minHeight: '44px' }}>
                {t('setDetail.delete.cancel')}
              </button>
              <button onClick={deleteTarget === 'inventory' ? handleRemoveFromInventory : handleRemoveFromCollection}
                style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', minHeight: '44px' }}>
                {t('setDetail.delete.remove')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        itemName={set.name}
        itemType="set"
      />

      {/* Save Collection Modal */}
      <SaveCollectionModal
        isOpen={showSaveCollectionModal}
        onClose={() => setShowSaveCollectionModal(false)}
        itemCount={guestCollectionCount}
        totalValue={guestCollectionTotal}
        currencyCode={pricing.currencyCode}
      />
    </div>
  );
}
