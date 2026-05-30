'use client';

import { useState, useEffect } from 'react';

interface DatabaseLimitErrorProps {
  resetTime: Date;
}

export default function DatabaseLimitError({ resetTime }: DatabaseLimitErrorProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [localResetTime, setLocalResetTime] = useState('');

  useEffect(() => {
    // Format the reset time in user's local timezone
    const formatted = resetTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
    setLocalResetTime(formatted);

    // Update countdown every second
    const updateCountdown = () => {
      const now = new Date();
      const diff = resetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('now');
        // Reload page when time is up
        window.location.reload();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes > 0) {
        setTimeRemaining(`${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`);
      } else {
        setTimeRemaining(`${seconds} second${seconds !== 1 ? 's' : ''}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [resetTime]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          background: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: '16px',
          padding: '48px 32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            fontSize: '64px',
            textAlign: 'center',
            marginBottom: '24px',
            opacity: 0.8
          }}>
            ⏳
          </div>

          <h3 style={{
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: '600',
            color: '#171717',
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            Taking a Quick Break
          </h3>

          <p style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: '#737373',
            lineHeight: '1.6',
            marginBottom: '32px',
            textAlign: 'center',
            maxWidth: '480px',
            margin: '0 auto 32px'
          }}>
            We've reached our hourly database connection limit during development. Normal usage won't cause this.
          </p>

          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid #e5e5e5'
          }}>
            <div style={{
              fontSize: 'clamp(13px, 2vw, 14px)',
              color: '#737373',
              fontWeight: '500',
              marginBottom: '8px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Back online at
            </div>
            <div style={{
              fontSize: 'clamp(16px, 3vw, 20px)',
              color: '#171717',
              fontWeight: '600',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {localResetTime}
            </div>
            {timeRemaining && (
              <div style={{
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: '600',
                color: '#3b82f6',
                textAlign: 'center',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {timeRemaining}
              </div>
            )}
          </div>

          <p style={{
            fontSize: 'clamp(13px, 2vw, 14px)',
            color: '#a3a3a3',
            lineHeight: '1.5',
            textAlign: 'center'
          }}>
            The page will automatically reload when ready
          </p>
        </div>
      </div>
    </div>
  );
}
