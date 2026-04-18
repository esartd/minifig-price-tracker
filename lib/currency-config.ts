// Currency configuration for regional pricing

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  countryCode: string;
  region: string;
  locale: string;
  flag: string;
  continent: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  // North America
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    countryCode: 'US',
    region: 'north_america',
    locale: 'en-US',
    flag: '🇺🇸',
    continent: 'North America',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    countryCode: 'CA',
    region: 'north_america',
    locale: 'en-CA',
    flag: '🇨🇦',
    continent: 'North America',
  },
  {
    code: 'MXN',
    symbol: 'MX$',
    name: 'Mexican Peso',
    countryCode: 'MX',
    region: 'north_america',
    locale: 'es-MX',
    flag: '🇲🇽',
    continent: 'North America',
  },
  {
    code: 'GTQ',
    symbol: 'Q',
    name: 'Guatemalan Quetzal',
    countryCode: 'GT',
    region: 'north_america',
    locale: 'es-GT',
    flag: '🇬🇹',
    continent: 'North America',
  },

  // Europe
  {
    code: 'GBP',
    symbol: '£',
    name: 'Pound Sterling',
    countryCode: 'GB',
    region: 'europe',
    locale: 'en-GB',
    flag: '🇬🇧',
    continent: 'Europe',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    countryCode: 'DE',
    region: 'europe',
    locale: 'de-DE',
    flag: '🇪🇺',
    continent: 'Europe',
  },
  {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    countryCode: 'CH',
    region: 'europe',
    locale: 'de-CH',
    flag: '🇨🇭',
    continent: 'Europe',
  },
  {
    code: 'NOK',
    symbol: 'kr',
    name: 'Norwegian Kroner',
    countryCode: 'NO',
    region: 'europe',
    locale: 'nb-NO',
    flag: '🇳🇴',
    continent: 'Europe',
  },
  {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    countryCode: 'SE',
    region: 'europe',
    locale: 'sv-SE',
    flag: '🇸🇪',
    continent: 'Europe',
  },
  {
    code: 'DKK',
    symbol: 'kr',
    name: 'Danish Krone',
    countryCode: 'DK',
    region: 'europe',
    locale: 'da-DK',
    flag: '🇩🇰',
    continent: 'Europe',
  },
  {
    code: 'PLN',
    symbol: 'zł',
    name: 'Polish Zloty',
    countryCode: 'PL',
    region: 'europe',
    locale: 'pl-PL',
    flag: '🇵🇱',
    continent: 'Europe',
  },
  {
    code: 'CZK',
    symbol: 'Kč',
    name: 'Czech Koruna',
    countryCode: 'CZ',
    region: 'europe',
    locale: 'cs-CZ',
    flag: '🇨🇿',
    continent: 'Europe',
  },
  {
    code: 'HUF',
    symbol: 'Ft',
    name: 'Hungarian Forint',
    countryCode: 'HU',
    region: 'europe',
    locale: 'hu-HU',
    flag: '🇭🇺',
    continent: 'Europe',
  },
  {
    code: 'BGN',
    symbol: 'лв',
    name: 'Bulgarian Lev',
    countryCode: 'BG',
    region: 'europe',
    locale: 'bg-BG',
    flag: '🇧🇬',
    continent: 'Europe',
  },
  {
    code: 'RON',
    symbol: 'lei',
    name: 'Romanian New Lei',
    countryCode: 'RO',
    region: 'europe',
    locale: 'ro-RO',
    flag: '🇷🇴',
    continent: 'Europe',
  },
  {
    code: 'RSD',
    symbol: 'дин',
    name: 'Serbian Dinar',
    countryCode: 'RS',
    region: 'europe',
    locale: 'sr-RS',
    flag: '🇷🇸',
    continent: 'Europe',
  },
  {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    countryCode: 'TR',
    region: 'europe',
    locale: 'tr-TR',
    flag: '🇹🇷',
    continent: 'Europe',
  },
  {
    code: 'RUB',
    symbol: '₽',
    name: 'Russian Rouble',
    countryCode: 'RU',
    region: 'europe',
    locale: 'ru-RU',
    flag: '🇷🇺',
    continent: 'Europe',
  },
  {
    code: 'UAH',
    symbol: '₴',
    name: 'Ukraine Hryvnia',
    countryCode: 'UA',
    region: 'europe',
    locale: 'uk-UA',
    flag: '🇺🇦',
    continent: 'Europe',
  },

  // Asia
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    countryCode: 'JP',
    region: 'asia_pacific',
    locale: 'ja-JP',
    flag: '🇯🇵',
    continent: 'Asia',
  },
  {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    countryCode: 'KR',
    region: 'asia_pacific',
    locale: 'ko-KR',
    flag: '🇰🇷',
    continent: 'Asia',
  },
  {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    countryCode: 'CN',
    region: 'asia_pacific',
    locale: 'zh-CN',
    flag: '🇨🇳',
    continent: 'Asia',
  },
  {
    code: 'HKD',
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    countryCode: 'HK',
    region: 'asia_pacific',
    locale: 'zh-HK',
    flag: '🇭🇰',
    continent: 'Asia',
  },
  {
    code: 'MOP',
    symbol: 'MOP$',
    name: 'Macau Pataca',
    countryCode: 'MO',
    region: 'asia_pacific',
    locale: 'zh-MO',
    flag: '🇲🇴',
    continent: 'Asia',
  },
  {
    code: 'TWD',
    symbol: 'NT$',
    name: 'Taiwan New Dollar',
    countryCode: 'TW',
    region: 'asia_pacific',
    locale: 'zh-TW',
    flag: '🇹🇼',
    continent: 'Asia',
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    countryCode: 'SG',
    region: 'asia_pacific',
    locale: 'en-SG',
    flag: '🇸🇬',
    continent: 'Asia',
  },
  {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    countryCode: 'MY',
    region: 'asia_pacific',
    locale: 'ms-MY',
    flag: '🇲🇾',
    continent: 'Asia',
  },
  {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    countryCode: 'TH',
    region: 'asia_pacific',
    locale: 'th-TH',
    flag: '🇹🇭',
    continent: 'Asia',
  },
  {
    code: 'PHP',
    symbol: '₱',
    name: 'Philippine Peso',
    countryCode: 'PH',
    region: 'asia_pacific',
    locale: 'en-PH',
    flag: '🇵🇭',
    continent: 'Asia',
  },
  {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    countryCode: 'ID',
    region: 'asia_pacific',
    locale: 'id-ID',
    flag: '🇮🇩',
    continent: 'Asia',
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    countryCode: 'IN',
    region: 'asia_pacific',
    locale: 'en-IN',
    flag: '🇮🇳',
    continent: 'Asia',
  },

  // Oceania
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    countryCode: 'AU',
    region: 'asia_pacific',
    locale: 'en-AU',
    flag: '🇦🇺',
    continent: 'Oceania',
  },
  {
    code: 'NZD',
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
    countryCode: 'NZ',
    region: 'asia_pacific',
    locale: 'en-NZ',
    flag: '🇳🇿',
    continent: 'Oceania',
  },

  // South America
  {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    countryCode: 'BR',
    region: 'south_america',
    locale: 'pt-BR',
    flag: '🇧🇷',
    continent: 'South America',
  },
  {
    code: 'ARS',
    symbol: 'AR$',
    name: 'Argentine Peso',
    countryCode: 'AR',
    region: 'south_america',
    locale: 'es-AR',
    flag: '🇦🇷',
    continent: 'South America',
  },

  // Africa
  {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    countryCode: 'ZA',
    region: 'africa',
    locale: 'en-ZA',
    flag: '🇿🇦',
    continent: 'Africa',
  },

  // Middle East
  {
    code: 'ILS',
    symbol: '₪',
    name: 'Israeli New Shekel',
    countryCode: 'IL',
    region: 'middle_east',
    locale: 'he-IL',
    flag: '🇮🇱',
    continent: 'Middle East',
  },
];

