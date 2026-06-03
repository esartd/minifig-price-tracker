'use client';

import { useState, useEffect } from 'react';

interface CollectionPaginationProps {
  currentPage: number;
  totalPages: number;
  currentCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onLoadMore?: () => void; // New prop for mobile load more behavior
}

export default function CollectionPagination({
  currentPage,
  totalPages,
  currentCount,
  totalCount,
  onPageChange,
  onLoadMore
}: CollectionPaginationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasMore = currentPage < totalPages;

  // Mobile: Show More button (accumulates items, no scroll to top)
  if (isMobile) {
    if (!hasMore) return null;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '32px 16px'
      }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#737373'
        }}>
          Showing {currentCount} of {totalCount}
        </p>
        <button
          onClick={() => {
            // Use onLoadMore if provided (mobile behavior), otherwise fallback to onPageChange
            if (onLoadMore) {
              onLoadMore();
            } else {
              onPageChange(currentPage + 1);
            }
          }}
          style={{
            padding: '12px 32px',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: '#ffffff',
            background: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#3b82f6';
          }}
        >
          Show More
        </button>
      </div>
    );
  }

  // Desktop: Page numbers (like Google desktop)
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '32px 16px',
      fontSize: 'var(--text-sm)',
      flexWrap: 'wrap'
    }}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 16px',
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
          if (currentPage !== 1) e.currentTarget.style.background = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} style={{ padding: '8px 12px', color: '#a3a3a3' }}>
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
              if (!isActive) e.currentTarget.style.background = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
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
          padding: '8px 16px',
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
          if (currentPage !== totalPages) e.currentTarget.style.background = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        Next →
      </button>
    </div>
  );
}
