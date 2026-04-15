'use client';

import { useRouter } from 'next/navigation';

interface CollectionSwitcherProps {
  currentPage: 'inventory' | 'personal-collection';
}

export default function CollectionSwitcher({ currentPage }: CollectionSwitcherProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    router.push(`/${value}`);
  };

  return (
    <select
      value={currentPage}
      onChange={handleChange}
      style={{
        fontSize: '28px',
        fontWeight: '700',
        lineHeight: '1',
        letterSpacing: '-0.02em',
        color: '#171717',
        margin: 0,
        padding: '8px 40px 8px 8px',
        background: '#ffffff',
        border: '2px solid #e5e5e5',
        borderRadius: '12px',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23525252' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
        backgroundPosition: 'right 12px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '20px 20px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        minHeight: '44px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f5f5f5';
        e.currentTarget.style.borderColor = '#d4d4d4';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#ffffff';
        e.currentTarget.style.borderColor = '#e5e5e5';
      }}
    >
      <option value="inventory">Inventory</option>
      <option value="personal-collection">Personal Collection</option>
    </select>
  );
}
