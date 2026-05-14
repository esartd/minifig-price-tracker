import Link from 'next/link';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

function getTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = getTranslations(locale);

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  return {
    title: `${t.privacyPolicy.meta.title} - FigTracker`,
    description: t.privacyPolicy.meta.description,
    openGraph: {
      title: `${t.privacyPolicy.meta.title} - FigTracker`,
      description: t.privacyPolicy.meta.ogDescription,
      url: `${domains[locale as keyof typeof domains]}/privacy`,
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/privacy`,
      languages: {
        'en': `${domains.en}/privacy`,
        'de': `${domains.de}/privacy`,
        'fr': `${domains.fr}/privacy`,
        'es': `${domains.es}/privacy`,
        'x-default': `${domains.en}/privacy`,
      },
    },
  };
}

export default async function PrivacyPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = getTranslations(locale);
  const p = t.privacyPolicy;
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
          {p.title}
        </h1>

        <div style={{
          fontSize: 'var(--text-sm)',
          color: '#525252',
          marginBottom: 'var(--space-4)'
        }}>
          {p.lastUpdated.replace('{date}', 'April 16, 2026')}
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
              {p.introduction.title}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.introduction.content}
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.informationWeCollect.title}
            </h2>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              {p.informationWeCollect.accountInformation.title}
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.informationWeCollect.accountInformation.intro}
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              {p.informationWeCollect.accountInformation.items.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              {p.informationWeCollect.inventoryData.title}
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.informationWeCollect.inventoryData.intro}
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              {p.informationWeCollect.inventoryData.items.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              {p.informationWeCollect.usageAnalytics.title}
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.informationWeCollect.usageAnalytics.intro}
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              {p.informationWeCollect.usageAnalytics.items.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.howWeUse.title}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.howWeUse.intro}
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              {p.howWeUse.items.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.dataStorage.title}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.dataStorage.intro}
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              {p.dataStorage.items.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.thirdPartyServices.title}
            </h2>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              {p.thirdPartyServices.bricklink.title}
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.thirdPartyServices.bricklink.content}
            </p>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              {p.thirdPartyServices.googleAnalytics.title}
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.thirdPartyServices.googleAnalytics.content} <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>{p.thirdPartyServices.googleAnalytics.linkText}</a>.
            </p>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              {p.thirdPartyServices.amazonAssociates.title}
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.thirdPartyServices.amazonAssociates.content} <Link href="/disclosure" style={{ color: '#3b82f6', textDecoration: 'none' }}>{p.thirdPartyServices.amazonAssociates.linkText}</Link> {p.thirdPartyServices.amazonAssociates.contentEnd}
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.yourRights.title}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.yourRights.intro}
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              {p.yourRights.items.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.yourRights.footer}
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.dataRetention.title}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.dataRetention.content}
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.childrensPrivacy.title}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.childrensPrivacy.content}
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.changesToPolicy.title}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.changesToPolicy.content}
            </p>
          </section>

          <section>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              {p.contactUs.title}
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.contactUs.intro}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>ES Art & D LLC</strong>
            </p>
            <p style={{ marginBottom: '8px' }}>
              {p.contactUs.emailLabel} <a href="mailto:hello@ericksu.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>hello@ericksu.com</a>
            </p>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              {p.contactUs.websiteLabel} <a href="https://ericksu.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>ericksu.com</a>
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
