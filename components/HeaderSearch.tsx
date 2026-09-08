'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from './TranslationProvider';

/**
 * The search box in the site header.
 *
 * One component rendered in four places: header-client.tsx has two complete
 * duplicated header trees (signed-out and signed-in), and each renders a
 * desktop slot and a mobile row. Both slots are in the DOM at every viewport,
 * one hidden by a CSS media query -- that is what keeps the first paint
 * correct on phones, and it is why the two notes below about ids and fetching
 * matter.
 *
 * Suggestions come from /api/search/autocomplete, which already existed with
 * zero callers. It caps itself at 3 minifigures and 2 sets, which is what
 * keeps the dropdown short.
 */

type Suggestion =
  | { kind: 'minifig' | 'set'; key: string; id: string; name: string; image: string | null; meta: string }
  | { kind: 'seeAll'; key: string };

export interface HeaderSearchProps {
  value: string;
  onValueChange: (next: string) => void;
  /**
   * 'desktop' and 'mobile' are the two header slots. 'hero' is the big box on
   * the homepage, which behaves identically -- it just sits on its own rather
   * than in a 64px row, so it is taller and rounder.
   */
  variant: 'desktop' | 'mobile' | 'hero';
}

const MIN_CHARS = 2;
const DEBOUNCE_MS = 200;

