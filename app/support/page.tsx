import type { Metadata } from 'next';
import SupportPageClient from '@/components/support-page-client';
import { getTranslations, getLocaleFromHost, type Locale } from '@/lib/i18n-subdomain';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

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
    title: t.supportPage.meta.title,
    description: t.supportPage.meta.description,
    keywords: t.supportPage.meta.keywords,
    openGraph: {
      title: t.supportPage.meta.title,
      description: t.supportPage.meta.description,
      url: `${domains[locale as keyof typeof domains]}/support`,
      type: 'website',
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/support`,
      languages: {
        'en': `${domains.en}/support`,
        'de': `${domains.de}/support`,
        'fr': `${domains.fr}/support`,
        'es': `${domains.es}/support`,
        'it': `${domains.it}/support`,
        'nl': `${domains.nl}/support`,
        'pl': `${domains.pl}/support`,
        'pt': `${domains.pt}/support`,
        'sv': `${domains.sv}/support`,
        'ja': `${domains.ja}/support`,
        'x-default': `${domains.en}/support`,
      },
    },
  };
}

export default async function SupportPage() {
  // Fetch user data if logged in
  const session = await auth();
  let userData = null;

  if (session?.user?.email) {
    userData = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        totalPricingViews: true,
      },
    });
  }

  return <SupportPageClient totalPricingViews={userData?.totalPricingViews || null} />;
}
