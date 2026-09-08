'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from './TranslationProvider';
import SegmentedControl from '@/components/ui/SegmentedControl';

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
      {/* Two SegmentedControls, replacing two hand-built tracks.

          This was the only toggle on the site using an iOS-style white thumb
          on a grey track -- one of eleven separate designs for the same job of
          "pick one of these". shortLabel replaces the .toggle-text-mobile /
          .toggle-text-desktop span pairs that swapped the wording by
          breakpoint. */}
      <SegmentedControl
        ariaLabel={t('navigation.browse') || 'Item type'}
        value={currentType}
        onChange={(v) => handleNavigate(v as 'minifigs' | 'sets', currentView)}
        options={[
          {
            value: 'minifigs',
            label: t('navigation.minifigures') || 'Minifigures',
            shortLabel: t('navigation.minifigs') || 'Minifigs',
          },
          { value: 'sets', label: t('navigation.sets') || 'Sets' },
        ]}
      />

      <SegmentedControl
        ariaLabel={t('navigation.yourLego') || 'List'}
        value={currentView}
        onChange={(v) => handleNavigate(currentType, v as 'sale' | 'keep')}
        options={[
          {
            value: 'sale',
            label: t('navigation.forSale') || 'For Sale',
            shortLabel: t('navigation.sale') || 'Sale',
          },
          {
            value: 'keep',
            label: t('navigation.toKeep') || 'To Keep',
            shortLabel: t('navigation.keep') || 'Keep',
          },
        ]}
      />
    </div>
  );
}