export function getCurrencyByCode(code: string): CurrencyOption | undefined {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code);
}

export function getCurrencyByCountryCode(countryCode: string): CurrencyOption | undefined {
  return SUPPORTED_CURRENCIES.find((c) => c.countryCode === countryCode);
}

export function getCurrencySymbol(code: string): string {
  return getCurrencyByCode(code)?.symbol || '$';
}

export function getCurrencyConfig(code: string) {
  const currency = getCurrencyByCode(code);
  if (!currency) {
    return {
      symbol: '$',
      countryCode: 'US',
      region: 'north_america',
      locale: 'en-US',
    };
  }
  return {
    symbol: currency.symbol,
    countryCode: currency.countryCode,
    region: currency.region,
    locale: currency.locale,
  };
}

export function getCurrenciesByContinent(): Record<string, CurrencyOption[]> {
  const grouped: Record<string, CurrencyOption[]> = {};

  SUPPORTED_CURRENCIES.forEach((currency) => {
    if (!grouped[currency.continent]) {
      grouped[currency.continent] = [];
    }
    grouped[currency.continent].push(currency);
  });

  // Sort currencies alphabetically by name within each continent
  Object.keys(grouped).forEach((continent) => {
    grouped[continent].sort((a, b) => a.name.localeCompare(b.name));
  });

  return grouped;
}
