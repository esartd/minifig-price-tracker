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

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'flex-end' }}>
      {/* Quantity Input */}
      <div style={{ flex: '1', minWidth: '120px', maxWidth: '200px' }}>
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
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            value={quantity}
            readOnly
            style={{
              width: '100%',
              padding: '16px 48px 16px 20px',
              fontSize: '16px',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              color: '#171717',
              background: '#ffffff',
              textAlign: 'left',
              cursor: 'default',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
          <div style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            width: '32px'
          }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
              style={{
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#525252'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '12px', height: '12px', transform: 'rotate(180deg)' }}>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8l4 4 4-4"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (quantity > 1) setQuantity(quantity - 1);
              }}
              disabled={quantity <= 1}
              style={{
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: quantity > 1 ? '#f5f5f5' : '#e5e5e5',
                border: 'none',
                borderRadius: '4px',
                cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                color: quantity > 1 ? '#525252' : '#a3a3a3',
                opacity: quantity > 1 ? 1 : 0.5
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '12px', height: '12px' }}>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8l4 4 4-4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div style={{ flex: '0 0 auto' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
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
            whiteSpace: 'nowrap'
          }}
        >
          {loading ? 'Adding...' : session ? 'Add to Inventory' : 'Sign In to Add'}
        </button>
      </div>
    </div>
  );
}
