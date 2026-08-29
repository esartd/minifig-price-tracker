'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/components/TranslationProvider';
import AlertDialog from '@/components/AlertDialog';
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ExportSource =
  | 'minifig-inventory'
  | 'minifig-collection'
  | 'set-inventory'
  | 'set-collection';

interface SourceConfig {
  key: ExportSource;
  endpoint: string;
  isSet: boolean;
  labelKey: string;
  fallbackLabel: string;
}

const SOURCES: SourceConfig[] = [
  {
    key: 'minifig-inventory',
    endpoint: '/api/inventory?all=true',
    isSet: false,
    labelKey: 'whatnotExport.sources.minifigInventory',
    fallbackLabel: 'Minifigs — For Sale',
  },
  {
    key: 'set-inventory',
    endpoint: '/api/set-inventory?all=true',
    isSet: true,
    labelKey: 'whatnotExport.sources.setInventory',
    fallbackLabel: 'Sets — For Sale',
  },
  {
    key: 'minifig-collection',
    endpoint: '/api/personal-collection?all=true',
    isSet: false,
    labelKey: 'whatnotExport.sources.minifigCollection',
    fallbackLabel: 'Minifigs — My Collection',
  },
  {
    key: 'set-collection',
    endpoint: '/api/set-personal-collection?all=true',
    isSet: true,
    labelKey: 'whatnotExport.sources.setCollection',
    fallbackLabel: 'Sets — My Collection',
  },
];

/** One row of the picker, normalised across the four differently-shaped APIs. */
interface PickerItem {
  id: string;
  itemNo: string;
  name: string;
  quantity: number;
  condition: string;
  imageUrl: string;
  suggestedPrice: number;
}

const WHATNOT_CONDITIONS = [
  'New in box',
  'New with damaged box',
  'New without box',
  'Used - Like New',
  'Used - Good',
  'Used - Fair',
  'Used - Poor',
];

interface ExportOptions {
  type: 'Auction' | 'Buy it Now' | 'Giveaway';
  markupPercent: number;
  rounding: 'exact' | 'whole' | 'ninetyNine';
  conditionMapping: { new: string; used: string };
  packagingOz: number;
  offerable: boolean;
  includeImages: boolean;
}

const DEFAULT_OPTIONS: ExportOptions = {
  type: 'Buy it Now',
  markupPercent: 0,
  rounding: 'exact',
  conditionMapping: { new: 'New without box', used: 'Used - Good' },
  packagingOz: 2,
  offerable: true,
  includeImages: true,
};

interface PreviewData {
  rows: Array<Record<string, any>>;
  totalSelected: number;
  exportable: number;
  warnings: Array<{ itemNo: string; name: string; messages: string[] }>;
  skipped: Array<{ itemNo: string; name: string; reason: string }>;
}

// ---------------------------------------------------------------------------
// Styles — matching the inline-style convention used across the app
// ---------------------------------------------------------------------------

const card: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '12px',
  padding: '20px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: '#404040',
  marginBottom: '6px',
};

const controlStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 'var(--text-base)',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  color: '#171717',
  background: '#ffffff',
  outline: 'none',
};

// ---------------------------------------------------------------------------

