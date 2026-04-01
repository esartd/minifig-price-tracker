import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/header'
import AuthProvider from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'FigTracker - Track Minifig Prices & Inventory',
  description: 'Track LEGO minifigure prices, inventory, and get suggested sell prices from Bricklink data',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
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
  return (
    <html lang="en" className="antialiased" style={{ margin: 0, padding: 0 }}>
      <body className="antialiased" style={{ margin: 0, padding: 0 }}>
        <AuthProvider>
          <div className="min-h-screen" style={{ backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <footer style={{
              padding: '40px 32px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#737373',
              borderTop: '1px solid #e5e5e5',
              background: '#ffffff'
            }}>
              <p style={{ margin: 0, lineHeight: '1.6', marginBottom: '12px' }}>
                The term "BrickLink" is a trademark of the LEGO Group BrickLink. This application uses the BrickLink API but is not endorsed or certified by LEGO BrickLink, Inc.
              </p>
              <p style={{ margin: 0, lineHeight: '1.6', marginBottom: '12px' }}>
                Minifigure data provided by <a
                  href="https://www.bricklink.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                >
                  Bricklink.com
                </a>.
                {' '}LEGO® is a trademark of the LEGO Group.
              </p>
              <p style={{ margin: 0, lineHeight: '1.6', fontSize: '13px', color: '#a3a3a3' }}>
                Designed by <a
                  href="https://ericksu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                >
                  ES Art & D LLC
                </a>
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
