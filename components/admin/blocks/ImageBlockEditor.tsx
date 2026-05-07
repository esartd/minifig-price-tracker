'use client';

import { useState } from 'react';
import { ImageBlock } from '@/types/article';

interface ImageBlockEditorProps {
  block: ImageBlock;
  onChange: (updates: Partial<ImageBlock>) => void;
}

export function ImageBlockEditor({ block, onChange }: ImageBlockEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/articles/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      onChange({
        imageId: data.image.id,
        imageUrl: data.image.url,
        alt: block.alt || file.name.replace(/\.[^/.]+$/, ''),
      });
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {!block.imageUrl ? (
        <div>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              border: '2px dashed #e5e5e5',
              borderRadius: '8px',
              background: '#fafafa',
              cursor: uploading ? 'wait' : 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>
              {uploading ? '⏳' : '📸'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#171717', marginBottom: '4px' }}>
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </div>
            <div style={{ fontSize: '13px', color: '#737373' }}>
              PNG, JPG, WEBP (Max 5MB)
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          {error && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '6px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          <img
            src={block.imageUrl}
            alt={block.alt}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              value={block.alt}
              onChange={(e) => onChange({ alt: e.target.value })}
              placeholder="Alt text (for accessibility)"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
            <input
              type="text"
              value={block.caption || ''}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder="Caption (optional)"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => onChange({ imageUrl: '', imageId: '', alt: '', caption: '' })}
              style={{
                padding: '8px 12px',
                background: '#fee2e2',
                color: '#b91c1c',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Remove Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
