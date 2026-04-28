import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - FigTracker',
  description: 'Learn how FigTracker collects, uses, and protects your personal information and inventory data.',
  openGraph: {
    title: 'Privacy Policy - FigTracker',
    description: 'Learn how we protect your privacy and handle your data.',
    url: 'https://figtracker.ericksu.com/privacy',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/privacy',
  },
};

export default function PrivacyPage() {
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
          Privacy Policy
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
              Introduction
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              FigTracker ("we," "our," or "us") is operated by ES Art & D LLC. This Privacy Policy explains how we collect, use, and protect your information when you use our LEGO minifigure price tracking and inventory management service.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Information We Collect
            </h2>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              Account Information
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              When you create an account, we collect:
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '8px' }}>Email address</li>
              <li style={{ marginBottom: '8px' }}>Password (encrypted)</li>
              <li style={{ marginBottom: '8px' }}>Optional profile information (name, avatar)</li>
            </ul>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              Inventory Data
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              Your inventory data includes:
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '8px' }}>LEGO minifigure IDs you track</li>
              <li style={{ marginBottom: '8px' }}>Quantities and conditions</li>
              <li style={{ marginBottom: '8px' }}>Custom notes</li>
              <li style={{ marginBottom: '8px' }}>Timestamps of additions/modifications</li>
            </ul>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              Usage Analytics
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              We use Google Analytics to understand how users interact with FigTracker:
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '8px' }}>Pages visited</li>
              <li style={{ marginBottom: '8px' }}>Search queries (minifigure searches only)</li>
              <li style={{ marginBottom: '8px' }}>Device type and browser</li>
              <li style={{ marginBottom: '8px' }}>General location (country/region)</li>
            </ul>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              How We Use Your Information
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              We use collected information to:
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '8px' }}>
                Provide inventory tracking and pricing features
              </li>
              <li style={{ marginBottom: '8px' }}>
                Fetch real-time Bricklink marketplace data
              </li>
              <li style={{ marginBottom: '8px' }}>
                Improve our service through usage analytics
              </li>
              <li style={{ marginBottom: '8px' }}>
                Send essential account notifications (password resets, etc.)
              </li>
              <li style={{ marginBottom: '8px' }}>
                Build a searchable minifigure catalog based on user searches
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Data Storage and Security
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              Your data is stored securely:
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '8px' }}>
                Passwords are encrypted using industry-standard bcrypt hashing
              </li>
              <li style={{ marginBottom: '8px' }}>
                Data is stored in secure, encrypted databases
              </li>
              <li style={{ marginBottom: '8px' }}>
                All connections use HTTPS encryption
              </li>
              <li style={{ marginBottom: '8px' }}>
                We implement access controls to protect your data
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Third-Party Services
            </h2>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              Bricklink API
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              We use the official Bricklink API to fetch minifigure pricing data. When you search for or add minifigures, we send minifigure IDs to Bricklink to retrieve current marketplace prices. No personal information is shared with Bricklink.
            </p>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              Google Analytics
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              We use Google Analytics to understand site usage. Google Analytics may use cookies to track your activity. For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Google's Privacy Policy</a>.
            </p>

            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px',
              marginTop: 'var(--space-2)'
            }}>
              Amazon Associates
            </h3>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              We participate in the Amazon Associates Program. When you click affiliate links, Amazon may track your activity. See our <Link href="/disclosure" style={{ color: '#3b82f6', textDecoration: 'none' }}>Affiliate Disclosure</Link> for details.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Your Rights
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              You have the right to:
            </p>
            <ul style={{
              marginLeft: '20px',
              marginBottom: 'var(--space-2)',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '8px' }}>
                Access your personal data and inventory
              </li>
              <li style={{ marginBottom: '8px' }}>
                Update or correct your information
              </li>
              <li style={{ marginBottom: '8px' }}>
                Delete your account and all associated data
              </li>
              <li style={{ marginBottom: '8px' }}>
                Export your inventory data
              </li>
              <li style={{ marginBottom: '8px' }}>
                Opt out of analytics tracking (via browser settings)
              </li>
            </ul>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              To exercise these rights, contact us through the information below or use the account settings in your dashboard.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Data Retention
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              We retain your data as long as your account is active. If you delete your account, we will permanently delete your personal information and inventory data within 30 days, except where we are required by law to retain certain information.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Children's Privacy
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              FigTracker is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Changes to This Policy
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on FigTracker or sending you an email. Your continued use of FigTracker after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-2)'
            }}>
              Contact Us
            </h2>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              If you have questions about this Privacy Policy or how we handle your data, please contact:
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>ES Art & D LLC</strong>
            </p>
            <p style={{ marginBottom: '8px' }}>
              Email: <a href="mailto:hello@ericksu.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>hello@ericksu.com</a>
            </p>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              Website: <a href="https://ericksu.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>ericksu.com</a>
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
