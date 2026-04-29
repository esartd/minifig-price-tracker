'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrenciesByContinent, SUPPORTED_CURRENCIES } from '@/lib/currency-config';
import { formatPrice } from '@/lib/format-price';
import { useTranslation } from '@/components/TranslationProvider';

export default function AccountPage() {
  const { t, locale } = useTranslation();
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile states
  const [name, setName] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Avatar options - initials + AI-generated LEGO minifigures
  const avatarOptions = [
    { id: 'initials', label: 'Initials', image: null },
    { id: 'astronaut-female', label: 'Astronaut', image: '/avatars/astronaut-female.png' },
    { id: 'ninja-purple', label: 'Ninja', image: '/avatars/ninja-purple.png' },
    { id: 'wizard-female', label: 'Wizard', image: '/avatars/wizard-female.png' },
    { id: 'pirate', label: 'Pirate', image: '/avatars/pirate.png' },
    { id: 'vampire', label: 'Vampire', image: '/avatars/vampire.png' },
    { id: 'robot', label: 'Robot', image: '/avatars/robot.png' },
    { id: 'chef', label: 'Chef', image: '/avatars/chef.png' },
    { id: 'astronaut-male', label: 'Astronaut', image: '/avatars/astronaut-male.png' },
    { id: 'ninja-black', label: 'Ninja', image: '/avatars/ninja-black.png' },
    { id: 'nerd-female', label: 'Nerd', image: '/avatars/nerd-female.png' },
    { id: 'wizard-male', label: 'Wizard', image: '/avatars/wizard-male.png' },
    { id: 'punk', label: 'Rocker', image: '/avatars/punk.png' },
    { id: 'cowgirl', label: 'Cowgirl', image: '/avatars/cowgirl.png' },
    { id: 'cowboy', label: 'Cowboy', image: '/avatars/cowboy.png' },
    { id: 'cool-guy', label: 'Cool Guy', image: '/avatars/cool-guy.png' },
    { id: 'nerd-male', label: 'Nerd', image: '/avatars/nerd-male.png' },
  ];

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Collection stats
  const [stats, setStats] = useState({ totalItems: 0, totalValue: 0, memberSince: '' });

  // Currency preference
  const [selectedCurrency, setSelectedCurrency] = useState(session?.user?.preferredCurrency || 'USD');

  // Share collection states
  const [shareEnabled, setShareEnabled] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    if (session?.user?.image) {
      setSelectedAvatar(session.user.image);
    }
  }, [session]);

  const renderAvatar = (avatarId: string | null, size: number = 100) => {
    if (!avatarId || avatarId === 'initials') {
      return (
        <div style={{
          width: `${size}px`,
          height: `${size}px`,
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          fontSize: `${size * 0.28}px`,
          fontWeight: '600',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getInitials(session?.user?.name)}
        </div>
      );
    }

    // Find the avatar image URL
    const avatarOption = avatarOptions.find(opt => opt.id === avatarId);
    const imageUrl = avatarOption?.image;

    if (!imageUrl) {
      return renderAvatar('initials', size);
    }

    // It's a minifig image
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        background: '#ffffff',
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img
          src={imageUrl}
          alt="Avatar"
          style={{
            width: 'auto',
            height: '200%',
            position: 'absolute',
            left: '50%',
            top: '-10%',
            transform: 'translateX(-50%)',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    // Fetch collection stats from all 4 collections
    const fetchStats = async () => {
      try {
        // Fetch all 4 collection types in parallel (with ?all=true to get everything, not paginated)
        const [inventoryResponse, collectionResponse, setInventoryResponse, setCollectionResponse] = await Promise.all([
          fetch('/api/inventory?all=true', { cache: 'no-store' }),
          fetch('/api/personal-collection?all=true', { cache: 'no-store' }),
          fetch('/api/set-inventory?all=true', { cache: 'no-store' }),
          fetch('/api/set-personal-collection?all=true', { cache: 'no-store' })
        ]);

        let totalValue = 0;
        let totalItems = 0;

        // Process minifig inventory items (for sale)
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json();
          const inventoryItems = inventoryData.success ? inventoryData.data : (Array.isArray(inventoryData) ? inventoryData : []);

          if (Array.isArray(inventoryItems)) {
            inventoryItems.forEach((item: any) => {
              const price = item.pricing?.suggestedPrice || item.suggestedPrice || 0;
              const qty = item.quantity || 1;
              totalValue += price * qty;
              totalItems += qty;
            });
          }
        }

        // Process minifig personal collection items
        if (collectionResponse.ok) {
          const collectionData = await collectionResponse.json();
          const collectionItems = collectionData.success ? collectionData.data : (Array.isArray(collectionData) ? collectionData : []);

          if (Array.isArray(collectionItems)) {
            collectionItems.forEach((item: any) => {
              const price = item.pricing?.suggestedPrice || item.suggestedPrice || 0;
              const qty = item.quantity || 1;
              totalValue += price * qty;
              totalItems += qty;
            });
          }
        }

        // Process set inventory items (for sale)
        if (setInventoryResponse.ok) {
          const setInventoryData = await setInventoryResponse.json();
          const setInventoryItems = setInventoryData.success ? setInventoryData.data : (Array.isArray(setInventoryData) ? setInventoryData : []);

          if (Array.isArray(setInventoryItems)) {
            setInventoryItems.forEach((item: any) => {
              const price = item.pricing?.suggestedPrice || item.suggestedPrice || 0;
              const qty = item.quantity || 1;
              totalValue += price * qty;
              totalItems += qty;
            });
          }
        }

        // Process set personal collection items
        if (setCollectionResponse.ok) {
          const setCollectionData = await setCollectionResponse.json();
          const setCollectionItems = setCollectionData.success ? setCollectionData.data : (Array.isArray(setCollectionData) ? setCollectionData : []);

          if (Array.isArray(setCollectionItems)) {
            setCollectionItems.forEach((item: any) => {
              const price = item.pricing?.suggestedPrice || item.suggestedPrice || 0;
              const qty = item.quantity || 1;
              totalValue += price * qty;
              totalItems += qty;
            });
          }
        }

        setStats({
          totalItems: totalItems,
          totalValue: totalValue,
          memberSince: session?.user?.email ? 'Recently' : ''
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({
          totalItems: 0,
          totalValue: 0,
          memberSince: session?.user?.email ? 'Recently' : ''
        });
      }
    };

    if (session?.user) {
      fetchStats();
    }

    // Refetch stats when page becomes visible (e.g., navigating back from inventory)
    const handleVisibilityChange = () => {
      if (!document.hidden && session?.user) {
        fetchStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session]);

  // Fetch share status
  useEffect(() => {
    const fetchShareStatus = async () => {
      try {
        const response = await fetch('/api/collection/share');
        const data = await response.json();
        if (data.success) {
          setShareEnabled(data.shareEnabled);
          setShareToken(data.shareToken);
          setShareUrl(data.shareUrl);
        }
      } catch (error) {
        console.error('Failed to fetch share status:', error);
      }
    };

    if (session?.user) {
      fetchShareStatus();
    }
  }, [session]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage('error', data.error || t('account.messages.genericError'));
      } else {
        showMessage('success', t('account.messages.nameUpdated'));
        router.refresh();
      }
    } catch (error) {
      showMessage('error', t('account.messages.genericError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (avatar: string) => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/update-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage('error', data.error || t('account.messages.genericError'));
        setLoading(false);
        return;
      }

      // Update local state immediately for visual feedback
      setSelectedAvatar(avatar);
      setShowAvatarPicker(false);

      // Update session without signing out (like Google/Apple)
      await update({ image: avatar });
      router.refresh(); // Refresh server components to show new avatar in header

      showMessage('success', t('account.messages.avatarUpdated'));
      setLoading(false);

    } catch (error) {
      console.error('Avatar update error:', error);
      showMessage('error', t('account.messages.genericError'));
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage('error', t('account.messages.passwordMismatch'));
      return;
    }

    if (newPassword.length < 8) {
      showMessage('error', t('account.messages.passwordTooShort'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage('error', data.error || t('account.messages.genericError'));
      } else {
        showMessage('success', t('account.messages.passwordChanged'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      showMessage('error', t('account.messages.genericError'));
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch collection');

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `minifig-collection-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showMessage('success', t('account.dataManagement.export.success'));
    } catch (error) {
      showMessage('error', t('account.dataManagement.export.error'));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      t('account.dataManagement.delete.confirm1')
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      t('account.dataManagement.delete.confirm2')
    );

    if (!doubleConfirm) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        showMessage('error', t('account.dataManagement.delete.error'));
        setLoading(false);
        return;
      }

      window.location.href = '/auth/signin';
    } catch (error) {
      showMessage('error', t('account.messages.genericError'));
      setLoading(false);
    }
  };

  const handleCurrencyChange = async (currencyCode: string) => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
    if (!currency) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/update-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency: currency.code,
          countryCode: currency.countryCode,
          region: currency.region,
          currencySymbol: currency.symbol,
          locale: currency.locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage('error', data.error || t('account.messages.genericError'));
      } else {
        setSelectedCurrency(currency.code);
        await update({
          preferredCurrency: currency.code,
          preferredCountryCode: currency.countryCode,
          preferredRegion: currency.region,
          currencySymbol: currency.symbol,
          locale: currency.locale,
        });

        // Show notification with time estimate
        const { itemCount, estimatedMinutes } = data.priceUpdate || { itemCount: 0, estimatedMinutes: 0 };
        let message = `✓ ${t('account.messages.currencyUpdated', { currencyName: currency.name, currencySymbol: currency.symbol })}`;

        if (itemCount > 0) {
          message += `\n\n⏱️ ${t('account.messages.updatingPrices', { itemCount: itemCount.toString() })}`;
          message += `\n${t('account.messages.estimatedTime', { minutes: estimatedMinutes.toString(), plural: estimatedMinutes > 1 ? 's' : '' })}`;
          message += `\n\n${t('account.messages.refreshPage')}`;
        } else {
          message += `\n\n${t('account.messages.pricesWillDisplay', { currencyCode: currency.code })}`;
        }

        alert(message);
        router.refresh();
      }
    } catch (error) {
      showMessage('error', t('account.messages.genericError'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShare = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/collection/share', {
        method: 'PATCH',
      });
      const data = await response.json();

      if (data.success) {
        setShareEnabled(data.shareEnabled);
        setShareToken(data.shareToken);
        setShareUrl(data.shareUrl);
        showMessage('success', data.shareEnabled ? t('account.sharing.enableSuccess') : t('account.sharing.disableSuccess'));
      } else {
        showMessage('error', t('account.sharing.error'));
      }
    } catch (error) {
      showMessage('error', t('account.messages.genericError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', overflowX: 'hidden' }}>
      <div className="account-page-wrapper" style={{
        maxWidth: '768px',
        margin: '0 auto',
        padding: '32px 16px 80px'
      }}>
        {/* Back Link */}
        <Link
          href="/inventory"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 'var(--text-sm)',
            color: '#737373',
            textDecoration: 'none',
            gap: '8px',
            marginBottom: '64px',
            transition: 'color 0.2s'
          }}
        >
          <svg width="var(--icon-sm)" height="var(--icon-sm)" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 12L6 8l4-4" />
          </svg>
          {t('account.backToCollection')}
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '700',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            color: '#171717',
            marginBottom: '12px'
          }}>
            {t('account.title')}
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#525252',
            lineHeight: '1.6'
          }}>
            {t('account.subtitle')}
          </p>
        </div>

        {/* Message Banner */}
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
              color: message.type === 'success' ? '#166534' : '#991b1b'
            }}>
              {message.text}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="account-stats-wrapper" style={{
          marginBottom: '40px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          marginLeft: '-16px',
          marginRight: '-16px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}>
        <div className="account-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(140px, 1fr))',
          gap: '16px',
          minWidth: 'max-content'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px 20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            minWidth: '140px'
          }}>
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: '500',
              color: '#737373',
              marginBottom: '8px',
              letterSpacing: '0.01em'
            }}>
              {t('account.stats.totalItems')}
            </p>
            <p style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1'
            }}>
              {stats.totalItems}
            </p>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px 20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            minWidth: '140px'
          }}>
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: '500',
              color: '#737373',
              marginBottom: '8px',
              letterSpacing: '0.01em'
            }}>
              {t('account.stats.collectionValue')}
            </p>
            <p style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1'
            }}>
              {formatPrice(stats.totalValue, session?.user?.preferredCurrency || 'USD', true)}
            </p>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px 20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            minWidth: '140px'
          }}>
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: '500',
              color: '#737373',
              marginBottom: '8px',
              letterSpacing: '0.01em'
            }}>
              {t('account.stats.memberSince')}
            </p>
            <p style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1'
            }}>
              2026
            </p>
          </div>
        </div>
        </div>

        {/* Profile Section */}
        <div className="account-section" style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px 16px',
          marginBottom: '32px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '32px',
            letterSpacing: '-0.01em'
          }}>
            {t('account.profile.title')}
          </h2>

          <div className="account-profile-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Avatar Picker */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div style={{ marginBottom: '20px' }}>
                {renderAvatar(selectedAvatar, 100)}
              </div>

              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#3b82f6',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  marginBottom: '16px'
                }}
              >
                {showAvatarPicker ? t('account.profile.avatar.cancel') : t('account.profile.avatar.change')}
              </button>

              {/* Avatar options grid */}
              {showAvatarPicker && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                  gap: '12px',
                  width: '100%',
                  maxWidth: '400px',
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5'
                }}>
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleAvatarSelect(avatar.id)}
                      disabled={loading}
                      style={{
                        padding: '8px',
                        background: selectedAvatar === avatar.id ? '#eff6ff' : '#ffffff',
                        border: selectedAvatar === avatar.id ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAvatar !== avatar.id) e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAvatar !== avatar.id) e.currentTarget.style.borderColor = '#e5e5e5';
                      }}
                    >
                      {renderAvatar(avatar.id, 60)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Name and Email */}
            <div style={{ width: '100%' }}>
              <form onSubmit={handleNameUpdate} style={{ marginBottom: '32px' }}>
                <label htmlFor="name" style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  {t('account.profile.fullName')}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: 'var(--text-sm)',
                      borderRadius: '8px',
                      border: '1px solid #e5e5e5',
                      color: '#171717',
                      background: 'white',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxSizing: 'border-box'
                    }}
                    placeholder={t('account.profile.placeholders.name')}
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
                    type="submit"
                    disabled={loading || name === session.user.name}
                    style={{
                      padding: '14px 24px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      background: (loading || name === session.user.name) ? '#a3a3a3' : '#3b82f6',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      cursor: (loading || name === session.user.name) ? 'not-allowed' : 'pointer',
                      opacity: (loading || name === session.user.name) ? 0.5 : 1,
                      transition: 'all 0.2s',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    {loading ? t('account.profile.saving') : t('account.profile.save')}
                  </button>
                </div>
              </form>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  {t('account.profile.emailAddress')}
                </label>
                <div style={{
                  padding: '14px 16px',
                  fontSize: 'var(--text-sm)',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  background: '#f5f5f5',
                  color: '#737373',
                  wordBreak: 'break-all'
                }}>
                  {session.user.email}
                </div>
                <p style={{
                  fontSize: 'var(--text-xs)',
                  color: '#a3a3a3',
                  marginTop: '8px',
                  lineHeight: '1.5'
                }}>
                  {t('account.profile.emailNote')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="account-section" style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px 16px',
          marginBottom: '32px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '32px',
            letterSpacing: '-0.01em'
          }}>
            {t('account.security.title')}
          </h2>

          <form onSubmit={handlePasswordChange}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <div>
                <label htmlFor="currentPassword" style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  {t('account.security.currentPassword')}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      padding: '14px 48px 14px 16px',
                      fontSize: 'var(--text-sm)',
                      borderRadius: '8px',
                      border: '1px solid #e5e5e5',
                      color: '#171717',
                      background: 'white',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxSizing: 'border-box'
                    }}
                    placeholder={t('account.security.placeholders.currentPassword')}
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
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#737373',
                      outline: 'none'
                    }}
                  >
                    {showCurrentPassword ? (
                      <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  {t('account.security.newPassword')}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      padding: '14px 48px 14px 16px',
                      fontSize: 'var(--text-sm)',
                      borderRadius: '8px',
                      border: '1px solid #e5e5e5',
                      color: '#171717',
                      background: 'white',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxSizing: 'border-box'
                    }}
                    placeholder={t('account.security.placeholders.newPassword')}
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
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#737373',
                      outline: 'none'
                    }}
                  >
                    {showNewPassword ? (
                      <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  {t('account.security.confirmPassword')}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      padding: '14px 48px 14px 16px',
                      fontSize: 'var(--text-sm)',
                      borderRadius: '8px',
                      border: '1px solid #e5e5e5',
                      color: '#171717',
                      background: 'white',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxSizing: 'border-box'
                    }}
                    placeholder={t('account.security.placeholders.confirmPassword')}
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
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#737373',
                      outline: 'none'
                    }}
                  >
                    {showConfirmPassword ? (
                      <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              style={{
                padding: '14px 24px',
                fontSize: 'var(--text-sm)',
                fontWeight: '600',
                color: '#ffffff',
                background: (loading || !currentPassword || !newPassword || !confirmPassword) ? '#a3a3a3' : '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                cursor: (loading || !currentPassword || !newPassword || !confirmPassword) ? 'not-allowed' : 'pointer',
                opacity: (loading || !currentPassword || !newPassword || !confirmPassword) ? 0.5 : 1,
                transition: 'all 0.2s',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {loading ? t('account.security.changing') : t('account.security.changePassword')}
            </button>
          </form>
        </div>

        {/* Regional Settings Section */}
        <div className="account-section" style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px 16px',
          marginBottom: '32px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '8px',
            letterSpacing: '-0.01em'
          }}>
            {t('account.regional.title')}
          </h2>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            {t('account.regional.subtitle')}
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              color: '#171717',
              marginBottom: '8px'
            }}>
              {t('account.regional.currency')}
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: 'var(--text-base)',
                color: '#171717',
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
            >
              {Object.entries(getCurrenciesByContinent()).map(([continent, currencies]) => (
                <optgroup key={continent} label={continent}>
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              color: '#171717',
              marginBottom: '8px'
            }}>
              {t('account.regional.language')}
            </label>
            <select
              value={locale}
              onChange={(e) => {
                const newLocale = e.target.value as 'en' | 'de' | 'fr' | 'es';
                const protocol = window.location.protocol;
                const currentPath = window.location.pathname;
                const subdomainMap = {
                  en: 'figtracker.ericksu.com',
                  de: 'de.figtracker.ericksu.com',
                  fr: 'fr.figtracker.ericksu.com',
                  es: 'es.figtracker.ericksu.com'
                };
                window.location.href = `${protocol}//${subdomainMap[newLocale]}${currentPath}`;
              }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: 'var(--text-base)',
                color: '#171717',
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div style={{
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e5e5'
          }}>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: '#525252',
              lineHeight: '1.6'
            }}>
              <strong>Note:</strong> {t('account.regional.note')}
            </p>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="account-section" style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px 16px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '32px',
            letterSpacing: '-0.01em'
          }}>
            {t('account.dataManagement.title')}
          </h2>

          <div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: '32px',
              borderBottom: '1px solid #e5e5e5',
              marginBottom: '32px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '6px'
                }}>
                  {t('account.dataManagement.export.title')}
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  lineHeight: '1.6'
                }}>
                  {t('account.dataManagement.export.subtitle')}
                </p>
              </div>
              <button
                onClick={handleExportData}
                style={{
                  padding: '14px 24px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#525252',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {t('account.dataManagement.export.button')}
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#dc2626',
                  marginBottom: '6px'
                }}>
                  {t('account.dataManagement.delete.title')}
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  lineHeight: '1.6'
                }}>
                  {t('account.dataManagement.delete.subtitle')}
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                style={{
                  padding: '14px 24px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#dc2626',
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {t('account.dataManagement.delete.button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
