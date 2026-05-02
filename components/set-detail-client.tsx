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
import { formatPrice } from '@/lib/format-price';
import { getSetAvailability } from '@/lib/set-availability';
import { generateLegoSetLink, generateAmazonLegoSetLink, generateBrickLinkAffiliateLink } from '@/lib/affiliate-links';
import { trackAffiliateClick } from '@/lib/analytics';

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
  const { t } = useTranslation();
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

  const [condition, setCondition] = useState<'new' | 'used'>('new');

  const [featuredSets, setFeaturedSets] = useState<any[]>([]);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(set.image_url);

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
  }, [set.box_no, condition, session]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('condition', condition);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [condition, router, searchParams]);

  useEffect(() => {
    setSuccessMessage('');
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
      router.push('/auth/signin');
      return;
    }
    setAddLoading(true);
    setError('');
    setSuccessMessage('');
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
      router.push('/auth/signin');
      return;
    }
    setAddPersonalLoading(true);
    setError('');
    setSuccessMessage('');
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
        body: JSON.stringify({ box_no: set.box_no, quantity: addToCollectionQty, condition })
      });
      const data = await response.json();
      if (data.success) {
        await refreshCollections();
        const itemText = addToCollectionQty === 1 ? 'item' : 'items';
        setSuccessMessage(`Added ${addToCollectionQty} ${itemText} to keep`);
        setAddToCollectionQty(1);
      } else {
        setError(data.error || 'Failed to add');
      }
    } catch (err) {
      setError(t('setDetail.errors.failedToAddToCollection'));
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
      const response = await fetch('/api/set-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ box_no: set.box_no, quantity: addToInventoryQty, condition })
      });
      const data = await response.json();
      if (data.success) {
        await refreshCollections();
        const itemText = addToInventoryQty === 1 ? 'item' : 'items';
        setSuccessMessage(`Added ${addToInventoryQty} ${itemText} to sell`);
        setAddToInventoryQty(1);
      } else {
        setError(data.error || 'Failed to add');
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
      setError('Failed to update quantity');
    }
  };

  const handleUpdatePersonalQuantity = async (newQuantity: number) => {
    if (!personalCollectionItem || !session) return;
    setSuccessMessage('');
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
      setError('Failed to update quantity');
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
          ✓ Moved to {lastMovedItem.direction === 'to-collection' ? 'Collection' : 'Inventory'}! Click anywhere to dismiss.
        </div>
      )}

      <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Set Themes', href: '/sets-themes' },
            { label: parentTheme, href: `/sets-themes/${encodeURIComponent(parentTheme)}` },
            { label: set.name }
          ]} />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <div className="minifig-detail-grid" style={{
          display: 'flex', flexDirection: 'column', background: '#ffffff',
          marginTop: '24px', borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div className="minifig-image-container" style={{
            padding: '32px', background: '#ffffff', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            {!imageError ? (
              <Image
                src={imageUrl}
                alt={set.name}
                width={600}
                height={600}
                quality={100}
                style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'contain' }}
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

          <div className="minifig-details-section" style={{ padding: '32px' }}>
            {/* Year Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '8px', marginBottom: '8px', marginTop: 0, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: '500', color: '#3b82f6',
                textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 1 auto', minWidth: 0 }}>
                {set.year_released && set.year_released !== '?' ? set.year_released : 'Year Unknown'}
              </span>
            </div>

            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: '#171717', marginBottom: '8px' }}>
              {set.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', margin: 0 }}>
                {set.box_no}
              </p>
              {session && (allInventoryItems.length > 0 || allCollectionItems.length > 0) && (
                <div style={{ fontSize: 'var(--text-xs)', color: '#737373', display: 'flex', gap: '8px' }}>
                  {allInventoryItems.length > 0 && (
                    <span>Inventory: {allInventoryItems.sort((a, b) => a.condition === 'new' ? -1 : 1)
                      .map((item: any) => `${item.quantity}x ${item.condition === 'new' ? 'New' : 'Used'}`).join(', ')}</span>
                  )}
                  {allCollectionItems.length > 0 && (
                    <span>Collection: {allCollectionItems.sort((a, b) => a.condition === 'new' ? -1 : 1)
                      .map((item: any) => `${item.quantity}x ${item.condition === 'new' ? 'New' : 'Used'}`).join(', ')}</span>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', padding: '4px',
              background: '#f5f5f5', borderRadius: '8px', width: 'fit-content' }}>
              <button onClick={() => setCondition('new')} style={{
                padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: '600',
                color: condition === 'new' ? '#ffffff' : '#525252',
                background: condition === 'new' ? '#3b82f6' : 'transparent',
                border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}>New</button>
              <button onClick={() => setCondition('used')} style={{
                padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: '600',
                color: condition === 'used' ? '#ffffff' : '#525252',
                background: condition === 'used' ? '#3b82f6' : 'transparent',
                border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}>Used</button>
            </div>

            {pricing.loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#737373' }}>
                <p style={{ fontSize: 'var(--text-sm)' }}>Loading pricing...</p>
              </div>
            ) : pricing.suggestedPrice > 0 ? (
              <div className="minifig-pricing-row" style={{
                display: 'flex', width: '100%', marginBottom: '24px', alignItems: 'stretch'
              }}>
                <div className="pricing-item" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 'clamp(9px, 2vw, 10px)', fontWeight: '500', color: '#737373',
                    textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>6 Mo Avg</p>
                  <p style={{ fontSize: 'clamp(16px, 3.5vw, 18px)', fontWeight: '700', color: '#171717' }}>
                    {formatPrice(pricing.sixMonthAverage, pricing.currencyCode, true)}</p>
                </div>
                <div className="pricing-divider" style={{ width: '1px', background: '#e5e5e5' }}></div>
                <div className="pricing-item" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 'clamp(9px, 2vw, 10px)', fontWeight: '500', color: '#737373',
                    textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>Current Avg</p>
                  <p style={{ fontSize: 'clamp(16px, 3.5vw, 18px)', fontWeight: '700', color: '#171717' }}>
                    {formatPrice(pricing.currentAverage, pricing.currencyCode, true)}</p>
                </div>
                <div className="pricing-divider" style={{ width: '1px', background: '#e5e5e5' }}></div>
                <div className="pricing-item" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 'clamp(9px, 2vw, 10px)', fontWeight: '500', color: '#737373',
                    textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>Lowest</p>
                  <p style={{ fontSize: 'clamp(16px, 3.5vw, 18px)', fontWeight: '700', color: '#171717' }}>
                    {formatPrice(pricing.currentLowest, pricing.currencyCode, true)}</p>
                </div>
                <div className="pricing-divider" style={{ width: '1px', background: '#e5e5e5' }}></div>
                <div className="pricing-item" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 'clamp(9px, 2vw, 10px)', fontWeight: '500', color: '#737373',
                    textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>Suggested</p>
                  <p style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: '700', color: '#3b82f6' }}>
                    {formatPrice(pricing.suggestedPrice, pricing.currencyCode, true)}</p>
                </div>
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', background: '#fafafa',
                borderRadius: '8px', color: '#737373', fontSize: 'var(--text-sm)', marginBottom: '24px' }}>
                No sellers available in your region
              </div>
            )}

            <div style={{ height: '1px', background: '#e5e5e5', marginBottom: '16px' }}></div>

            <div>
              {checkingCollection ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#737373' }}>Checking collections...</div>
              ) : (
                <>
                  {/* Show add buttons when neither inventory nor collection exists */}
                  {!inventoryItem && !personalCollectionItem && (
                    <div>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717',
                        marginTop: 0, marginBottom: '16px' }}>Add This Set</h2>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500',
                          color: '#525252', marginBottom: '8px' }}>Quantity</label>
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
                          + To sell
                        </button>
                        <button onClick={() => handleAddToPersonalCollection(quantity)} disabled={addPersonalLoading}
                          style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px', background: addPersonalLoading ? '#a3a3a3' : '#3b82f6', color: '#ffffff',
                            border: 'none', borderRadius: '8px', fontSize: 'var(--text-sm)', fontWeight: '600',
                            cursor: addPersonalLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                          + To keep
                        </button>
                      </div>
                    </div>
                  )}

                  {inventoryItem && (
                    <>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717',
                        marginBottom: '16px' }}>Items to Sell</h2>
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
                        }} title="Move to Your Collection">
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
                          onSuccess={(listing) => {
                            alert('Listing saved!');
                          }}
                          onOpen={() => {
                            setSuccessMessage('');
                            setError('');
                          }}
                        />
                      </div>

                      {/* Success message for Items to Sell section */}
                      {successMessage && successMessage.includes('to sell') && (
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
                        marginBottom: '16px', marginTop: '0' }}>Add to keep?</h2>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500',
                          color: '#525252', marginBottom: '8px' }}>Quantity</label>
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
                        {addToCollectionLoading ? 'Adding...' : '+ Add to keep'}
                      </button>
                    </div>
                  )}

                  {personalCollectionItem && (
                    <>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: '#171717',
                        marginBottom: '16px', marginTop: inventoryItem ? '24px' : '0' }}>Items to Keep</h2>
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
                        }} title="Move to Inventory">
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
                      {successMessage && successMessage.includes('to keep') && (
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
                        marginBottom: '16px', marginTop: '0' }}>Add to sell?</h2>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500',
                          color: '#525252', marginBottom: '8px' }}>Quantity</label>
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
                        {addToInventoryLoading ? 'Adding...' : 'Add to sell'}
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Where to Buy Section - always show, prioritize by availability */}
              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #e5e5e5'
              }}>
                <h3 style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#525252',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: 0,
                  marginBottom: '12px'
                }}>
                  Where to Buy
                </h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* BrickLink Link - Always show with blue styling */}
                  {(() => {
                    const bgColor = '#EFF6FF';
                    const bgHoverColor = '#DBEAFE';
                    const borderColor = '#3b82f6';
                    const iconColor = '#3b82f6';
                    const shadowColor = 'rgba(59, 130, 246, 0.15)';

                    return (
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
                          background: bgColor,
                          border: `2px solid ${borderColor}`,
                          borderRadius: '8px',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = bgHoverColor;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = `0 2px 8px ${shadowColor}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = bgColor;
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                              BrickLink
                            </div>
                            <div style={{
                              fontSize: 'var(--text-xs)',
                              color: '#737373'
                            }}>
                              {availability.status === 'retired' ? 'Best for retired sets' : 'Used & new available'}
                            </div>
                          </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={iconColor} style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    );
                  })()}

                  {/* Amazon Link - Show for available sets */}
                  {(availability.status === 'available' || availability.status === 'retiring_soon') && (
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
                        background: '#FFF9F0',
                        border: '2px solid #FF9900',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FFE4B3';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 153, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FFF9F0';
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
                            Amazon
                          </div>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: '#737373'
                          }}>
                            Fast shipping • Sponsored
                          </div>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#FF9900" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {themeSets.length > 0 && (
          <div style={{ marginTop: '48px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: '24px', color: '#171717' }}>
              More from {parentTheme}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
              {themeSets.map(s => (
                <Link key={s.box_no} href={`/sets/${s.box_no}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5',
                    transition: 'transform 0.2s', cursor: 'pointer' }}>
                    <div style={{ padding: '16px', height: '180px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', background: '#ffffff' }}>
                      <SetCardImage imageUrl={s.image_url} setName={s.name} width={160} height={160} maxHeight="160px" />
                    </div>
                    <div style={{ padding: '16px', borderTop: '1px solid #e5e5e5' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#171717', marginBottom: '4px' }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: '#737373' }}>{s.box_no}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {featuredSets.length > 0 && (
          <div style={{ marginTop: '48px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: '24px', color: '#171717' }}>
              Featured {parentTheme} Sets
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {featuredSets.map((setAd) => (
                <SetAdCard key={setAd.setNumber || setAd.box_no} setNumber={setAd.setNumber || setAd.box_no}
                  setName={setAd.name} imageUrl={setAd.imageUrl || setAd.image_url}
                  year={setAd.year || (setAd.year_released ? parseInt(setAd.year_released) : undefined)}
                  amazonUrl={setAd.amazonUrl} />
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
              setError('Failed to move');
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
              setError('Failed to move');
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
              Delete from {deleteTarget === 'inventory' ? 'items to sell' : 'items to keep'}?
            </h3>
            <p style={{ fontSize: '14px', color: '#737373', marginBottom: '24px', lineHeight: '1.5' }}>
              This will permanently remove this set from your {deleteTarget === 'inventory' ? 'items to sell' : 'items to keep'}.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setShowDeleteDialog(false); setDeleteTarget(null); }}
                style={{ flex: 1, padding: '12px', background: 'white', color: '#525252', border: '1px solid #e5e5e5',
                  borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', minHeight: '44px' }}>
                Cancel
              </button>
              <button onClick={deleteTarget === 'inventory' ? handleRemoveFromInventory : handleRemoveFromCollection}
                style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', minHeight: '44px' }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
