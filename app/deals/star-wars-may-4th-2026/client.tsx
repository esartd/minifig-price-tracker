'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '@/components/TranslationProvider';

interface DealSet {
  setNumber: string;
  name: string;
  price: number;
  tier: 'A' | 'B' | 'C' | 'D';
  imageUrl: string;
  affiliateLink: string;
}

// Tier A = ~27-35% (BEST) - 4x points sets at $160+
// Tier B = ~26% - 2x points sets at $160+
// Tier C = ~25% - 75442 only
// Tier D = ~20% - minimum $40 on 2x sets

const DEAL_SETS: DealSet[] = [
  {
    setNumber: '75417',
    name: 'AT-ST Walker',
    price: 199.99,
    tier: 'A',
    imageUrl: 'https://cdn.rebrickable.com/media/sets/75417-1.jpg',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.139237143524730166147003&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fat-st-walker-75417',
  },
  {
    setNumber: '75382',
    name: 'TIE Interceptor',
    price: 229.99,
    tier: 'A',
    imageUrl: 'https://cdn.rebrickable.com/media/sets/75382-1.jpg',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392315432448651422365399&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2ftie-interceptor-75382',
  },
  {
    setNumber: '75447',
    name: 'The Razor Crest',
    price: 149.99,
    tier: 'B',
    imageUrl: 'https://cdn.rebrickable.com/media/sets/75447-1.jpg',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392318298979089533984024&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fthe-razor-crest-75447',
  },
  {
    setNumber: '75444',
    name: 'AT-RT Attack',
    price: 44.99,
    tier: 'B',
    imageUrl: 'https://cdn.rebrickable.com/media/sets/75444-1.jpg',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392315189149030117995046&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fat-rt-attack-75444',
  },
  {
    setNumber: '75449',
    name: 'Siege of Mandalore Battle Pack',
    price: 22.99,
    tier: 'D',
    imageUrl: 'https://cdn.rebrickable.com/media/sets/75449-1.jpg',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.139239665792440630903595&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fsiege-of-mandalore-battle-pack-75449',
  },
  {
    setNumber: '75391',
    name: 'Captain Rex Y-Wing Microfighter',
    price: 12.99,
    tier: 'D',
    imageUrl: 'https://cdn.rebrickable.com/media/sets/75391-1.jpg',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392313918199668343810360&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fcaptain-rex-y-wing-microfighter-75391',
  },
  {
    setNumber: '75436',
    name: 'The Mandalorian & Grogu\'s Speeder Bike',
    price: 9.99,
    tier: 'D',
    imageUrl: 'https://cdn.rebrickable.com/media/sets/75436-1.jpg',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.139231408361465689096246&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fthe-mandalorian-grogus-speeder-bike-75436',
  },
];

