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
// Sources
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

interface PickerItem {
  id: string;
  itemNo: string;
  name: string;
  quantity: number;
  condition: string;
  imageUrl: string;
  suggestedPrice: number;
}

// ---------------------------------------------------------------------------
// Marketplaces
// ---------------------------------------------------------------------------

export interface MarketplaceInfo {
  id: string;
  label: string;
  fileExtension: string;
  needsImages: boolean;
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

/** Settings shared by every marketplace. */
interface SharedOptions {
  markupPercent: number;
  rounding: 'exact' | 'whole' | 'ninetyNine';
}

interface WhatnotOptions {
  type: 'Auction' | 'Buy it Now' | 'Giveaway';
  conditionMapping: { new: string; used: string };
  packagingOz: number;
  offerable: boolean;
  includeImages: boolean;
}

const DEFAULT_SHARED: SharedOptions = { markupPercent: 0, rounding: 'exact' };

interface BricklinkOptions {
  defaultCompleteness: 'complete' | 'incomplete' | 'sealed';
  includeCost: boolean;
  stockroom: boolean;
  retain: boolean;
  includeNotes: boolean;
}

const DEFAULT_BRICKLINK: BricklinkOptions = {
  defaultCompleteness: 'complete',
  includeCost: true,
  stockroom: false,
  retain: false,
  includeNotes: true,
};

interface EbayOptions {
  format: 'FixedPrice' | 'Auction';
  duration: string;
  location: string;
  dispatchTimeMax: number;
  returnsAccepted: boolean;
  shippingService: string;
  shippingCost: number;
  includeImages: boolean;
}

const DEFAULT_EBAY: EbayOptions = {
  format: 'FixedPrice',
  duration: 'GTC',
  location: '',
  dispatchTimeMax: 3,
  returnsAccepted: true,
  shippingService: 'USPSFirstClass',
  shippingCost: 4.99,
  includeImages: true,
};

const EBAY_DURATIONS = ['1', '3', '5', '7', '10', '30', 'GTC'];

const DEFAULT_WHATNOT: WhatnotOptions = {
  type: 'Buy it Now',
  conditionMapping: { new: 'New without box', used: 'Used - Good' },
  packagingOz: 2,
  offerable: true,
  includeImages: true,
};

interface PreviewMarketplace {
  marketplace: string;
  label: string;
  fileExtension: string;
  exportable: number;
  warnings: Array<{ itemNo: string; name: string; messages: string[] }>;
}

interface PreviewData {
  totalSelected: number;
  skipped: Array<{ itemNo: string; name: string; reason: string }>;
  marketplaces: PreviewMarketplace[];
}

interface ExportedFile {
  marketplace: string;
  label: string;
  filename: string;
  mimeType: string;
  bytes: number;
  rowCount: number;
  partIndex: number;
  partCount: number;
  content: string;
}

// ---------------------------------------------------------------------------
// Styles
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

const sectionHeading: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  fontWeight: 700,
  color: '#737373',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '4px 0 12px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
};

// ---------------------------------------------------------------------------

