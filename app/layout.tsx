import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/header'
import AuthProvider from '@/components/session-provider'
import ScrollToTop from '@/components/ScrollToTop'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

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
          <div className="min-h-screen" style={{ backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <footer style={{
              padding: 'var(--space-6) var(--space-4)',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: '#737373',
              borderTop: '1px solid #e5e5e5',
              background: '#ffffff'
            }}>
              <div style={{
                maxWidth: '1000px',
                margin: '0 auto'
              }}>
                {/* Navigation Links */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--space-4)',
                  marginBottom: 'var(--space-5)',
                  fontSize: 'var(--text-sm)',
                  flexWrap: 'wrap'
                }}>
                  <a href="/about" style={{
                    color: '#525252',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
                  >About</a>
                  <a href="/privacy" style={{
                    color: '#525252',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
                  >Privacy Policy</a>
                  <a href="/disclosure" style={{
                    color: '#525252',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#525252'}
                  >Affiliate Disclosure</a>
                </div>

                {/* Divider */}
                <div style={{
                  width: '60px',
                  height: '1px',
                  background: '#e5e5e5',
                  margin: '0 auto var(--space-5) auto'
                }} />

                {/* BrickLink Attribution (Required) */}
                <div style={{
                  marginBottom: 'var(--space-4)',
                  lineHeight: '1.7',
                  fontSize: 'var(--text-xs)',
                  color: '#737373'
                }}>
                  <p style={{ margin: 0, marginBottom: 'var(--space-1)' }}>
                    Minifigure data provided by <a
                      href="https://www.bricklink.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
                    >
                      BrickLink.com
                    </a>
                  </p>
                  <p style={{ margin: 0 }}>
                    The term "BrickLink" is a trademark of the LEGO Group. This application uses the BrickLink API but is not endorsed or certified by LEGO BrickLink, Inc.
                  </p>
                  <p style={{ margin: 0, marginTop: 'var(--space-1)' }}>
                    LEGO® is a trademark of the LEGO Group.
                  </p>
                </div>

                {/* Copyright & Credit */}
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: '#a3a3a3',
                  lineHeight: '1.6'
                }}>
                  <p style={{ margin: 0, marginBottom: '4px' }}>
                    © {new Date().getFullYear()} FigTracker. All rights reserved.
                  </p>
                  <p style={{ margin: 0 }}>
                    Created by <a
                      href="https://ericksu.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#a3a3a3', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = '#a3a3a3'}
                      onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                    >
                      ES Art & D LLC
                    </a>
                  </p>
                </div>
              </div>
            </footer>
            <ScrollToTop />
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
