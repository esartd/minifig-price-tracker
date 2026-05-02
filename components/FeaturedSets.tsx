'use client';

import Image from 'next/image';
import { useTranslation } from './TranslationProvider';

interface FeaturedSet {
  name: string;
  setNumber: string;
  imageUrl: string;
  affiliateLink: string;
  trackingPixel?: string;
  retailer: 'lego' | 'amazon';
}

const FEATURED_SETS: FeaturedSet[] = [
  // Row 1: Big wow factor - Death Star, Pokémon trio, Razor Crest
  {
    name: 'Death Star',
    setNumber: '75419',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt725a94446f56dbe2/75419_Prod.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392316690332535869762939&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fdeath-star-75419',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.1392316690332535869762939&type=2&subid=0',
    retailer: 'lego'
  },
  {
    name: 'Venusaur, Charizard and Blastoise',
    setNumber: '72153',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt03c6f9be28fbf6ad/72153_Prod.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.139234124780332512277469&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fvenusaur-charizard-and-blastoise-72153',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.139234124780332512277469&type=2&subid=0',
    retailer: 'lego'
  },
  {
    name: 'The Razor Crest',
    setNumber: '75447',
    imageUrl: 'https://m.media-amazon.com/images/I/81f7XO+OneL._AC_SL1500_.jpg',
    affiliateLink: 'https://amzn.to/489zDAF',
    retailer: 'amazon'
  },
  // Row 2: Mix of unique - Nike, X-wing, Eevee
  {
    name: 'Nike Air Max 95 x LEGO Set',
    setNumber: '43025',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/bltea4265dd0b4ff9a7/blte76f8eeef463f0d2-43025_Prod_en-gb.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392317205829561007743728&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fnike-air-max-95-x-lego-set-43025',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.1392317205829561007743728&type=2&subid=0',
    retailer: 'lego'
  },
  {
    name: 'New Republic X-wing Starfighter',
    setNumber: '75460',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt3c7b337dee009946/75460_Prod.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392310902806047811533973&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fnew-republic-x-wing-starfighter-75460',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.1392310902806047811533973&type=2&subid=0',
    retailer: 'lego'
  },
  {
    name: 'Eevee',
    setNumber: '72151',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt278340680c8d7955/72151_Prod.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392314824195809996297094&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2feevee-72151',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.1392314824195809996297094&type=2&subid=0',
    retailer: 'lego'
  },
  // Row 3: Fun variety - Winnie, Mandalorian, Minecraft
  {
    name: 'Winnie the Pooh',
    setNumber: '43300',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt90ec9b36934c6763/blt1bf4465602ddf9aa-43300_Prod_en-gb.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392311628564234059934635&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fwinnie-the-pooh-43300',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.1392311628564234059934635&type=2&subid=0',
    retailer: 'lego'
  },
  {
    name: 'Anzellan Starship',
    setNumber: '75445',
    imageUrl: 'https://m.media-amazon.com/images/I/81KpA46siyL._AC_SL1500_.jpg',
    affiliateLink: 'https://amzn.to/4tPQSzo',
    retailer: 'amazon'
  },
  {
    name: 'The Enderman Tower',
    setNumber: '21279',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt69e0c9637cf8c1e8/21279_Prod_en-gb.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.139239676002968405250455&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fthe-enderman-tower-21279',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.139239676002968405250455&type=2&subid=0',
    retailer: 'lego'
  },
  // Row 4: Final row - Speeder, Gingerbread, [one more spot]
  {
    name: 'Cobb Vanth\'s Speeder',
    setNumber: '75437',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt74204d585275936e/75437_Prod_en-gb.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.1392316649727683231473773&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fcobb-vanths-speeder-75437',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.1392316649727683231473773&type=2&subid=0',
    retailer: 'lego'
  },
  {
    name: 'Gingerbread AT-AT Walker',
    setNumber: '40806',
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt6d4c85ec676b3157/40806_Prod.png?format=jpg&fit=bounds&quality=80',
    affiliateLink: 'https://click.linksynergy.com/link?id=g%2aDYfXR3HYU&offerid=1606623.139239742528138961320669&type=2&murl=https%3a%2f%2fwww.lego.com%2fen-us%2fproduct%2fgingerbread-at-at-walker-40806',
    trackingPixel: 'https://ad.linksynergy.com/fs-bin/show?id=g%2aDYfXR3HYU&bids=1606623.139239742528138961320669&type=2&subid=0',
    retailer: 'lego'
  },
  {
    name: 'Lionel Messi Collector\'s Set',
    setNumber: '66818',
    imageUrl: 'https://m.media-amazon.com/images/I/81zsda6UCyL._AC_SL1500_.jpg',
    affiliateLink: 'https://amzn.to/4sNYGRc',
    retailer: 'amazon'
  },
  // {
  //   name: 'Set Name',
  //   setNumber: '12345',
  //   imageUrl: 'https://www.lego.com/...',
  //   affiliateLink: 'https://click.linksynergy.com/...',
  //   trackingPixel: 'https://ad.linksynergy.com/...'
  // },
];

export default function FeaturedSets() {
  const { t } = useTranslation();
  return (
    <>
      <style jsx>{`
        .featured-sets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .featured-sets-grid {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 900px) {
          .featured-sets-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .featured-sets-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
      <section style={{
        padding: '60px 20px 80px',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e5e5e5'
      }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.01em',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          {t('featured.title')}
        </h2>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          {t('featured.subtitle')}
        </p>

        <div className="featured-sets-grid">
          {FEATURED_SETS.map((set) => (
            <div key={set.setNumber} style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e5e5',
              transition: 'all 0.2s',
              width: '100%',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              display: 'grid',
              gridTemplateRows: 'auto 1fr auto',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4d4d4';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e5e5';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <a
                href={set.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'contents'
                }}
              >
                {/* Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  marginBottom: '16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={set.imageUrl}
                    alt={set.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
                    style={{
                      objectFit: 'contain',
                      padding: '12px'
                    }}
                    unoptimized
                  />
                </div>

                {/* Text Content */}
                <div>
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
                    marginBottom: '0'
                  }}>
                    Sponsored · {set.setNumber}
                  </p>
                </div>

                {/* Button */}
                <div style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: set.retailer === 'lego'
                    ? 'linear-gradient(135deg, #005C97 0%, #363795 100%)'
                    : 'linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)',
                  borderRadius: '8px',
                  alignSelf: 'start',
                  textAlign: 'center',
                  marginTop: '16px'
                }}>
                  {set.retailer === 'lego' ? t('footer.buyLego') : t('footer.buyAmazon')}
                </div>
              </a>
              {/* Tracking pixel (LEGO.com only) */}
              {set.trackingPixel && (
                <img
                  src={set.trackingPixel}
                  alt=""
                  style={{
                    width: '1px',
                    height: '1px',
                    border: '0',
                    position: 'absolute',
                    visibility: 'hidden'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Affiliate Disclosure */}
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#737373',
          marginTop: '48px',
          textAlign: 'center'
        }}>
          {t('footer.commission')} <a href="/disclosure" style={{ color: '#737373', textDecoration: 'underline' }}>{t('footer.learnMore')}</a>
        </p>
      </div>
    </section>
    </>
  );
}
