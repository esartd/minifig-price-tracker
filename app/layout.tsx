import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/session-provider'
import ScrollToTop from '@/components/ScrollToTop'
import CurrencyBanner from '@/components/CurrencyBanner'
import GuestCollectionProvider from '@/components/GuestCollectionProvider'
import GuestCollectionMigrator from '@/components/GuestCollectionMigrator'
import Script from 'next/script'
import '@/lib/startup-checks' // Initialize database safeguards on app startup
import { TranslationProvider } from '@/components/TranslationProvider'
import { AccountLinkedToast } from '@/components/auth/AccountLinkedToast'
import { getLocaleFromHost, getTranslations } from '@/lib/i18n-subdomain'
import { headers } from 'next/headers'
import { DOMAINS } from '@/lib/i18n-alternates';
import { SITE_DOMAIN, originFor } from '@/lib/site-domain';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);

  // Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

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
    metadataBase: new URL(domains[locale as keyof typeof domains]),
    title: {
      default: t.metadata?.title || 'IntoBrick - One Price for Any LEGO Minifigure or Set',
      template: '%s | IntoBrick'
    },
    description: t.metadata?.description || 'Price any LEGO minifigure or set in seconds. One suggested price from BrickLink and eBay data. Track your inventory free. 18,000+ minifigs, 20,000+ sets.',
    keywords: t.metadata?.keywords || ['LEGO minifigure prices', 'LEGO set prices', 'BrickLink price tracker', 'LEGO collection manager', 'minifig value tracker', 'LEGO seller tool', 'LEGO price guide', 'minifigure collection tracker', 'LEGO set tracker', 'LEGO inventory tracker', 'track LEGO prices', 'LEGO pricing tool', 'minifig suggested price'],
    authors: [{ name: 'IntoBrick', url: originFor(locale) }],
    creator: 'IntoBrick',
    publisher: 'IntoBrick',
    verification: {
      google: 'Q_SG-OFVZAL1wgpz58lt_DRWEOa0lSN_ISMhFg6TpuE',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      url: domains[locale as keyof typeof domains],
      siteName: 'IntoBrick',
      title: t.metadata?.title || 'IntoBrick - One Price for Any LEGO Minifigure or Set',
      description: t.metadata?.description || 'Price any LEGO minifigure or set in seconds. One suggested price from BrickLink and eBay data. Track your inventory free. 18,000+ minifigs, 20,000+ sets.',
      images: [
        {
          url: `/api/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: t.metadata?.ogImageAlt || 'IntoBrick - LEGO Minifigure Price Tracker',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.metadata?.title || 'IntoBrick - One Price for Any LEGO Minifigure or Set',
      description: t.metadata?.twitterDescription || 'Price any LEGO minifigure or set in seconds. One suggested price from BrickLink and eBay data. Track your inventory free.',
      images: [`/api/og?locale=${locale}`],
    },
    alternates: {
      canonical: domains[locale as keyof typeof domains],
      languages: {
        'en': domains.en,
        'de': domains.de,
        'fr': domains.fr,
        'es': domains.es,
        'it': domains.it,
        'nl': domains.nl,
        'pl': domains.pl,
        'pt': domains.pt,
        'sv': domains.sv,
        'ja': domains.ja,
        'x-default': domains.en,
      },
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Detect locale from subdomain
  const headersList = await headers();
  const host = headersList.get('host');
  const locale = getLocaleFromHost(host);
  const translations = await getTranslations(locale);

  // Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

  const localeCodeMap = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    it: 'it-IT',
    nl: 'nl-NL',
    pl: 'pl-PL',
    pt: 'pt-PT',
    sv: 'sv-SE',
    ja: 'ja-JP',
  };

  const baseUrl = domains[locale as keyof typeof domains];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'IntoBrick',
    description: translations.metadata?.webAppDescription || 'Price any LEGO minifigure or set in seconds. One suggested price, no mental math.',
    url: baseUrl,
    inLanguage: localeCodeMap[locale as keyof typeof localeCodeMap],
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: translations.metadata?.featureList || [
      'One suggested price per minifigure or set',
      'Dual inventory: sell list and personal collection',
      'Suggested pricing calculator',
      'Collection tracking',
      '18,000+ LEGO minifigures, 20,000+ sets'
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IntoBrick',
    // Was the retired hostname, on every page of the site. That told
    // Google the organisation lives on a host that now only 301s.
    url: originFor(locale),
    logo: `${originFor(locale)}/favicon.svg`,
    description: translations.metadata?.organizationDescription || 'IntoBrick gives you one suggested price for any LEGO minifigure or set, so you can list faster and sell with confidence.',
    foundingDate: '2024',
    sameAs: [],
  };

  // WebSite schema with sitelinks search box for Google
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IntoBrick',
    alternateName: translations.metadata?.siteAlternateName || 'LEGO Minifigure Price Tracker',
    url: baseUrl,
    inLanguage: localeCodeMap[locale as keyof typeof localeCodeMap],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang={locale} className="antialiased" style={{ margin: 0, padding: 0 }}>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://img.bricklink.com" />
        <link rel="preconnect" href="https://www.lego.com" />
        <link rel="preconnect" href="https://cdn.rebrickable.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://img.bricklink.com" />
        <link rel="dns-prefetch" href="https://www.lego.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased" style={{ margin: 0, padding: 0 }}>
        {/* Google Analytics.

            Gated on hostname, and that is not belt-and-braces. This same build
            runs as `figtracker-staging` on the production VPS, reachable at an
            easypanel.host address on the same IP -- so every page view on
            staging was landing in the live property. GA's own tag diagnostics
            is what surfaced it: it listed that host under "additional domains
            detected" alongside the real one.

            The loader is injected rather than rendered, so a non-production
            host does not even fetch gtag.js. SITE_DOMAIN comes from
            lib/site-domain.ts, so this follows the domain automatically
            instead of hard-coding a hostname that would need finding again on
            the next move. */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            (function () {
              var root = ${JSON.stringify(SITE_DOMAIN)};
              var h = window.location.hostname;
              // The apex, or any locale subdomain of it. Nothing else.
              if (h !== root && h.indexOf('.' + root) !== h.length - root.length - 1) return;

              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', 'G-PXLF7KRTSB', {
                send_page_view: true,
                cookie_flags: 'SameSite=None;Secure'
              });

              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=G-PXLF7KRTSB';
              document.head.appendChild(s);
            })();
          `}
        </Script>

        {/* eBay Partner Network Smart Tools */}
        <Script id="ebay-epn-config" strategy="afterInteractive">
          {`
            window._epn = {campaign: 5339150379};
            // Error handling for EPN script
            window.addEventListener('error', function(e) {
              if (e.filename && e.filename.includes('epn-smart-tools')) {
                console.warn('EPN Smart Tools failed to load:', e.message);
              }
            }, true);
          `}
        </Script>
        <Script
          src="https://epnt.ebay.com/static/epn-smart-tools.js"
          strategy="lazyOnload"
        />
        <AuthProvider>
          <TranslationProvider locale={locale} translations={translations}>
            <AccountLinkedToast />
            <CurrencyBanner />
            <GuestCollectionMigrator />
            <div className="min-h-screen" style={{ backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
              <ScrollToTop />
              <GuestCollectionProvider />
            </div>
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
