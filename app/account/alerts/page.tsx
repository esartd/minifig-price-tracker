'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PriceAlert {
  id: string;
  item_no: string;
  item_type: 'MINIFIG' | 'SET';
  item_name: string;
  condition: 'new' | 'used';
  target_price: number;
  currency_code: string;
  active: boolean;
  created_at: string;
  triggered_at: string | null;
  last_checked: string | null;
}

export default function AlertsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add styles for responsive delete button text
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width: 640px) {
        .delete-button-text {
          display: inline !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadAlerts();
    }
  }, [status, router]);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.data || []);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      const response = await fetch(`/api/alerts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlerts(alerts.filter(a => a.id !== id));
        showMessage('success', 'Alert deleted successfully');
      } else {
        showMessage('error', 'Failed to delete alert');
      }
    } catch (error) {
      showMessage('error', 'Failed to delete alert');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      if (response.ok) {
        setAlerts(alerts.map(a => a.id === id ? { ...a, active: !currentActive, triggered_at: null } : a));
        showMessage('success', currentActive ? 'Alert paused' : 'Alert activated');
      } else {
        showMessage('error', 'Failed to update alert');
      }
    } catch (error) {
      showMessage('error', 'Failed to update alert');
    }
  };

  const startEditing = (alert: PriceAlert) => {
    setEditingId(alert.id);
    setEditPrice(alert.target_price.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const saveEdit = async (alert: PriceAlert) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      showMessage('error', 'Please enter a valid price');
      return;
    }

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_no: alert.item_no,
          item_type: alert.item_type,
          item_name: alert.item_name,
          condition: alert.condition,
          target_price: newPrice,
          currency_code: alert.currency_code,
        }),
      });

      if (response.ok) {
        setAlerts(alerts.map(a => a.id === alert.id ? { ...a, target_price: newPrice } : a));
        setEditingId(null);
        setEditPrice('');
        showMessage('success', 'Target price updated');
      } else {
        showMessage('error', 'Failed to update price');
      }
    } catch (error) {
      showMessage('error', 'Failed to update price');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const getCurrencySymbol = (code: string) => {
    return code === 'USD' ? '$' : code === 'EUR' ? '€' : code === 'GBP' ? '£' : code;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafafa',
        padding: '32px 16px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#737373' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.active && !a.triggered_at);
  const triggeredAlerts = alerts.filter(a => a.triggered_at);
  const pausedAlerts = alerts.filter(a => !a.active && !a.triggered_at);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      padding: '32px 16px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#737373',
            marginBottom: '16px'
          }}>
            <Link href="/account" style={{
              color: '#737373',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#737373'}
            >
              Account
            </Link>
            <span>/</span>
            <span style={{ color: '#171717' }}>Price Alerts</span>
          </div>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '700',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            color: '#171717',
            marginBottom: '12px'
          }}>
            Price Alerts
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#525252',
            lineHeight: '1.6'
          }}>
            Manage your price drop notifications
          </p>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            marginBottom: '32px',
            padding: '16px 20px',
            borderRadius: '12px',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            border: '1px solid',
            borderColor: message.type === 'success' ? '#86efac' : '#fca5a5'
          }}>
            <p style={{
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              margin: 0
            }}>
              {message.text}
            </p>
          </div>
        )}

        {/* Empty State */}
        {alerts.length === 0 && (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            padding: '64px 32px',
            textAlign: 'center'
          }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4d4d4"
              strokeWidth="1.5"
              style={{ margin: '0 auto 24px' }}
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '8px'
            }}>
              No price alerts yet
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#737373',
              marginBottom: '24px'
            }}>
              Set price alerts on any minifig or set to get notified when prices drop.
            </p>
            <Link
              href="/search"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#ffffff',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
            >
              Browse Items
            </Link>
          </div>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ color: '#3b82f6' }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Active Alerts ({activeAlerts.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  isEditing={editingId === alert.id}
                  editPrice={editPrice}
                  onEdit={startEditing}
                  onSave={saveEdit}
                  onCancel={cancelEditing}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  setEditPrice={setEditPrice}
                  getCurrencySymbol={getCurrencySymbol}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#10b981' }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Triggered Alerts ({triggeredAlerts.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {triggeredAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  isEditing={editingId === alert.id}
                  editPrice={editPrice}
                  onEdit={startEditing}
                  onSave={saveEdit}
                  onCancel={cancelEditing}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  setEditPrice={setEditPrice}
                  getCurrencySymbol={getCurrencySymbol}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Paused Alerts */}
        {pausedAlerts.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#a3a3a3' }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Paused Alerts ({pausedAlerts.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pausedAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  isEditing={editingId === alert.id}
                  editPrice={editPrice}
                  onEdit={startEditing}
                  onSave={saveEdit}
                  onCancel={cancelEditing}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  setEditPrice={setEditPrice}
                  getCurrencySymbol={getCurrencySymbol}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AlertCardProps {
  alert: PriceAlert;
  isEditing: boolean;
  editPrice: string;
  onEdit: (alert: PriceAlert) => void;
  onSave: (alert: PriceAlert) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
  setEditPrice: (price: string) => void;
  getCurrencySymbol: (code: string) => string;
  formatDate: (date: string) => string;
}

function AlertCard({
  alert,
  isEditing,
  editPrice,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleActive,
  setEditPrice,
  getCurrencySymbol,
  formatDate,
}: AlertCardProps) {
  const itemUrl = alert.item_type === 'MINIFIG'
    ? `/minifigs/${alert.item_no}`
    : `/sets/${alert.item_no}`;

  // Construct image URL directly without API call
  const imageUrl = alert.item_type === 'MINIFIG'
    ? `https://img.bricklink.com/ItemImage/MN/0/${alert.item_no}.png`
    : `https://img.bricklink.com/ItemImage/SN/0/${alert.item_no}.png`;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      padding: '16px',
      border: '1px solid #f5f5f5'
    }}>
      {/* Header with image and title */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* Image */}
        <Link href={itemUrl} style={{
          flexShrink: 0,
          width: '64px',
          height: '64px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#fafafa',
          border: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={imageUrl}
            alt={alert.item_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '4px'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </Link>

        {/* Title and details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={itemUrl} style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#171717',
            textDecoration: 'none',
            display: 'block',
            marginBottom: '6px',
            transition: 'color 0.2s',
            lineHeight: '1.3'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#171717'}
          >
            {alert.item_name}
          </Link>
          <div style={{
            fontSize: '13px',
            color: '#737373',
            lineHeight: '1.4'
          }}>
            {alert.item_no} • {alert.condition === 'new' ? 'New' : 'Used'} • {alert.item_type === 'MINIFIG' ? 'Minifigure' : 'Set'}
          </div>
        </div>
      </div>

      {/* Target Price */}
      <div style={{ marginBottom: '12px' }}>
        {isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#737373' }}>Target:</span>
            <input
              type="number"
              step="0.01"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              style={{
                width: '100px',
                padding: '6px 10px',
                fontSize: '13px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={() => onSave(alert)}
              style={{
                padding: '6px',
                color: '#10b981',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdf4'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </button>
            <button
              onClick={onCancel}
              style={{
                padding: '6px',
                color: '#737373',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#737373' }}>Target:</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#171717' }}>
              {getCurrencySymbol(alert.currency_code)}{alert.target_price.toFixed(2)}
            </span>
            <button
              onClick={() => onEdit(alert)}
              style={{
                padding: '4px',
                color: '#a3a3a3',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fafafa';
                e.currentTarget.style.color = '#525252';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#a3a3a3';
              }}
              title="Edit target price"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{ fontSize: '12px', color: '#a3a3a3', marginBottom: '16px' }}>
        {alert.triggered_at ? (
          <span style={{ color: '#10b981', fontWeight: '500' }}>
            Triggered on {formatDate(alert.triggered_at)}
          </span>
        ) : alert.last_checked ? (
          <span>Last checked: {formatDate(alert.last_checked)}</span>
        ) : (
          <span>Created: {formatDate(alert.created_at)}</span>
        )}
      </div>

      {/* Actions - Full width buttons on mobile */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {alert.triggered_at ? (
          <button
            onClick={() => onToggleActive(alert.id, alert.active)}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#3b82f6',
              background: '#eff6ff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}
          >
            Reactivate
          </button>
        ) : (
          <button
            onClick={() => onToggleActive(alert.id, alert.active)}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: '500',
              color: alert.active ? '#737373' : '#3b82f6',
              background: alert.active ? '#fafafa' : '#eff6ff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = alert.active ? '#f5f5f5' : '#dbeafe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = alert.active ? '#fafafa' : '#eff6ff';
            }}
          >
            {alert.active ? 'Pause' : 'Activate'}
          </button>
        )}
        <button
          onClick={() => onDelete(alert.id)}
          style={{
            padding: '10px 16px',
            color: '#ef4444',
            background: '#fef2f2',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'background 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
          title="Delete alert"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span className="delete-button-text" style={{ display: 'none' }}>Delete</span>
        </button>
      </div>
    </div>
  );
}
