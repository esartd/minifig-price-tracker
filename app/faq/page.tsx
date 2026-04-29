import type { Metadata } from 'next';
import FAQPageClient from '@/components/faq-page-client';
import { headers } from 'next/headers';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | FigTracker',
  description: 'Common questions about FigTracker LEGO minifigure and set price tracker. Learn how to price items, track inventory in 15+ currencies, and use Bricklink data effectively.',
  keywords: ['LEGO pricing FAQ', 'Bricklink help', 'minifigure pricing guide', 'FigTracker help', 'how to price LEGO', 'LEGO set tracker'],
  openGraph: {
    title: 'Frequently Asked Questions | FigTracker',
    description: 'Get answers about pricing LEGO minifigures and sets with FigTracker. 15+ currencies, 18,000+ minifigs, 20,000+ sets.',
    url: 'https://figtracker.ericksu.com/faq',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/faq',
  },
};

function getTranslations(locale: string) {
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

  const t = getTranslations(locale);
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