export default function WhatnotExportClient({
  initialSource,
}: {
  initialSource?: string;
}) {
  const { t } = useTranslation();
  const { status } = useSession();

  const [source, setSource] = useState<ExportSource>(
    SOURCES.some((s) => s.key === initialSource)
      ? (initialSource as ExportSource)
      : 'minifig-inventory'
  );
  const [items, setItems] = useState<PickerItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<ExportOptions>(DEFAULT_OPTIONS);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const config = useMemo(
    () => SOURCES.find((s) => s.key === source) as SourceConfig,
    [source]
  );

  const tr = useCallback(
    (key: string, fallback: string) => t(key) || fallback,
    [t]
  );

  // --- load items -----------------------------------------------------------

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;
    setLoadingItems(true);
    setItems([]);
    setSelected(new Set());
    setPreview(null);

    (async () => {
      try {
        const response = await fetch(config.endpoint);
        const json = await response.json();
        if (cancelled) return;

        const raw: any[] = json?.data ?? [];
        setItems(
          raw.map((item) => ({
            id: item.id,
            itemNo: config.isSet ? item.box_no : item.minifigure_no,
            name: config.isSet ? item.set_name : item.minifigure_name,
            quantity: item.quantity ?? 1,
            condition: item.condition ?? 'used',
            imageUrl:
              item.image_url ||
              `https://img.bricklink.com/ItemImage/${config.isSet ? 'ON' : 'MN'}/0/${
                config.isSet ? item.box_no : item.minifigure_no
              }.png`,
            suggestedPrice: item.pricing?.suggestedPrice ?? 0,
          }))
        );
      } catch {
        if (!cancelled) {
          setAlertMessage(
            tr(
              'whatnotExport.errors.loadFailed',
              "We couldn't load your collection. Please refresh and try again."
            )
          );
        }
      } finally {
        if (!cancelled) setLoadingItems(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [config, status, tr]);

  // --- preview (debounced) --------------------------------------------------

  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selected.size === 0) {
      setPreview(null);
      return;
    }

    if (previewTimer.current) clearTimeout(previewTimer.current);

    previewTimer.current = setTimeout(async () => {
      setPreviewing(true);
      try {
        const response = await fetch('/api/whatnot-export/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source,
            itemIds: Array.from(selected),
            options,
          }),
        });
        const json = await response.json();
        setPreview(json?.success ? json.data : null);
      } catch {
        setPreview(null);
      } finally {
        setPreviewing(false);
      }
    }, 400);

    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
  }, [selected, options, source]);

  // --- selection ------------------------------------------------------------

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.itemNo.toLowerCase().includes(query)
    );
  }, [items, search]);

  const toggleItem = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allVisibleSelected =
    visibleItems.length > 0 && visibleItems.every((item) => selected.has(item.id));

  const toggleAllVisible = useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (visibleItems.every((item) => next.has(item.id))) {
        visibleItems.forEach((item) => next.delete(item.id));
      } else {
        visibleItems.forEach((item) => next.add(item.id));
      }
      return next;
    });
  }, [visibleItems]);

  // --- download -------------------------------------------------------------

  const handleDownload = useCallback(async () => {
    if (selected.size === 0) return;

    setDownloading(true);
    try {
      const response = await fetch('/api/whatnot-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, itemIds: Array.from(selected), options }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        setAlertMessage(
          json?.error ||
            tr('whatnotExport.errors.exportFailed', "We couldn't build your CSV. Please try again.")
        );
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `whatnot-${source}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

      const notes = response.headers.get('X-Export-Notes');
      const rowCount = response.headers.get('X-Export-Rows');
      setAlertMessage(
        [
          tr('whatnotExport.success', 'Your CSV is downloading.').replace(
            '{count}',
            rowCount || String(selected.size)
          ),
          notes ? decodeURIComponent(notes) : '',
        ]
          .filter(Boolean)
          .join('\n\n')
      );

      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'export_collection' }),
      }).catch(() => {});
    } catch {
      setAlertMessage(
        tr('whatnotExport.errors.exportFailed', "We couldn't build your CSV. Please try again.")
      );
    } finally {
      setDownloading(false);
    }
  }, [selected, source, options, tr]);

  // --- logged out -----------------------------------------------------------

  if (status === 'unauthenticated') {
    return (
      <div style={{ ...card, textAlign: 'center', padding: '40px 24px' }}>
        <p style={{ fontSize: 'var(--text-base)', color: '#525252', marginBottom: '20px' }}>
          {tr(
            'whatnotExport.signInPrompt',
            'Sign in to turn your FigTracker collection into a Whatnot CSV.'
          )}
        </p>
        <Link
          href="/auth/signin?callbackUrl=/whatnot-export"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#3b82f6',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          {tr('whatnotExport.signIn', 'Sign in')}
        </Link>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div style={{ ...card, textAlign: 'center', color: '#737373' }}>
        {tr('common.loading', 'Loading…')}
      </div>
    );
  }

  // --- tool -----------------------------------------------------------------

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Source picker */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {SOURCES.map((s) => {
          const active = s.key === source;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSource(s.key)}
              style={{
                padding: '10px 16px',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                borderRadius: '8px',
                cursor: 'pointer',
                border: `1px solid ${active ? '#3b82f6' : '#e5e5e5'}`,
                background: active ? '#3b82f6' : '#ffffff',
                color: active ? '#ffffff' : '#525252',
              }}
            >
              {tr(s.labelKey, s.fallbackLabel)}
            </button>
          );
        })}
      </div>

      {/* Options */}
      <div style={card}>
        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: '#171717',
          }}
        >
          <span>{tr('whatnotExport.options.title', 'Listing settings')}</span>
          <span style={{ color: '#3b82f6', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            {showOptions
              ? tr('whatnotExport.options.hide', 'Hide')
              : tr('whatnotExport.options.show', 'Show')}
          </span>
        </button>

        {showOptions && (
          <div
            style={{
              marginTop: '20px',
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            }}
          >
            <div>
              <label style={labelStyle} htmlFor="wn-type">
                {tr('whatnotExport.options.type', 'Listing type')}
              </label>
              <select
                id="wn-type"
                style={controlStyle}
                value={options.type}
                onChange={(e) =>
                  setOptions((o) => ({ ...o, type: e.target.value as ExportOptions['type'] }))
                }
              >
                <option value="Buy it Now">Buy it Now</option>
                <option value="Auction">Auction</option>
                <option value="Giveaway">Giveaway</option>
              </select>
            </div>

            <div>
              <label style={labelStyle} htmlFor="wn-markup">
                {tr('whatnotExport.options.markup', 'Price adjustment (%)')}
              </label>
              <input
                id="wn-markup"
                type="number"
                style={controlStyle}
                value={options.markupPercent}
                min={-90}
                max={500}
                onChange={(e) =>
                  setOptions((o) => ({ ...o, markupPercent: Number(e.target.value) || 0 }))
                }
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="wn-rounding">
                {tr('whatnotExport.options.rounding', 'Round prices')}
              </label>
              <select
                id="wn-rounding"
                style={controlStyle}
                value={options.rounding}
                onChange={(e) =>
                  setOptions((o) => ({
                    ...o,
                    rounding: e.target.value as ExportOptions['rounding'],
                  }))
                }
              >
                <option value="exact">
                  {tr('whatnotExport.options.roundingExact', 'Exact (12.34)')}
                </option>
                <option value="whole">
                  {tr('whatnotExport.options.roundingWhole', 'Whole dollars (12)')}
                </option>
                <option value="ninetyNine">
                  {tr('whatnotExport.options.roundingNinetyNine', 'Ends in .99 (12.99)')}
                </option>
              </select>
            </div>

            <div>
              <label style={labelStyle} htmlFor="wn-cond-new">
                {tr('whatnotExport.options.conditionNew', 'Items marked "new" become')}
              </label>
              <select
                id="wn-cond-new"
                style={controlStyle}
                value={options.conditionMapping.new}
                onChange={(e) =>
                  setOptions((o) => ({
                    ...o,
                    conditionMapping: { ...o.conditionMapping, new: e.target.value },
                  }))
                }
              >
                {WHATNOT_CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle} htmlFor="wn-cond-used">
                {tr('whatnotExport.options.conditionUsed', 'Items marked "used" become')}
              </label>
              <select
                id="wn-cond-used"
                style={controlStyle}
                value={options.conditionMapping.used}
                onChange={(e) =>
                  setOptions((o) => ({
                    ...o,
                    conditionMapping: { ...o.conditionMapping, used: e.target.value },
                  }))
                }
              >
                {WHATNOT_CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle} htmlFor="wn-packaging">
                {tr('whatnotExport.options.packaging', 'Packaging weight (oz)')}
              </label>
              <input
                id="wn-packaging"
                type="number"
                style={controlStyle}
                value={options.packagingOz}
                min={0}
                max={64}
                step={0.5}
                onChange={(e) =>
                  setOptions((o) => ({ ...o, packagingOz: Number(e.target.value) || 0 }))
                }
              />
              <p style={{ fontSize: 'var(--text-xs)', color: '#737373', margin: '6px 0 0' }}>
                {tr(
                  'whatnotExport.options.packagingHelp',
                  'Added to each item’s weight to pick a shipping profile. Whatnot bills on packed weight.'
                )}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'var(--text-sm)',
                  color: '#404040',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={options.includeImages}
                  onChange={(e) =>
                    setOptions((o) => ({ ...o, includeImages: e.target.checked }))
                  }
                />
                {tr('whatnotExport.options.includeImages', 'Include catalog photos')}
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'var(--text-sm)',
                  color: options.type === 'Buy it Now' ? '#404040' : '#a3a3a3',
                  cursor: options.type === 'Buy it Now' ? 'pointer' : 'not-allowed',
                }}
              >
                <input
                  type="checkbox"
                  checked={options.offerable && options.type === 'Buy it Now'}
                  disabled={options.type !== 'Buy it Now'}
                  onChange={(e) => setOptions((o) => ({ ...o, offerable: e.target.checked }))}
                />
                {tr('whatnotExport.options.offerable', 'Allow buyers to make offers')}
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Item picker */}
      <div style={card}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <MagnifyingGlassIcon
              style={{
                width: 'var(--icon-sm)',
                height: 'var(--icon-sm)',
                color: '#a3a3a3',
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr('whatnotExport.searchPlaceholder', 'Search by name or number')}
              style={{ ...controlStyle, paddingLeft: '36px' }}
            />
          </div>

          <button
            type="button"
            onClick={toggleAllVisible}
            disabled={visibleItems.length === 0}
            style={{
              padding: '10px 16px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: '#3b82f6',
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              cursor: visibleItems.length === 0 ? 'not-allowed' : 'pointer',
              opacity: visibleItems.length === 0 ? 0.5 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {allVisibleSelected
              ? tr('whatnotExport.selectNone', 'Clear selection')
              : tr('whatnotExport.selectAll', 'Select all')}
          </button>
        </div>

        {loadingItems ? (
          <p style={{ color: '#737373', textAlign: 'center', padding: '24px 0' }}>
            {tr('common.loading', 'Loading…')}
          </p>
        ) : visibleItems.length === 0 ? (
          <p style={{ color: '#737373', textAlign: 'center', padding: '24px 0' }}>
            {items.length === 0
              ? tr('whatnotExport.emptyCollection', 'Nothing in this collection yet.')
              : tr('whatnotExport.noMatches', 'No items match your search.')}
          </p>
        ) : (
          <div style={{ maxHeight: '420px', overflowY: 'auto', margin: '0 -4px' }}>
            {visibleItems.map((item) => {
              const isSelected = selected.has(item.id);
              const noPrice = item.suggestedPrice <= 0;
              return (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 4px',
                    borderBottom: '1px solid #f5f5f5',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItem(item.id)}
                    style={{ flexShrink: 0 }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt=""
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain', flexShrink: 0 }}
                    loading="lazy"
                  />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        color: '#171717',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.name}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: '#737373' }}>
                      {item.itemNo} · {item.condition} · ×{item.quantity}
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: noPrice ? '#a3a3a3' : '#171717',
                      flexShrink: 0,
                    }}
                  >
                    {noPrice ? '—' : `$${item.suggestedPrice.toFixed(2)}`}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary + warnings */}
      {selected.size > 0 && (
        <div style={card}>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: '#171717',
              margin: '0 0 12px',
              fontWeight: 600,
            }}
          >
            {previewing ? (
              <span style={{ color: '#737373', fontWeight: 400 }}>
                {tr('whatnotExport.checking', 'Checking your selection…')}
              </span>
            ) : preview ? (
              tr('whatnotExport.readyCount', '{count} listings ready').replace(
                '{count}',
                String(preview.exportable)
              )
            ) : (
              tr('whatnotExport.selectedCount', '{count} selected').replace(
                '{count}',
                String(selected.size)
              )
            )}
          </p>

          {preview && preview.skipped.length > 0 && (
            <Notice
              tone="error"
              title={tr(
                'whatnotExport.skippedTitle',
                '{count} will be left out'
              ).replace('{count}', String(preview.skipped.length))}
              lines={preview.skipped.map((s) => `${s.name} (${s.itemNo}) — ${s.reason}`)}
            />
          )}

          {preview && preview.warnings.length > 0 && (
            <Notice
              tone="warning"
              title={tr(
                'whatnotExport.warningsTitle',
                '{count} worth double-checking'
              ).replace('{count}', String(preview.warnings.length))}
              lines={preview.warnings.map(
                (w) => `${w.name} (${w.itemNo}) — ${w.messages.join(' ')}`
              )}
            />
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || previewing || (preview ? preview.exportable === 0 : false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '8px',
              padding: '12px 24px',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: '#ffffff',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              cursor: downloading ? 'wait' : 'pointer',
              opacity: downloading || previewing ? 0.6 : 1,
            }}
          >
            {downloading ? (
              <>
                <ArrowPathIcon
                  style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }}
                />
                {tr('whatnotExport.building', 'Building your CSV…')}
              </>
            ) : (
              <>
                <ArrowDownTrayIcon
                  style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }}
                />
                {tr('whatnotExport.download', 'Download CSV')}
              </>
            )}
          </button>

          {downloading && options.includeImages && (
            <p style={{ fontSize: 'var(--text-xs)', color: '#737373', margin: '10px 0 0' }}>
              {tr(
                'whatnotExport.buildingHelp',
                'First time exporting an item takes a moment while we prepare its photo. Later exports are instant.'
              )}
            </p>
          )}
        </div>
      )}

      <AlertDialog
        isOpen={alertMessage !== null}
        onClose={() => setAlertMessage(null)}
        message={alertMessage || ''}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------

function Notice({
  tone,
  title,
  lines,
}: {
  tone: 'warning' | 'error';
  title: string;
  lines: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const palette =
    tone === 'error'
      ? { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' }
      : { bg: '#fffbeb', border: '#fde68a', text: '#92400e' };

  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: '8px',
        padding: '12px 14px',
        marginBottom: '12px',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: palette.text,
        }}
      >
        <ExclamationTriangleIcon
          style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', flexShrink: 0 }}
        />
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{ fontWeight: 500 }}>{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <ul
          style={{
            margin: '10px 0 0',
            paddingLeft: '26px',
            fontSize: 'var(--text-xs)',
            color: palette.text,
            lineHeight: 1.6,
          }}
        >
          {lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
