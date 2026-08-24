'use client';

import { useState } from 'react';
import { AmazonProductsBlock } from '@/types/article';
import AlertDialog from '../../AlertDialog';

interface AmazonProductsBlockEditorProps {
  block: AmazonProductsBlock;
  onChange: (updates: Partial<AmazonProductsBlock>) => void;
}

export function AmazonProductsBlockEditor({ block, onChange }: AmazonProductsBlockEditorProps) {
  const [fetchingIndex, setFetchingIndex] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const fetchProductInfo = async (url: string, index: number) => {
    setFetchingIndex(index);

    try {
      const response = await fetch('/api/admin/articles/amazon-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();

      const newProducts = [...block.products];
      newProducts[index] = {
        asin: data.asin,
        title: data.title,
        imageUrl: data.imageUrl,
        price: data.price,
      };
      onChange({ products: newProducts });
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setAlertMessage('Failed to auto-fetch product info. Please enter details manually.');
    } finally {
      setFetchingIndex(null);
    }
  };

  const updateProduct = (index: number, field: string, value: string) => {
    const newProducts = [...block.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    onChange({ products: newProducts });
  };

  const removeProduct = (index: number) => {
    const newProducts = block.products.filter((_, i) => i !== index);
    onChange({ products: newProducts });
  };

  const addProduct = () => {
    if (block.products.length >= block.columns) return;
    onChange({
      products: [...block.products, { asin: '', title: '', imageUrl: '' }]
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Column Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button
          onClick={() => onChange({ columns: 1 })}
          style={{
            padding: '6px 12px',
            background: block.columns === 1 ? '#3b82f6' : '#f3f4f6',
            color: block.columns === 1 ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          1 Column
        </button>
        <button
          onClick={() => onChange({ columns: 2 })}
          style={{
            padding: '6px 12px',
            background: block.columns === 2 ? '#3b82f6' : '#f3f4f6',
            color: block.columns === 2 ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          2 Columns
        </button>
        <button
          onClick={() => onChange({ columns: 3 })}
          style={{
            padding: '6px 12px',
            background: block.columns === 3 ? '#3b82f6' : '#f3f4f6',
            color: block.columns === 3 ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          3 Columns
        </button>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${block.columns}, 1fr)`,
        gap: '12px',
      }}>
        {block.products.map((product, index) => (
          <div
            key={index}
            style={{
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#737373', marginBottom: '4px' }}>
                  Amazon Link
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={product.asin || ''}
                    onChange={(e) => updateProduct(index, 'asin', e.target.value)}
                    placeholder="https://amzn.to/4nla5XO or https://amazon.com/dp/..."
                    disabled={fetchingIndex === index}
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '13px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      opacity: fetchingIndex === index ? 0.6 : 1,
                    }}
                  />
                  <button
                    onClick={() => {
                      if (product.asin) {
                        fetchProductInfo(product.asin, index);
                      }
                    }}
                    disabled={!product.asin || fetchingIndex === index}
                    style={{
                      padding: '8px 16px',
                      background: fetchingIndex === index ? '#d1d5db' : '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: !product.asin || fetchingIndex === index ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fetchingIndex === index ? 'Fetching...' : 'Fetch'}
                  </button>
                </div>
                <div style={{ fontSize: '10px', color: '#737373', marginTop: '4px' }}>
                  Paste Amazon link and click "Fetch" to auto-fill product details
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#737373', marginBottom: '4px' }}>
                  Product Title
                </label>
                <input
                  type="text"
                  value={product.title}
                  onChange={(e) => updateProduct(index, 'title', e.target.value)}
                  placeholder="Product name..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '13px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#737373', marginBottom: '4px' }}>
                  Image URL
                </label>
                <input
                  type="text"
                  value={product.imageUrl}
                  onChange={(e) => updateProduct(index, 'imageUrl', e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '13px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#737373', marginBottom: '4px' }}>
                  Price (optional)
                </label>
                <input
                  type="text"
                  value={product.price || ''}
                  onChange={(e) => updateProduct(index, 'price', e.target.value)}
                  placeholder="$29.99"
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '13px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                  }}
                />
              </div>

              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '6px',
                    border: '1px solid #e5e5e5',
                  }}
                />
              )}

              <button
                onClick={() => removeProduct(index)}
                style={{
                  padding: '6px',
                  background: '#fee2e2',
                  color: '#b91c1c',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Button */}
      {block.products.length < block.columns && (
        <button
          onClick={addProduct}
          style={{
            padding: '8px 12px',
            background: '#f3f4f6',
            border: '1px solid #e5e5e5',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          + Add Amazon Product
        </button>
      )}

      <div style={{
        padding: '12px',
        background: '#e0f2fe',
        border: '1px solid #7dd3fc',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#0c4a6e',
      }}>
        <strong>✨ Auto-Fetch:</strong> Paste any Amazon product link (including amzn.to short links) and click "Fetch" to automatically fill in title, image, and price.
      </div>

      <AlertDialog
        isOpen={alertMessage !== null}
        onClose={() => setAlertMessage(null)}
        message={alertMessage || ''}
      />
    </div>
  );
}
