'use client';

import { useState, useRef, useEffect } from 'react';

interface ThemeFiltersProps {
  themes: string[];
  themeCounts: Record<string, { count: number; items: any[] }>;
  selectedTheme: string | null; // null = "All"
  onSelectTheme: (theme: string | null) => void;
}

export default function ThemeFilters({
  themes,
  themeCounts,
  selectedTheme,
  onSelectTheme
}: ThemeFiltersProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (themes.length <= 1) return null;

  const MAX_SIMPLE_DISPLAY = 6;
  const useDropdown = themes.length > MAX_SIMPLE_DISPLAY;

  // Filter themes by search
  const filteredThemes = useDropdown && searchTerm
    ? themes.filter(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()))
    : themes;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSearchTerm('');
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Simple button display (6 or fewer themes)
  if (!useDropdown) {
    return (
      <div className="theme-filters-wrapper" style={{ marginBottom: '32px' }}>
        <div className="flex flex-wrap items-center" style={{ gap: '10px' }}>
          {/* "All" button */}
          <button
            className="theme-filter-button"
            onClick={() => onSelectTheme(null)}
            style={{
              padding: '12px 20px',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              background: selectedTheme === null ? '#3b82f6' : '#ffffff',
              border: selectedTheme === null ? 'none' : '1px solid #e5e5e5',
              borderRadius: '8px',
              color: selectedTheme === null ? '#ffffff' : '#525252',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none'
            }}
          >
            All
          </button>

          {themes.map(theme => {
            const isSelected = selectedTheme === theme;
            const count = themeCounts[theme]?.count || 0;

            return (
              <button
                key={theme}
                className="theme-filter-button"
                onClick={() => onSelectTheme(theme)}
                style={{
                  padding: '12px 20px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  background: isSelected ? '#3b82f6' : '#ffffff',
                  border: isSelected ? 'none' : '1px solid #e5e5e5',
                  borderRadius: '8px',
                  color: isSelected ? '#ffffff' : '#525252',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
              >
                {theme} · {count}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Dropdown display (more than 6 themes)
  return (
    <div className="theme-filters-wrapper" style={{ marginBottom: '32px' }}>
      <div className="flex items-center" style={{ gap: '10px', position: 'relative' }}>
        <div ref={dropdownRef} style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              padding: '12px 20px',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              color: '#525252',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: '12px'
            }}
          >
            <span>
              {selectedTheme ? selectedTheme : 'All categories'}
            </span>
            <svg
              style={{
                width: '16px',
                height: '16px',
                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                flexShrink: 0
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '12px',
              zIndex: 1000,
              maxHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Search box */}
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                style={{
                  padding: '10px 12px',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
              />

              {/* Scrollable theme list */}
              <div style={{
                maxHeight: '320px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {/* "All" option */}
                <button
                  onClick={() => {
                    onSelectTheme(null);
                    setShowDropdown(false);
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '10px 12px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    background: selectedTheme === null ? '#eff6ff' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: selectedTheme === null ? '#3b82f6' : '#525252',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTheme !== null) e.currentTarget.style.background = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTheme !== null) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>All</span>
                </button>

                {filteredThemes.length > 0 ? (
                  filteredThemes.map(theme => {
                    const isSelected = selectedTheme === theme;
                    const count = themeCounts[theme]?.count || 0;

                    return (
                      <button
                        key={theme}
                        onClick={() => {
                          onSelectTheme(theme);
                          setShowDropdown(false);
                          setSearchTerm('');
                        }}
                        style={{
                          padding: '10px 12px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: '500',
                          background: isSelected ? '#eff6ff' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: isSelected ? '#3b82f6' : '#525252',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span>{theme}</span>
                        <span style={{ color: '#a3a3a3' }}>{count}</span>
                      </button>
                    );
                  })
                ) : (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#a3a3a3',
                    fontSize: 'var(--text-sm)'
                  }}>
                    No categories found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
