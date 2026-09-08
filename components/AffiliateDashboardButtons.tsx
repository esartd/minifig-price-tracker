'use client';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function AffiliateDashboardButtons() {
  return (
    <>
      <div style={{ height: '1px', background: '#e5e5e5', margin: 'var(--space-4) 0' }} />
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div style={{
          fontSize: '12px',
          color: '#737373',
          marginBottom: 'var(--space-2)',
          fontWeight: '500',
        }}>
          Partner Dashboards
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
        }}>
          <a
            href="https://partner.ebay.com/secure/mediapartner/home/pview.ihtml#/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#3665f3',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2952d6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3665f3';
            }}
          >
            <ArrowTopRightOnSquareIcon style={{ width: '16px', height: '16px' }} />
            eBay Partner Network
          </a>
          <a
            href="https://publisher.rakutenadvertising.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#bf0000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#a00000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#bf0000';
            }}
          >
            <ArrowTopRightOnSquareIcon style={{ width: '16px', height: '16px' }} />
            Rakuten (LEGO)
          </a>
          <a
            href="https://affiliate-program.amazon.com/home"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#ff9900',
              color: '#000000',
              border: 'none',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e88700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ff9900';
            }}
          >
            <ArrowTopRightOnSquareIcon style={{ width: '16px', height: '16px' }} />
            Amazon Associates
          </a>
        </div>
      </div>
    </>
  );
}
