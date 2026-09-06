import { Metadata } from 'next';
import VerifyHumanClient from '@/components/VerifyHumanClient';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';

export async function generateMetadata(): Promise<Metadata> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);

  return {
    title: t.verifyHuman?.meta?.title || 'Security Check',
    description: t.verifyHuman?.meta?.description || 'Please complete this quick security check to continue',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function VerifyHumanPage() {
  return <VerifyHumanClient />;
}
