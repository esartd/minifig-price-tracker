import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'edge';


export default async function AdminArticlesPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect('/');
  }

  // TODO: Once Article model is added to database, restore full admin page
  // For now, redirect to the working demo page
  redirect('/cms-demo');
}
