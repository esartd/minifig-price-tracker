'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to search page as the new home
    router.push('/search');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
    </div>
  );
}
