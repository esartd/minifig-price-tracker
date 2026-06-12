'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

function tx(translations: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((obj, key) => obj?.[key], translations as any) as string | undefined;
}

interface MinifigItem {
  id: string;
  minifigure_no: string;
  minifigure_name: string;
  quantity: number;
  condition: string;
  image_url?: string | null;
  date_added: string;
}

interface SetItem {
  id: string;
  box_no: string;
  set_name: string;
  category_name?: string | null;
  quantity: number;
  condition: string;
  image_url?: string | null;
  date_added: string;
}

type ItemType = 'minifig' | 'set';

interface PublicCollectionListProps {
  items: (MinifigItem | SetItem)[];
  type: ItemType;
}

export default function PublicCollectionList({ items, type }: PublicCollectionListProps) {
  const { translations } = useTranslation();

  if (items.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: '#a3a3a3',
          fontSize: 'var(--text-sm)',
        }}
      >
        {tx(translations, 'collectors.profile.empty.noItems') || 'No items in this collection yet'}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((item) => {
        const isMinifig = type === 'minifig';
        const itemNo = isMinifig ? (item as MinifigItem).minifigure_no : (item as SetItem).box_no;
        const itemName = isMinifig ? (item as MinifigItem).minifigure_name : (item as SetItem).set_name;
        const href = isMinifig ? `/minifigs/${itemNo}` : `/sets/${itemNo}`;
        const imageSize = isMinifig ? { width: 64, height: 80 } : { width: 96, height: 80 };

        return (
          <Link key={item.id} href={href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `${imageSize.width}px 1fr auto`,
                gap: '16px',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                (e.currentTarget as HTMLDivElement).style.borderColor = '#d4d4d4';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e5e5';
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: imageSize.width,
                  height: imageSize.height,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={itemName}
                    width={imageSize.width}
                    height={imageSize.height}
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e5e5' }} />
                )}
              </div>

              {/* Name + number */}
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: '#171717',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {itemName}
                </p>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: '#737373' }}>{itemNo}</p>
                {!isMinifig && (item as SetItem).category_name && (
                  <p style={{ margin: '2px 0 0 0', fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>
                    {(item as SetItem).category_name}
                  </p>
                )}
              </div>

              {/* Qty + condition */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: '0 0 4px 0', fontSize: 'var(--text-sm)', fontWeight: 600, color: '#171717' }}>
                  ×{item.quantity}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    backgroundColor: item.condition === 'new' ? '#dcfce7' : '#fef9c3',
                    color: item.condition === 'new' ? '#16a34a' : '#a16207',
                  }}
                >
                  {item.condition === 'new' ? 'New' : 'Used'}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
