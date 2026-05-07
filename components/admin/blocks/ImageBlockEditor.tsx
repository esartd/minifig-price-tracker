'use client';

import { useState } from 'react';
import { ImageBlock } from '@/types/article';

interface ImageBlockEditorProps {
  block: ImageBlock;
  onChange: (updates: Partial<ImageBlock>) => void;
}

export function ImageBlockEditor({ block, onChange }: ImageBlockEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const isDemo = typeof window !== 'undefined' && window.location.pathname.includes('/cms-demo');
      const endpoint = isDemo ? '/api/demo/upload-image' : '/api/admin/articles/images';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      const newImages = [...block.images];
      newImages[index] = {
        ...newImages[index],
        imageId: data.image.id,
        imageUrl: data.image.url,
        alt: file.name.replace(/\.[^/.]+$/, ''),
      };
      onChange({ images: newImages });
    } catch (err) {
      alert('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploadingIndex(null);
    }
  };

  const updateImage = (index: number, field: string, value: any) => {
    const newImages = [...block.images];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange({ images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = block.images.filter((_, i) => i !== index);
    onChange({ images: newImages });
  };

  const addImage = () => {
    if (block.images.length >= block.columns) return;
    onChange({
      images: [...block.images, { imageId: '', imageUrl: '', alt: '' }]
    });
  };

  const positionPresets = [
    { label: 'Center', value: 'center' },
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ];

  const sizePresets = [
    { label: 'Auto', height: undefined, ratio: 'Full' },
    { label: 'Banner', height: 240, ratio: '3:1' },
    { label: 'Panoramic', height: 309, ratio: '21:9' },
    { label: 'Landscape', height: 405, ratio: '16:9' },
    { label: 'Standard', height: 540, ratio: '4:3' },
    { label: 'Square', height: 720, ratio: '1:1' },
  ];

  const updateAllImagesHeight = (height: number | undefined) => {
    const newImages = block.images.map(img => ({ ...img, height, objectPosition: height ? (img.objectPosition || 'center') : undefined }));
    onChange({ images: newImages });
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
          1 Image
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
          2 Images
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
          3 Images
        </button>
      </div>

      {/* Global Size Control (applies to all images) */}
      <div style={{
        padding: '12px',
        background: '#f9fafb',
        border: '1px solid #e5e5e5',
        borderRadius: '6px',
      }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '8px', fontWeight: '600' }}>
          Image Size (All)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {sizePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => updateAllImagesHeight(preset.height)}
              style={{
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                border: block.images[0]?.height === preset.height ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                borderRadius: '6px',
                background: block.images[0]?.height === preset.height ? '#eff6ff' : '#ffffff',
                color: block.images[0]?.height === preset.height ? '#3b82f6' : '#374151',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: '600' }}>{preset.label}</div>
              <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>{preset.ratio}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${block.columns}, 1fr)`,
        gap: '12px',
      }}>
        {block.images.map((image, index) => (
          <div
            key={index}
            style={{
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            {!image.imageUrl ? (
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  border: '2px dashed #e5e5e5',
                  borderRadius: '8px',
                  background: '#ffffff',
                  cursor: uploadingIndex === index ? 'wait' : 'pointer',
                  minHeight: '200px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>
                  {uploadingIndex === index ? '⏳' : '📸'}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#171717', marginBottom: '4px' }}>
                  {uploadingIndex === index ? 'Uploading...' : 'Click to upload image'}
                </div>
                <div style={{ fontSize: '13px', color: '#737373' }}>
                  Auto-compressed to WebP
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, index)}
                  disabled={uploadingIndex === index}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  width: '100%',
                  height: image.height || 'auto',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}>
                  <img
                    src={image.imageUrl}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: image.height ? '100%' : 'auto',
                      objectFit: image.height ? 'cover' : 'contain',
                      objectPosition: image.objectPosition || 'center',
                      display: 'block',
                    }}
                  />
                </div>

                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateImage(index, 'alt', e.target.value)}
                  placeholder="Alt text"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                  }}
                />

                <input
                  type="text"
                  value={image.caption || ''}
                  onChange={(e) => updateImage(index, 'caption', e.target.value)}
                  placeholder="Caption (optional)"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                  }}
                />

                {/* Position Control (individual per image) */}
                {image.height && (
                  <div style={{
                    padding: '12px',
                    background: '#f9fafb',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                  }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '4px' }}>
                      Image Position
                    </label>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {positionPresets.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => updateImage(index, 'objectPosition', preset.value)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: (image.objectPosition || 'center') === preset.value ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                            borderRadius: '6px',
                            background: (image.objectPosition || 'center') === preset.value ? '#eff6ff' : '#ffffff',
                            color: (image.objectPosition || 'center') === preset.value ? '#3b82f6' : '#374151',
                            cursor: 'pointer',
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => removeImage(index)}
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
            )}
          </div>
        ))}
      </div>

      {/* Add Image Button */}
      {block.images.length < block.columns && (
        <button
          onClick={addImage}
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
          + Add Image
        </button>
      )}
    </div>
  );
}
