'use client';

const THEME_NAMES: Record<string, string> = {
  // Star Wars & Popular themes
  'sw': 'Star Wars',
  'hp': 'Harry Potter',
  'sh': 'Super Heroes',
  'njo': 'Ninjago',
  'mk': 'Monkie Kid',
  'min': 'Minecraft',
  'frnd': 'Friends',
  'dis': 'Disney',
  'dp': 'Disney Princess',

  // Collectible Minifigures
  'col': 'Collectible',
  'coldnd': 'Collectible D&D',
  'colhp': 'Collectible HP',
  'coltlbm': 'Collectible Batman',
  'coltlnm': 'Collectible Ninjago',
  'colmar': 'Collectible Marvel',
  'colsh': 'Collectible Heroes',
  'colspi': 'Collectible Spider-Man',
  'collt': 'Collectible Looney Tunes',
  'coltm': 'Collectible Muppets',
  'coluni': 'Collectible Unikitty',

  // Town/City themes
  'cty': 'City',
  'air': 'Airport',
  'cop': 'Police',
  'chef': 'Town',
  'but': 'Town',

  // Castle & Adventure
  'cas': 'Castle',
  'adv': 'Adventurers',
  'pi': 'Pirates',
  'poc': 'Pirates Caribbean',

  // Fantasy & Sci-Fi
  'lor': 'LOTR',
  'hol': 'Hobbit',
  'elf': 'Elves',
  'nex': 'Nexo Knights',
  'atl': 'Atlantis',
  'aqu': 'Aquazone',
  'alp': 'Alpha Team',
  'agt': 'Agents',
  'bio': 'BIONICLE',

  // Movies & Shows
  'tlm': 'LEGO Movie',
  'tlb': 'LEGO Batman',
  'tln': 'LEGO Ninjago Movie',
  'bat': 'Batman',
  'bob': 'SpongeBob',
  'ani': 'Animal Crossing',
  'avt': 'Avatar',
  'blu': 'Bluey',

  // DUPLO & Parks
  'crs': 'DUPLO Cars',
  'btb': 'Bob The Builder',
  'bdp': 'BrickLink Program',
  'llp': 'LEGOLAND Parks',

  // Ideas & Other
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
