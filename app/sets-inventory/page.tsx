'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SetInventoryItem } from '@/types';
import Link from 'next/link';
import { formatPrice } from '@/lib/format-price';
import CollectionPagination from '@/components/CollectionPagination';
import SetCardImage from '@/components/SetCard';

export default function SetsInventoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inventory, setInventory] = useState<SetInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-high' | 'price-low' | 'name'>('price-high');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'new' | 'used'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadInventory();
    }
  }, [status, router]);

  const loadInventory = async (page: number = 1) => {
    try {
      const response = await fetch(`/api/set-inventory?page=${page}&limit=50`);
      const data = await response.json();

      if (data.success) {
        setInventory(data.data);

        // Update pagination state
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.totalItems);
          setCurrentPage(data.pagination.page);
        }
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by condition
  const filteredInventory = inventory.filter(item => {
    if (conditionFilter === 'all') return true;
    return item.condition === conditionFilter;
  });

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (sortOrder === 'price-high') {
      return (b.pricing?.suggestedPrice || 0) - (a.pricing?.suggestedPrice || 0);
    } else if (sortOrder === 'price-low') {
      return (a.pricing?.suggestedPrice || 0) - (b.pricing?.suggestedPrice || 0);
    } else if (sortOrder === 'name') {
      return a.set_name.localeCompare(b.set_name);
    } else {
      return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
    }
  });

  // Calculate stats
  const totalValue = filteredInventory.reduce((sum, item) => {
    return sum + (item.pricing?.suggestedPrice || 0) * item.quantity;
  }, 0);

  const totalItems = filteredInventory.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <div style={{ fontSize: '18px', color: '#525252' }}>Loading your sets...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .responsive-padding {
          padding: 16px !important;
        }

        @media (min-width: 768px) {
          .responsive-padding {
            padding: 24px !important;
          }
        }

        @media (min-width: 1024px) {
          .responsive-padding {
            padding: 32px !important;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }} className="responsive-padding">
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#171717'
            }}>
              Sets for Sale
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: '#737373',
              marginBottom: '16px'
            }}>
              {totalItems} sets • Total value: {formatPrice(totalValue, 'USD')}
            </p>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value as 'all' | 'new' | 'used')}
                style={{
                  padding: '10px 48px 10px 16px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  minHeight: '44px',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23525252' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center'
                }}
              >
                <option value="all">All Conditions ({inventory.length})</option>
                <option value="new">New ({inventory.filter(i => i.condition === 'new').length})</option>
                <option value="used">Used ({inventory.filter(i => i.condition === 'used').length})</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                style={{
                  padding: '10px 48px 10px 16px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  minHeight: '44px',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23525252' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center'
                }}
              >
                <option value="default">Sort by Date Added</option>
                <option value="price-high">Sort by Price (High to Low)</option>
                <option value="price-low">Sort by Price (Low to High)</option>
                <option value="name">Sort by Name (A-Z)</option>
              </select>

              <Link
                href="/sets/browse"
                style={{
                  padding: '10px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '44px'
                }}
              >
                + Add Sets
              </Link>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }} className="responsive-padding">
          {sortedInventory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#737373'
            }}>
              <div style={{ fontSize: '72px', marginBottom: '16px' }}>📦</div>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                No sets in inventory
              </div>
              <div style={{ fontSize: '16px', marginBottom: '24px' }}>
                Add sets you want to sell to your inventory
              </div>
              <Link
                href="/sets/browse"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Browse Sets
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {sortedInventory.map(item => (
                <Link
                  key={item.id}
                  href={`/sets/${item.box_no}?condition=${item.condition}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e5e5e5',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    {/* Image */}
                    <div style={{
                      height: '200px',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px'
                    }}>
                      <SetCardImage imageUrl={item.image_url} setName={item.set_name} />
                    </div>

                    {/* Content */}
                    <div style={{ padding: '16px' }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#3b82f6',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {item.box_no}
                      </div>

                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#171717',
                        marginBottom: '8px',
                        lineHeight: '1.4',
                        minHeight: '42px'
                      }}>
                        {item.set_name}
                      </h3>

                      {/* Theme Badge */}
                      {item.category_name && (
                        <div style={{
                          fontSize: '11px',
                          background: '#f0f9ff',
                          color: '#0369a1',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          display: 'inline-block'
                        }}>
                          {item.category_name.split(' / ')[0]}
                        </div>
                      )}

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '12px'
                      }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#737373' }}>Quantity</div>
                          <div style={{ fontSize: '16px', fontWeight: '700' }}>
                            {item.quantity}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: '#737373' }}>Price</div>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
                            {item.pricing?.suggestedPrice
                              ? formatPrice(item.pricing.suggestedPrice, item.pricing.currencyCode)
                              : 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        fontSize: '11px',
                        color: '#737373',
                        marginTop: '8px',
                        textTransform: 'capitalize'
                      }}>
                        Condition: {item.condition}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <CollectionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            currentCount={inventory.length}
            totalCount={totalCount}
            onPageChange={(page) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              loadInventory(page);
            }}
          />
        </div>
      </div>
    </>
  );
}
