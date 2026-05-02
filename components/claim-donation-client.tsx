'use client';

import { useState } from 'react';

export default function ClaimDonationClient() {
  const [formData, setFormData] = useState({
    paypalEmail: '',
    transactionId: '',
    displayName: '',
    showOnLeaderboard: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/donations/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Clear form
        setFormData({
          paypalEmail: '',
          transactionId: '',
          displayName: '',
          showOnLeaderboard: false,
        });
      } else {
        setError(data.error || 'Failed to claim donation');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1488cc 0%, #2b32b2 100%)',
        paddingTop: '80px',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '60px 24px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '24px',
            lineHeight: '1.2',
          }}
        >
          Claim Your Donation
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 3vw, 18px)',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: '1.6',
            marginBottom: '0',
          }}
        >
          Join our supporters leaderboard and let the community know you helped keep FigTracker free
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto 80px',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
        >
          {success ? (
            // Success Message
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '64px',
                  marginBottom: '24px',
                }}
              >
                ✅
              </div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#171717',
                  marginBottom: '16px',
                }}
              >
                Thank You!
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: '#525252',
                  lineHeight: '1.7',
                  marginBottom: '32px',
                }}
              >
                Your donation has been claimed successfully.
                {formData.showOnLeaderboard && ' Check out the homepage to see your name on the leaderboard!'}
              </p>
              <a
                href="/"
                style={{
                  display: 'inline-block',
                  padding: '12px 28px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                Go to Homepage
              </a>
            </div>
          ) : (
            // Claim Form
            <form onSubmit={handleSubmit}>
              {/* Instructions */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#737373',
                  marginBottom: '32px',
                  lineHeight: '1.7',
                }}
              >
                To verify your donation and add yourself to the leaderboard, enter your PayPal email and
                transaction ID from your donation receipt.
              </p>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    marginBottom: '24px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#dc2626',
                      marginBottom: '0',
                    }}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* PayPal Email */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="paypalEmail"
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '8px',
                  }}
                >
                  PayPal Email *
                </label>
                <input
                  type="email"
                  id="paypalEmail"
                  required
                  value={formData.paypalEmail}
                  onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Transaction ID */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="transactionId"
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '8px',
                  }}
                >
                  Transaction ID *
                </label>
                <input
                  type="text"
                  id="transactionId"
                  required
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  placeholder="e.g., 1AB23456CD789012E"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />
                <p
                  style={{
                    fontSize: '12px',
                    color: '#737373',
                    marginTop: '6px',
                    marginBottom: '0',
                  }}
                >
                  Find this in your PayPal receipt email
                </p>
              </div>

              {/* Leaderboard Opt-in Checkbox */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.showOnLeaderboard}
                    onChange={(e) => setFormData({ ...formData, showOnLeaderboard: e.target.checked })}
                    style={{
                      width: '18px',
                      height: '18px',
                      marginRight: '12px',
                      cursor: 'pointer',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#171717',
                    }}
                  >
                    Add me to the supporters leaderboard
                  </span>
                </label>
              </div>

              {/* Display Name (only show if opted-in) */}
              {formData.showOnLeaderboard && (
                <div style={{ marginBottom: '24px' }}>
                  <label
                    htmlFor="displayName"
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#171717',
                      marginBottom: '8px',
                    }}
                  >
                    Display Name *
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    required={formData.showOnLeaderboard}
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="LEGO Master"
                    minLength={3}
                    maxLength={30}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#737373',
                      marginTop: '6px',
                      marginBottom: '0',
                    }}
                  >
                    3-30 characters, letters, numbers, spaces, underscores, and hyphens only
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: loading ? '#9ca3af' : '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? 'Claiming...' : 'Claim Donation'}
              </button>
            </form>
          )}

          {/* Privacy Note */}
          {!success && (
            <p
              style={{
                fontSize: '12px',
                color: '#737373',
                textAlign: 'center',
                marginTop: '24px',
                marginBottom: '0',
                lineHeight: '1.6',
              }}
            >
              Your email and transaction ID are used only for verification and will never be shared publicly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
