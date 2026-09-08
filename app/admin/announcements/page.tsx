import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AnnounceClient from './announce-client';

// Same gate as the other admin pages.
const ADMIN_EMAIL = 'erickkosysu@gmail.com';

export const dynamic = 'force-dynamic';

export default async function AdminAnnouncementsPage() {
  const session = await auth();
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  const [subscribed, unsubscribed] = await Promise.all([
    prisma.user.count({ where: { emailSubscribed: true } }),
    prisma.user.count({ where: { emailSubscribed: false } }),
  ]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <h1
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#171717',
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        Email your users
      </h1>
      <p style={{ fontSize: '15px', color: '#525252', margin: '0 0 32px', lineHeight: 1.6 }}>
        {subscribed} subscribed
        {unsubscribed > 0 && `, ${unsubscribed} opted out`}. Each person gets their own copy with
        their own unsubscribe link — nobody sees anyone else&apos;s address.
      </p>

      <AnnounceClient subscriberCount={subscribed} />
    </div>
  );
}
