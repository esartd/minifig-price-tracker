/**
 * Calculate collection statistics in a single pass
 */
export function calculateCollectionStats<T extends {
  quantity: number;
  pricing?: {
    suggestedPrice?: number;
  };
}>(items: T[]) {
  if (items.length === 0) {
    return {
      totalValue: 0,
      totalItems: 0,
      avgValue: 0
    };
  }

  const stats = items.reduce(
    (acc, item) => ({
      totalValue: acc.totalValue + ((item.pricing?.suggestedPrice || 0) * item.quantity),
      totalItems: acc.totalItems + item.quantity,
      priceSum: acc.priceSum + (item.pricing?.suggestedPrice || 0)
    }),
    { totalValue: 0, totalItems: 0, priceSum: 0 }
  );

  return {
    totalValue: stats.totalValue,
    totalItems: stats.totalItems,
    avgValue: stats.priceSum / items.length
  };
}
