'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAmazonSetUrl, getLegoOfficialUrl, getBrickLinkSetUrl, getConfiguredAffiliates } from '@/lib/affiliate-links';

interface SetInfo {
  no: string;
  name: string;
  quantity: number;
  image_url: string;
}

interface MinifigSetsProps {
  minifigNo: string;
}

export default function MinifigSets({ minifigNo }: MinifigSetsProps) {
  const [sets, setSets] = useState<SetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const affiliates = getConfiguredAffiliates();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await fetch(`/api/minifigs/${minifigNo}/sets`);
        const data = await response.json();

        if (data.success) {
          setSets(data.sets || []);
        } else {
          setError(data.error || 'Failed to load sets');
        }
      } catch (err) {
        console.error('Error fetching sets:', err);
        setError('Failed to load sets');
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [minifigNo]);

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#737373' }}>
        <div style={{
          width: '32px',
          height: '32px',
          margin: '0 auto 12px',
          border: '3px solid #e5e5e5',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p style={{ fontSize: '14px' }}>Loading sets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        background: '#fef2f2',
        borderRadius: '8px',
        color: '#991b1b',
        fontSize: '14px'
      }}>
        {error}
      </div>
    );
  }

  if (sets.length === 0) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        background: '#fafafa',
        borderRadius: '8px',
        color: '#737373',
        fontSize: '14px'
      }}>
        No sets found for this minifigure
      </div>
    );
  }

  return (
    <div className="minifig-related-section" style={{ marginTop: '32px' }}>
      <h2 className="minifig-related-heading">
        Found in {sets.length} Set{sets.length !== 1 ? 's' : ''}
      </h2>
      <p className="minifig-related-description">
        LEGO sets that include this minifigure
      </p>
      <div className="minifig-related-grid">
        {sets.map((set) => (
          <div
            key={set.no}
            style={{
              display: 'block',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              overflow: 'hidden',
              textDecoration: 'none',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            {/* Quantity Badge */}
            {set.quantity > 1 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#10b981',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 8px',
                borderRadius: '6px',
                zIndex: 10
              }}>
                ×{set.quantity}
              </div>
            )}

            <div className="minifig-variant-image" style={{
              background: '#f9fafb',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '150px'
            }}>
              <Image
                src={set.image_url}
                alt={set.name}
                width={140}
                height={140}
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  height: 'auto'
                }}
                unoptimized
              />
            </div>
            <div style={{ padding: '12px 16px 16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '4px',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {set.name}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#737373',
                fontFamily: 'monospace',
                marginBottom: '12px'
              }}>
                {set.no}
              </p>

              {/* Purchase Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {/* Amazon (Primary) */}
                {affiliates.amazon && (
                  <a
                    href={getAmazonSetUrl(set.no, set.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#ffffff',
                      background: '#FF9900',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F08000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FF9900';
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.53.406-3.045.61-4.516.61-2.265 0-4.463-.346-6.544-1.036-2.08-.69-3.943-1.708-5.59-3.046-.15-.124-.21-.224-.18-.31zm23.71-5.048c-.315.027-.584-.077-.812-.307-.23-.23-.358-.505-.39-.84 0-.058-.007-.12-.013-.185l-.006-.065c-.044-.582-.22-1.087-.524-1.506-.303-.42-.7-.634-1.188-.634-.26 0-.487.082-.683.244s-.294.39-.294.686c0 .138.034.305.103.498.07.193.28.61.63 1.248.36.655.61 1.152.76 1.49.15.34.224.627.224.86 0 .584-.23 1.08-.69 1.488-.46.407-1.034.61-1.717.61-.683 0-1.294-.2-1.835-.598s-.96-.95-1.257-1.653c-.11-.27-.028-.405.246-.405.088 0 .207.02.36.064.15.043.26.065.328.065.22 0 .395-.11.523-.327.13-.217.194-.457.194-.717 0-.153-.014-.29-.042-.41-.028-.12-.1-.29-.214-.512-.115-.223-.214-.396-.297-.52-.083-.125-.21-.29-.382-.497s-.345-.375-.52-.497c-.175-.123-.407-.24-.696-.353s-.583-.17-.88-.17c-.586 0-1.093.183-1.52.55-.43.365-.64.817-.64 1.352 0 .248.045.495.134.74.09.244.23.53.42.857.32.55.48 1.01.48 1.382 0 .263-.082.483-.246.662-.164.18-.382.27-.653.27-.27 0-.524-.09-.76-.27s-.433-.433-.587-.763c-.155-.33-.233-.703-.233-1.12 0-.615.155-1.2.466-1.755.31-.555.744-1 1.3-1.333s1.19-.5 1.903-.5c.713 0 1.347.167 1.903.5.555.333.988.778 1.3 1.333.31.555.465 1.14.465 1.755 0 .278-.04.543-.118.795-.08.25-.195.48-.348.685-.152.205-.337.373-.555.503s-.463.195-.735.195c-.36 0-.67-.09-.932-.27s-.465-.43-.61-.75c-.145-.32-.218-.683-.218-1.09 0-.407.073-.77.218-1.09s.348-.57.61-.75c.262-.18.572-.27.932-.27.272 0 .517.065.735.195s.403.298.555.503c.153.205.268.435.348.685.078.252.118.517.118.795 0 .615-.155 1.2-.465 1.755-.312.555-.745 1-1.3 1.333-.556.333-1.19.5-1.903.5-.714 0-1.348-.167-1.903-.5-.556-.333-.99-.778-1.3-1.333-.31-.555-.466-1.14-.466-1.755 0-.417.078-.79.233-1.12.154-.33.35-.583.587-.763.236-.18.49-.27.76-.27.27 0 .489.09.653.27.164.18.246.4.246.662 0 .372-.16.832-.48 1.382-.19.327-.33.613-.42.857-.09.245-.134.492-.134.74 0 .535.21.987.64 1.352.427.367.934.55 1.52.55.297 0 .59-.057.88-.17.29-.113.52-.23.696-.353.175-.122.347-.29.52-.497s.3-.372.382-.497c.083-.124.182-.297.297-.52.114-.222.186-.392.214-.512.028-.12.042-.257.042-.41 0-.26-.064-.5-.194-.717-.128-.217-.303-.327-.523-.327-.068 0-.178.022-.328.065-.153.044-.272.064-.36.064-.274 0-.356-.135-.246-.405.297-.703.716-1.255 1.257-1.653.54-.398 1.152-.598 1.835-.598.683 0 1.257.203 1.717.61.46.408.69.904.69 1.488 0 .233-.075.52-.224.86-.15.338-.4.835-.76 1.49-.35.638-.56 1.055-.63 1.248-.07.193-.103.36-.103.498 0 .296.098.524.294.686.196.162.423.244.683.244.488 0 .885-.214 1.188-.634.304-.42.48-.924.524-1.506l.006-.065c.006-.065.013-.127.013-.185.032-.335.16-.61.39-.84.228-.23.497-.334.812-.307.26.023.472.126.636.308.164.182.246.406.246.674 0 .174-.02.336-.06.484s-.104.302-.19.46c-.086.16-.202.328-.348.506-.145.178-.305.348-.48.51s-.378.316-.608.46c-.23.146-.488.27-.773.374s-.59.19-.914.244-.664.08-1.018.08c-.682 0-1.283-.183-1.8-.55-.518-.367-.777-.87-.777-1.508 0-.437.15-1.01.45-1.717.3-.708.45-1.23.45-1.566 0-.222-.062-.408-.186-.558s-.29-.225-.497-.225c-.207 0-.395.075-.564.225s-.253.336-.253.558c0 .138.034.305.103.498.07.193.28.61.63 1.248.36.655.61 1.152.76 1.49.15.34.224.627.224.86 0 .584-.23 1.08-.69 1.488-.46.407-1.034.61-1.717.61-.683 0-1.294-.2-1.835-.598s-.96-.95-1.257-1.653c-.11-.27-.028-.405.246-.405.088 0 .207.02.36.064.15.043.26.065.328.065.22 0 .395-.11.523-.327.13-.217.194-.457.194-.717 0-.153-.014-.29-.042-.41-.028-.12-.1-.29-.214-.512-.115-.223-.214-.396-.297-.52-.083-.125-.21-.29-.382-.497s-.345-.375-.52-.497c-.175-.123-.407-.24-.696-.353s-.583-.17-.88-.17c-.586 0-1.093.183-1.52.55-.43.365-.64.817-.64 1.352 0 .248.045.495.134.74.09.244.23.53.42.857.32.55.48 1.01.48 1.382 0 .263-.082.483-.246.662-.164.18-.382.27-.653.27-.27 0-.524-.09-.76-.27s-.433-.433-.587-.763c-.155-.33-.233-.703-.233-1.12 0-.615.155-1.2.466-1.755.31-.555.744-1 1.3-1.333s1.19-.5 1.903-.5c.713 0 1.347.167 1.903.5.555.333.988.778 1.3 1.333.31.555.465 1.14.465 1.755 0 .278-.04.543-.118.795-.08.25-.195.48-.348.685-.152.205-.337.373-.555.503s-.463.195-.735.195z"/>
                    </svg>
                    Buy on Amazon
                  </a>
                )}

                {/* LEGO.com (via Rakuten) */}
                {affiliates.rakuten && (
                  <a
                    href={getLegoOfficialUrl(set.no)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#ffffff',
                      background: '#FFCF00',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#E6BA00';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFCF00';
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="2" width="20" height="20" rx="2"/>
                    </svg>
                    Buy on LEGO.com
                  </a>
                )}

                {/* BrickLink (Reference/Fallback) */}
                <a
                  href={getBrickLinkSetUrl(set.no)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#737373',
                    background: 'transparent',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.color = '#737373';
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  View on BrickLink
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
