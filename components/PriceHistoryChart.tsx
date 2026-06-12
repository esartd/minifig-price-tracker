'use client';

import { useState, useEffect } from 'react';

interface PriceHistoryData {
  id: string;
  minifigure_no: string;
  condition: string;
  six_month_avg: number;
  current_avg: number;
  current_lowest: number;
  suggested_price: number;
  recorded_at: string;
}

interface PriceHistoryStats {
  dataPoints: number;
  firstRecorded: string;
  lastRecorded: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceChange: string;
}

interface PriceHistoryChartProps {
  minifigure_no: string;
  condition: string;
}

export default function PriceHistoryChart({ minifigure_no, condition }: PriceHistoryChartProps) {
  const [data, setData] = useState<PriceHistoryData[]>([]);
  const [stats, setStats] = useState<PriceHistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'6months' | 'all'>('6months');

  useEffect(() => {
    fetchPriceHistory();
  }, [minifigure_no, condition, timeframe]);

  const fetchPriceHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/price-history?minifigure_no=${encodeURIComponent(minifigure_no)}&condition=${encodeURIComponent(condition)}&timeframe=${timeframe}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setStats(result.stats);
      } else {
        setError(result.error || 'Failed to load price history');
      }
    } catch (err) {
      setError('Failed to load price history');
    } finally {
      setLoading(false);
    }
  };

  // No data yet - show placeholder message
  if (!loading && data.length === 0) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: '#fafafa',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #e5e5e5'
      }}>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          margin: 0
        }}>
          Price history will appear here as data is collected over time
        </p>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#a3a3a3',
          marginTop: '8px',
          marginBottom: 0
        }}>
          Check back in a few days to see price trends
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{
          width: 'var(--icon-xl)',
          height: 'var(--icon-xl)',
          margin: '0 auto',
          border: '3px solid #e5e5e5',
          borderTop: '3px solid #005C97',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: '#fee2e2',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #fca5a5'
      }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#991b1b',
          margin: 0
        }}>
          {error}
        </p>
      </div>
    );
  }

  // Render the chart
  return (
    <div style={{
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header with Timeframe Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{
          fontSize: 'var(--text-base)',
          fontWeight: '600',
          color: '#171717',
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Price History
        </h2>
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
        <button
          onClick={() => setTimeframe('6months')}
          style={{
            padding: '8px 16px',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            color: timeframe === '6months' ? '#ffffff' : '#737373',
            background: timeframe === '6months' ? '#3b82f6' : '#ffffff',
            border: '1px solid',
            borderColor: timeframe === '6months' ? '#3b82f6' : '#e5e5e5',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (timeframe !== '6months') {
              e.currentTarget.style.borderColor = '#d4d4d4';
            }
          }}
          onMouseLeave={(e) => {
            if (timeframe !== '6months') {
              e.currentTarget.style.borderColor = '#e5e5e5';
            }
          }}
        >
          6 Months
        </button>
        <button
          onClick={() => setTimeframe('all')}
          style={{
            padding: '8px 16px',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            color: timeframe === 'all' ? '#ffffff' : '#737373',
            background: timeframe === 'all' ? '#3b82f6' : '#ffffff',
            border: '1px solid',
            borderColor: timeframe === 'all' ? '#3b82f6' : '#e5e5e5',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (timeframe !== 'all') {
              e.currentTarget.style.borderColor = '#d4d4d4';
            }
          }}
          onMouseLeave={(e) => {
            if (timeframe !== 'all') {
              e.currentTarget.style.borderColor = '#e5e5e5';
            }
          }}
        >
          All Time
        </button>
        </div>
      </div>

      {/* Chart */}
      <LineChart data={data} />
    </div>
  );
}

// Line Chart Component
function LineChart({ data }: { data: PriceHistoryData[] }) {
  if (data.length === 0) return null;

  // Extract prices for chart (using suggested_price - the most important number)
  const prices = data.map(d => d.suggested_price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1; // Avoid division by zero

  // Chart dimensions - designed for mobile-first
  const chartHeight = 180;
  const chartPadding = { top: 20, right: 20, bottom: 36, left: 80 };
  const chartWidth = 600; // SVG viewBox width (will scale)
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const aspectRatio = chartWidth / chartHeight;

  // Calculate points for the line
  const points = data.map((d, i) => {
    // Handle single data point case
    const x = data.length === 1
      ? chartPadding.left + plotWidth / 2
      : chartPadding.left + (i / (data.length - 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - ((d.suggested_price - minPrice) / priceRange) * plotHeight;
    return { x, y, date: d.recorded_at, price: d.suggested_price };
  });

  // Create SVG path
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Y-axis labels - always use 4 ticks for clean spacing on mobile
  const yTicks = Array.from({ length: 4 }, (_, i) => {
    const value = minPrice + (priceRange * (3 - i) / 3);
    const y = chartPadding.top + (i * plotHeight / 3);
    return { value, y };
  });

  return (
    <div style={{
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      padding: '12px',
      border: '1px solid #e5e5e5',
      position: 'relative'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(1 / aspectRatio) * 100}%`
      }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        >
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <line
              key={i}
              x1={chartPadding.left}
              y1={tick.y}
              x2={chartWidth - chartPadding.right}
              y2={tick.y}
              stroke="#e5e5e5"
              strokeWidth="0.5"
            />
          ))}

          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="var(--icon-stroke)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#3b82f6"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {/* Y-axis labels (HTML/CSS) */}
        {yTicks.map((tick, i) => {
          const topPercent = (tick.y / chartHeight) * 100;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${topPercent}%`,
                left: '0',
                transform: 'translateY(-50%)',
                fontSize: 'var(--text-xs)',
                fontWeight: '500',
                color: '#737373',
                paddingRight: '12px',
                textAlign: 'right',
                width: `${(chartPadding.left / chartWidth) * 100}%`,
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              ${tick.value.toFixed(2)}
            </div>
          );
        })}

        {/* X-axis labels (HTML/CSS) */}
        {data.length > 0 && (
          <>
            {/* Only show start date if more than 1 data point */}
            {data.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: `${(chartPadding.left / chartWidth) * 100}%`,
                  fontSize: 'var(--text-xs)',
                  fontWeight: '500',
                  color: '#737373',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {new Date(data[0].recorded_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </div>
            )}
            {/* End date (or only date if single point) */}
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                right: data.length === 1 ? '50%' : `${(chartPadding.right / chartWidth) * 100}%`,
                transform: data.length === 1 ? 'translateX(50%)' : 'none',
                fontSize: 'var(--text-xs)',
                fontWeight: '500',
                color: '#737373',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {new Date(data[data.length - 1].recorded_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
