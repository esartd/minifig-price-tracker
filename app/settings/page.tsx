import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import SettingsClient from '@/components/settings-client';

export const metadata: Metadata = {
  title: 'Settings - FigTracker',
  description: 'Manage your FigTracker account settings and preferences',
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/search');
  }

  return <SettingsClient />;
}
