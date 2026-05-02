'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SettingsClient() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    showOnMinifigLeaderboard: true,
    showOnSetLeaderboard: true,
    leaderboardDisplayName: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load current settings
  useEffect(() => {
    fetch('/api/user/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormData({
            showOnMinifigLeaderboard: data.data.showOnMinifigLeaderboard ?? true,
            showOnSetLeaderboard: data.data.showOnSetLeaderboard ?? true,
            leaderboardDisplayName: data.data.leaderboardDisplayName || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#171717', marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ fontSize: '16px', color: '#737373', marginBottom: '40px' }}>
          Manage your leaderboard preferences
        </p>

        {/* Settings Card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <form onSubmit={handleSubmit}>
            {/* Section: Leaderboard */}
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#171717', marginBottom: '16px' }}>
              Community Leaderboards
            </h2>
            <p style={{ fontSize: '14px', color: '#737373', marginBottom: '24px', lineHeight: '1.7' }}>
              Choose whether to appear on the FigTracker homepage leaderboards. Your display name will be shown publicly if you opt-in.
            </p>

            {/* Display Name */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="displayName" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={formData.leaderboardDisplayName}
                onChange={(e) => setFormData({ ...formData, leaderboardDisplayName: e.target.value })}
                placeholder="e.g., LEGO Master"
                minLength={3}
                maxLength={30}
                style={{ width: '100%', padding: '12px 16px', fontSize: '15px', border: '1px solid #e5e5e5', borderRadius: '8px', boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: '12px', color: '#737373', marginTop: '6px', marginBottom: '0' }}>
                This name will appear on leaderboards if you opt-in (3-30 characters)
              </p>
            </div>

            {/* Minifig Leaderboard Opt-in */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.showOnMinifigLeaderboard}
                  onChange={(e) => setFormData({ ...formData, showOnMinifigLeaderboard: e.target.checked })}
                  style={{ width: '18px', height: '18px', marginRight: '12px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#171717' }}>
                  Show me on Top Minifig Collectors leaderboard
                </span>
              </label>
              <p style={{ fontSize: '13px', color: '#737373', marginTop: '8px', marginLeft: '30px', marginBottom: '0' }}>
                Your collection count will be publicly visible
              </p>
            </div>

            {/* Set Leaderboard Opt-in */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.showOnSetLeaderboard}
                  onChange={(e) => setFormData({ ...formData, showOnSetLeaderboard: e.target.checked })}
                  style={{ width: '18px', height: '18px', marginRight: '12px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#171717' }}>
                  Show me on Top Set Collectors leaderboard
                </span>
              </label>
              <p style={{ fontSize: '13px', color: '#737373', marginTop: '8px', marginLeft: '30px', marginBottom: '0' }}>
                Your set collection count will be publicly visible
              </p>
            </div>

            {/* Message */}
            {message && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: message.includes('success') ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${message.includes('success') ? '#86efac' : '#fecaca'}`,
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <p style={{ fontSize: '14px', color: message.includes('success') ? '#16a34a' : '#dc2626', marginBottom: '0' }}>
                  {message}
                </p>
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: saving ? '#9ca3af' : '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
