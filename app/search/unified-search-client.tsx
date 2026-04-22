'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type TabType = 'all' | 'minifigs' | 'sets';

interface MinifigResult {
  minifigure_no: string;
  name: string;
  category_name: string;
  year_released: string | null;
}

interface SetResult {
  box_no: string;
  name: string;
  category_name: string;
  year_released: string;
  weight: string;
  image_url: string;
}

export default function UnifiedSearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [minifigs, setMinifigs] = useState<MinifigResult[]>([]);
  const [sets, setSets] = useState<SetResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    if (query) {
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setMinifigs([]);
      setSets([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search/unified?q=${encodeURIComponent(query)}&limit=50`);
      const data = await response.json();

      if (data.success) {
        setMinifigs(data.data.minifigs || []);
        setSets(data.data.sets || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setMinifigs([]);
    setSets([]);
    router.push('/search');
  };

  const minifigsToShow = activeTab === 'all' ? minifigs.slice(0, 5) : minifigs;
  const setsToShow = activeTab === 'all' ? sets.slice(0, 5) : sets;

  const showMinifigs = activeTab === 'all' || activeTab === 'minifigs';
  const showSets = activeTab === 'all' || activeTab === 'sets';

  return (
    <>
      <style jsx>{`
        .responsive-padding {
          padding: 16px !important;
        }

        @media (min-width: 768px) {
          .responsive-padding {
            padding: 24px !important;
          }
        }

        @media (min-width: 1024px) {
          .responsive-padding {
            padding: 32px !important;
          }
        }

        .tab-pill {
          transition: all 0.2s;
        }

        .tab-pill:hover {
          background: #f3f4f6;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        {/* Header with Search */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e5e5e5',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }} className="responsive-padding">
            <h1 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#171717'
            }}>
              Search LEGO
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: '#ffffff',
                border: '1px solid #dfe1e5',
                borderRadius: '24px',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                maxWidth: '720px'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 1px 6px rgba(32,33,36,.28)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#dfe1e5';
              }}>
                <svg style={{ width: '20px', height: '20px', flexShrink: 0, color: '#9aa0a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search minifigures and sets..."
                  autoComplete="off"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#202124',
                    backgroundColor: 'transparent',
                    padding: 0
                  }}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      padding: 0,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      flexShrink: 0,
                      color: '#5f6368'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            {/* Tabs - Only show if there are results */}
            {(minifigs.length > 0 || sets.length > 0) && (
              <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}>
                <button
                  onClick={() => setActiveTab('all')}
                  className="tab-pill"
                  style={{
                    padding: '10px 20px',
                    border: activeTab === 'all' ? '1px solid #3b82f6' : '1px solid #e5e5e5',
                    background: activeTab === 'all' ? '#eff6ff' : 'white',
                    color: activeTab === 'all' ? '#3b82f6' : '#525252',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  All
                </button>

                {minifigs.length > 0 && (
                  <button
                    onClick={() => setActiveTab('minifigs')}
                    className="tab-pill"
                    style={{
                      padding: '10px 20px',
                      border: activeTab === 'minifigs' ? '1px solid #3b82f6' : '1px solid #e5e5e5',
                      background: activeTab === 'minifigs' ? '#eff6ff' : 'white',
                      color: activeTab === 'minifigs' ? '#3b82f6' : '#525252',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Minifigures ({minifigs.length})
                  </button>
                )}

                {sets.length > 0 && (
                  <button
                    onClick={() => setActiveTab('sets')}
                    className="tab-pill"
                    style={{
                      padding: '10px 20px',
                      border: activeTab === 'sets' ? '1px solid #3b82f6' : '1px solid #e5e5e5',
                      background: activeTab === 'sets' ? '#eff6ff' : 'white',
                      color: activeTab === 'sets' ? '#3b82f6' : '#525252',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sets ({sets.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }} className="responsive-padding">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', color: '#525252' }}>Searching...</div>
            </div>
          ) : !searchQuery ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#737373' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
                Search for Minifigures and Sets
              </div>
              <div style={{ fontSize: '16px', marginBottom: '24px' }}>
                Try searching by name, number, or theme
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['Star Wars', 'Harry Potter', 'City', 'Ninjago'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => {
                      setSearchQuery(theme);
                      router.push(`/search?q=${encodeURIComponent(theme)}`);
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'white',
                      border: '1px solid #e5e5e5',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#525252'
                    }}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          ) : minifigs.length === 0 && sets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#737373' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                No results found
              </div>
              <div style={{ fontSize: '16px' }}>
                Try different keywords or browse by theme
              </div>
            </div>
          ) : (
            <>
              {/* Minifigures Section */}
              {showMinifigs && minifigs.length > 0 && (
                <div style={{ marginBottom: activeTab === 'all' ? '48px' : '0' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                  }}>
                    <h2 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#171717'
                    }}>
                      Minifigures {activeTab === 'minifigs' && `(${minifigs.length})`}
                    </h2>
                    {activeTab === 'all' && minifigs.length > 5 && (
                      <button
                        onClick={() => setActiveTab('minifigs')}
                        style={{
                          color: '#3b82f6',
                          fontSize: '14px',
                          fontWeight: '600',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        See all →
                      </button>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '24px'
                  }}>
                    {minifigsToShow.map(minifig => (
                      <Link
                        key={minifig.minifigure_no}
                        href={`/minifigs/${minifig.minifigure_no}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div style={{
                          background: 'white',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid #e5e5e5',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          <div style={{
                            height: '200px',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                          }}>
                            <Image
                              src={`https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`}
                              alt={minifig.name}
                              width={160}
                              height={160}
                              style={{ objectFit: 'contain', maxHeight: '160px' }}
                            />
                          </div>
                          <div style={{ padding: '16px' }}>
                            <div style={{
                              fontSize: '11px',
                              color: '#3b82f6',
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {minifig.minifigure_no}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#171717',
                              marginBottom: '8px',
                              lineHeight: '1.3',
                              minHeight: '38px'
                            }}>
                              {minifig.name}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: '#737373'
                            }}>
                              {minifig.category_name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sets Section */}
              {showSets && sets.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                  }}>
                    <h2 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#171717'
                    }}>
                      Sets {activeTab === 'sets' && `(${sets.length})`}
                    </h2>
                    {activeTab === 'all' && sets.length > 5 && (
                      <button
                        onClick={() => setActiveTab('sets')}
                        style={{
                          color: '#3b82f6',
                          fontSize: '14px',
                          fontWeight: '600',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        See all →
                      </button>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '24px'
                  }}>
                    {setsToShow.map(set => (
                      <Link
                        key={set.box_no}
                        href={`/sets/${set.box_no}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div style={{
                          background: 'white',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid #e5e5e5',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          <div style={{
                            height: '200px',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                          }}>
                            <Image
                              src={set.image_url}
                              alt={set.name}
                              width={160}
                              height={160}
                              style={{ objectFit: 'contain', maxHeight: '160px' }}
                            />
                          </div>
                          <div style={{ padding: '16px' }}>
                            <div style={{
                              fontSize: '11px',
                              color: '#10b981',
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {set.box_no}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#171717',
                              marginBottom: '8px',
                              lineHeight: '1.3',
                              minHeight: '38px'
                            }}>
                              {set.name}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: '#737373'
                            }}>
                              {set.category_name.split(' / ')[0]}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
