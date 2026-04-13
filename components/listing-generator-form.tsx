'use client';

import { useState, useEffect } from 'react';

interface CollectionItem {
  id: string;
  minifigure_no: string;
  minifigure_name: string;
  quantity: number;
  condition: string;
  image_url?: string;
  pricing_suggested_price?: number;
  pricing_current_avg?: number;
  pricing_current_lowest?: number;
}

interface ListingGeneratorFormProps {
  item: CollectionItem;
  onSuccess: (listing: any) => void;
}

interface ListingPreferences {
  // Facebook
  offersShipping: boolean;
  offersLocalPickup: boolean;
  offersBundleDiscount: boolean;
  acceptsCash: boolean;
  acceptsVenmo: boolean;
  acceptsPayPal: boolean;

  // eBay
  acceptsOffers: boolean;
  fastShipping: boolean;
  carefulPackaging: boolean;
  messageWithQuestions: boolean;

  // All platforms
  smokeFreeHome: boolean;
  shipsWithTracking: boolean;
}

const DEFAULT_PREFERENCES: ListingPreferences = {
  // Facebook defaults
  offersShipping: true,
  offersLocalPickup: true,
  offersBundleDiscount: true,
  acceptsCash: true,
  acceptsVenmo: false,
  acceptsPayPal: false,

  // eBay defaults
  acceptsOffers: true,
  fastShipping: true,
  carefulPackaging: true,
  messageWithQuestions: true,

  // All platforms
  smokeFreeHome: true,
  shipsWithTracking: true,
};

