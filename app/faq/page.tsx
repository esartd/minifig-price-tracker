import type { Metadata } from 'next';
import FAQPageClient from '@/components/faq-page-client';
import { getTranslations, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = await getTranslations(locale as Locale);

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  const localeMap = {
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    es: 'es_ES',
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
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/faq`,
      languages: {
        'en': `${domains.en}/faq`,
        'de': `${domains.de}/faq`,
        'fr': `${domains.fr}/faq`,
        'es': `${domains.es}/faq`,
        'x-default': `${domains.en}/faq`,
      },
    },
  };
}

function getLocalTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

export default async function FAQPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = getLocalTranslations(locale);
  const faqItems = t.faq.items as Array<{ q: string; a: string }>;

  const faqs = faqItems.map(item => ({
    question: item.q,
    answer: item.a,
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
