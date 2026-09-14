'use client';

import { getCurrencyByCode } from '@/lib/currency-config';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * Says, in words, which currency the prices above are in.
 *
 * Prices used to render as a bare "$9.14" for every visitor on earth, because
 * each pricing route began `preferredCountryCode || 'US'` and nothing ever
 * labelled the result. "$" is the dollar of at least five countries, so a
 * reader in Toronto or Sydney had no way to know which one they were looking
 * at -- and they were looking at the wrong one.
 *
 * Intl formats most currencies unambiguously on its own (CA$, R$, £), so this
 * is belt and braces for the symbol-sharing cases and, more importantly, the
 * place to be honest that a converted figure is an estimate: BrickLink quoted
 * dollars, we did the arithmetic, and the number a seller actually wants may
 * differ by the spread.
 */
export default function CurrencyNote({
  currencyCode,
  converted,
}: {
  currencyCode: string;
  converted?: boolean;
}) {
  const { t } = useTranslation();
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return null;

  const inCurrency = (
    t('pricing.shownIn') || 'Prices shown in {currency}'
  ).replace('{currency}', `${currency.code} (${currency.symbol})`);

  const note = converted
    ? t('pricing.convertedFromUsd') ||
      'converted from BrickLink’s worldwide USD prices at today’s rate'
    : null;

  return (
    <p
      style={{
        margin: '8px 0 0',
        fontSize: 'var(--text-xs)',
        color: '#737373',
        lineHeight: 1.5,
      }}
    >
      {currency.flag} {inCurrency}
      {note ? ` — ${note}` : null}
    </p>
  );
}
