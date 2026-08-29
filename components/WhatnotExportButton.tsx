'use client';

import Link from 'next/link';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';

type ExportSource =
  | 'minifig-inventory'
  | 'minifig-collection'
  | 'set-inventory'
  | 'set-collection';

/**
 * Sends the seller to the Whatnot export tool with this collection preselected.
 *
 * Styled to match ShareCollectionButton, which it sits beside on all four
 * collection pages.
 */
export default function WhatnotExportButton({ source }: { source: ExportSource }) {
  const { t } = useTranslation();

  return (
    <Link
      href={`/whatnot-export?source=${source}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontSize: 'var(--text-sm)',
        fontWeight: '500',
        color: '#525252',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        cursor: 'pointer',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <ArrowUpTrayIcon style={{ width: '18px', height: '18px' }} />
      <span>{t('whatnotExport.exportButton') || 'Export to Whatnot'}</span>
    </Link>
  );
}
