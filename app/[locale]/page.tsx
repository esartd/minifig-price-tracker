import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  // If not authenticated, redirect to search
  if (!session) {
    redirect(`/${locale}/search`);
  }

  // If authenticated, redirect to search (they can navigate to inventory from header)
  redirect(`/${locale}/search`);
}