export default function May4thDealsClient() {
  const { t } = useTranslation();
  const tierAsets = DEAL_SETS.filter(s => s.tier === 'A'); // 4x points (39%)
  const tierBsets = DEAL_SETS.filter(s => s.tier === 'B'); // 2x points (32%)
  const tierDsets = DEAL_SETS.filter(s => s.tier === 'D'); // minimum (22.5%)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LEGO Star Wars May the 4th Deals 2026',
    description: 'Exclusive LEGO Star Wars deals with up to 35% total value including free gifts and cashback',
    url: 'https://figtracker.ericksu.com/deals/star-wars-may-4th-2026',
    validFrom: '2026-05-01',
    validThrough: '2026-05-06',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Tier A - Ultimate Value Deal',
        description: 'Up to 35% total return: spend $160+ on 4x point sets, get Darksaber plus 20% cashback',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Tier B - Better Value Deal',
        description: '32% total return: spend $160+ on 2x point sets, get Darksaber + Razor Crest plus 10% cashback',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Tier C - Display Collector Deal',
        description: '25% total return: buy 75442 N-1 Starfighter, get Display + Darksaber plus 5% cashback',
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="fun-gradient-bg" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="fun-search-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 className="fun-header-title" style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            {t('may4thDeals.hero.title')}
          </h1>
          <p className="fun-header-subtitle" style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            marginBottom: '20px',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            {t('may4thDeals.hero.subtitle')}<br/>
            <span style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: '400', opacity: '0.95' }}>
              {t('may4thDeals.hero.description')}
            </span>
          </p>
        </div>
      </section>

      {/* Tier D - 22.5% (Worst) */}
      <section style={{ padding: '40px 20px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#a3a3a3',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600'
            }}>
              {t('may4thDeals.tierD.badge')}
            </span>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              color: '#171717',
              margin: '0'
            }}>
              {t('may4thDeals.tierD.title')}
            </h2>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #e5e5e5'
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '16px' }}>{t('may4thDeals.tierD.whatYouGet')}</h3>
            <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', marginBottom: '20px' }}>
              <li>{t('may4thDeals.tierD.item1')}</li>
              <li>{t('may4thDeals.tierD.item2')}</li>
              <li>{t('may4thDeals.tierD.item3')}</li>
            </ul>
            <p style={{ fontSize: 'var(--text-base)', color: '#525252', fontWeight: '600', marginBottom: '16px' }}>
              {t('may4thDeals.tierD.description')}
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #e0e0e0'
            }}>
              <p style={{ fontSize: 'var(--text-base)', color: '#171717', fontWeight: '600', marginBottom: '12px' }}>
                {t('may4thDeals.tierD.example.title')}
              </p>
              <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', listStyle: 'none', paddingLeft: '0' }}>
                <li>{t('may4thDeals.tierD.example.set1')}</li>
                <li>{t('may4thDeals.tierD.example.set2')}</li>
                <li>{t('may4thDeals.tierD.example.set3')}</li>
                <li style={{ fontWeight: '700', color: '#171717', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #d4d4d4' }}>
                  {t('may4thDeals.tierD.example.totals')}
                </li>
                <li style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: '8px', fontStyle: 'italic' }}>
                  {t('may4thDeals.tierD.example.returns')}
                </li>
              </ul>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginTop: '32px'
            }}>
              {tierDsets.map(set => (
                <SetCard key={set.setNumber} set={set} tierColor="#a3a3a3" t={t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tier C - 25% */}
      <section style={{ padding: '40px 20px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#cd7f32',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600'
            }}>
              {t('may4thDeals.tierC.badge')}
            </span>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              color: '#171717',
              margin: '0'
            }}>
              {t('may4thDeals.tierC.title')}
            </h2>
          </div>
          <div style={{
            background: '#fafafa',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #e5e5e5'
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '16px' }}>{t('may4thDeals.tierC.whatYouGet')}</h3>
            <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', marginBottom: '20px' }}>
              <li>{t('may4thDeals.tierC.item1')}</li>
              <li>{t('may4thDeals.tierC.item2')}</li>
              <li>{t('may4thDeals.tierC.item3')}</li>
              <li>{t('may4thDeals.tierC.item4')}</li>
            </ul>
            <p style={{ fontSize: 'var(--text-base)', color: '#525252', fontWeight: '500', marginBottom: '24px' }}>
              {t('may4thDeals.tierC.description')}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginTop: '32px'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e5e5e5',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  marginBottom: '16px',
                  background: '#fafafa',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Image
                    src="https://www.lego.com/cdn/cs/set/assets/blt99c6a9bf2e0c2d9a/blt2f8fb720e38f6e09-75442_Prod_en-gb.png?format=jpg&fit=bounds&quality=80"
                    alt={t('may4thDeals.tierC.setName') || "The Mandalorian's N-1 Starfighter"}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    style={{ objectFit: 'contain', padding: '12px' }}
                    unoptimized
                  />
                </div>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '4px',
                  lineHeight: '1.3'
                }}>
                  {t('may4thDeals.tierC.setName') || "The Mandalorian's N-1 Starfighter"}
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  marginBottom: '8px'
                }}>
                  75442
                </p>
                <p style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: '700',
                  color: '#171717',
                  marginBottom: '16px'
                }}>
                  {t('may4thDeals.common.price') || 'Price'}: $249.99
                </p>
                <a
                  href="https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392315235359109392213990&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fthe-mandalorians-n-1-starfighter-75442"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    display: 'block',
                    padding: '12px 24px',
                    fontSize: 'var(--text-base)',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #005C97 0%, #363795 100%)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    marginTop: 'auto',
                    boxShadow: '0 2px 8px rgba(0, 92, 151, 0.3)'
                  }}
                >
                  {t('may4thDeals.common.buyOnLego')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tier B - 32% */}
      <section style={{ padding: '40px 20px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#c0c0c0',
              color: '#171717',
              borderRadius: '8px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600'
            }}>
              {t('may4thDeals.tierB.badge')}
            </span>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              color: '#171717',
              margin: '0'
            }}>
              {t('may4thDeals.tierB.title')}
            </h2>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '2px solid #c0c0c0'
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '16px' }}>{t('may4thDeals.tierB.whatYouGet')}</h3>
            <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', marginBottom: '20px' }}>
              <li>{t('may4thDeals.tierB.item1')}</li>
              <li>{t('may4thDeals.tierB.item2')}</li>
              <li>{t('may4thDeals.tierB.item3')}</li>
            </ul>
            <p style={{ fontSize: 'var(--text-base)', color: '#525252', fontWeight: '600', marginBottom: '16px' }}>
              {t('may4thDeals.tierB.description')}
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #e0e0e0'
            }}>
              <p style={{ fontSize: 'var(--text-base)', color: '#171717', fontWeight: '600', marginBottom: '12px' }}>
                {t('may4thDeals.tierB.example.title')}
              </p>
              <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', listStyle: 'none', paddingLeft: '0' }}>
                <li>{t('may4thDeals.tierB.example.set1')}</li>
                <li>{t('may4thDeals.tierB.example.set2')}</li>
                <li style={{ fontWeight: '700', color: '#171717', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #d4d4d4' }}>
                  {t('may4thDeals.tierB.example.totals')}
                </li>
                <li style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: '8px', fontStyle: 'italic' }}>
                  {t('may4thDeals.tierB.example.returns')}
                </li>
              </ul>
            </div>
            <p style={{ fontSize: 'var(--text-base)', color: '#737373', fontStyle: 'italic' }}>
              {t('may4thDeals.tierB.note')}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginTop: '32px'
            }}>
              {tierBsets.map(set => (
                <SetCard key={set.setNumber} set={set} tierColor="#c0c0c0" t={t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tier A - 39% (BEST) */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#ffffff',
              borderRadius: '12px',
              fontSize: 'var(--text-base)',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
            }}>
              {t('may4thDeals.tierA.badge')}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: '700',
            color: '#171717',
            margin: '0 0 32px 0',
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            {t('may4thDeals.tierA.title')}
          </h2>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #fbbf24',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
          }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: '20px', color: '#171717' }}>{t('may4thDeals.tierA.whatYouGet')}</h3>
            <ul style={{ fontSize: 'var(--text-lg)', color: '#171717', lineHeight: '1.8', marginBottom: '24px', fontWeight: '500' }}>
              <li>{t('may4thDeals.tierA.item1')}</li>
              <li>{t('may4thDeals.tierA.item2')}</li>
              <li>{t('may4thDeals.tierA.item3')}</li>
              <li>{t('may4thDeals.tierA.item4')}</li>
            </ul>

            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: '12px', color: '#171717' }}>{t('may4thDeals.tierA.example.mathTitle')}</h4>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7', marginBottom: '12px' }}>
                {t('may4thDeals.tierA.example.description')}
              </p>
              <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7', listStyle: 'none', paddingLeft: '0' }}>
                <li>{t('may4thDeals.tierA.example.item1')}</li>
                <li>{t('may4thDeals.tierA.example.item2')}</li>
                <li style={{ fontWeight: '700', color: '#171717', marginTop: '8px', fontSize: 'var(--text-lg)' }}>
                  {t('may4thDeals.tierA.example.total')}
                </li>
              </ul>
              <p style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: '12px', fontStyle: 'italic' }}>
                {t('may4thDeals.tierA.example.alternateSet')}
              </p>
            </div>

            <p style={{
              fontSize: 'var(--text-base)',
              color: '#171717',
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: '32px',
              padding: '20px',
              background: '#ffffff',
              borderRadius: '8px',
              border: '2px dashed #fbbf24'
            }}>
              {t('may4thDeals.tierA.winner')}
            </p>

            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: '20px', color: '#171717' }}>{t('may4thDeals.tierA.setsTitle')}</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginTop: '24px'
            }}>
              {tierAsets.map(set => (
                <SetCard key={set.setNumber} set={set} tierColor="#fbbf24" isBest t={t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GWP Showcase */}
      <section style={{ padding: '60px 20px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            color: '#171717',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            {t('may4thDeals.gwpSection.title')}
          </h2>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            {t('may4thDeals.gwpSection.subtitle')}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px'
          }}>
            <div style={{
              background: '#fafafa',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              border: '1px solid #e5e5e5'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1',
                marginBottom: '20px',
                background: '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/deals/darksaber-gwp.jpg"
                  alt="The Razor Crest Mini-Build"
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  style={{ objectFit: 'contain', padding: '12px' }}
                  unoptimized
                />
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '600', marginBottom: '8px' }}>{t('may4thDeals.gwpSection.razorCrest.title')}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', marginBottom: '8px' }}>{t('may4thDeals.gwpSection.razorCrest.subtitle')}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: '#525252', fontWeight: '600' }}>{t('may4thDeals.gwpSection.razorCrest.price')}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a3a3a3', marginTop: '8px' }}>{t('may4thDeals.gwpSection.razorCrest.requirement')}</p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              border: '2px solid #fbbf24'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1',
                marginBottom: '20px',
                background: '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/deals/mando-grogu-tile-gwp.jpg"
                  alt="The Mandalorian and Grogu Display"
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  style={{ objectFit: 'contain', padding: '12px' }}
                  unoptimized
                />
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', marginBottom: '8px', color: '#171717' }}>{t('may4thDeals.gwpSection.display.title')}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#525252', marginBottom: '8px', fontWeight: '600' }}>{t('may4thDeals.gwpSection.display.subtitle')}</p>
              <p style={{ fontSize: 'var(--text-base)', color: '#171717', fontWeight: '700' }}>{t('may4thDeals.gwpSection.display.price')}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a3a3a3', marginTop: '8px' }}>{t('may4thDeals.gwpSection.display.requirement')}</p>
            </div>

            <div style={{
              background: '#fafafa',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              border: '1px solid #e5e5e5'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1',
                marginBottom: '20px',
                background: '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/deals/razor-crest-gwp.jpg"
                  alt="The Darksaber"
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  style={{ objectFit: 'contain', padding: '12px' }}
                  unoptimized
                />
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '600', marginBottom: '8px' }}>{t('may4thDeals.gwpSection.darksaber.title')}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', marginBottom: '8px' }}>{t('may4thDeals.gwpSection.darksaber.subtitle')}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: '#525252', fontWeight: '600' }}>{t('may4thDeals.gwpSection.darksaber.price')}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a3a3a3', marginTop: '8px' }}>{t('may4thDeals.gwpSection.darksaber.requirement')}</p>
            </div>
          </div>

          <p style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            textAlign: 'center',
            marginTop: '32px',
            fontStyle: 'italic'
          }}>
            {t('may4thDeals.gwpSection.note')}
          </p>
        </div>
      </section>

      {/* Value Comparison Table */}
      <section style={{ padding: '60px 20px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            color: '#171717',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            {t('may4thDeals.whichTier.title')}
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <thead>
                <tr style={{ background: '#171717', color: '#ffffff' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>{t('may4thDeals.comparisonTable.tier') || 'Tier'}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>{t('may4thDeals.comparisonTable.spend') || 'Spend'}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>{t('may4thDeals.comparisonTable.freebiesValue') || 'Freebies Value'}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>{t('may4thDeals.comparisonTable.cashback') || 'Cashback'}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>{t('may4thDeals.comparisonTable.totalReturn') || 'Total Return'}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>D</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>$40+</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>$5</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>~$4 (2x)</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)', color: '#737373' }}>~20%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>C</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>$249.99</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>$50</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>~$12.50 (1x)</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)', color: '#737373' }}>~25%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>B</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>$160+ (2x sets)</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>$35</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)' }}>~$16 (2x)</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)', fontWeight: '600' }}>~26%</td>
                </tr>
                <tr style={{ background: '#fef3c7' }}>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)', fontWeight: '700' }}>A 🏆</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)', fontWeight: '600' }}>$160+ (4x sets)</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)', fontWeight: '600' }}>$30</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-base)', fontWeight: '600' }}>~$32 (4x)</td>
                  <td style={{ padding: '16px', fontSize: 'var(--text-lg)', fontWeight: '700', color: '#f59e0b' }}>~33%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Decision Guide */}
          <div style={{ marginTop: '60px' }}>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              {t('may4thDeals.whichTier.title') || 'Which Tier Should You Buy?'}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                background: '#fef3c7',
                border: '2px solid #fbbf24',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '12px' }}>{t('may4thDeals.whichTier.tierA.title')}</h4>
                <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                  <li>{t('may4thDeals.whichTier.tierA.item1')}</li>
                  <li>{t('may4thDeals.whichTier.tierA.item2')}</li>
                  <li>{t('may4thDeals.whichTier.tierA.item3')}</li>
                </ul>
              </div>
              <div style={{
                background: '#ffffff',
                border: '2px solid #c0c0c0',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '12px' }}>{t('may4thDeals.whichTier.tierB.title')}</h4>
                <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                  <li>{t('may4thDeals.whichTier.tierB.item1')}</li>
                  <li>{t('may4thDeals.whichTier.tierB.item2')}</li>
                  <li>{t('may4thDeals.whichTier.tierB.item3')}</li>
                </ul>
              </div>
              <div style={{
                background: '#ffffff',
                border: '2px solid #cd7f32',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '12px' }}>{t('may4thDeals.whichTier.tierC.title')}</h4>
                <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                  <li>{t('may4thDeals.whichTier.tierC.item1')}</li>
                  <li>{t('may4thDeals.whichTier.tierC.item2')}</li>
                  <li>{t('may4thDeals.whichTier.tierC.item3')}</li>
                </ul>
              </div>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '12px' }}>{t('may4thDeals.whichTier.tierD.title')}</h4>
                <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                  <li>{t('may4thDeals.whichTier.tierD.item1')}</li>
                  <li>{t('may4thDeals.whichTier.tierD.item2')}</li>
                  <li>{t('may4thDeals.whichTier.tierD.item3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '60px 20px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            color: '#171717',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            {t('may4thDeals.faq.title')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: '#fafafa',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e5e5'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '8px', color: '#171717' }}>
                {t('may4thDeals.faq.q1.question')}
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                {t('may4thDeals.faq.q1.answer')}
              </p>
            </div>
            <div style={{
              background: '#fafafa',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e5e5'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '8px', color: '#171717' }}>
                {t('may4thDeals.faq.q2.question')}
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                {t('may4thDeals.faq.q2.answer')}
              </p>
            </div>
            <div style={{
              background: '#fafafa',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e5e5'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '8px', color: '#171717' }}>
                {t('may4thDeals.faq.q3.question')}
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                {t('may4thDeals.faq.q3.answer')}
              </p>
            </div>
            <div style={{
              background: '#fafafa',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e5e5'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '8px', color: '#171717' }}>
                {t('may4thDeals.faq.q4.question')}
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                {t('may4thDeals.faq.q4.answer')}
              </p>
            </div>
            <div style={{
              background: '#fafafa',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e5e5'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '8px', color: '#171717' }}>
                {t('may4thDeals.faq.q5.question')}
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
                {t('may4thDeals.faq.q5.answer')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FigTracker Promotion */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #005C97 0%, #363795 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px'
          }}>
            {t('may4thDeals.cta.title')}
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            {t('may4thDeals.cta.description')}
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              fontSize: 'var(--text-base)',
              color: '#ffffff',
              textAlign: 'left'
            }}>
              <li>{t('may4thDeals.cta.features.minifigsTracked') || '✓ 18,000+ minifigures tracked'}</li>
              <li>{t('may4thDeals.cta.features.setsTracked') || '✓ 20,000+ sets tracked'}</li>
              <li>{t('may4thDeals.cta.features.smartPricing') || '✓ Smart market pricing'}</li>
              <li>{t('may4thDeals.cta.features.currencySupport') || '✓ 15+ currency support'}</li>
            </ul>
          </div>

          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#005C97',
              background: '#ffffff',
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            {t('may4thDeals.cta.button')}
          </Link>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section style={{ padding: '40px 20px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: '#737373', lineHeight: '1.6' }}>
            {t('may4thDeals.cta.disclaimer')} <Link href="/disclosure" style={{ color: '#737373', textDecoration: 'underline' }}>{t('footer.disclosure')}</Link>
          </p>
        </div>
      </section>
    </>
  );
}

interface SetCardProps {
  set: DealSet;
  tierColor: string;
  isBest?: boolean;
  t: (key: string) => string;
}

function SetCard({ set, tierColor, isBest, t }: SetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        border: isBest ? `2px solid ${tierColor}` : '1px solid #e5e5e5',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: isHovered
          ? '0 8px 20px rgba(0, 0, 0, 0.12)'
          : isBest ? '0 4px 12px rgba(251, 191, 36, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '180px',
        marginBottom: '16px',
        background: '#fafafa',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!imageError && set.imageUrl ? (
          <Image
            src={set.imageUrl}
            alt={set.name}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            style={{ objectFit: 'contain', padding: '12px' }}
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: '600',
            color: '#d4d4d4',
            textAlign: 'center',
            letterSpacing: '0.05em'
          }}>
            {set.setNumber}
          </div>
        )}
      </div>

      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: '600',
        color: '#171717',
        marginBottom: '4px',
        lineHeight: '1.3'
      }}>
        {set.name}
      </h3>
      <p style={{
        fontSize: 'var(--text-sm)',
        color: '#737373',
        marginBottom: '8px'
      }}>
        {t('may4thDeals.common.sponsored') || 'Sponsored'} • {t('may4thDeals.common.setNumber')}: {set.setNumber}
      </p>
      <p style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '700',
        color: '#171717',
        marginBottom: '16px'
      }}>
        {t('may4thDeals.common.price')}: ${set.price.toFixed(2)}
      </p>

      <a
        href={set.affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          padding: '12px 24px',
          fontSize: 'var(--text-base)',
          fontWeight: '600',
          color: '#ffffff',
          background: isBest
            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
            : 'linear-gradient(135deg, #005C97 0%, #363795 100%)',
          borderRadius: '8px',
          textAlign: 'center',
          textDecoration: 'none',
          marginTop: 'auto',
          transition: 'all 0.2s',
          boxShadow: isBest ? '0 2px 8px rgba(251, 191, 36, 0.3)' : '0 2px 8px rgba(0, 92, 151, 0.3)'
        }}
      >
        {t('may4thDeals.common.buyOnLego')}
      </a>
    </div>
  );
}