export default function HeaderSearch({ value, onValueChange, variant }: HeaderSearchProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Ids must be unique per instance, not per component.
   *
   * The desktop slot and the mobile row are both mounted at all times (one is
   * display:none). With a hardcoded id, `aria-controls` and
   * `aria-activedescendant` would resolve to whichever element the browser
   * found first -- usually the hidden one. It looks perfect on screen and the
   * combobox is entirely broken for screen readers, which is not something you
   * notice without actually turning one on.
   */
  const uid = useId();
  const listboxId = `header-search-listbox-${uid}`;
  const optionId = (index: number) => `header-search-option-${uid}-${index}`;

  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ minifigs: any[]; sets: any[] } | null>(null);
  // -1 means "nothing highlighted", so Enter submits what was typed rather
  // than opening whichever row happened to arrive first.
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Only the most recently started request may write results.
   *
   * The same guard the homepage uses (app/page.tsx). A broad query ("ba",
   * thousands of matches) can resolve after a narrow one typed later
   * ("batman") and replace the right answer with the wrong one. The abort
   * below usually prevents it, but aborting is best-effort -- a response
   * already in flight can still land -- so the sequence number is what makes
   * this actually correct.
   */
  const seq = useRef(0);

  const term = value.trim();

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    /**
     * The hidden twin must never fetch. A display:none input cannot take
     * focus, so gating on focus keeps it inert without having to thread
     * viewport state down here. This matters: /api/search/autocomplete shares
     * one rate-limit bucket with /api/search-all (both match /api/search), so
     * two boxes fetching in parallel would halve the budget for no benefit.
     */
    if (!focused || term.length < MIN_CHARS) {
      abortRef.current?.abort();
      seq.current++; // invalidate anything still in flight
      setResults(null);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const mySeq = ++seq.current;
      const isCurrent = () => mySeq === seq.current;

      fetch(`/api/search/autocomplete?q=${encodeURIComponent(term)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (!isCurrent()) return;
          const s = data?.suggestions;
          setResults({
            minifigs: Array.isArray(s?.minifigs) ? s.minifigs : [],
            sets: Array.isArray(s?.sets) ? s.sets : [],
          });
          setActiveIndex(-1);
          setLoading(false);
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return; // expected on every keystroke
          if (!isCurrent()) return;
          setResults({ minifigs: [], sets: [] });
          setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [term, focused]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const suggestions = useMemo<Suggestion[]>(() => {
    const out: Suggestion[] = [];
    if (results) {
      for (const m of results.minifigs) {
        out.push({
          kind: 'minifig',
          key: `fig:${m.id}`,
          id: m.id,
          name: m.name,
          image: m.image_url || null,
          meta: [m.id, m.year].filter(Boolean).join(' · '),
        });
      }
      for (const s of results.sets) {
        out.push({
          kind: 'set',
          key: `set:${s.id}`,
          id: s.id,
          name: s.name,
          image: s.image_url || null,
          meta: [s.id, s.year].filter(Boolean).join(' · '),
        });
      }
    }
    if (term) out.push({ kind: 'seeAll', key: 'see-all' });
    return out;
  }, [results, term]);

  useEffect(() => {
    setOpen(focused && term.length >= MIN_CHARS);
  }, [focused, term]);

  // Keep the highlighted row in view. 'nearest', not 'center', so the list
  // does not lurch on every arrow press.
  useEffect(() => {
    if (activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Navigating away closes the panel and drops the mobile keyboard.
  useEffect(() => {
    setOpen(false);
    setFocused(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }, [pathname]);

  // This component owns its own click-outside rather than extending the shared
  // handler in header-client.tsx, because it is mounted four times and that
  // handler lives in a component rendered twice.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const submitQuery = () => {
    if (!term) return;
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const activate = (index: number) => {
    const s = suggestions[index];
    if (!s) return;
    if (s.kind === 'seeAll') {
      submitQuery();
      return;
    }
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    router.push(s.kind === 'set' ? `/sets/${encodeURIComponent(s.id)}` : `/minifigs/${encodeURIComponent(s.id)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const count = suggestions.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault(); // also stops the caret jumping to the end
      if (!open) {
        if (count) { setOpen(true); setActiveIndex(0); }
        return;
      }
      if (count) setActiveIndex((i) => (i + 1) % count);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        if (count) { setOpen(true); setActiveIndex(count - 1); }
        return;
      }
      if (count) setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (open && activeIndex >= 0) activate(activeIndex);
      else submitQuery();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault(); // Safari resets the whole field otherwise
      if (open) {
        // Keep focus and keep the text. Someone pressing Escape wants the list
        // gone, not to lose their place.
        setOpen(false);
        setActiveIndex(-1);
        return;
      }
      if (value) { onValueChange(''); return; }
      inputRef.current?.blur();
      return;
    }
    if (e.key === 'Tab') {
      // Close and let focus move on normally. Deliberately does NOT adopt the
      // highlighted option: aria-autocomplete="list" promises no inline
      // completion, so rewriting the field on Tab would contradict what was
      // announced to a screen reader.
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const statusText = (() => {
    if (!open) return '';
    if (loading) return t('search.searching') || 'Searching…';
    const n = suggestions.length;
    if (n === 0) return t('search.header.noResults') || 'Nothing found. You can also search by BrickLink ID, like sw0001.';
    if (n === 1) return t('search.header.oneResultAvailable') || '1 suggestion available';
    return t('search.header.resultsAvailable', { count: n }) || `${n} suggestions available`;
  })();

  const isMobile = variant === 'mobile';
  const isHero = variant === 'hero';

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <form
        role="search"
        className={isHero ? 'hero-search-form' : undefined}
        onSubmit={(e) => { e.preventDefault(); submitQuery(); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          height: isHero ? '56px' : isMobile ? '44px' : '40px',
          padding: isHero ? '0 20px' : '0 12px',
          background: '#ffffff',
          border: `1px solid ${focused ? '#3b82f6' : '#e5e5e5'}`,
          borderRadius: isHero ? '28px' : '8px',
          boxShadow: focused ? '0 0 0 3px rgba(59, 130, 246, 0.15)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxSizing: 'border-box',
        }}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          style={{
            width: isHero ? 'var(--icon-lg)' : 'var(--icon-base)',
            height: isHero ? 'var(--icon-lg)' : 'var(--icon-base)',
            flexShrink: 0,
            color: '#737373',
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          ref={inputRef}
          className={isHero ? 'hero-search-input' : undefined}
          // type="text", not type="search": Safari and Chrome add their own
          // clear button and their own Escape-clears-the-field behaviour to
          // type="search", both of which fight the handling above.
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            // Only a blur that leaves the whole widget closes it, so clicking
            // the clear button does not tear the panel down underneath.
            if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
              setFocused(false);
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          // Must be undefined rather than "" when nothing is active: an empty
          // string is a dangling reference and some screen readers go silent.
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-label={t('search.header.ariaLabel') || 'Search LEGO minifigures and sets by name or BrickLink ID'}
          // Same short placeholder in every variant. The version with example
          // IDs overflowed the hero box by ~190px at 375px wide and got cut
          // mid-word; the examples live in the hint line under the box
          // instead, which wraps and -- unlike a placeholder -- is still there
          // once you start typing.
          placeholder={t('search.header.placeholder') || 'Search by name or BrickLink ID'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: 0,
            // Must stay at 16px. iOS Safari zooms the entire page when a
            // focused input's font-size is smaller, and the user then has to
            // pinch back out. --text-sm is clamp(14px, 1.75vw, 15px), which
            // would trigger it; --text-base is a flat 16px.
            fontSize: isHero ? 'var(--text-lg)' : 'var(--text-base)',
            fontFamily: 'inherit',
            color: '#171717',
          }}
        />

        {value && (
          <button
            type="button"
            aria-label={t('search.header.clear') || 'Clear search'}
            onClick={() => { onValueChange(''); inputRef.current?.focus(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'var(--icon-base)',
              height: 'var(--icon-base)',
              flexShrink: 0,
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              color: '#737373',
            }}
          >
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }}>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </form>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t('search.header.suggestions') || 'Search suggestions'}
          style={{
            // Absolute, never in normal flow. header-client.tsx measures the
            // header's offsetHeight to position the fixed mobile menu, so an
            // in-flow panel would push that menu down by the height of the
            // suggestion list on every keystroke.
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            padding: 0,
            listStyle: 'none',
            textAlign: 'left',
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            maxHeight: 'min(70vh, 460px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            // <header> is zIndex 10000 and establishes its own stacking
            // context, so 1000 inside it already floats above all page
            // content. Matches the header's sibling dropdowns.
            zIndex: 1000,
          }}
        >
          {suggestions.length === 0 && !loading && (
            <li role="presentation" style={{ padding: '14px 20px', fontSize: 'var(--text-sm)', color: '#737373' }}>
              {t('search.header.noResults') || 'Nothing found. You can also search by BrickLink ID, like sw0001.'}
            </li>
          )}

          {suggestions.map((s, i) => {
            const active = i === activeIndex;
            const isSeeAll = s.kind === 'seeAll';
            return (
              <li
                key={s.key}
                ref={(el) => { optionRefs.current[i] = el; }}
                id={optionId(i)}
                role="option"
                aria-selected={active}
                // Without this, mousedown blurs the input, the blur handler
                // closes the panel, this <li> unmounts, and the click never
                // fires at all. The classic autocomplete bug.
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => activate(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background: active ? '#f9fafb' : 'transparent',
                  borderTop: isSeeAll ? '1px solid #f5f5f5' : 'none',
                  fontSize: 'var(--text-sm)',
                  color: isSeeAll ? '#3b82f6' : '#171717',
                  fontWeight: isSeeAll ? 500 : 400,
                }}
              >
                {isSeeAll ? (
                  <span style={{ minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {(t('search.header.seeAll', { query: term }) || `See all results for “${term}”`)}
                  </span>
                ) : (
                  <>
                    <span style={{
                      width: '32px', height: '32px', flexShrink: 0, background: '#f5f5f5',
                      borderRadius: '4px', overflow: 'hidden', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      {s.image && (
                        // Plain <img>: next.config.js sets images.unoptimized,
                        // so next/image adds layout constraints and buys
                        // nothing at 32px.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt="" loading="lazy" decoding="async"
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      )}
                    </span>
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </span>
                      {s.meta && (
                        <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: '#737373' }}>
                          {s.meta}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Announces the result count. Sighted users get this from the list. */}
      <div role="status" aria-live="polite" style={{
        position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px',
        overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
      }}>
        {statusText}
      </div>
    </div>
  );
}
