import { ImageResponse } from '@vercel/og';
import { getTranslations, locales, defaultLocale, type Locale } from '@/lib/i18n-subdomain';

export async function GET(request: Request) {
  // Locale comes from a `?locale=` query param that app/layout.tsx appends when it
  // builds the OG image URL (it already knows the visitor's locale from the host).
  // No other caller of this route passes a locale today.
  const { searchParams } = new URL(request.url);
  const requestedLocale = searchParams.get('locale') || defaultLocale;
  const locale: Locale = (locales as readonly string[]).includes(requestedLocale)
    ? (requestedLocale as Locale)
    : defaultLocale;
  const t = await getTranslations(locale);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(135deg, rgba(0, 92, 151, 0.1) 0%, rgba(54, 55, 149, 0.1) 100%)',
        }}
      >
        {/* Main Title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #005C97 0%, #363795 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          FigTracker
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: '#171717',
            marginBottom: 40,
          }}
        >
          {t.metadata?.ogImage?.subtitle || 'LEGO Minifigure Price Tracker'}
        </div>

        {/* Feature Text */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#737373',
            marginBottom: 40,
          }}
        >
          {t.metadata?.ogImage?.featureText || 'Real-time Bricklink prices • Track your collection'}
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: '#005C97',
          }}
        >
          figtracker.ericksu.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
