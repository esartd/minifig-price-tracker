import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure - FigTracker',
  description: 'FigTracker participates in the Amazon Associates Program. Learn about our affiliate partnerships and how we earn commissions.',
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
              Amazon Associates Program
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              FigTracker (operated by ES Art & D LLC) is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
            </p>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              As an Amazon Associate, we earn from qualifying purchases made through affiliate links on this site. When you click on a "Buy on Amazon" button or link and make a purchase, we may receive a small commission at no additional cost to you.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              How Affiliate Links Work
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              Throughout FigTracker, you'll find "Buy on Amazon" buttons on LEGO set advertisements. These buttons contain affiliate tracking codes that help us earn a small commission when you make a purchase.
            </p>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Important:</strong> Using affiliate links does not increase the price you pay. Amazon determines all pricing independently.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Product Recommendations
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              We display current, purchasable LEGO sets from relevant themes throughout FigTracker. These recommendations are:
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '8px' }}>
                Based on theme relevance to the page content
              </li>
              <li style={{ marginBottom: '8px' }}>
                Limited to sets currently available for purchase (2024-2026)
              </li>
              <li style={{ marginBottom: '8px' }}>
                Filtered to exclude promotional items and store exclusives
              </li>
            </ul>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              Our affiliate partnerships do not influence the core functionality of FigTracker, including minifigure pricing data, inventory tracking, or search features.
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
              LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize, or endorse this site. FigTracker is an independent tool for LEGO minifigure collectors and resellers.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Questions?
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              If you have questions about our affiliate relationships or how we use affiliate links, please contact us through our <Link href="/about" style={{ color: '#3b82f6', textDecoration: 'none' }}>About page</Link>.
            </p>
          </section>

          <section>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Support FigTracker
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              FigTracker is free to use. By purchasing LEGO sets through our affiliate links, you help support the ongoing development and maintenance of this tool at no extra cost to you. Thank you for your support!
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
