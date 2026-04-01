'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile states
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Collection stats
  const [stats, setStats] = useState({ totalItems: 0, totalValue: 0, memberSince: '' });

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    // Fetch collection stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/collection');
        if (response.ok) {
          const data = await response.json();
          const totalValue = data.reduce((sum: number, item: any) =>
            sum + (item.suggestedPrice || 0), 0
          );
          setStats({
            totalItems: data.length,
            totalValue: totalValue,
            memberSince: session?.user?.email ? 'Recently' : ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (session?.user) {
      fetchStats();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage('error', data.error || 'Failed to upload avatar');
      } else {
        showMessage('success', 'Profile picture updated successfully');
        setSelectedFile(null);
        setPreview(null);
        router.refresh();
      }
    } catch (error) {
      showMessage('error', 'An error occurred. Please try again.');
    } finally {
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
      const response = await fetch('/api/collection');
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
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <div className="account-page-wrapper" style={{
        maxWidth: '768px',
        margin: '0 auto',
        padding: '80px 32px 128px'
      }}>
        {/* Back Link */}
        <Link
          href="/collection"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '15px',
            color: '#737373',
            textDecoration: 'none',
            gap: '8px',
            marginBottom: '64px',
            transition: 'color 0.2s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 12L6 8l4-4" />
          </svg>
          Back to Collection
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '80px' }}>
          <h1 style={{
            fontSize: '40px',
            fontWeight: '700',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            color: '#171717',
            marginBottom: '16px'
          }}>
            Account Settings
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#525252',
            lineHeight: '1.6'
          }}>
            Manage your profile, security, and data preferences
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div style={{
            marginBottom: '80px',
            padding: '24px',
            borderRadius: '12px',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            border: '1px solid',
            borderColor: message.type === 'success' ? '#86efac' : '#fca5a5'
          }}>
            <p style={{
              fontSize: '15px',
              fontWeight: '500',
              color: message.type === 'success' ? '#166534' : '#991b1b'
            }}>
              {message.text}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          marginBottom: '80px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#737373',
              marginBottom: '12px',
              letterSpacing: '0.01em'
            }}>
              Total Items
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1'
            }}>
              {stats.totalItems}
            </p>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#737373',
              marginBottom: '12px',
              letterSpacing: '0.01em'
            }}>
              Collection Value
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1'
            }}>
              ${stats.totalValue.toFixed(2)}
            </p>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#737373',
              marginBottom: '12px',
              letterSpacing: '0.01em'
            }}>
              Member Since
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1'
            }}>
              2026
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '64px',
          marginBottom: '80px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '48px',
            letterSpacing: '-0.01em'
          }}>
            Profile Information
          </h2>

          <div style={{ display: 'flex', gap: '64px' }}>
            {/* Avatar Upload */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '24px' }}>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: '120px',
                      height: '120px',
                      border: '4px solid #f3f4f6',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    style={{
                      width: '120px',
                      height: '120px',
                      border: '4px solid #f3f4f6',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: '600',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getInitials(session.user.name)}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              {selectedFile ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                    style={{
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#525252',
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAvatarUpload}
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
                      outline: 'none'
                    }}
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#525252',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                >
                  Change Picture
                </button>
              )}
            </div>

            {/* Name and Email */}
            <div style={{ flex: 1 }}>
              <form onSubmit={handleNameUpdate} style={{ marginBottom: '48px' }}>
                <label htmlFor="name" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  Full Name
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      padding: '16px 20px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e5e5',
                      color: '#171717',
                      background: 'white',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
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
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      background: (loading || name === session.user.name) ? '#a3a3a3' : '#3b82f6',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      cursor: (loading || name === session.user.name) ? 'not-allowed' : 'pointer',
                      opacity: (loading || name === session.user.name) ? 0.5 : 1,
                      transition: 'all 0.2s',
                      outline: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  Email Address
                </label>
                <div style={{
                  padding: '16px 20px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  background: '#f5f5f5',
                  color: '#737373'
                }}>
                  {session.user.email}
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#a3a3a3',
                  marginTop: '12px',
                  lineHeight: '1.5'
                }}>
                  Email cannot be changed for security reasons
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '64px',
          marginBottom: '80px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '48px',
            letterSpacing: '-0.01em'
          }}>
            Security
          </h2>

          <form onSubmit={handlePasswordChange}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div>
                <label htmlFor="currentPassword" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                    color: '#171717',
                    background: 'white',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label htmlFor="newPassword" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                    color: '#171717',
                    background: 'white',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                    color: '#171717',
                    background: 'white',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: (loading || !currentPassword || !newPassword || !confirmPassword) ? '#a3a3a3' : '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                cursor: (loading || !currentPassword || !newPassword || !confirmPassword) ? 'not-allowed' : 'pointer',
                opacity: (loading || !currentPassword || !newPassword || !confirmPassword) ? 0.5 : 1,
                transition: 'all 0.2s',
                outline: 'none'
              }}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Data Management Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '64px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '48px',
            letterSpacing: '-0.01em'
          }}>
            Data Management
          </h2>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '40px',
              borderBottom: '1px solid #e5e5e5',
              marginBottom: '40px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '8px'
                }}>
                  Export Collection Data
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#737373',
                  lineHeight: '1.6'
                }}>
                  Download your entire collection as a JSON file
                </p>
              </div>
              <button
                onClick={handleExportData}
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#525252',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
              >
                Export Data
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#dc2626',
                  marginBottom: '8px'
                }}>
                  Delete Account
                </h3>
                <p style={{
                  fontSize: '15px',
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
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#dc2626',
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s',
                  outline: 'none'
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
