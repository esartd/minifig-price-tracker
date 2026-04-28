import { redirect } from 'next/navigation';

// Root page redirects to English with explicit locale
export default function RootPage() {
  redirect('/en');
}
