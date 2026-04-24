import Link from 'next/link';
import type { Metadata } from 'next';
import { MagnifyingGlassIcon, CurrencyDollarIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'FigTracker - LEGO Minifigure Price Tracker & Inventory Management',
  description: 'Free LEGO minifigure price tracker with real-time Bricklink marketplace data. Get instant suggested prices, track your inventory, and manage your collection with 18,000+ minifigs.',
  keywords: ['LEGO minifigure prices', 'Bricklink price tracker', 'LEGO inventory', 'minifig value', 'LEGO reseller tool', 'Bricklink marketplace', 'LEGO price guide', 'minifigure collection tracker'],
  openGraph: {
    title: 'FigTracker - LEGO Minifigure Price Tracker',
    description: 'Free LEGO minifigure price tracker with real-time Bricklink data. Track your inventory and get instant pricing suggestions.',
    url: 'https://figtracker.ericksu.com',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com',
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FigTracker',
    description: 'Free LEGO minifigure price tracker with real-time Bricklink marketplace data',
    url: 'https://figtracker.ericksu.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };

  const popularThemes = ['Star Wars', 'Harry Potter', 'Marvel Super Heroes', 'The Lord of the Rings', 'DC Super Heroes', 'Ninjago'];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#fafafa]">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-10 bg-white/15 border border-white/25 rounded-full h-11">
              <span className="text-xs font-semibold text-white tracking-wider uppercase leading-none whitespace-nowrap">
                FREE PRICE TRACKER
              </span>
            </div>

            <h1 className="text-[clamp(48px,5vw,56px)] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Price Your LEGO<br />Minifigures in Seconds
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              Real-time Bricklink marketplace data. 18,000+ minifigures. Zero guesswork.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/search"
                className="px-8 py-4 text-base font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors inline-block"
              >
                Start Pricing Now →
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 text-base font-semibold text-blue-500 bg-white border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition-colors inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-decoration hero-decoration-1"></div>
          <div className="hero-decoration hero-decoration-2"></div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(32px,4vw,40px)] font-bold text-neutral-900 mb-4">
              Everything You Need to Price LEGO Minifigures
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Built for sellers and collectors who want accurate pricing fast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: CurrencyDollarIcon,
                title: 'Instant Price Suggestions',
                description: 'Smart pricing algorithm combines Bricklink quantity-weighted average, simple average, and lowest price into one suggested value.',
              },
              {
                icon: MagnifyingGlassIcon,
                title: '18,000+ Minifigures',
                description: 'Search by exact Bricklink ID or name. Browse by theme including Star Wars, Harry Potter, Marvel, and 50+ more collections.',
              },
              {
                icon: ChartBarIcon,
                title: 'Inventory Management',
                description: 'Track quantities, conditions, and total value. Separate your selling inventory from personal collection.',
              },
              {
                icon: ShieldCheckIcon,
                title: 'Real Bricklink Data',
                description: 'Official Bricklink API integration ensures accurate US marketplace prices. Refresh anytime for latest values.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Themes */}
        <section className="px-6 py-20 bg-white border-t border-neutral-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[clamp(32px,4vw,40px)] font-bold text-neutral-900 mb-4">
                Browse by Popular Theme
              </h2>
              <p className="text-lg text-neutral-600">
                Explore minifigures from your favorite LEGO collections
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
              {popularThemes.map(theme => (
                <Link
                  key={theme}
                  href={`/themes/${theme.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl text-center hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-sm font-semibold text-neutral-900">{theme}</span>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/themes"
                className="inline-block text-sm font-semibold text-blue-500 hover:text-blue-600"
              >
                View All Themes →
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <NewsletterSignup />
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-[clamp(32px,4vw,40px)] font-bold text-neutral-900 mb-4">
              Ready to Stop Guessing?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Join sellers and collectors using FigTracker to price LEGO minifigures accurately
            </p>
            <Link
              href="/search"
              className="inline-block px-8 py-4 text-base font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Start Pricing Now →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
