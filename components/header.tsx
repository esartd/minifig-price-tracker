import { auth } from '@/auth';
import { HeaderClient } from './header-client';

export default async function Header() {
  const session = await auth();

  return <HeaderClient user={session?.user || null} />;
}
