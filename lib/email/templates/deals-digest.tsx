import * as React from 'react';

/**
 * The daily Walmart deals digest, for Premium subscribers who opted in.
 *
 * Carries only what CHANGED since the last send -- sets that entered the deals
 * list, and sets whose price dropped further. The full list is deliberately not
 * repeated: an identical email every morning is how a daily digest teaches
 * people to stop opening it, and then to unsubscribe. The cron skips the send
 * entirely on a day with nothing new.
 *
 * Every set here has already cleared the same bar as /deals -- Walmart flagging
 * a real sale AND our own suggested price agreeing the asking price is below
 * what the set is worth.
 */

export interface DigestDeal {
  boxNo: string;
  name: string;
  currentPrice: number;
  listPrice: number | null;
  discountPercent: number;
  pctBelowOurPrice: number | null;
  /** Present only for a set whose price fell since the last digest. */
  previousPrice?: number | null;
  buyUrl: string;
  imageUrl?: string | null;
}

interface DealsDigestEmailProps {
  userName: string;
  /** Sets that were not on the list yesterday. */
  newDeals: DigestDeal[];
  /** Sets already on the list whose price fell. */
  cheaperDeals: DigestDeal[];
  dealsUrl: string;
  /** One-click, no sign-in. Stops the digest only, not other mail. */
  unsubscribeUrl: string;
}

const money = (n: number) => `$${n.toFixed(2)}`;

function DealRow({ deal }: { deal: DigestDeal }) {
  return (
    <tr>
      <td style={{ padding: '14px 0', borderBottom: '1px solid #eeeeee' }}>
        <a
          href={deal.buyUrl}
          style={{ color: '#171717', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}
        >
          {deal.name}
        </a>
        <div style={{ fontSize: '13px', color: '#737373', marginTop: '2px' }}>{deal.boxNo}</div>
        <div style={{ fontSize: '15px', marginTop: '6px' }}>
          <strong style={{ color: '#171717' }}>{money(deal.currentPrice)}</strong>
          {deal.listPrice !== null && deal.listPrice > deal.currentPrice && (
            <span style={{ color: '#a3a3a3', textDecoration: 'line-through', marginLeft: '8px' }}>
              {money(deal.listPrice)}
            </span>
          )}
          {deal.discountPercent > 0 && (
            <span style={{ color: '#b91c1c', fontWeight: 600, marginLeft: '8px' }}>
              {deal.discountPercent}% off
            </span>
          )}
        </div>
        {/* Our own verdict, stated after Walmart's. Every row passed this test
            before it could be here; it is corroboration, not the pitch. */}
        {deal.pctBelowOurPrice !== null && deal.pctBelowOurPrice > 0 && (
          <div style={{ fontSize: '13px', color: '#16a34a', marginTop: '2px' }}>
            {deal.pctBelowOurPrice}% below market value
          </div>
        )}
        {deal.previousPrice != null && deal.previousPrice > deal.currentPrice && (
          <div style={{ fontSize: '13px', color: '#737373', marginTop: '2px' }}>
            was {money(deal.previousPrice)} yesterday
          </div>
        )}
      </td>
    </tr>
  );
}

export const DealsDigestEmail = ({
  userName,
  newDeals,
  cheaperDeals,
  dealsUrl,
  unsubscribeUrl,
}: DealsDigestEmailProps) => {
  const total = newDeals.length + cheaperDeals.length;

  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #005C97 0%, #363795 100%);
            color: white;
            padding: 24px;
            text-align: center;
          }
          .header h1 { margin: 0; font-size: 22px; }
          .content { padding: 28px 24px; }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #737373;
            margin: 24px 0 4px;
          }
          .cta {
            display: inline-block;
            background: #3b82f6;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 24px;
          }
          .footer {
            padding: 20px 24px;
            font-size: 12px;
            color: #737373;
            text-align: center;
            border-top: 1px solid #eeeeee;
          }
          .footer a { color: #737373; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>
              {total === 1 ? '1 new LEGO deal today' : `${total} new LEGO deals today`}
            </h1>
          </div>

          <div className="content">
            <p style={{ margin: '0 0 8px' }}>Morning {userName},</p>
            <p style={{ margin: '0 0 8px', color: '#525252' }}>
              Only what changed since yesterday. Every set here is discounted at Walmart
              <em> and</em> priced below what we reckon it is worth.
            </p>

            {newDeals.length > 0 && (
              <>
                <p className="section-title">
                  {newDeals.length === 1 ? 'New deal' : `${newDeals.length} new deals`}
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {newDeals.map((d) => (
                      <DealRow key={d.boxNo} deal={d} />
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {cheaperDeals.length > 0 && (
              <>
                <p className="section-title">
                  {cheaperDeals.length === 1 ? 'Dropped further' : `${cheaperDeals.length} dropped further`}
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {cheaperDeals.map((d) => (
                      <DealRow key={d.boxNo} deal={d} />
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <div style={{ textAlign: 'center' }}>
              <a href={dealsUrl} className="cta">
                See every current deal
              </a>
            </div>

            <p style={{ fontSize: '12px', color: '#737373', marginTop: '24px', lineHeight: 1.6 }}>
              Prices come from Walmart and are refreshed once a day, so they can change at any
              time. The price shown on Walmart at checkout is the one that applies.
            </p>
          </div>

          <div className="footer">
            You get this because you switched on the daily deals digest.{' '}
            <a href={unsubscribeUrl}>Stop these emails</a> — it will not affect any other mail
            from us.
          </div>
        </div>
      </body>
    </html>
  );
};
