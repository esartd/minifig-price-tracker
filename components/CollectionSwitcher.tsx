'use client';

import { useRouter } from 'next/navigation';

interface CollectionSwitcherProps {
  currentPage: 'inventory' | 'collection';
}

export default function CollectionSwitcher({ currentPage }: CollectionSwitcherProps) {
  const router = useRouter();

  const displayName = currentPage === 'inventory' ? 'Inventory' : 'Your Collection';
  const targetPage = currentPage === 'inventory' ? '/collection' : '/inventory';

  const handleClick = () => {
    router.push(targetPage);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        fontSize: '28px',
        fontWeight: '700',
        lineHeight: '1',
        letterSpacing: '-0.02em',
        color: '#171717',
        margin: 0,
        padding: '0 32px 0 0',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23171717' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5'/%3E%3C/svg%3E")`,
        backgroundPosition: 'right 0 center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px 16px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        minHeight: '44px',
        width: 'fit-content',
        display: 'inline-block',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      {displayName}
    </button>
  );
}
