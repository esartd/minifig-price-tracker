'use client';

import { CollectionItem } from '@/types';
import { useSession } from 'next-auth/react';
import { formatPrice as formatPriceUtil } from '@/lib/format-price';
import { useTranslation } from '@/components/TranslationProvider';

interface PricingCardProps {
  item: CollectionItem;
  showDecimals: boolean;
}

export default function PricingCard({ item, showDecimals }: PricingCardProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const pricing = item.pricing;
  const currency = item.pricing?.currencyCode || session?.user?.preferredCurrency || 'USD';

  const formatPrice = (price: number) => {
    return formatPriceUtil(price, currency, showDecimals);
  };

  if (!pricing) {
    return (
      <div className="apple-card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 tracking-tight">{item.minifigure_name}</h3>
        <p className="text-gray-500 text-sm">Loading pricing data...</p>
      </div>
    );
  }

  if (pricing.suggestedPrice === 0) {
    const msg = pricing.unavailable_reason === 'daily_limit'
      ? (t('collection.pricing.pricingDailyLimit') || 'Pricing unavailable right now — check back soon')
      : (t('collection.pricing.noSellersAvailable') || 'No sellers available');
    return (
      <div className="apple-card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 tracking-tight">{item.minifigure_name}</h3>
        <p className="text-xs text-gray-400 mb-2">{item.minifigure_no}</p>
        <p className="text-gray-500 text-sm">{msg}</p>
      </div>
    );
  }

  const handleSupportClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Track the click event
    try {
      await fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'pricing_card_support_click',
          properties: {
            item_no: item.minifigure_no,
            item_name: item.minifigure_name,
          }
        })
      });
    } catch (error) {
      console.error('Failed to track support click:', error);
    }

    // Navigate to support page
    window.location.href = '/support';
  };

  return (
    <div className="apple-card sticky top-24">
      <h3 className="text-lg font-semibold mb-1 text-gray-900 tracking-tight">{item.minifigure_name}</h3>
      <p className="text-xs text-gray-400 mb-2">{item.minifigure_no}</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Sold Qty Avg (6 months) */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
          <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wide mb-2">
            6 Mo Avg
          </p>
          <p className="text-2xl font-semibold text-blue-900 tracking-tight">
            {formatPrice(pricing.sixMonthAverage)}
          </p>
        </div>

        {/* Stock Qty Avg */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
          <p className="text-[10px] font-medium text-purple-600 uppercase tracking-wide mb-2">
            Current Avg
          </p>
          <p className="text-2xl font-semibold text-purple-900 tracking-tight">
            {formatPrice(pricing.currentAverage)}
          </p>
        </div>

        {/* Stock Lowest */}
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl">
          <p className="text-[10px] font-medium text-orange-600 uppercase tracking-wide mb-2">
            Lowest
          </p>
          <p className="text-2xl font-semibold text-orange-900 tracking-tight">
            {formatPrice(pricing.currentLowest)}
          </p>
        </div>

        {/* Suggested Price */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl">
          <p className="text-[10px] font-medium text-green-600 uppercase tracking-wide mb-2">
            Suggested Price
          </p>
          <p className="text-2xl font-semibold text-green-900 tracking-tight">
            {formatPrice(pricing.suggestedPrice)}
          </p>
        </div>
      </div>

      {/* Support Link */}
      <div className="mt-4 text-center">
        <a
          href="/support"
          onClick={handleSupportClick}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          Saved you some time? Support free pricing →
        </a>
      </div>
    </div>
  );
}
