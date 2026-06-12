'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getGuestCollection, clearGuestCollection } from '@/lib/guestCollectionStorage';

export default function GuestCollectionMigrator() {
  const { data: session, status } = useSession();
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    async function migrateCollection() {
      // Only run once when user becomes authenticated
      if (status !== 'authenticated' || !session || migrating) return;

      // Check if migration is needed
      const shouldMigrate = localStorage.getItem('figtracker_migrate_guest_collection');
      if (!shouldMigrate) return;

      const guestItems = getGuestCollection();
      if (guestItems.length === 0) {
        localStorage.removeItem('figtracker_migrate_guest_collection');
        return;
      }

      setMigrating(true);

      try {
        const response = await fetch('/api/migrate-guest-collection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: guestItems })
        });

        const data = await response.json();

        if (data.success) {
          // Clear guest collection and migration flag
          clearGuestCollection();
          localStorage.removeItem('figtracker_migrate_guest_collection');

          console.log('Guest collection migrated:', data.message);
        } else {
          console.error('Migration failed:', data.error);
        }
      } catch (error) {
        console.error('Error migrating collection:', error);
      } finally {
        setMigrating(false);
      }
    }

    migrateCollection();
  }, [session, status, migrating]);

  // This component doesn't render anything
  return null;
}
