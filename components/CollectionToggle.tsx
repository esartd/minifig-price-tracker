'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from './TranslationProvider';

interface CollectionToggleProps {
  currentType: 'minifigs' | 'sets';
  currentView: 'sale' | 'keep';
}

export default function CollectionToggle({ currentType, currentView }: CollectionToggleProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleNavigate = (type: 'minifigs' | 'sets', view: 'sale' | 'keep') => {
    // Map to correct URL
    if (type === 'minifigs' && view === 'sale') {
      router.push('/inventory');
    } else if (type === 'minifigs' && view === 'keep') {
      router.push('/collection');
    } else if (type === 'sets' && view === 'sale') {
      router.push('/sets-inventory');
    } else if (type === 'sets' && view === 'keep') {
      router.push('/sets-collection');
    }
  };

  return (
    <div className="collection-toggle-wrapper" style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 'var(--space-3)',
      flexWrap: 'nowrap',
      alignItems: 'center'
    }}>
      {/* Item Type Toggle */}
      <div style={{
        display: 'inline-flex',
        background: '#e5e5e5',
        borderRadius: '8px',
        padding: '4px',
        flex: '0 1 auto',
        minWidth: 0
      }}>
        <button
          onClick={() => handleNavigate('minifigs', currentView)}
          style={{
            padding: '9px 24px',
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: currentType === 'minifigs' ? '#ffffff' : 'transparent',
            color: currentType === 'minifigs' ? '#171717' : '#737373',
            boxShadow: currentType === 'minifigs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <span className="toggle-text-mobile">{t('navigation.minifigs')}</span>
          <span className="toggle-text-desktop">{t('navigation.minifigures')}</span>
        </button>
        <button
          onClick={() => handleNavigate('sets', currentView)}
          style={{
            padding: '9px 24px',
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: currentType === 'sets' ? '#ffffff' : 'transparent',
            color: currentType === 'sets' ? '#171717' : '#737373',
            boxShadow: currentType === 'sets' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {t('navigation.sets')}
        </button>
      </div>

      {/* View Type Toggle */}
      <div style={{
        display: 'inline-flex',
        background: '#e5e5e5',
        borderRadius: '8px',
        padding: '4px',
        flex: '0 1 auto',
        minWidth: 0
      }}>
        <button
          onClick={() => handleNavigate(currentType, 'sale')}
          style={{
            padding: '9px 24px',
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: currentView === 'sale' ? '#ffffff' : 'transparent',
            color: currentView === 'sale' ? '#171717' : '#737373',
            boxShadow: currentView === 'sale' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <span className="toggle-text-mobile">{t('navigation.sale')}</span>
          <span className="toggle-text-desktop">{t('navigation.forSale')}</span>
        </button>
        <button
          onClick={() => handleNavigate(currentType, 'keep')}
          style={{
            padding: '9px 24px',
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: currentView === 'keep' ? '#ffffff' : 'transparent',
            color: currentView === 'keep' ? '#171717' : '#737373',
            boxShadow: currentView === 'keep' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <span className="toggle-text-mobile">{t('navigation.keep')}</span>
          <span className="toggle-text-desktop">{t('navigation.toKeep')}</span>
        </button>
      </div>
    </div>
  );
}
