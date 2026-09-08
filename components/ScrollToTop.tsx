'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/TranslationProvider';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function ScrollToTop() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label={t('scrollToTop.ariaLabel') || 'Scroll to top'}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: 'var(--icon-2xl)',
        height: 'var(--icon-2xl)',
        // Square box, pill radius -- so this is a circle, like every other
        // icon-only button on the site.
        borderRadius: '999px',
        background: '#3b82f6',
        border: 'none',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        zIndex: 1000,
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
      }}
    >
      <ArrowUpIcon style={{ width: 'var(--icon-base)', height: 'var(--icon-base)' }} />
    </button>
  );
}
