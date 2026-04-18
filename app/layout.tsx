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

export const metadata: Metadata = {
  metadataBase: new URL('https://figtracker.ericksu.com'),
  title: {
    default: 'FigTracker - LEGO Minifigure Price Tracker & Inventory Management',
    template: '%s | FigTracker'
  },
  description: 'Free LEGO minifigure price tracker with real-time Bricklink marketplace data. Get instant suggested prices, track your inventory, and manage your collection with 8,000+ minifigs.',
  keywords: ['LEGO minifigure prices', 'Bricklink price tracker', 'LEGO inventory', 'minifig value', 'LEGO reseller tool', 'Bricklink marketplace', 'LEGO price guide', 'minifigure collection tracker'],
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
    locale: 'en_US',
    url: 'https://figtracker.ericksu.com',
    siteName: 'FigTracker',
    title: 'FigTracker - LEGO Minifigure Price Tracker & Inventory Management',
    description: 'Free LEGO minifigure price tracker with real-time Bricklink data. Get instant suggested prices and manage your collection.',
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
    title: 'FigTracker - LEGO Minifigure Price Tracker',
    description: 'Free LEGO minifigure price tracker with real-time Bricklink data.',
    images: ['/api/og'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FigTracker',
    description: 'Free LEGO minifigure price tracker with real-time Bricklink marketplace data',
    url: 'https://figtracker.ericksu.com',
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

  return (
    <html lang="en" className="antialiased" style={{ margin: 0, padding: 0 }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          <CurrencyBanner />
          <div className="min-h-screen" style={{ backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
