'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkCollection = async () => {
      if (status === 'loading') return;

      // If not authenticated, go to search
      if (status === 'unauthenticated') {
        router.push('/search');
        return;
      }

      // If authenticated, check if they have any inventory items
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/inventory');
          const data = await response.json();

          if (data.success && data.data && data.data.length > 0) {
            // User has inventory items, go to inventory
            router.push('/inventory');
          } else {
            // User has no inventory items, go to search
            router.push('/search');
          }
        } catch (error) {
          // On error, default to search
          router.push('/search');
        }
      }
    };

    checkCollection();
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
    </div>
  );
}
