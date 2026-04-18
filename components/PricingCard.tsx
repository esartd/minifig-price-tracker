'use client';

import { CollectionItem } from '@/types';
import { useSession } from 'next-auth/react';
import { formatPrice as formatPriceUtil } from '@/lib/format-price';

interface PricingCardProps {
  item: CollectionItem;
  showDecimals: boolean;
}

export default function PricingCard({ item, showDecimals }: PricingCardProps) {
  const { data: session } = useSession();
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

  return (
    <div className="apple-card sticky top-24">
      <h3 className="text-lg font-semibold mb-1 text-gray-900 tracking-tight">{item.minifigure_name}</h3>
      <p className="text-xs text-gray-400 mb-2">{item.minifigure_no}</p>

      {currency !== 'USD' && (
        <p className="text-xs text-orange-600 mb-4 italic">
          ⓘ Showing USD prices - limited sellers in your region
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Market Average (Qty Weighted) */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
          <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wide mb-2">
            Market Avg (Qty Weighted)
          </p>
          <p className="text-2xl font-semibold text-blue-900 tracking-tight">
            {formatPrice(pricing.sixMonthAverage)}
          </p>
        </div>

        {/* Current Simple Average */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
          <p className="text-[10px] font-medium text-purple-600 uppercase tracking-wide mb-2">
            Simple Avg
          </p>
          <p className="text-2xl font-semibold text-purple-900 tracking-tight">
            {formatPrice(pricing.currentAverage)}
          </p>
        </div>

        {/* Current Lowest */}
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl">
          <p className="text-[10px] font-medium text-orange-600 uppercase tracking-wide mb-2">
            Lowest Listing
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
    </div>
  );
}
