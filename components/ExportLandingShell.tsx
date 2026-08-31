import Link from 'next/link';
import MarketplaceExportClient from '@/components/marketplace-export-client';
import { MARKETPLACES } from '@/lib/marketplace/registry';

/**
 * Shared layout for the bulk-export landing pages.
 *
 * There is one tool but several doors into it — /export, /whatnot-export,
 * /bricklink-export — because people search for "export lego to bricklink",
 * not for a generic exporter. Each page brings its own copy, metadata and
 * JSON-LD; this holds the shape they have in common so the layout isn't
 * triplicated.
 */

export interface ExportLandingCopy {
  title: string;
  subtitle: string;
  howItWorks: string;
  steps: Array<{ title: string; body: string }>;
  notesTitle: string;
  notes: string[];
  pricingLinkText: string;
  pricingLinkLabel: string;
}

export default function ExportLandingShell({
  copy,
  jsonLd,
  initialSource,
  initialMarketplace,
}: {
  copy: ExportLandingCopy;
  jsonLd: Record<string, unknown>;
  initialSource?: string;
  /** Pre-ticks this marketplace. Omit on the neutral /export page. */
  initialMarketplace?: string;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 16px' }}>
        <h1
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            color: '#171717',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          {copy.title}
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: '#525252',
            marginBottom: '40px',
            lineHeight: 1.6,
          }}
        >
          {copy.subtitle}
        </p>

        <div style={{ marginBottom: '48px' }}>
          <MarketplaceExportClient
            marketplaces={[...MARKETPLACES]}
            initialSource={initialSource}
            initialMarketplace={initialMarketplace}
          />
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: '#171717',
              marginBottom: '20px',
            }}
          >
            {copy.howItWorks}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {copy.steps.map((step, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '20px 24px',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: '#171717',
                    marginBottom: '8px',
                  }}
                >
                  {i + 1}. {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-base)',
                    color: '#525252',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: '24px',
            background: '#fafafa',
            borderRadius: '12px',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: '#171717',
              marginBottom: '12px',
            }}
          >
            {copy.notesTitle}
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: 'var(--text-base)',
              color: '#525252',
              lineHeight: 1.7,
            }}
          >
            {copy.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>

        <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: 1.6 }}>
          {copy.pricingLinkText}{' '}
          <Link href="/how-we-calculate-prices" style={{ color: '#3b82f6' }}>
            {copy.pricingLinkLabel}
          </Link>
        </p>
      </div>
    </>
  );
}
