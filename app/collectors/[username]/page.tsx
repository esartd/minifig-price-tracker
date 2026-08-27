import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getLocaleFromHost } from '@/lib/i18n-subdomain';
import { prisma } from '@/lib/prisma';
import CollectorProfileClient from './collector-profile-client';

const domains: Record<string, string> = {
  en: 'https://figtracker.ericksu.com',
  de: 'https://de.figtracker.ericksu.com',
  fr: 'https://fr.figtracker.ericksu.com',
  es: 'https://es.figtracker.ericksu.com',
  it: 'https://it.figtracker.ericksu.com',
  nl: 'https://nl.figtracker.ericksu.com',
  pl: 'https://pl.figtracker.ericksu.com',
  pt: 'https://pt.figtracker.ericksu.com',
  sv: 'https://sv.figtracker.ericksu.com',
  ja: 'https://ja.figtracker.ericksu.com',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const baseUrl = domains[locale] || domains.en;
  const canonicalUrl = `${baseUrl}/collectors/${username}`;

  const lower = username.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      profilePublic: true,
      OR: [{ username: lower }, { id: username }],
    },
    select: {
      username: true,
      name: true,
      leaderboardDisplayName: true,
    },
  });

  // Private, nonexistent, or opted-out profile — don't leak that it exists,
  // and don't let it get indexed.
  if (!user) {
    return {
      title: 'Collector Not Found',
      robots: { index: false, follow: false },
    };
  }

  const displayName = user.leaderboardDisplayName || user.name || user.username || 'This collector';
  const title = `${displayName}'s LEGO Collection`;
  const description = `See ${displayName}'s LEGO minifigure and set collection on FigTracker, with live suggested prices.`;

  return {
    title,
    description,
    openGraph: { title, description, url: canonicalUrl },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...Object.fromEntries(Object.entries(domains).map(([loc, d]) => [loc, `${d}/collectors/${username}`])),
        'x-default': `${domains.en}/collectors/${username}`,
      },
    },
  };
}

export default async function CollectorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const lower = username.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      profilePublic: true,
      OR: [{ username: lower }, { id: username }],
    },
    select: { username: true, name: true, leaderboardDisplayName: true },
  });

  const jsonLd = user
    ? {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: user.leaderboardDisplayName || user.name || user.username,
        },
        url: `https://figtracker.ericksu.com/collectors/${username}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CollectorProfileClient params={params} />
    </>
  );
}
