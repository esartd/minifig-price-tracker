import * as React from 'react';

interface PriceAlertEmailProps {
  userName: string;
  itemName: string;
  itemNo: string;
  itemType: 'MINIFIG' | 'SET';
  condition: 'new' | 'used';
  targetPrice: number;
  currentPrice: number;
  currencyCode: string;
  itemUrl: string;
  ebayUrl: string;
  bricklinkUrl: string;
  amazonUrl: string;
  unsubscribeUrl: string;
}

export const PriceAlertEmail = ({
  userName,
  itemName,
  itemNo,
  itemType,
  condition,
  targetPrice,
  currentPrice,
  currencyCode,
  itemUrl,
  ebayUrl,
  bricklinkUrl,
  amazonUrl,
  unsubscribeUrl,
}: PriceAlertEmailProps) => {
  const currencySymbol = currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : currencyCode === 'GBP' ? '£' : currencyCode;
  const conditionText = condition === 'new' ? 'New' : 'Used';
  const savingsPercent = Math.round(((targetPrice - currentPrice) / targetPrice) * 100);

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
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 32px 24px;
          }
          .alert-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .item-name {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin: 8px 0;
          }
          .item-details {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 24px;
          }
          .price-comparison {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
          }
          .price-label {
            color: #6b7280;
            font-size: 14px;
          }
          .price-value {
            font-size: 18px;
            font-weight: 600;
          }
          .target-price {
            color: #6b7280;
          }
          .current-price {
            color: #10b981;
          }
          .savings {
            color: #10b981;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
          }
          .cta-section {
            text-align: center;
            margin: 32px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #005C97 0%, #363795 100%);
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 8px;
            box-shadow: 0 2px 8px rgba(0, 92, 151, 0.2);
          }
          .marketplace-links {
            margin: 24px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .marketplace-links h3 {
            margin: 0 0 16px 0;
            font-size: 16px;
            color: #1f2937;
          }
          .marketplace-link {
            display: block;
            color: #005C97;
            text-decoration: none;
            padding: 8px 0;
            font-size: 14px;
          }
          .marketplace-link:hover {
            color: #363795;
          }
          .footer {
            background: #f9fafb;
            padding: 24px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          .footer a {
            color: #005C97;
            text-decoration: none;
          }
          .footer a:hover {
            color: #363795;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>🎯 Price Alert Triggered!</h1>
          </div>

          <div className="content">
            <div className="alert-badge">
              Price Drop Detected
            </div>

            <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
              Hi {userName},
            </p>

            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              Great news! The price for <strong>{itemName}</strong> has dropped below your target price.
            </p>

            <div className="item-name">
              {itemName}
            </div>

            <div className="item-details">
              {itemNo} • {conditionText} • {itemType === 'MINIFIG' ? 'Minifigure' : 'Set'}
            </div>

            <div className="price-comparison">
              <div className="price-row">
                <span className="price-label">Your Target Price:</span>
                <span className="price-value target-price">
                  {currencySymbol}{targetPrice.toFixed(2)}
                </span>
              </div>

              <div className="price-row">
                <span className="price-label">Current Price:</span>
                <span className="price-value current-price">
                  {currencySymbol}{currentPrice.toFixed(2)}
                </span>
              </div>

              <div className="savings">
                💰 Save {currencySymbol}{(targetPrice - currentPrice).toFixed(2)} ({savingsPercent}% below target)
              </div>
            </div>

            <div className="cta-section">
              <a href={itemUrl} className="cta-button">
                View on FigTracker
              </a>
            </div>

            <div className="marketplace-links">
              <h3>Where to Buy</h3>
              <a href={ebayUrl} className="marketplace-link">
                🔵 Search on eBay →
              </a>
              <a href={bricklinkUrl} className="marketplace-link">
                🟠 Search on BrickLink →
              </a>
              <a href={amazonUrl} className="marketplace-link">
                🟡 Search on Amazon →
              </a>
            </div>

            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '24px', lineHeight: '1.6' }}>
              <strong>Note:</strong> This alert has been automatically deactivated. Prices are updated every 6 hours based on BrickLink market data. Set a new alert if you'd like to continue monitoring.
            </p>
          </div>

          <div className="footer">
            <p style={{ margin: '0 0 8px 0' }}>
              This alert was set for <strong>{itemName}</strong>
            </p>
            <p style={{ margin: '8px 0' }}>
              <a href={unsubscribeUrl}>Unsubscribe</a> from price alerts
            </p>
            <p style={{ margin: '8px 0', color: '#9ca3af' }}>
              © {new Date().getFullYear()} FigTracker. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default PriceAlertEmail;
