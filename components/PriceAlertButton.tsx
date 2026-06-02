'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BellIcon, BellAlertIcon } from '@heroicons/react/24/outline';

interface PriceAlertButtonProps {
  itemNo: string;
  itemType: 'MINIFIG' | 'SET';
  itemName: string;
  condition: 'new' | 'used';
  currentPrice: number;
  currencyCode: string;
}

export default function PriceAlertButton({
  itemNo,
  itemType,
  itemName,
  condition,
  currentPrice,
  currencyCode,
}: PriceAlertButtonProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [hasAlert, setHasAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currencySymbol = currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : currencyCode === 'GBP' ? '£' : currencyCode;

  // Check if user already has alert for this item
  useEffect(() => {
    if (session?.user && isOpen) {
      checkExistingAlert();
    }
  }, [session, isOpen]);

  const checkExistingAlert = async () => {
    try {
      const response = await fetch('/api/alerts');
      if (response.ok) {
        const data = await response.json();
        const existingAlert = data.data?.find(
          (alert: any) =>
            alert.item_no === itemNo &&
            alert.item_type === itemType &&
            alert.condition === condition &&
            alert.active
        );
        if (existingAlert) {
          setHasAlert(true);
          setTargetPrice(existingAlert.target_price.toString());
        }
      }
    } catch (error) {
      console.error('Error checking existing alert:', error);
    }
  };

  const handleSetAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid price' });
      setIsLoading(false);
      return;
    }

    if (price >= currentPrice) {
      setMessage({ type: 'error', text: `Target price must be below current price (${currencySymbol}${currentPrice})` });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_no: itemNo,
          item_type: itemType,
          item_name: itemName,
          condition,
          target_price: price,
          currency_code: currencyCode,
        }),
      });

      if (response.ok) {
        setHasAlert(true);
        setMessage({ type: 'success', text: '✓ Price alert set! You\'ll receive an email when the price drops.' });
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
        }, 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to set alert' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to set alert. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') return null;
  if (!session) return null;
  if (currentPrice <= 0) return null; // Don't show for unavailable prices

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        title="Set price alert"
      >
        {hasAlert ? (
          <BellAlertIcon className="w-5 h-5 text-blue-600" />
        ) : (
          <BellIcon className="w-5 h-5" />
        )}
        <span>Price Alert</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Set Price Alert</h3>
                <p className="text-sm text-gray-500 mt-1">{itemName}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSetAlert}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Price: {currencySymbol}{currentPrice.toFixed(2)}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notify me when price drops to:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">{currencySymbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Set a target price below the current price
                </p>
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Setting...' : 'Set Alert'}
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              You'll receive an email when the price drops to or below your target. The alert will be automatically deactivated after triggering.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
