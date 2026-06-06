'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowPathIcon, ExclamationTriangleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface CountryAnalytics {
  success: boolean;
  country: string;
  days: number;
  metrics: {
    totalViews: number;
    uniqueVisitors: number;
    avgPagesPerSession: number;
  };
  topPages: Array<{ path: string; count: number }>;
  hourlyPattern: Array<{ hour: number; count: number }>;
  scrapingIndicators: {
    noRefererRate: number;
    suspiciousIPs: Array<{
      ip: string;
      totalPages: number;
      noRefererPages: number;
      noRefererRate: number;
    }>;
    totalSuspiciousIPs: number;
  };
}

const COUNTRIES = [
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
];

const TIME_RANGES = [
  { value: 1, label: 'Last 24 Hours' },
  { value: 7, label: 'Last 7 Days' },
  { value: 30, label: 'Last 30 Days' },
];

interface TcoBotAnalysis {
  totalVisits: number;
  uniqueIPs: number;
  botScore: number;
  indicators: {
    botUserAgents: number;
    rapidAccessIPs: number;
    onlyDetailPagesIPs: number;
    highSessionIPs: number;
  };
  recommendation: 'block' | 'monitor' | 'allow';
  details: string;
}

interface TcoBotStats {
  analysis: TcoBotAnalysis;
  topBotIPs: Array<{
    ip: string;
    visits: number;
    botIndicators: string[];
  }>;
  topPages: Array<{
    path: string;
    visits: number;
  }>;
}

