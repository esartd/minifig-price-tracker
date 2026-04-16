'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
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
    // Fetch collection stats
    const fetchStats = async () => {
      try {
        // Add cache: 'no-store' to always fetch fresh data
        const response = await fetch('/api/inventory', {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          // Check if response has success and data structure from API
          const items = data.success ? data.data : (Array.isArray(data) ? data : []);

          if (Array.isArray(items)) {
            const totalValue = items.reduce((sum: number, item: any) => {
              const price = item.pricing?.suggestedPrice || item.suggestedPrice || 0;
              const qty = item.quantity || 1;
              return sum + (price * qty);
            }, 0);

            const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

            setStats({
              totalItems: totalItems,
              totalValue: totalValue,
              memberSince: session?.user?.email ? 'Recently' : ''
            });
          } else {
            setStats({
              totalItems: 0,
              totalValue: 0,
              memberSince: session?.user?.email ? 'Recently' : ''
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
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
        showMessage('error', data.error || 'Failed to update name');
      } else {
        showMessage('success', 'Name updated successfully');
        router.refresh();
      }
    } catch (error) {
      showMessage('error', 'An error occurred. Please try again.');
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
        showMessage('error', data.error || 'Failed to update avatar');
        setLoading(false);
        return;
      }

      // Update local state immediately for visual feedback
      setSelectedAvatar(avatar);
      setShowAvatarPicker(false);

      // Update session without signing out (like Google/Apple)
      await update({ image: avatar });
      router.refresh(); // Refresh server components to show new avatar in header

      showMessage('success', 'Avatar updated!');
      setLoading(false);

    } catch (error) {
      console.error('Avatar update error:', error);
      showMessage('error', 'Failed to update avatar');
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters');
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
        showMessage('error', data.error || 'Failed to change password');
      } else {
        showMessage('success', 'Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      showMessage('error', 'An error occurred. Please try again.');
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

      showMessage('success', 'Collection data exported successfully');
    } catch (error) {
      showMessage('error', 'Failed to export collection data');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your collection data.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'This is your last chance. Are you absolutely sure you want to delete your account and all data?'
    );

    if (!doubleConfirm) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        showMessage('error', 'Failed to delete account');
        setLoading(false);
        return;
      }

      window.location.href = '/auth/signin';
    } catch (error) {
      showMessage('error', 'An error occurred. Please try again.');
      setLoading(false);
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
          Back to Collection
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
            Account Settings
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#525252',
            lineHeight: '1.6'
          }}>
            Manage your profile, security, and data preferences
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
              Total Items
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
              Collection Value
            </p>
            <p style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1'
            }}>
              ${stats.totalValue.toFixed(2)}
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
              Member Since
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
            Profile Information
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
                {showAvatarPicker ? 'Cancel' : 'Change Avatar'}
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
                  Full Name
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
                    placeholder="Enter your full name"
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
                    {loading ? 'Saving...' : 'Save'}
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
                  Email Address
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
                  Email cannot be changed for security reasons
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
            Security
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
                  Current Password
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
                    placeholder="Enter current password"
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
                  New Password
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
                    placeholder="Enter new password"
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
                  Confirm New Password
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
                    placeholder="Confirm new password"
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
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
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
            Data Management
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
                  Export Collection Data
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  lineHeight: '1.6'
                }}>
                  Download your entire collection as a JSON file
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
                Export Data
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
                  Delete Account
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  lineHeight: '1.6'
                }}>
                  Permanently delete your account and all associated data
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
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