export default function ListingGeneratorForm({ item, onSuccess }: ListingGeneratorFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  // Load preferences from localStorage
  const [preferences, setPreferences] = useState<ListingPreferences>(DEFAULT_PREFERENCES);
  const [usageStats, setUsageStats] = useState<{
    platformCounts: { facebook: number; ebay: number; bricklink: number };
    conditionCounts: {
      facebook: Record<string, number>;
      ebay: Record<string, number>;
      bricklink: Record<string, number>;
    };
  }>({
    platformCounts: { facebook: 0, ebay: 0, bricklink: 0 },
    conditionCounts: {
      facebook: {},
      ebay: {},
      bricklink: {}
    }
  });

  // Get most frequently used platform and condition
  const getMostFrequentPlatform = (): 'facebook' | 'ebay' | 'bricklink' => {
    const { platformCounts } = usageStats;
    const entries = Object.entries(platformCounts) as [('facebook' | 'ebay' | 'bricklink'), number][];
    if (entries.every(([_, count]) => count === 0)) return 'ebay'; // Default
    return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  const getMostFrequentCondition = (platform: 'facebook' | 'ebay' | 'bricklink'): string => {
    const conditions = usageStats.conditionCounts[platform];
    const entries = Object.entries(conditions);
    if (entries.length === 0) return 'new'; // Default
    return entries.reduce((a, b) => a[1] > b[1] ? a : b, ['new', 0])[0];
  };

  useEffect(() => {
    const saved = localStorage.getItem('listingPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }

    const savedStats = localStorage.getItem('listingUsageStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setUsageStats(stats);

      // Set form defaults based on usage
      const defaultPlatform = getMostFrequentPlatformFromStats(stats);
      const defaultCondition = getMostFrequentConditionFromStats(stats, defaultPlatform);

      // Load last-used form values
      const savedFormValues = localStorage.getItem('lastListingFormValues');
      if (savedFormValues) {
        const lastValues = JSON.parse(savedFormValues);
        setFormData({
          platform: defaultPlatform,
          condition_detail: defaultCondition,
          accessories: lastValues.accessories || '',
          known_flaws: lastValues.known_flaws || '',
          quantity: lastValues.quantity || 1
        });
      } else {
        setFormData(prev => ({
          ...prev,
          platform: defaultPlatform,
          condition_detail: defaultCondition
        }));
      }
    }
  }, []);

  // Helper functions to get most frequent from stats object
  const getMostFrequentPlatformFromStats = (stats: any): 'facebook' | 'ebay' | 'bricklink' => {
    const { platformCounts } = stats;
    const entries = Object.entries(platformCounts) as [('facebook' | 'ebay' | 'bricklink'), number][];
    if (entries.every(([_, count]) => count === 0)) return 'ebay';
    return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  const getMostFrequentConditionFromStats = (stats: any, platform: 'facebook' | 'ebay' | 'bricklink'): string => {
    const conditions = stats.conditionCounts[platform];
    const entries = Object.entries(conditions) as [string, number][];
    if (entries.length === 0) return 'new';
    return entries.reduce((a, b) => a[1] > b[1] ? a : b, ['new', 0])[0];
  };

  const [formData, setFormData] = useState({
    platform: 'ebay' as 'facebook' | 'ebay' | 'bricklink',
    condition_detail: 'new',
    accessories: '',
    known_flaws: '',
    quantity: 1
  });

  // Update condition when platform changes (use most frequent for that platform)
  const handlePlatformChange = (newPlatform: 'facebook' | 'ebay' | 'bricklink') => {
    const mostFrequentCondition = getMostFrequentCondition(newPlatform);
    setFormData(prev => ({
      ...prev,
      platform: newPlatform,
      condition_detail: mostFrequentCondition
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/inventory/${item.id}/generate-listing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          preferences
        })
      });

      const data = await response.json();
      if (data.success) {
        setPreview(data.listing);
        setEditedTitle(data.listing.title);
        setEditedDescription(data.listing.description);
        setIsEditing(false);
        setShowDetailedForm(false); // Close form to show preview

        // Save preferences for next time
        localStorage.setItem('listingPreferences', JSON.stringify(preferences));

        // Save form values for next time
        localStorage.setItem('lastListingFormValues', JSON.stringify({
          accessories: formData.accessories,
          known_flaws: formData.known_flaws,
          quantity: formData.quantity
        }));

        // Update usage statistics
        const updatedStats = {
          platformCounts: {
            ...usageStats.platformCounts,
            [formData.platform]: usageStats.platformCounts[formData.platform] + 1
          },
          conditionCounts: {
            ...usageStats.conditionCounts,
            [formData.platform]: {
              ...usageStats.conditionCounts[formData.platform],
              [formData.condition_detail]: (usageStats.conditionCounts[formData.platform][formData.condition_detail] || 0) + 1
            }
          }
        };
        setUsageStats(updatedStats);
        localStorage.setItem('listingUsageStats', JSON.stringify(updatedStats));
      } else {
        alert(data.error || 'Failed to generate listing');
      }
    } catch (error) {
      alert('Failed to generate listing');
    } finally {
      setLoading(false);
    }
  };


  // Quick generate with saved defaults
  const handleQuickGenerate = async () => {
    const defaultPlatform = getMostFrequentPlatform();
    const defaultCondition = getMostFrequentCondition(defaultPlatform);

    // Get last used form values
    const savedFormValues = localStorage.getItem('lastListingFormValues');
    const lastValues = savedFormValues ? JSON.parse(savedFormValues) : {};

    const quickFormData = {
      platform: defaultPlatform,
      condition_detail: defaultCondition,
      accessories: lastValues.accessories || '',
      known_flaws: lastValues.known_flaws || '',
      quantity: lastValues.quantity || 1
    };

    setLoading(true);
    try {
      const response = await fetch(`/api/inventory/${item.id}/generate-listing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quickFormData,
          preferences
        })
      });

      const data = await response.json();
      if (data.success) {
        setPreview(data.listing);
        setEditedTitle(data.listing.title);
        setEditedDescription(data.listing.description);
        setIsEditing(false);
        setIsOpen(true);
        setShowDetailedForm(false);
        setFormData(quickFormData); // Update formData so price displays correctly

        // Update usage stats
        const updatedStats = {
          platformCounts: {
            ...usageStats.platformCounts,
            [quickFormData.platform]: usageStats.platformCounts[quickFormData.platform] + 1
          },
          conditionCounts: {
            ...usageStats.conditionCounts,
            [quickFormData.platform]: {
              ...usageStats.conditionCounts[quickFormData.platform],
              [quickFormData.condition_detail]: (usageStats.conditionCounts[quickFormData.platform][quickFormData.condition_detail] || 0) + 1
            }
          }
        };
        setUsageStats(updatedStats);
        localStorage.setItem('listingUsageStats', JSON.stringify(updatedStats));
      } else {
        alert(data.error || 'Failed to generate listing');
      }
    } catch (error) {
      alert('Failed to generate listing');
    } finally {
      setLoading(false);
    }
  };

  // Check if user has generated listings before
  const hasUsageHistory = usageStats.platformCounts.facebook > 0 ||
                          usageStats.platformCounts.ebay > 0 ||
                          usageStats.platformCounts.bricklink > 0;

  if (!isOpen) {
    return (
      <div style={{ marginTop: '24px' }}>
        {!hasUsageHistory && (
          <div style={{
            marginBottom: '12px',
            padding: '12px',
            backgroundColor: '#eff6ff',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#1e40af',
            border: '1px solid #dbeafe'
          }}>
            💡 <strong>First time?</strong> Use the settings icon to customize your preferences. Quick Generate will remember them for next time!
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleQuickGenerate}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 20px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = '#2563eb';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = '#3b82f6';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            {loading ? 'Generating...' : 'Quick Generate'}
          </button>
        <button
          onClick={() => {
            setIsOpen(true);
            setShowDetailedForm(true);
            // Set defaults based on usage when opening
            const defaultPlatform = getMostFrequentPlatform();
            const defaultCondition = getMostFrequentCondition(defaultPlatform);
            setFormData(prev => ({
              ...prev,
              platform: defaultPlatform,
              condition_detail: defaultCondition
            }));
          }}
          title="Customize options"
          style={{
            padding: '14px 16px',
            backgroundColor: '#ffffff',
            color: '#525252',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: '24px',
      padding: '24px',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      backgroundColor: '#ffffff'
    }}>
      {preview && !showDetailedForm ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Generated Listing</h3>
            <button
              onClick={() => setShowDetailedForm(true)}
              title="Adjust Settings"
              style={{
                  width: '40px',
                  height: '40px',
                  padding: '0',
                  backgroundColor: '#ffffff',
                  color: '#3b82f6',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '14px', fontWeight: '600', color: '#171717' }}>Title:</strong>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(editedTitle);
                    alert('Title copied to clipboard!');
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  Copy Title
                </button>
              </div>
              <textarea
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  minHeight: '60px',
                  resize: 'vertical',
                  lineHeight: '1.5'
                }}
              />
            </div>

            {/* Suggested Price */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '14px', fontWeight: '600', color: '#171717' }}>Price:</strong>
                <button
                  onClick={() => {
                    const price = formData.platform === 'facebook'
                      ? Math.round(item.pricing_suggested_price || 0).toString()
                      : (item.pricing_suggested_price || 0).toFixed(2);
                    navigator.clipboard.writeText(price);
                    alert('Price copied to clipboard!');
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  Copy Price
                </button>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '16px', fontWeight: '600', color: '#171717' }}>
                {formData.platform === 'facebook'
                  ? `$${Math.round(item.pricing_suggested_price || 0)}`
                  : `$${(item.pricing_suggested_price || 0).toFixed(2)}`
                }
                {formData.platform === 'facebook' && (
                  <span style={{ fontSize: '12px', color: '#737373', marginLeft: '8px', fontWeight: 'normal' }}>
                    (whole number)
                  </span>
                )}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '14px', fontWeight: '600', color: '#171717' }}>Description:</strong>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(editedDescription);
                    alert('Description copied to clipboard!');
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  Copy Description
                </button>
              </div>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  minHeight: '200px',
                  resize: 'vertical',
                  lineHeight: '1.6'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => {
                setIsOpen(false);
                setPreview(null);
                setIsEditing(false);
                setShowDetailedForm(false);
              }}
              style={{
                flex: 1,
                padding: '14px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              Done
            </button>
          </div>
        </>
      ) : showDetailedForm ? (
        <>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0, marginBottom: '24px' }}>
            {preview ? 'Adjust Settings' : 'Generate Listing'}
          </h3>

          {/* Platform Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#171717' }}>Platform:</label>
            <select
              value={formData.platform}
              onChange={(e) => handlePlatformChange(e.target.value as 'facebook' | 'ebay' | 'bricklink')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23737373\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
            >
              <option value="ebay">eBay</option>
              <option value="facebook">Facebook Marketplace</option>
              <option value="bricklink">BrickLink</option>
            </select>
          </div>

          {/* Condition */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#171717' }}>Condition:</label>
            <select
              value={formData.condition_detail}
              onChange={(e) => setFormData(prev => ({ ...prev, condition_detail: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23737373\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
            >
              {formData.platform === 'facebook' && (
                <>
                  <option value="new">New</option>
                  <option value="like_new">Like new</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </>
              )}
              {formData.platform === 'ebay' && (
                <>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="very_good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="acceptable">Acceptable</option>
                </>
              )}
              {formData.platform === 'bricklink' && (
                <>
                  <option value="new">New</option>
                  <option value="like_new">Used - Like New</option>
                  <option value="very_good">Used - Very Good</option>
                  <option value="good">Used - Good</option>
                  <option value="acceptable">Used - Acceptable</option>
                </>
              )}
            </select>
          </div>

          {/* Accessories */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#171717' }}>Accessories Included:</label>
            <textarea
              placeholder="Helmet, blasters, cape..."
              value={formData.accessories}
              onChange={(e) => setFormData(prev => ({ ...prev, accessories: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '80px',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: '1.5'
              }}
            />
          </div>

          {/* Known Flaws */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#171717' }}>Known Flaws (optional):</label>
            <textarea
              placeholder="Minor print wear, loose joints..."
              value={formData.known_flaws}
              onChange={(e) => setFormData(prev => ({ ...prev, known_flaws: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '80px',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: '1.5'
              }}
            />
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#171717' }}>Quantity to List:</label>
            <input
              type="number"
              min="1"
              max={item.quantity}
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Preferences */}
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '14px', color: '#171717' }}>Include in listing:</label>

            <div style={{ display: 'grid', gap: '8px' }}>
              {/* Facebook-specific */}
              {formData.platform === 'facebook' && (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.offersShipping}
                      onChange={(e) => setPreferences(prev => ({ ...prev, offersShipping: e.target.checked }))}
                    />
                    I offer shipping
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.offersLocalPickup}
                      onChange={(e) => setPreferences(prev => ({ ...prev, offersLocalPickup: e.target.checked }))}
                    />
                    I offer local pickup
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.offersBundleDiscount}
                      onChange={(e) => setPreferences(prev => ({ ...prev, offersBundleDiscount: e.target.checked }))}
                    />
                    Bundle discounts available
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.acceptsCash}
                      onChange={(e) => setPreferences(prev => ({ ...prev, acceptsCash: e.target.checked }))}
                    />
                    Accept cash
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.acceptsVenmo}
                      onChange={(e) => setPreferences(prev => ({ ...prev, acceptsVenmo: e.target.checked }))}
                    />
                    Accept Venmo
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.acceptsPayPal}
                      onChange={(e) => setPreferences(prev => ({ ...prev, acceptsPayPal: e.target.checked }))}
                    />
                    Accept PayPal
                  </label>
                </>
              )}

              {/* eBay-specific */}
              {formData.platform === 'ebay' && (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.acceptsOffers}
                      onChange={(e) => setPreferences(prev => ({ ...prev, acceptsOffers: e.target.checked }))}
                    />
                    Offers accepted - "Make Offer" enabled
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.fastShipping}
                      onChange={(e) => setPreferences(prev => ({ ...prev, fastShipping: e.target.checked }))}
                    />
                    Ships fast and securely
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.carefulPackaging}
                      onChange={(e) => setPreferences(prev => ({ ...prev, carefulPackaging: e.target.checked }))}
                    />
                    Carefully packaged in protective material
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.messageWithQuestions}
                      onChange={(e) => setPreferences(prev => ({ ...prev, messageWithQuestions: e.target.checked }))}
                    />
                    "Feel free to message with any questions"
                  </label>
                </>
              )}

              {/* BrickLink-specific */}
              {formData.platform === 'bricklink' && (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.shipsWithTracking}
                      onChange={(e) => setPreferences(prev => ({ ...prev, shipsWithTracking: e.target.checked }))}
                    />
                    Shipped with tracking
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.carefulPackaging}
                      onChange={(e) => setPreferences(prev => ({ ...prev, carefulPackaging: e.target.checked }))}
                    />
                    Carefully packaged
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.messageWithQuestions}
                      onChange={(e) => setPreferences(prev => ({ ...prev, messageWithQuestions: e.target.checked }))}
                    />
                    "Contact with questions before purchasing"
                  </label>
                </>
              )}

              {/* Common to all platforms */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={preferences.smokeFreeHome}
                  onChange={(e) => setPreferences(prev => ({ ...prev, smokeFreeHome: e.target.checked }))}
                />
                From smoke-free home
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => {
                if (preview) {
                  setShowDetailedForm(false);
                } else {
                  setIsOpen(false);
                }
              }}
              style={{
                padding: '14px 24px',
                backgroundColor: '#ffffff',
                color: '#525252',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              {preview ? 'Cancel' : 'Cancel'}
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px 24px',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              {loading ? 'Generating...' : preview ? 'Regenerate' : 'Generate Listing'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
