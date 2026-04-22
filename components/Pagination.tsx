'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (isMobile: boolean) => {
    const pages: (number | string)[] = [];
    const maxVisible = isMobile ? 3 : 7; // Fewer pages on mobile

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        // Mobile: Just show current, prev, and next
        if (currentPage > 1) pages.push(currentPage - 1);
        pages.push(currentPage);
        if (currentPage < totalPages) pages.push(currentPage + 1);
      } else {
        // Desktop: Show full range
        pages.push(1);

        if (currentPage > 3) {
          pages.push('...');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (currentPage < totalPages - 2) {
          pages.push('...');
        }

        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const pageNumbers = getPageNumbers(isMobile);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? '4px' : '8px',
      padding: '32px 16px',
      fontSize: 'var(--text-sm)',
      flexWrap: 'wrap'
    }}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: isMobile ? '8px 12px' : '8px 16px',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: currentPage === 1 ? '#a3a3a3' : '#171717',
          background: 'transparent',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.background = '#f5f5f5';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {isMobile ? '←' : '← Previous'}
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} style={{
              padding: '8px 12px',
              color: '#a3a3a3'
            }}>
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            style={{
              padding: '8px 12px',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? '600' : '500',
              color: isActive ? '#ffffff' : '#171717',
              background: isActive ? '#3b82f6' : 'transparent',
              border: `1px solid ${isActive ? '#3b82f6' : '#e5e5e5'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '40px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: isMobile ? '8px 12px' : '8px 16px',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: currentPage === totalPages ? '#a3a3a3' : '#171717',
          background: 'transparent',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.background = '#f5f5f5';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {isMobile ? '→' : 'Next →'}
      </button>
    </div>
  );
}
