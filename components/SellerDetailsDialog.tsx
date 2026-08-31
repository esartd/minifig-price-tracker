'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from './TranslationProvider';

/**
 * Edits the per-item details a marketplace listing needs but FigTracker can't
 * work out on its own.
 *
 * None of these can be derived or fetched: completeness is a fact about the
 * seller's own copy (BrickLink's price guide API has no completeness parameter,
 * and it has never seen their shelf), cost is what they paid, and notes are
 * theirs. So they have to be recorded once, here, and then every export reuses
 * them.
 *
 * Shared by all four collection lists. `showCompleteness` is on for sets only.
 */

export type Completeness = 'complete' | 'incomplete' | 'sealed';

export interface SellerDetails {
  cost?: number | null;
  notes?: string | null;
  completeness?: Completeness | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  /** Sets need completeness; minifigs don't have the concept. */
  showCompleteness: boolean;
  initial: SellerDetails;
  onSave: (details: SellerDetails) => void;
}

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '16px',
};

const panel: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  maxWidth: '440px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const label: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: '#404040',
  marginBottom: '6px',
};

const control: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 'var(--text-base)',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  color: '#171717',
  background: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
};

const help: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: '#737373',
  margin: '6px 0 0',
};

export default function SellerDetailsDialog({
  isOpen,
  onClose,
  itemName,
  showCompleteness,
  initial,
  onSave,
}: Props) {
  const { t } = useTranslation();
  const tr = (key: string, fallback: string) => t(key) || fallback;

  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [completeness, setCompleteness] = useState<string>('');

  // Reset whenever a different item is opened, so the dialog never shows the
  // previous item's values.
  useEffect(() => {
    if (!isOpen) return;
    setCost(initial.cost !== null && initial.cost !== undefined ? String(initial.cost) : '');
    setNotes(initial.notes ?? '');
    setCompleteness(initial.completeness ?? '');
  }, [isOpen, initial.cost, initial.notes, initial.completeness]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedCost = cost.trim();
    const parsedCost = trimmedCost === '' ? null : Number(trimmedCost);

    onSave({
      // An unparseable or negative cost is treated as "not recorded" rather
      // than written as a bogus number into a marketplace's cost column.
      cost:
        parsedCost !== null && Number.isFinite(parsedCost) && parsedCost >= 0
          ? parsedCost
          : null,
      notes: notes.trim() === '' ? null : notes.trim(),
      completeness: showCompleteness
        ? ((completeness || null) as Completeness | null)
        : undefined,
    });
    onClose();
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <h2
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: '#171717',
            margin: '0 0 4px',
          }}
        >
          {tr('sellerDetails.title', 'Selling details')}
        </h2>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            margin: '0 0 20px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {itemName}
        </p>

        {showCompleteness && (
          <div style={{ marginBottom: '16px' }}>
            <label style={label} htmlFor="sd-completeness">
              {tr('sellerDetails.completeness', 'Completeness')}
            </label>
            <select
              id="sd-completeness"
              style={control}
              value={completeness}
              onChange={(e) => setCompleteness(e.target.value)}
            >
              <option value="">{tr('sellerDetails.notRecorded', 'Not recorded')}</option>
              <option value="complete">
                {tr('marketplaceExport.completeness.complete', 'Complete')}
              </option>
              <option value="incomplete">
                {tr('marketplaceExport.completeness.incomplete', 'Incomplete')}
              </option>
              <option value="sealed">
                {tr('marketplaceExport.completeness.sealed', 'Sealed')}
              </option>
            </select>
            <p style={help}>
              {tr(
                'sellerDetails.completenessHelp',
                'BrickLink asks for this on every set. Recording it once means your exports stop guessing.'
              )}
            </p>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={label} htmlFor="sd-cost">
            {tr('sellerDetails.cost', 'What you paid')}
          </label>
          <input
            id="sd-cost"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            style={control}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder={tr('sellerDetails.costPlaceholder', 'e.g. 4.50')}
          />
          <p style={help}>
            {tr(
              'sellerDetails.costHelp',
              'Sent to Whatnot and BrickLink so they can show your profit. Leave blank if you’d rather not.'
            )}
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={label} htmlFor="sd-notes">
            {tr('sellerDetails.notes', 'Notes')}
          </label>
          <textarea
            id="sd-notes"
            // A textarea defaults to monospace; inherit the page font instead.
            style={{
              ...control,
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={tr(
              'sellerDetails.notesPlaceholder',
              'e.g. missing one accessory, slight fading'
            )}
          />
          <p style={help}>
            {tr(
              'sellerDetails.notesHelp',
              'Added to the listing description, and kept as your private remark on BrickLink.'
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: '#525252',
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {tr('common.cancel', 'Cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: '#ffffff',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {tr('common.save', 'Save')}
          </button>
        </div>
      </div>
    </div>
  );
}
