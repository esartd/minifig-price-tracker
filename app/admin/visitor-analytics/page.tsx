import { Metadata } from 'next';
import VisitorAnalyticsDashboard from '@/components/admin/VisitorAnalyticsDashboard';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Visitor Analytics | Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VisitorAnalyticsPage() {
  const session = await auth();

  // Admin only
  if (!session?.user?.email || session.user.email !== 'ericksu0c@gmail.com') {
    redirect('/');
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Visitor Analytics Dashboard
        </h1>
        <p style={{ color: '#737373' }}>
          Monitor visitor behavior by country and detect scraping patterns
        </p>
      </div>

      <VisitorAnalyticsDashboard />
    </div>
  );
}
