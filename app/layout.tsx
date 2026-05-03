import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/session-provider'
import ScrollToTop from '@/components/ScrollToTop'
import CurrencyBanner from '@/components/CurrencyBanner'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import '@/lib/startup-checks' // Initialize database safeguards on app startup
import { TranslationProvider } from '@/components/TranslationProvider'
import { getLocaleFromHost, getTranslations } from '@/lib/i18n-subdomain'
import { headers } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

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
    metadataBase: new URL(domains[locale as keyof typeof domains]),
    title: {
      default: 'FigTracker - LEGO Minifigure & Set Price Tracker with Real-Time Bricklink Data',
      template: '%s | FigTracker'
    },
    description: 'Free LEGO price tracker for 18,000+ minifigures and 20,000+ sets with real-time Bricklink marketplace data. Track inventory value, manage collections, compete on leaderboards, and discover great deals.',
    keywords: ['LEGO minifigure prices', 'LEGO set prices', 'Bricklink price tracker', 'LEGO inventory management', 'minifig value tracker', 'LEGO reseller tool', 'Bricklink marketplace data', 'LEGO price guide', 'minifigure collection tracker', 'LEGO set tracker', 'LEGO deals', 'LEGO Star Wars prices'],
    authors: [{ name: 'FigTracker', url: 'https://figtracker.ericksu.com' }],
    creator: 'FigTracker',
    publisher: 'FigTracker',
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
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      url: domains[locale as keyof typeof domains],
      siteName: 'FigTracker',
      title: 'FigTracker - LEGO Minifigure & Set Price Tracker with Real-Time Bricklink Data',
      description: 'Free LEGO price tracker for 18,000+ minifigures and 20,000+ sets. Real-time Bricklink data, inventory management, collection tracking, and community leaderboards.',
      images: [
        {
          url: '/api/og',
          width: 1200,
          height: 630,
          alt: 'FigTracker - LEGO Minifigure Price Tracker',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FigTracker - LEGO Minifigure & Set Price Tracker',
      description: 'Free LEGO price tracker for 18,000+ minifigures and 20,000+ sets with real-time Bricklink marketplace data.',
      images: ['/api/og'],
    },
    alternates: {
      canonical: domains[locale as keyof typeof domains],
      languages: {
        'en': domains.en,
        'de': domains.de,
        'fr': domains.fr,
        'es': domains.es,
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

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  const localeCodeMap = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
  };

  const baseUrl = domains[locale as keyof typeof domains];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FigTracker',
    description: 'Free LEGO minifigure price tracker with real-time Bricklink marketplace data',
    url: baseUrl,
    inLanguage: localeCodeMap[locale as keyof typeof localeCodeMap],
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time Bricklink price data',
      'Inventory management',
      'Suggested pricing calculator',
      'Collection tracking',
      '8,000+ LEGO minifigures database'
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FigTracker',
    url: 'https://figtracker.ericksu.com',
    logo: 'https://figtracker.ericksu.com/favicon.svg',
    description: 'Free LEGO minifigure price tracker and inventory management tool',
    foundingDate: '2024',
    sameAs: [],
  };

  // WebSite schema with sitelinks search box for Google
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FigTracker',
    alternateName: 'LEGO Minifigure Price Tracker',
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PXLF7KRTSB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PXLF7KRTSB');
          `}
        </Script>
        <AuthProvider>
          <TranslationProvider locale={locale} translations={translations}>
            <CurrencyBanner />
            <div className="min-h-screen" style={{ backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
              <ScrollToTop />
            </div>
          </TranslationProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
