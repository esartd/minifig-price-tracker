'use client';

const THEME_NAMES: Record<string, string> = {
  'sw': 'Star Wars',
  'hp': 'Harry Potter',
  'sh': 'Super Heroes',
  'col': 'Collectible',
  'njo': 'Ninjago',
  'dis': 'Disney',
  'dp': 'Disney Princess',
  'frnd': 'Friends',
  'lor': 'LOTR',
  'hol': 'Hobbit',
  'tlm': 'LEGO Movie',
  'cty': 'City',
  'cas': 'Castle',
  'pi': 'Pirates',
  'poc': 'Pirates Caribbean',
  'tlb': 'LEGO Batman',
  'tln': 'LEGO Ninjago Movie',
  'elf': 'Elves',
  'nex': 'Nexo Knights',
  'idea': 'Ideas',
};

interface ThemeFiltersProps {
  themes: string[];
  themeCounts: Record<string, { count: number; items: any[] }>;
  selectedThemes: Set<string>;
  onToggleTheme: (theme: string) => void;
  onToggleAll: () => void;
}

export default function ThemeFilters({
  themes,
  themeCounts,
  selectedThemes,
  onToggleTheme,
  onToggleAll
}: ThemeFiltersProps) {
  if (themes.length <= 1) return null;

  return (
    <div className="theme-filters-wrapper" style={{ marginBottom: '32px' }}>
      <div className="flex flex-wrap items-center" style={{ gap: '10px' }}>
        {themes.map(theme => {
          const isSelected = selectedThemes.has(theme);
          const themeName = THEME_NAMES[theme] || theme.toUpperCase();
          const count = themeCounts[theme]?.count || 0;

          return (
            <button
              key={theme}
              className="theme-filter-button"
              onClick={() => onToggleTheme(theme)}
              style={{
                padding: '12px 20px',
                fontSize: '15px',
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
              {themeName} · {count}
            </button>
          );
        })}

        {themes.length > 1 && (
          <button
            className="theme-filter-button"
            onClick={onToggleAll}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: '500',
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              color: '#525252',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none'
            }}
          >
            {selectedThemes.size === themes.length ? 'Clear All' : 'Select All'}
          </button>
        )}
      </div>
    </div>
  );
}
