'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';

interface HeaderClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function HeaderClient({ user }: HeaderClientProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      // Don't close mobile menu if clicking the button itself
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const names = name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleSignOut = async () => {
    await signOut({ redirectTo: '/auth/signin' });
  };

  // If not logged in, show Sign In / Sign Up
  if (!user) {
    return (
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10000,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px'
          }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#171717',
                letterSpacing: '-0.01em',
                transition: 'color 0.2s'
              }}>
                FigTracker
              </div>
            </Link>

            {/* Desktop Navigation + Auth */}
            <div className="desktop-nav" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              {/* About Link */}
              <Link
                href="/about"
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#525252',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  height: '36px'
                }}
              >
                About
              </Link>

              {/* Auth Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Link
                  href="/auth/signin"
                  style={{
                    padding: '10px 20px',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#525252',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  style={{
                    padding: '10px 20px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: '#3b82f6',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              ref={mobileMenuButtonRef}
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: '#171717'
              }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="mobile-menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderBottom: '1px solid #e5e5e5',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '24px 32px',
              animation: 'slideDown 0.2s ease-out'
            }}
          >
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#171717',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid #f5f5f5'
                }}
              >
                About
              </Link>
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#171717',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid #f5f5f5'
                }}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'inline-block',
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: '#3b82f6',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                Sign Up
              </Link>
            </nav>
          </div>
        )}
      </header>
    );
  }

  // Logged in view
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 10000,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e5e5e5'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#171717',
              letterSpacing: '-0.01em',
              transition: 'color 0.2s'
            }}>
              FigTracker
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            {/* Search Link */}
            <Link
              href="/search"
              style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                height: '36px'
              }}
            >
              Search
            </Link>

            {/* My Inventory Link */}
            <Link
              href="/collection"
              style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                height: '36px'
              }}
            >
              My Inventory
            </Link>

            {/* About Link */}
            <Link
              href="/about"
              style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                height: '36px'
              }}
            >
              About
            </Link>

            {/* User Avatar Dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  outline: 'none'
                }}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #e5e5e5',
                      transition: 'border-color 0.2s'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '2px solid #e5e5e5',
                    transition: 'border-color 0.2s'
                  }}>
                    {getInitials(user.name, user.email)}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 12px)',
                  minWidth: '220px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e5e5',
                  padding: '8px',
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  {/* User Info */}
                  <div style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e5e5',
                    marginBottom: '8px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#171717',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.name || 'User'}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: '#737373',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/account"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#171717',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'background-color 0.15s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg style={{ width: '16px', height: '16px', color: '#737373' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                  </Link>

                  <div style={{
                    height: '1px',
                    background: '#e5e5e5',
                    margin: '8px 0'
                  }} />

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#dc2626',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      textAlign: 'left',
                      transition: 'background-color 0.15s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            ref={mobileMenuButtonRef}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: '#171717'
            }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderBottom: '1px solid #e5e5e5',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '24px 32px',
            animation: 'slideDown 0.2s ease-out',
            zIndex: 9999
          }}
        >
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#171717',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #f5f5f5'
              }}
            >
              Search
            </Link>
            <Link
              href="/collection"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#171717',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #f5f5f5'
              }}
            >
              My Inventory
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#171717',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #f5f5f5'
              }}
            >
              About
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#171717',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #f5f5f5'
              }}
            >
              Account Settings
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignOut();
              }}
              style={{
                display: 'inline-block',
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: '#dc2626',
                borderRadius: '8px',
                textAlign: 'center',
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