export default function VisitorAnalyticsDashboard() {
  const [selectedCountry, setSelectedCountry] = useState('SG');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CountryAnalytics | null>(null);
  const [error, setError] = useState('');

  // T.co bot analysis state
  const [showTcoAnalysis, setShowTcoAnalysis] = useState(false);
  const [tcoLoading, setTcoLoading] = useState(false);
  const [tcoData, setTcoData] = useState<TcoBotStats | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/country-analytics?country=${selectedCountry}&days=${days}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTcoAnalysis = async () => {
    setTcoLoading(true);

    try {
      const response = await fetch(`/api/admin/tco-bot-analysis?hours=${days * 24}`);

      if (!response.ok) {
        throw new Error('Failed to fetch t.co analysis');
      }

      const result = await response.json();
      setTcoData(result);
    } catch (err: any) {
      console.error('T.co analysis error:', err);
      setTcoData(null);
    } finally {
      setTcoLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedCountry, days]);

  useEffect(() => {
    if (showTcoAnalysis) {
      fetchTcoAnalysis();
    }
  }, [showTcoAnalysis, days]);

  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry);
  const isHighRisk = data && data.scrapingIndicators.noRefererRate > 70;

  return (
    <div>
      {/* T.co Bot Analysis Toggle */}
      <div style={{
        background: '#fff7ed',
        border: '1px solid #fdba74',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
      }}
      onClick={() => setShowTcoAnalysis(!showTcoAnalysis)}
      >
        <ShieldExclamationIcon style={{ width: '24px', height: '24px', color: '#ea580c', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <strong style={{ color: '#9a3412' }}>Twitter/X Bot Detection (t.co referrals)</strong>
          <p style={{ color: '#9a3412', marginTop: '4px', fontSize: '14px' }}>
            Click to analyze whether t.co traffic is real users or automated bots
          </p>
        </div>
        <div style={{
          background: '#ea580c',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
        }}>
          {showTcoAnalysis ? 'Hide' : 'Analyze'}
        </div>
      </div>

      {/* T.co Analysis Results */}
      {showTcoAnalysis && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: '24px',
          marginBottom: '24px',
        }}>
          {tcoLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#737373' }}>
              Analyzing t.co traffic...
            </div>
          ) : tcoData && tcoData.analysis.totalVisits > 0 ? (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                Twitter/X (t.co) Bot Analysis
              </h2>

              {/* Bot Score Alert */}
              <div style={{
                background: tcoData.analysis.botScore >= 70 ? '#fef2f2' :
                           tcoData.analysis.botScore >= 40 ? '#fef3c7' : '#f0fdf4',
                border: `1px solid ${tcoData.analysis.botScore >= 70 ? '#fecaca' :
                                      tcoData.analysis.botScore >= 40 ? '#fbbf24' : '#86efac'}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px',
                  color: tcoData.analysis.botScore >= 70 ? '#dc2626' :
                         tcoData.analysis.botScore >= 40 ? '#f59e0b' : '#16a34a'
                }}>
                  {tcoData.analysis.botScore}%
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  Bot Likelihood Score
                </div>
                <div style={{ fontSize: '14px', color: '#737373', marginTop: '8px' }}>
                  {tcoData.analysis.details}
                </div>
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'white',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  Recommendation: <span style={{
                    color: tcoData.analysis.recommendation === 'block' ? '#dc2626' :
                           tcoData.analysis.recommendation === 'monitor' ? '#f59e0b' : '#16a34a'
                  }}>
                    {tcoData.analysis.recommendation.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Indicators */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#737373', marginBottom: '4px' }}>
                    Total t.co Visits
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {tcoData.analysis.totalVisits}
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#737373', marginBottom: '4px' }}>
                    Unique IPs
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {tcoData.analysis.uniqueIPs}
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#737373', marginBottom: '4px' }}>
                    Bot User Agents
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {tcoData.analysis.indicators.botUserAgents}
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#737373', marginBottom: '4px' }}>
                    Rapid Access IPs
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {tcoData.analysis.indicators.rapidAccessIPs}
                  </div>
                </div>
              </div>

              {/* Suspicious IPs */}
              {tcoData.topBotIPs.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                    Suspicious IPs ({tcoData.topBotIPs.length})
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                          <th style={{ textAlign: 'left', padding: '8px' }}>IP (Hashed)</th>
                          <th style={{ textAlign: 'right', padding: '8px' }}>Visits</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Bot Indicators</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tcoData.topBotIPs.map((ip, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                            <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '12px' }}>
                              {ip.ip.substring(0, 12)}...
                            </td>
                            <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                              {ip.visits}
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              {ip.botIndicators.map((indicator, i) => (
                                <div key={i} style={{
                                  display: 'inline-block',
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  marginRight: '4px',
                                  marginBottom: '4px',
                                }}>
                                  {indicator}
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Top Pages */}
              {tcoData.topPages.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                    Top Pages from t.co
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Path</th>
                          <th style={{ textAlign: 'right', padding: '8px' }}>Visits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tcoData.topPages.map((page, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                            <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '13px' }}>
                              {page.path}
                            </td>
                            <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                              {page.visits}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : tcoData ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#737373' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                No t.co Traffic Yet
              </div>
              <div style={{ fontSize: '14px' }}>
                Visitor tracking just started. Check back in 24 hours.
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Controls */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e5e5',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Country Selector */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #d4d4d4',
                fontSize: '14px',
              }}
            >
              {COUNTRIES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Time Range
            </label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #d4d4d4',
                fontSize: '14px',
              }}
            >
              {TIME_RANGES.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <ArrowPathIcon style={{ width: '16px', height: '16px' }} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: '48px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '16px', color: '#737373' }}>Loading analytics...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px',
          color: '#dc2626',
          marginBottom: '24px',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Analytics Display */}
      {!loading && data && (
        <div>
          {/* Alert Banner for High-Risk Countries */}
          {isHighRisk && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <ExclamationTriangleIcon style={{ width: '24px', height: '24px', color: '#f59e0b', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#92400e' }}>High Scraping Activity Detected</strong>
                <p style={{ color: '#78350f', marginTop: '4px', fontSize: '14px' }}>
                  {data.scrapingIndicators.noRefererRate}% of detail page visits have no referer.
                  This suggests automated scraping behavior.
                </p>
              </div>
            </div>
          )}

          {/* Metrics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <MetricCard
              title="Total Views"
              value={data.metrics.totalViews.toLocaleString()}
              subtitle={`From ${selectedCountryData?.flag} ${selectedCountryData?.name}`}
            />
            <MetricCard
              title="Unique Visitors"
              value={data.metrics.uniqueVisitors.toLocaleString()}
              subtitle="Distinct IP addresses"
            />
            <MetricCard
              title="Avg Pages/Session"
              value={data.metrics.avgPagesPerSession.toString()}
              subtitle={data.metrics.avgPagesPerSession > 10 ? 'Suspicious - may be scraping' : 'Normal browsing pattern'}
              warning={data.metrics.avgPagesPerSession > 10}
            />
            <MetricCard
              title="No Referer Rate"
              value={`${data.scrapingIndicators.noRefererRate}%`}
              subtitle={data.scrapingIndicators.noRefererRate > 70 ? 'High scraping activity' : 'Normal user behavior'}
              warning={data.scrapingIndicators.noRefererRate > 70}
            />
          </div>

          {/* Top Pages */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            padding: '24px',
            marginBottom: '24px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
              Top 20 Pages Visited
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600' }}>Path</th>
                    <th style={{ textAlign: 'right', padding: '8px', fontWeight: '600' }}>Views</th>
                    <th style={{ textAlign: 'right', padding: '8px', fontWeight: '600' }}>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.map((page, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '13px' }}>{page.path}</td>
                      <td style={{ textAlign: 'right', padding: '12px 8px' }}>{page.count.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', padding: '12px 8px', color: '#737373' }}>
                        {Math.round((page.count / data.metrics.totalViews) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hourly Pattern */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            padding: '24px',
            marginBottom: '24px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
              Hourly Traffic Pattern (UTC)
            </h2>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '200px' }}>
              {data.hourlyPattern.map((hour) => {
                const maxCount = Math.max(...data.hourlyPattern.map(h => h.count));
                const height = maxCount > 0 ? (hour.count / maxCount) * 180 : 0;
                return (
                  <div key={hour.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${height}px`,
                        background: hour.count > maxCount * 0.7 ? '#ef4444' : '#3b82f6',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s',
                      }}
                      title={`${hour.hour}:00 UTC - ${hour.count} views`}
                    />
                    <div style={{ fontSize: '10px', color: '#737373', marginTop: '4px' }}>
                      {hour.hour}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suspicious IPs */}
          {data.scrapingIndicators.suspiciousIPs.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              padding: '24px',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#dc2626' }}>
                Suspicious IPs ({data.scrapingIndicators.totalSuspiciousIPs})
              </h2>
              <p style={{ fontSize: '14px', color: '#737373', marginBottom: '16px' }}>
                IPs with 80%+ no-referer rate and 5+ page views (likely scrapers)
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                      <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600' }}>IP (Hashed)</th>
                      <th style={{ textAlign: 'right', padding: '8px', fontWeight: '600' }}>Total Pages</th>
                      <th style={{ textAlign: 'right', padding: '8px', fontWeight: '600' }}>No Referer</th>
                      <th style={{ textAlign: 'right', padding: '8px', fontWeight: '600' }}>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.scrapingIndicators.suspiciousIPs.map((ip, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '12px' }}>
                          {ip.ip.substring(0, 12)}...
                        </td>
                        <td style={{ textAlign: 'right', padding: '12px 8px' }}>{ip.totalPages}</td>
                        <td style={{ textAlign: 'right', padding: '12px 8px' }}>{ip.noRefererPages}</td>
                        <td style={{ textAlign: 'right', padding: '12px 8px', color: '#dc2626', fontWeight: '600' }}>
                          {Math.round(ip.noRefererRate * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  warning,
}: {
  title: string;
  value: string;
  subtitle: string;
  warning?: boolean;
}) {
  return (
    <div style={{
      background: warning ? '#fef2f2' : 'white',
      border: `1px solid ${warning ? '#fecaca' : '#e5e5e5'}`,
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ fontSize: '14px', color: '#737373', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: '700',
        color: warning ? '#dc2626' : '#171717',
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '13px',
        color: warning ? '#dc2626' : '#737373',
      }}>
        {subtitle}
      </div>
    </div>
  );
}
