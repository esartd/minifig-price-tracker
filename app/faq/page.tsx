import type { Metadata } from 'next';
import FAQPageClient from '@/components/faq-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);

  const t = await getTranslations(locale as Locale);

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
    it: 'https://it.figtracker.ericksu.com',
    nl: 'https://nl.figtracker.ericksu.com',
    pl: 'https://pl.figtracker.ericksu.com',
    pt: 'https://pt.figtracker.ericksu.com',
    sv: 'https://sv.figtracker.ericksu.com',
    ja: 'https://ja.figtracker.ericksu.com',
  };

  const localeMap = {
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    es: 'es_ES',
    it: 'it_IT',
    nl: 'nl_NL',
    pl: 'pl_PL',
    pt: 'pt_PT',
    sv: 'sv_SE',
    ja: 'ja_JP',
  };

  return {
    title: t.faq.meta.title,
    description: t.faq.meta.description,
    keywords: t.faq.meta.keywords,
    openGraph: {
      title: t.faq.meta.ogTitle,
      description: t.faq.meta.ogDescription,
      url: `${domains[locale as keyof typeof domains]}/faq`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/faq`,
      languages: {
        'en': `${domains.en}/faq`,
        'de': `${domains.de}/faq`,
        'fr': `${domains.fr}/faq`,
        'es': `${domains.es}/faq`,
        'it': `${domains.it}/faq`,
        'nl': `${domains.nl}/faq`,
        'pl': `${domains.pl}/faq`,
        'pt': `${domains.pt}/faq`,
        'sv': `${domains.sv}/faq`,
        'ja': `${domains.ja}/faq`,
        'x-default': `${domains.en}/faq`,
      },
    },
  };
}

export default async function FAQPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);

  const t = await getTranslations(locale);
  const faqItems = t.faq.items as Array<{ q: string; a: string }>;

  // Items 0 and 2 cover pricing methodology -- point them at the full
  // breakdown page rather than duplicating that content in the FAQ answer.
  const pricingMethodologyIndexes = new Set([0, 2]);
  const learnMoreText = t.howWeCalculatePrices?.faqLinkText || 'See the full pricing breakdown';

  const faqs = faqItems.map((item, index) => ({
    question: item.q,
    answer: item.a,
    ...(pricingMethodologyIndexes.has(index)
      ? { link: { href: '/how-we-calculate-prices', text: learnMoreText } }
      : {}),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FAQPageClient faqs={faqs} />
    </>
  );
}
