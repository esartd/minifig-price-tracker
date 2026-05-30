import { getCurrencySymbol, getCurrencyByCode } from './currency-config';

export function formatPrice(
  amount: number,
  currency: string = 'USD',
  showDecimals: boolean = true
): string {
  const currencyConfig = getCurrencyByCode(currency);
  const locale = currencyConfig?.locale || 'en-US';

  // Some currencies don't use decimal places
  const currenciesWithoutDecimals = ['JPY', 'KRW', 'IDR', 'TWD', 'HUF', 'CLP'];
  const useDecimals = showDecimals && !currenciesWithoutDecimals.includes(currency);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: useDecimals ? 2 : 0,
      maximumFractionDigits: useDecimals ? 2 : 0,
    }).format(amount);
  } catch (error) {
    const symbol = getCurrencySymbol(currency);
    const formatted = useDecimals ? amount.toFixed(2) : Math.round(amount).toString();
    return `${symbol}${formatted}`;
  }
}
