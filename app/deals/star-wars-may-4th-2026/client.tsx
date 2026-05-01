'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
            LEGO Star Wars May the 4th Deals 2026
          </h1>
          <p className="fun-header-subtitle" style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            marginBottom: '20px',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            Up to 35% Back + Free Gifts • May 1-6 Only<br/>
            <span style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: '400', opacity: '0.95' }}>
              Four tiers analyzed. Find your best deal below.
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
              TIER D
            </span>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              color: '#171717',
              margin: '0'
            }}>
              ~20-23% Return - Starting Point
            </h2>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #e5e5e5'
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '16px' }}>What You Get:</h3>
            <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', marginBottom: '20px' }}>
              <li>1 free item: <strong>The Razor Crest Mini-Build</strong> (~$5 value)</li>
              <li><strong>2x Insiders Points</strong> (~10% cashback value)</li>
              <li>Qualifying spend: <strong>$39.99+ on 2x eligible sets (before tax)</strong></li>
            </ul>
            <p style={{ fontSize: 'var(--text-base)', color: '#525252', fontWeight: '600', marginBottom: '16px' }}>
              The minimum entry point. Here's an example combo that works:
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #e0e0e0'
            }}>
              <p style={{ fontSize: 'var(--text-base)', color: '#171717', fontWeight: '600', marginBottom: '12px' }}>
                Example: Buy All 3 Sets Below
              </p>
              <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', listStyle: 'none', paddingLeft: '0' }}>
                <li>• Siege of Mandalore Battle Pack: <strong>$22.99</strong></li>
                <li>• Captain Rex Y-Wing Microfighter: <strong>$12.99</strong></li>
                <li>• Mandalorian & Grogu Speeder Bike: <strong>$9.99</strong></li>
                <li style={{ fontWeight: '700', color: '#171717', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #d4d4d4' }}>
                  Total: $45.97 ✓ Qualifies!
                </li>
                <li style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: '8px', fontStyle: 'italic' }}>
                  Return: $5 (Razor Crest) + $4.60 (2x points) = $9.60 = 21% back
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
                <SetCard key={set.setNumber} set={set} tierColor="#a3a3a3" />
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
              TIER C
            </span>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              color: '#171717',
              margin: '0'
            }}>
              25% Return - Display Collector's Choice
            </h2>
          </div>
          <div style={{
            background: '#fafafa',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #e5e5e5'
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '16px' }}>What You Get:</h3>
            <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', marginBottom: '20px' }}>
              <li>2 free items: <strong>The Mandalorian and Grogu Display + The Darksaber</strong> (~$50 value)</li>
              <li><strong>1x Insiders Points</strong> (~5% cashback = $12.50 on $249.99)</li>
              <li>Qualifying purchase: <strong>75442 N-1 Starfighter ($249.99)</strong></li>
              <li><strong>Total return: $62.50 = 25%</strong></li>
            </ul>
            <p style={{ fontSize: 'var(--text-base)', color: '#525252', fontWeight: '500', marginBottom: '24px' }}>
              Best option if you want the exclusive Display tile. You get both premium GWPs but lower points multiplier.
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
                  overflow: 'hidden'
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#d4d4d4',
                    textAlign: 'center'
                  }}>
                    75442
                  </div>
                </div>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '4px',
                  lineHeight: '1.3'
                }}>
                  The Mandalorian's N-1 Starfighter
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  marginBottom: '8px'
                }}>
                  Set #75442
                </p>
                <p style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: '700',
                  color: '#171717',
                  marginBottom: '16px'
                }}>
                  $249.99
                </p>
                <a
                  href="https://www.lego.com/en-us/product/the-mandalorians-n-1-starfighter-75442"
                  target="_blank"
                  rel="noopener noreferrer"
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
                  View on LEGO.com
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
              TIER B
            </span>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              color: '#171717',
              margin: '0'
            }}>
              ~25-30% Return - Sweet Spot for 2x Sets
            </h2>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '2px solid #c0c0c0'
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '16px' }}>What You Get:</h3>
            <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', marginBottom: '20px' }}>
              <li>2 free items: <strong>The Razor Crest Mini-Build + The Darksaber</strong> (~$35 value)</li>
              <li><strong>2x Insiders Points</strong> (~10% cashback)</li>
              <li>Qualifying spend: <strong>$160+ on 2x eligible sets</strong></li>
            </ul>
            <p style={{ fontSize: 'var(--text-base)', color: '#525252', fontWeight: '600', marginBottom: '16px' }}>
              Great value if you're buying 2x point sets. Here's an example combo:
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #e0e0e0'
            }}>
              <p style={{ fontSize: 'var(--text-base)', color: '#171717', fontWeight: '600', marginBottom: '12px' }}>
                Example: Buy Both Sets Below
              </p>
              <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.8', listStyle: 'none', paddingLeft: '0' }}>
                <li>• The Razor Crest: <strong>$149.99</strong></li>
                <li>• AT-RT Attack: <strong>$44.99</strong></li>
                <li style={{ fontWeight: '700', color: '#171717', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #d4d4d4' }}>
                  Total: $194.98 ✓ Qualifies!
                </li>
                <li style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: '8px', fontStyle: 'italic' }}>
                  Return: $35 (freebies) + $19.50 (2x points) = $54.50 = 28% back
                </li>
              </ul>
            </div>
            <p style={{ fontSize: 'var(--text-base)', color: '#737373', fontStyle: 'italic' }}>
              But if you can stretch to 4x sets, read on for even better value...
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginTop: '32px'
            }}>
              {tierBsets.map(set => (
                <SetCard key={set.setNumber} set={set} tierColor="#c0c0c0" />
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
              TIER A - BEST VALUE 🏆
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
            Up to 35% Return - The Ultimate Deal
          </h2>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #fbbf24',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
          }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: '20px', color: '#171717' }}>What You Get:</h3>
            <ul style={{ fontSize: 'var(--text-lg)', color: '#171717', lineHeight: '1.8', marginBottom: '24px', fontWeight: '500' }}>
              <li>1 free item: <strong>The Darksaber</strong> (~$30 value)</li>
              <li><strong>4x Insiders Points</strong> (~20% cashback = $32 on $160 spend)</li>
              <li>Qualifying spend: <strong>$160+ on 4x eligible sets</strong></li>
              <li><strong>Total return: $62 = 39%</strong></li>
            </ul>

            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: '12px', color: '#171717' }}>The Math:</h4>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7', marginBottom: '12px' }}>
                <strong>Example:</strong> Buy the AT-ST Walker (75417) for $199.99
              </p>
              <ul style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7', listStyle: 'none', paddingLeft: '0' }}>
                <li>✓ You get: $30 Darksaber</li>
                <li>✓ You get: $40 cashback (20% of $199.99)</li>
                <li style={{ fontWeight: '700', color: '#171717', marginTop: '8px', fontSize: 'var(--text-lg)' }}>
                  = $70 total return = 35% value
                </li>
              </ul>
              <p style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: '12px', fontStyle: 'italic' }}>
                TIE Interceptor ($229.99) gives $76 return = 33% value
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
              This is the winner. The 4x points multiplier (20% back) is the best in the entire promotion.
            </p>

            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: '20px', color: '#171717' }}>Qualifying 4x Points Sets:</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginTop: '24px'
            }}>
              {tierAsets.map(set => (
                <SetCard key={set.setNumber} set={set} tierColor="#fbbf24" isBest />
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
            What You Get Free
          </h2>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            Gifts with purchase - automatically added at checkout
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
                  src="/deals/razor-crest-gwp.jpg"
                  alt="The Razor Crest Mini-Build"
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  style={{ objectFit: 'contain', padding: '12px' }}
                />
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '600', marginBottom: '8px' }}>The Razor Crest Mini-Build</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', marginBottom: '8px' }}>Free with $40+ on 2x sets</p>
              <p style={{ fontSize: 'var(--text-sm)', color: '#525252', fontWeight: '600' }}>~$5 value</p>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a3a3a3', marginTop: '8px' }}>Tier D & B</p>
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
                />
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', marginBottom: '8px', color: '#171717' }}>The Mandalorian and Grogu Display</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#525252', marginBottom: '8px', fontWeight: '600' }}>Free ONLY with 75442 purchase</p>
              <p style={{ fontSize: 'var(--text-base)', color: '#171717', fontWeight: '700' }}>~$20 value</p>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a3a3a3', marginTop: '8px' }}>Tier C only</p>
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
                  src="/deals/darksaber-gwp.jpg"
                  alt="The Darksaber"
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  style={{ objectFit: 'contain', padding: '12px' }}
                />
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '600', marginBottom: '8px' }}>The Darksaber</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: '#737373', marginBottom: '8px' }}>Free with $160+ spend</p>
              <p style={{ fontSize: 'var(--text-sm)', color: '#525252', fontWeight: '600' }}>~$30 value</p>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a3a3a3', marginTop: '8px' }}>Tier A, B & C</p>
            </div>
          </div>

          <p style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            textAlign: 'center',
            marginTop: '32px',
            fontStyle: 'italic'
          }}>
            Note: GWP items don't count toward spend thresholds. They're added automatically at checkout.
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
            Deal Comparison at a Glance
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
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>Tier</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>Spend</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>Freebies Value</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>Cashback</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: 'var(--text-base)', fontWeight: '600' }}>Total Return</th>
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
            Track Your LEGO Collection Value
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Once you've grabbed these deals, use FigTracker to monitor your minifigure and set values in real-time
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
              <li>✓ 18,000+ minifigures tracked</li>
              <li>✓ 20,000+ sets tracked</li>
              <li>✓ Real-time BrickLink data</li>
              <li>✓ 15+ currency support</li>
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
            Start Tracking Free
          </Link>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section style={{ padding: '40px 20px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: '#737373', lineHeight: '1.6' }}>
            FigTracker earns commission on qualifying purchases through our affiliate links. This helps us keep the site running and provide free price tracking for collectors. Prices and promotions are accurate as of publication and subject to change by LEGO. Promotion valid May 1-6, 2026. <Link href="/disclosure" style={{ color: '#737373', textDecoration: 'underline' }}>Learn more</Link>
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
}

function SetCard({ set, tierColor, isBest }: SetCardProps) {
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
        Set #{set.setNumber}
      </p>
      <p style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '700',
        color: '#171717',
        marginBottom: '16px'
      }}>
        ${set.price.toFixed(2)}
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
        Shop on LEGO.com
      </a>
    </div>
  );
}
