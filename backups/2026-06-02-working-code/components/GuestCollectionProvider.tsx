'use client';

import { useSession } from 'next-auth/react';
import GuestCollectionBadge from '@/components/GuestCollectionBadge';

export default function GuestCollectionProvider() {
  const { data: session, status } = useSession();

  // Only show for unauthenticated users
  if (status === 'loading') return null;
  if (session) return null;

  return <GuestCollectionBadge />;
}
