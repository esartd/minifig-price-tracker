'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

interface AddToCollectionFormProps {
  onAdd: (quantity: number) => void;
  loading: boolean;
  session: Session | null;
}

export default function AddToCollectionForm({ onAdd, loading, session }: AddToCollectionFormProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleSubmit = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    // Redirect to sign-up if not logged in
    if (!session) {
      router.push('/auth/signup');
      return;
    }

    onAdd(quantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for editing
    if (value === '') {
      setQuantity(1);
      return;
    }
    // Parse and validate
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 9999) {
      setQuantity(num);
    }
  };

  const handleQuantityBlur = () => {
    // Ensure valid number on blur
    if (quantity < 1) {
      setQuantity(1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quantity Stepper - Mobile-friendly horizontal layout */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#525252',
          marginBottom: '12px',
          letterSpacing: '0.01em'
        }}>
          Quantity
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          width: 'fit-content',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Minus Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (quantity > 1) setQuantity(quantity - 1);
            }}
            disabled={quantity <= 1}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: quantity > 1 ? '#ffffff' : '#f5f5f5',
              border: 'none',
              borderRight: '1px solid #e5e5e5',
              cursor: quantity > 1 ? 'pointer' : 'not-allowed',
              color: quantity > 1 ? '#171717' : '#a3a3a3',
              transition: 'all 0.2s',
              fontSize: '20px',
              fontWeight: '600',
              padding: 0
            }}
            onMouseEnter={(e) => {
              if (quantity > 1) e.currentTarget.style.background = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (quantity > 1) e.currentTarget.style.background = '#ffffff';
            }}
          >
            −
          </button>

          {/* Quantity Input */}
          <input
            type="text"
            inputMode="numeric"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            onClick={(e) => e.stopPropagation()}
            style={{
              minWidth: '60px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '600',
              color: '#171717',
              background: '#ffffff',
              border: 'none',
              textAlign: 'center',
              outline: 'none',
              padding: '0'
            }}
          />

          {/* Plus Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(quantity + 1);
            }}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              border: 'none',
              borderLeft: '1px solid #e5e5e5',
              cursor: 'pointer',
              color: '#171717',
              transition: 'all 0.2s',
              fontSize: '20px',
              fontWeight: '600',
              padding: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            +
          </button>
        </div>
      </div>

      {/* Add Button */}
      <div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            background: loading ? '#a3a3a3' : '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            transition: 'all 0.2s',
            outline: 'none',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = '#2563eb';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = '#3b82f6';
          }}
        >
          {loading ? 'Adding...' : session ? 'Add to Inventory' : 'Sign In to Add'}
        </button>
      </div>
    </div>
  );
}
