'use client';

/**
 * Honeypot Bot Trap
 *
 * Invisible link that only bots click (hidden from humans via CSS)
 * When clicked, logs bot IP for permanent blocking
 *
 * How it works:
 * 1. Bots crawl all <a> tags, even hidden ones
 * 2. Humans never see this link (display: none, screen reader hidden)
 * 3. When bot clicks, we log their IP to ban list
 */

export default function HoneypotTrap() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Attractive link for bots (looks like valuable data) */}
      <a
        href="/api/honeypot-trap?admin=true&all_data=true"
        style={{ display: 'none' }}
        tabIndex={-1}
      >
        Download All Minifig Data (Admin Only)
      </a>
    </div>
  );
}
