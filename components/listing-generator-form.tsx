'use client';

import { useState } from 'react';

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

export default function ListingGeneratorForm({ item, onSuccess }: ListingGeneratorFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const [formData, setFormData] = useState({
    platform: 'ebay' as 'facebook' | 'ebay' | 'bricklink',
    condition_detail: 'excellent',
    accessories: '',
    known_flaws: '',
    quantity: 1
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/inventory/${item.id}/generate-listing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setPreview(data.listing);
      } else {
        alert(data.error || 'Failed to generate listing');
      }
    } catch (error) {
      alert('Failed to generate listing');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionItemId: item.id,
          ...preview,
          platform: formData.platform,
          ...formData
        })
      });

      const data = await response.json();
      if (data.success) {
        onSuccess(data.listing);
        setIsOpen(false);
        setPreview(null);
      } else {
        alert(data.error || 'Failed to save listing');
      }
    } catch (error) {
      alert('Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginTop: '16px'
        }}
      >
        📝 Generate Listing
      </button>
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
      {!preview ? (
        <>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Generate Listing</h3>

          {/* Platform Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Platform:</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value as 'facebook' | 'ebay' | 'bricklink' }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="ebay">eBay</option>
              <option value="facebook">Facebook Marketplace</option>
              <option value="bricklink">BrickLink</option>
            </select>
          </div>

          {/* Condition */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Condition:</label>
            <select
              value={formData.condition_detail}
              onChange={(e) => setFormData(prev => ({ ...prev, condition_detail: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="new">New - Never assembled</option>
              <option value="like_new">Like New - Assembled but perfect</option>
              <option value="excellent">Excellent - Light wear</option>
              <option value="good">Good - Visible wear</option>
              <option value="fair">Fair - Scratches, loose joints</option>
            </select>
          </div>

          {/* Accessories */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Accessories Included:</label>
            <textarea
              placeholder="Helmet, blasters, cape..."
              value={formData.accessories}
              onChange={(e) => setFormData(prev => ({ ...prev, accessories: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '80px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Known Flaws */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Known Flaws (optional):</label>
            <textarea
              placeholder="Minor print wear, loose joints..."
              value={formData.known_flaws}
              onChange={(e) => setFormData(prev => ({ ...prev, known_flaws: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '80px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Quantity to List:</label>
            <input
              type="number"
              min="1"
              max={item.quantity}
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#ffffff',
                color: '#171717',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Generating...' : 'Generate Listing'}
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Preview</h3>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Title:</strong>
              <p style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', margin: 0 }}>{preview.title}</p>
            </div>

            <div>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Description:</strong>
              <pre style={{
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                margin: 0,
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>{preview.description}</pre>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setPreview(null)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#ffffff',
                color: '#171717',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Regenerate
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: loading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Save Listing'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
