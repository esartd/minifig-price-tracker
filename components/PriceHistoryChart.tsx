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
          fontSize: '16px',
          color: '#737373',
          margin: 0
        }}>
          Price history will appear here as data is collected over time
        </p>
        <p style={{
          fontSize: '14px',
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
          width: '32px',
          height: '32px',
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
          fontSize: '14px',
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
      {/* Timeframe Toggle */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => setTimeframe('6months')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
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
            fontSize: '14px',
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

  // Chart dimensions (responsive)
  const chartHeight = 120;
  const chartPadding = { top: 12, right: 12, bottom: 32, left: 40 };
  const chartWidth = 600; // SVG viewBox width (will scale)
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = chartPadding.left + (i / (data.length - 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - ((d.suggested_price - minPrice) / priceRange) * plotHeight;
    return { x, y, date: d.recorded_at, price: d.suggested_price };
  });

  // Create SVG path
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = minPrice + (priceRange * (4 - i) / 4);
    const y = chartPadding.top + (i * plotHeight / 4);
    return { value, y };
  });

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e5e5e5'
    }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '300px'
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
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <text
            key={i}
            x={chartPadding.left - 8}
            y={tick.y}
            textAnchor="end"
            dominantBaseline="middle"
            fill="#737373"
            fontSize="11"
            fontWeight="500"
          >
            ${tick.value.toFixed(2)}
          </text>
        ))}

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke="#005C97"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#005C97"
          />
        ))}

        {/* X-axis labels (first and last date) */}
        {data.length > 0 && (
          <>
            <text
              x={chartPadding.left}
              y={chartHeight - chartPadding.bottom + 24}
              textAnchor="start"
              fill="#737373"
              fontSize="11"
              fontWeight="500"
            >
              {new Date(data[0].recorded_at).toLocaleDateString()}
            </text>
            <text
              x={chartWidth - chartPadding.right}
              y={chartHeight - chartPadding.bottom + 24}
              textAnchor="end"
              fill="#737373"
              fontSize="11"
              fontWeight="500"
            >
              {new Date(data[data.length - 1].recorded_at).toLocaleDateString()}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
