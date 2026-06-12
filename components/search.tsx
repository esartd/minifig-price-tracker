'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from '@/components/TranslationProvider';

interface MinifigResult {
  minifigure_no: string;
  minifigure_name: string;
  image_url?: string;
  category_name?: string;
  year_released?: number;
}

interface SearchResultsProps {
  searchResults: MinifigResult[];
  searchResult: MinifigResult | null;
  onSelectMinifig: (minifig: MinifigResult) => void;
  onAddToCollection: (item: any) => void;
  onCancelSelection: () => void;
  onClearSearch: () => void;
}

function MinifigImage({ imageUrl, name }: { imageUrl?: string; name: string }) {
  const [error, setError] = useState(false);
  if (!imageUrl || error) {
    return (
      <div style={{
        width: '56px', height: '72px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: '6px',
        fontSize: '28px', flexShrink: 0,
      }}>
        🧱
      </div>
    );
  }
  return (
    <Image
      src={imageUrl}
      alt={name}
      width={56}
      height={72}
      unoptimized
      style={{ objectFit: 'contain', flexShrink: 0, borderRadius: '6px' }}
      onError={() => setError(true)}
    />
  );
}

export function SearchResults({
  searchResults,
  searchResult,
  onSelectMinifig,
  onCancelSelection,
  onClearSearch,
}: SearchResultsProps) {
  const { t } = useTranslation();

  if (!searchResults.length && !searchResult) return null;

  if (searchResults.length > 0) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>
            {t('search.results') || `${searchResults.length} results`}
          </span>
          <button
            onClick={onClearSearch}
            style={{
              fontSize: '13px', color: '#737373', background: 'none',
              border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
            }}
          >
            {t('search.clear') || 'Clear'}
          </button>
        </div>
        <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
          {searchResults.map((minifig, i) => (
            <button
              key={minifig.minifigure_no}
              onClick={() => onSelectMinifig(minifig)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: i < searchResults.length - 1 ? '1px solid #f5f5f5' : 'none',
                textAlign: 'left', transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fafafa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <MinifigImage imageUrl={minifig.image_url} name={minifig.minifigure_name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: '0 0 4px', fontSize: '14px', fontWeight: 600,
                  color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {minifig.minifigure_name}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#737373' }}>
                  {minifig.minifigure_no}
                  {minifig.category_name && ` · ${minifig.category_name}`}
                  {minifig.year_released && ` · ${minifig.year_released}`}
                </p>
              </div>
              <svg style={{ width: '16px', height: '16px', color: '#d4d4d4', flexShrink: 0 }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
