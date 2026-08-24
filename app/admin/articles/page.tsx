import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';

export default async function AdminArticlesPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect('/');
  }

  // The Article model has existed in the DB for a while now -- the real
  // editor is /write (session-gated to the owner account). /cms-demo,
  // this used to redirect to, no longer exists, so this was a dead-end
  // 404 for any admin visiting /admin/articles.
  redirect('/write');
}
