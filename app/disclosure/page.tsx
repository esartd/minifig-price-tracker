import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure - FigTracker',
  description: 'FigTracker participates in the LEGO.com Affiliate Program and Amazon Associates Program. Learn about our affiliate partnerships and how we earn commissions.',
  openGraph: {
    title: 'Affiliate Disclosure - FigTracker',
    description: 'Learn about our affiliate partnerships and advertising practices.',
    url: 'https://figtracker.ericksu.com/disclosure',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/disclosure',
  },
};

export default function DisclosurePage() {
  return (
    <article className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-2)'
      }}>
        <h1 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.02em',
          marginBottom: 'var(--space-2)'
        }}>
          Affiliate Disclosure
        </h1>

        <div style={{
          fontSize: 'var(--text-sm)',
          color: '#525252',
          marginBottom: 'var(--space-4)'
        }}>
          Last Updated: April 16, 2026
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: 'var(--space-4)',
          lineHeight: '1.7',
          color: '#404040'
        }}>
          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Affiliate Programs
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              FigTracker participates in the LEGO.com Affiliate Program and Amazon Associates Program. When you click on featured product links and make a purchase, we may earn a small commission at no additional cost to you.
            </p>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              These affiliate partnerships help support FigTracker's development and maintenance while keeping the tool free to use.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              LEGO® Trademark Notice
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              LEGO® is a trademark of the LEGO Group which does not sponsor, authorize, or endorse this site.
            </p>
          </section>

          <section>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Questions?
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              If you have questions about our affiliate relationships, please contact us through our <Link href="/about" style={{ color: '#3b82f6', textDecoration: 'none' }}>About page</Link>.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