export default function MarketplaceExportClient({
  marketplaces,
  initialSource,
  initialMarketplace,
}: {
  marketplaces: MarketplaceInfo[];
  initialSource?: string;
  initialMarketplace?: string;
}) {
  const { t } = useTranslation();
  const { status } = useSession();

  const [source, setSource] = useState<ExportSource>(
    SOURCES.some((s) => s.key === initialSource)
      ? (initialSource as ExportSource)
      : 'minifig-inventory'
  );
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<Set<string>>(() => {
    // A marketplace-branded landing page pre-ticks just that one. The neutral
    // /export page ticks them all, matching its own promise — picking one
    // arbitrarily there would risk someone downloading a Whatnot file thinking
    // they'd got a generic one.
    const preferred =
      initialMarketplace && marketplaces.some((m) => m.id === initialMarketplace)
        ? [initialMarketplace]
        : marketplaces.map((m) => m.id);
    return new Set(preferred);
  });

  const [items, setItems] = useState<PickerItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const [shared, setShared] = useState<SharedOptions>(DEFAULT_SHARED);
  const [whatnot, setWhatnot] = useState<WhatnotOptions>(DEFAULT_WHATNOT);
  const [bricklink, setBricklink] = useState<BricklinkOptions>(DEFAULT_BRICKLINK);
  const [ebay, setEbay] = useState<EbayOptions>(DEFAULT_EBAY);

  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [building, setBuilding] = useState(false);
  const [files, setFiles] = useState<ExportedFile[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const config = useMemo(
    () => SOURCES.find((s) => s.key === source) as SourceConfig,
    [source]
  );

  const tr = useCallback((key: string, fallback: string) => t(key) || fallback, [t]);

  /** Per-marketplace settings, in the shape the API expects. */
  const optionsByMarketplace = useMemo(
    () => ({
      whatnot: { ...shared, ...whatnot },
      bricklink: { ...shared, ...bricklink },
      ebay: { ...shared, ...ebay },
    }),
    [shared, whatnot, bricklink, ebay]
  );

  // --- load items -----------------------------------------------------------

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;
    setLoadingItems(true);
    setItems([]);
    setSelected(new Set());
    setPreview(null);
    setFiles([]);

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
    if (selected.size === 0 || selectedMarketplaces.size === 0) {
      setPreview(null);
      return;
    }

    if (previewTimer.current) clearTimeout(previewTimer.current);

    previewTimer.current = setTimeout(async () => {
      setPreviewing(true);
      try {
        const response = await fetch('/api/marketplace-export/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source,
            itemIds: Array.from(selected),
            marketplaces: Array.from(selectedMarketplaces),
            optionsByMarketplace,
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
  }, [selected, selectedMarketplaces, optionsByMarketplace, source]);

  // Any change invalidates already-built files.
  useEffect(() => {
    setFiles([]);
    setNotes([]);
  }, [selected, selectedMarketplaces, optionsByMarketplace, source]);

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

  const toggleMarketplace = useCallback((id: string) => {
    setSelectedMarketplaces((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // --- build ----------------------------------------------------------------

  const handleBuild = useCallback(async () => {
    if (selected.size === 0 || selectedMarketplaces.size === 0) return;

    setBuilding(true);
    try {
      const response = await fetch('/api/marketplace-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          itemIds: Array.from(selected),
          marketplaces: Array.from(selectedMarketplaces),
          optionsByMarketplace,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json?.success) {
        setAlertMessage(
          json?.error ||
            tr('whatnotExport.errors.exportFailed', "We couldn't build your files. Please try again.")
        );
        return;
      }

      setFiles(json.data.files);
      setNotes(json.data.notes ?? []);

      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'export_collection' }),
      }).catch(() => {});
    } catch {
      setAlertMessage(
        tr('whatnotExport.errors.exportFailed', "We couldn't build your files. Please try again.")
      );
    } finally {
      setBuilding(false);
    }
  }, [selected, selectedMarketplaces, optionsByMarketplace, source, tr]);

  /**
   * Items in the current selection whose completeness isn't recorded.
   *
   * Derived from BrickLink's own warnings rather than re-deriving the rule, so
   * this can't drift from what the adapter actually complains about.
   */
  const setsMissingCompleteness = useMemo(() => {
    if (!config.isSet || !preview) return [];
    const bl = preview.marketplaces.find((m) => m.marketplace === 'bricklink');
    if (!bl) return [];
    const itemNos = new Set(
      bl.warnings
        .filter((w) => w.messages.some((m) => /complete, incomplete or sealed/i.test(m)))
        .map((w) => w.itemNo)
    );
    return items.filter((i) => itemNos.has(i.itemNo) && selected.has(i.id));
  }, [config.isSet, preview, items, selected]);

  const [applyingCompleteness, setApplyingCompleteness] = useState(false);

  /** Record one completeness value across every set that's missing it. */
  const applyCompletenessToAll = useCallback(
    async (value: string) => {
      if (setsMissingCompleteness.length === 0) return;
      setApplyingCompleteness(true);
      try {
        const endpoint =
          source === 'set-inventory' ? '/api/set-inventory' : '/api/set-personal-collection';

        // Sequential rather than parallel: this is a shared Hostinger database
        // with tight connection limits, and 60+ concurrent writes is exactly
        // the burst that causes 500s under load.
        for (const item of setsMissingCompleteness) {
          await fetch(`${endpoint}/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completeness: value }),
          });
        }

        // Re-run the preview so the warnings clear.
        const response = await fetch('/api/marketplace-export/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source,
            itemIds: Array.from(selected),
            marketplaces: Array.from(selectedMarketplaces),
            optionsByMarketplace,
          }),
        });
        const json = await response.json();
        if (json?.success) setPreview(json.data);
      } catch {
        setAlertMessage(
          tr('marketplaceExport.bulkCompletenessFailed', "We couldn't save that. Please try again.")
        );
      } finally {
        setApplyingCompleteness(false);
      }
    },
    [setsMissingCompleteness, source, selected, selectedMarketplaces, optionsByMarketplace, tr]
  );

  const downloadFile = useCallback((file: ExportedFile) => {
    const blob = new Blob([file.content], { type: file.mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, []);

  // --- logged out -----------------------------------------------------------

  if (status === 'unauthenticated') {
    return (
      <div style={{ ...card, textAlign: 'center', padding: '40px 24px' }}>
        <p style={{ fontSize: 'var(--text-base)', color: '#525252', marginBottom: '20px' }}>
          {tr(
            'whatnotExport.signInPrompt',
            'Sign in to turn your FigTracker collection into a marketplace file.'
          )}
        </p>
        <Link
          href="/auth/signin?callbackUrl=/export"
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

  const totalExportable = preview
    ? Math.max(...preview.marketplaces.map((m) => m.exportable), 0)
    : 0;

  // --- tool -----------------------------------------------------------------

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Step 1 — source */}
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

      {/* Step 2 — destinations. Hidden when there's only one marketplace. */}
      {marketplaces.length > 1 && (
        <div style={card}>
          {/* Sentence case, not the uppercase micro-label used for the
              settings groups — a full question in caps reads as shouting. */}
          <p
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: '#171717',
              margin: '0 0 12px',
            }}
          >
            {tr('marketplaceExport.destinations', 'Where do you want to list?')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {marketplaces.map((m) => {
              const on = selectedMarketplaces.has(m.id);
              return (
                <label
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${on ? '#3b82f6' : '#e5e5e5'}`,
                    background: on ? '#eff6ff' : '#ffffff',
                    color: on ? '#1d4ed8' : '#525252',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleMarketplace(m.id)}
                  />
                  {m.label}
                  <span style={{ fontWeight: 400, color: '#737373' }}>
                    .{m.fileExtension}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3 — settings */}
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
          <div style={{ marginTop: '20px' }}>
            <p style={sectionHeading}>{tr('marketplaceExport.sharedSettings', 'All marketplaces')}</p>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle} htmlFor="mx-markup">
                  {tr('whatnotExport.options.markup', 'Price adjustment (%)')}
                </label>
                <input
                  id="mx-markup"
                  type="number"
                  style={controlStyle}
                  value={shared.markupPercent}
                  min={-90}
                  max={500}
                  onChange={(e) =>
                    setShared((o) => ({ ...o, markupPercent: Number(e.target.value) || 0 }))
                  }
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="mx-rounding">
                  {tr('whatnotExport.options.rounding', 'Round prices')}
                </label>
                <select
                  id="mx-rounding"
                  style={controlStyle}
                  value={shared.rounding}
                  onChange={(e) =>
                    setShared((o) => ({ ...o, rounding: e.target.value as SharedOptions['rounding'] }))
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
            </div>

            {selectedMarketplaces.has('whatnot') && (
              <div style={{ marginTop: '24px' }}>
                <p style={sectionHeading}>Whatnot</p>
                <div style={gridStyle}>
                  <div>
                    <label style={labelStyle} htmlFor="mx-wn-type">
                      {tr('whatnotExport.options.type', 'Listing type')}
                    </label>
                    <select
                      id="mx-wn-type"
                      style={controlStyle}
                      value={whatnot.type}
                      onChange={(e) =>
                        setWhatnot((o) => ({ ...o, type: e.target.value as WhatnotOptions['type'] }))
                      }
                    >
                      <option value="Buy it Now">Buy it Now</option>
                      <option value="Auction">Auction</option>
                      <option value="Giveaway">Giveaway</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="mx-wn-new">
                      {tr('whatnotExport.options.conditionNew', 'Items marked "new" become')}
                    </label>
                    <select
                      id="mx-wn-new"
                      style={controlStyle}
                      value={whatnot.conditionMapping.new}
                      onChange={(e) =>
                        setWhatnot((o) => ({
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
                    <label style={labelStyle} htmlFor="mx-wn-used">
                      {tr('whatnotExport.options.conditionUsed', 'Items marked "used" become')}
                    </label>
                    <select
                      id="mx-wn-used"
                      style={controlStyle}
                      value={whatnot.conditionMapping.used}
                      onChange={(e) =>
                        setWhatnot((o) => ({
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
                    <label style={labelStyle} htmlFor="mx-wn-pack">
                      {tr('whatnotExport.options.packaging', 'Packaging weight (oz)')}
                    </label>
                    <input
                      id="mx-wn-pack"
                      type="number"
                      style={controlStyle}
                      value={whatnot.packagingOz}
                      min={0}
                      max={64}
                      step={0.5}
                      onChange={(e) =>
                        setWhatnot((o) => ({ ...o, packagingOz: Number(e.target.value) || 0 }))
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
                        checked={whatnot.includeImages}
                        onChange={(e) =>
                          setWhatnot((o) => ({ ...o, includeImages: e.target.checked }))
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
                        color: whatnot.type === 'Buy it Now' ? '#404040' : '#a3a3a3',
                        cursor: whatnot.type === 'Buy it Now' ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={whatnot.offerable && whatnot.type === 'Buy it Now'}
                        disabled={whatnot.type !== 'Buy it Now'}
                        onChange={(e) => setWhatnot((o) => ({ ...o, offerable: e.target.checked }))}
                      />
                      {tr('whatnotExport.options.offerable', 'Allow buyers to make offers')}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {selectedMarketplaces.has('bricklink') && (
              <div style={{ marginTop: '24px' }}>
                <p style={sectionHeading}>BrickLink</p>
                <div style={gridStyle}>
                  {config.isSet && (
                    <div>
                      <label style={labelStyle} htmlFor="mx-bl-complete">
                        {tr(
                          'marketplaceExport.bricklink.defaultCompleteness',
                          'Sets with no completeness recorded'
                        )}
                      </label>
                      <select
                        id="mx-bl-complete"
                        style={controlStyle}
                        value={bricklink.defaultCompleteness}
                        onChange={(e) =>
                          setBricklink((o) => ({
                            ...o,
                            defaultCompleteness: e.target
                              .value as BricklinkOptions['defaultCompleteness'],
                          }))
                        }
                      >
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
                      <p
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: '#737373',
                          margin: '6px 0 0',
                        }}
                      >
                        {tr(
                          'marketplaceExport.bricklink.completenessHelp',
                          'BrickLink requires this on every set. Record it per set to stop being asked.'
                        )}
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(
                      [
                        [
                          'includeCost',
                          tr('marketplaceExport.bricklink.includeCost', 'Include what I paid'),
                        ],
                        [
                          'includeNotes',
                          tr('marketplaceExport.bricklink.includeNotes', 'Include my notes as remarks'),
                        ],
                        [
                          'stockroom',
                          tr('marketplaceExport.bricklink.stockroom', 'Put in stockroom, not on sale'),
                        ],
                        [
                          'retain',
                          tr('marketplaceExport.bricklink.retain', 'Keep listing after it sells'),
                        ],
                      ] as Array<[keyof BricklinkOptions, string]>
                    ).map(([key, label]) => (
                      <label
                        key={key}
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
                          checked={Boolean(bricklink[key])}
                          onChange={(e) =>
                            setBricklink((o) => ({ ...o, [key]: e.target.checked }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedMarketplaces.has('ebay') && (
              <div style={{ marginTop: '24px' }}>
                <p style={sectionHeading}>eBay</p>
                <div style={gridStyle}>
                  <div>
                    <label style={labelStyle} htmlFor="mx-eb-location">
                      {tr('marketplaceExport.ebay.location', 'Where you ship from')}
                    </label>
                    <input
                      id="mx-eb-location"
                      type="text"
                      style={{
                        ...controlStyle,
                        // eBay rejects the upload without this, so make it obvious.
                        borderColor: ebay.location.trim() ? '#e5e5e5' : '#fca5a5',
                      }}
                      value={ebay.location}
                      maxLength={45}
                      placeholder={tr(
                        'marketplaceExport.ebay.locationPlaceholder',
                        'e.g. Utah, United States'
                      )}
                      onChange={(e) => setEbay((o) => ({ ...o, location: e.target.value }))}
                    />
                    <p style={{ fontSize: 'var(--text-xs)', color: '#737373', margin: '6px 0 0' }}>
                      {tr(
                        'marketplaceExport.ebay.locationHelp',
                        'State and country. eBay requires this and will reject the file without it.'
                      )}
                    </p>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="mx-eb-format">
                      {tr('marketplaceExport.ebay.format', 'Listing format')}
                    </label>
                    <select
                      id="mx-eb-format"
                      style={controlStyle}
                      value={ebay.format}
                      onChange={(e) =>
                        setEbay((o) => ({ ...o, format: e.target.value as EbayOptions['format'] }))
                      }
                    >
                      <option value="FixedPrice">
                        {tr('marketplaceExport.ebay.fixedPrice', 'Buy It Now (fixed price)')}
                      </option>
                      <option value="Auction">
                        {tr('marketplaceExport.ebay.auction', 'Auction')}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="mx-eb-duration">
                      {tr('marketplaceExport.ebay.duration', 'How long to run')}
                    </label>
                    <select
                      id="mx-eb-duration"
                      style={controlStyle}
                      value={ebay.duration}
                      onChange={(e) => setEbay((o) => ({ ...o, duration: e.target.value }))}
                    >
                      {EBAY_DURATIONS.filter(
                        // GTC is fixed-price only; eBay rejects it on auctions.
                        (d) => !(d === 'GTC' && ebay.format === 'Auction')
                      ).map((d) => (
                        <option key={d} value={d}>
                          {d === 'GTC'
                            ? tr('marketplaceExport.ebay.gtc', 'Until cancelled')
                            : tr('marketplaceExport.ebay.days', '{n} days').replace('{n}', d)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="mx-eb-dispatch">
                      {tr('marketplaceExport.ebay.dispatch', 'Days to post after payment')}
                    </label>
                    <input
                      id="mx-eb-dispatch"
                      type="number"
                      min={0}
                      max={30}
                      style={controlStyle}
                      value={ebay.dispatchTimeMax}
                      onChange={(e) =>
                        setEbay((o) => ({ ...o, dispatchTimeMax: Number(e.target.value) || 0 }))
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="mx-eb-shipservice">
                      {tr('marketplaceExport.ebay.shippingService', 'Shipping service')}
                    </label>
                    <input
                      id="mx-eb-shipservice"
                      type="text"
                      style={controlStyle}
                      value={ebay.shippingService}
                      onChange={(e) =>
                        setEbay((o) => ({ ...o, shippingService: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="mx-eb-shipcost">
                      {tr('marketplaceExport.ebay.shippingCost', 'Flat shipping cost')}
                    </label>
                    <input
                      id="mx-eb-shipcost"
                      type="number"
                      min={0}
                      step="0.01"
                      style={controlStyle}
                      value={ebay.shippingCost}
                      onChange={(e) =>
                        setEbay((o) => ({ ...o, shippingCost: Number(e.target.value) || 0 }))
                      }
                    />
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
                        checked={ebay.returnsAccepted}
                        onChange={(e) =>
                          setEbay((o) => ({ ...o, returnsAccepted: e.target.checked }))
                        }
                      />
                      {tr('marketplaceExport.ebay.returns', 'Accept returns')}
                    </label>
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
                        checked={ebay.includeImages}
                        onChange={(e) =>
                          setEbay((o) => ({ ...o, includeImages: e.target.checked }))
                        }
                      />
                      {tr('whatnotExport.options.includeImages', 'Include catalog photos')}
                    </label>
                  </div>
                </div>
              </div>
            )}
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

      {/* Step 4 — review & download */}
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
                String(totalExportable)
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
              title={tr('whatnotExport.skippedTitle', '{count} will be left out').replace(
                '{count}',
                String(preview.skipped.length)
              )}
              lines={preview.skipped.map((s) => `${s.name} (${s.itemNo}) — ${s.reason}`)}
            />
          )}

          {/* Fixing 60+ sets one dialog at a time isn't realistic, so offer the
              fix where the problem actually surfaces. Only touches sets with
              nothing recorded — anything already set is left alone. */}
          {setsMissingCompleteness.length > 0 && (
            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '12px',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: '#1d4ed8',
                  margin: '0 0 10px',
                }}
              >
                {tr(
                  'marketplaceExport.bulkCompletenessTitle',
                  '{count} sets have no completeness recorded'
                ).replace('{count}', String(setsMissingCompleteness.length))}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: '#404040' }}>
                  {tr('marketplaceExport.bulkCompletenessSetAll', 'Set them all to')}
                </span>
                {(['complete', 'incomplete', 'sealed'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={applyingCompleteness}
                    onClick={() => applyCompletenessToAll(value)}
                    style={{
                      padding: '8px 14px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: '#1d4ed8',
                      background: '#ffffff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      cursor: applyingCompleteness ? 'wait' : 'pointer',
                      opacity: applyingCompleteness ? 0.6 : 1,
                    }}
                  >
                    {tr(`marketplaceExport.completeness.${value}`, value)}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: '#525252', margin: '10px 0 0' }}>
                {applyingCompleteness
                  ? tr('marketplaceExport.bulkCompletenessSaving', 'Saving…')
                  : tr(
                      'marketplaceExport.bulkCompletenessHelp',
                      'Saved against each set, so you only do this once. Change individual ones with the pencil button on your collection page.'
                    )}
              </p>
            </div>
          )}

          {preview?.marketplaces.map(
            (m) =>
              m.warnings.length > 0 && (
                <Notice
                  key={m.marketplace}
                  tone="warning"
                  title={`${m.label}: ${tr(
                    'whatnotExport.warningsTitle',
                    '{count} worth double-checking'
                  ).replace('{count}', String(m.warnings.length))}`}
                  lines={m.warnings.map(
                    (w) => `${w.name} (${w.itemNo}) — ${w.messages.join(' ')}`
                  )}
                />
              )
          )}

          {files.length === 0 ? (
            <>
              <button
                type="button"
                onClick={handleBuild}
                disabled={building || previewing || selectedMarketplaces.size === 0}
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
                  cursor: building ? 'wait' : 'pointer',
                  opacity: building || previewing ? 0.6 : 1,
                }}
              >
                {building ? (
                  <>
                    <ArrowPathIcon style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
                    {tr('whatnotExport.building', 'Building your files…')}
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon
                      style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }}
                    />
                    {tr('marketplaceExport.build', 'Prepare files')}
                  </>
                )}
              </button>

              {building && (
                <p style={{ fontSize: 'var(--text-xs)', color: '#737373', margin: '10px 0 0' }}>
                  {tr(
                    'whatnotExport.buildingHelp',
                    'First time exporting an item takes a moment while we prepare its photo. Later exports are instant.'
                  )}
                </p>
              )}
            </>
          ) : (
            <div style={{ marginTop: '8px' }}>
              <p style={sectionHeading}>
                {tr('marketplaceExport.filesReady', 'Your files are ready')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {files.map((file) => (
                  <button
                    key={file.filename}
                    type="button"
                    onClick={() => downloadFile(file)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: '#ffffff',
                      background: '#3b82f6',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowDownTrayIcon
                      style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }}
                    />
                    <span>
                      {file.label}
                      {file.partCount > 1 ? ` (${file.partIndex}/${file.partCount})` : ''}
                      <span style={{ fontWeight: 400, opacity: 0.85 }}>
                        {' '}
                        · {file.rowCount} · {Math.max(1, Math.round(file.bytes / 1024))} KB
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {notes.map((note, i) => (
                <p
                  key={i}
                  style={{ fontSize: 'var(--text-xs)', color: '#737373', margin: '12px 0 0' }}
                >
                  {note}
                </p>
              ))}
            </div>
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
