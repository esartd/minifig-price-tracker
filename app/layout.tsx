import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Minifig Price Tracker',
  description: 'Track your LEGO minifigure inventory and pricing from Bricklink',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <body className="antialiased" style={{ margin: 0, padding: 0 }}>
        <div className="min-h-screen bg-[#fafafa]">
          <main className="max-w-[1200px] mx-auto px-16" style={{ paddingTop: '24px', paddingBottom: '128px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
