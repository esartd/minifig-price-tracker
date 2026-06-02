'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BellIcon, BellAlertIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.active && !a.triggered_at);
  const triggeredAlerts = alerts.filter(a => a.triggered_at);
  const pausedAlerts = alerts.filter(a => !a.active && !a.triggered_at);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/account" className="hover:text-gray-900">Account</Link>
            <span>/</span>
            <span className="text-gray-900">Price Alerts</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Price Alerts</h1>
          <p className="text-gray-600 mt-2">
            Manage your price drop notifications
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Empty State */}
        {alerts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No price alerts yet</h3>
            <p className="text-gray-600 mb-6">
              Set price alerts on any minifig or set to get notified when prices drop.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Items
            </Link>
          </div>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BellAlertIcon className="w-5 h-5 text-blue-600" />
              Active Alerts ({activeAlerts.length})
            </h2>
            <div className="space-y-3">
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
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-green-600" />
              Triggered Alerts ({triggeredAlerts.length})
            </h2>
            <div className="space-y-3">
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
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-gray-400" />
              Paused Alerts ({pausedAlerts.length})
            </h2>
            <div className="space-y-3">
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Link href={itemUrl} className="text-base font-semibold text-gray-900 hover:text-blue-600">
            {alert.item_name}
          </Link>
          <div className="text-sm text-gray-500 mt-1">
            {alert.item_no} • {alert.condition === 'new' ? 'New' : 'Used'} • {alert.item_type === 'MINIFIG' ? 'Minifigure' : 'Set'}
          </div>
          <div className="flex items-center gap-4 mt-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Target:</span>
                <input
                  type="number"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => onSave(alert)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={onCancel}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <div className="text-sm">
                  <span className="text-gray-600">Target: </span>
                  <span className="font-semibold text-gray-900">
                    {getCurrencySymbol(alert.currency_code)}{alert.target_price.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => onEdit(alert)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edit target price"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {alert.triggered_at ? (
              <span className="text-green-600 font-medium">
                Triggered on {formatDate(alert.triggered_at)}
              </span>
            ) : alert.last_checked ? (
              <span>Last checked: {formatDate(alert.last_checked)}</span>
            ) : (
              <span>Created: {formatDate(alert.created_at)}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {alert.triggered_at ? (
            <button
              onClick={() => onToggleActive(alert.id, alert.active)}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
            >
              Reactivate
            </button>
          ) : (
            <button
              onClick={() => onToggleActive(alert.id, alert.active)}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                alert.active
                  ? 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              {alert.active ? 'Pause' : 'Activate'}
            </button>
          )}
          <button
            onClick={() => onDelete(alert.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete alert"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
