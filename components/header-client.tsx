'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

interface HeaderClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function HeaderClient({ user }: HeaderClientProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
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

  const avatarMap: Record<string, string> = {
    'astronaut-female': '/avatars/astronaut-female.png',
    'ninja-purple': '/avatars/ninja-purple.png',
    'wizard-female': '/avatars/wizard-female.png',
    'pirate': '/avatars/pirate.png',
    'vampire': '/avatars/vampire.png',
    'robot': '/avatars/robot.png',
    'chef': '/avatars/chef.png',
    'astronaut-male': '/avatars/astronaut-male.png',
    'ninja-black': '/avatars/ninja-black.png',
    'nerd-female': '/avatars/nerd-female.png',
    'wizard-male': '/avatars/wizard-male.png',
    'punk': '/avatars/punk.png',
    'cowgirl': '/avatars/cowgirl.png',
    'cowboy': '/avatars/cowboy.png',
    'cool-guy': '/avatars/cool-guy.png',
    'nerd-male': '/avatars/nerd-male.png',
  };

  const renderAvatar = (avatarId: string | null | undefined, size: number = 36) => {
    if (!avatarId || avatarId === 'initials') {
      return (
        <div style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: `${size * 0.4}px`,
          fontWeight: '600',
          border: '2px solid #e5e5e5',
          transition: 'border-color 0.2s'
        }}>
          {getInitials(user?.name, user?.email)}
        </div>
      );
    }

    const imageUrl = avatarMap[avatarId];

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
        border: '2px solid #e5e5e5',
        transition: 'border-color 0.2s',
        position: 'relative'
      }}>
        <Image
          src={imageUrl}
          alt="Avatar"
          width={size}
          height={size * 2}
          style={{
            width: 'auto',
            height: '200%',
            position: 'absolute',
            left: '50%',
            top: '-10%',
            transform: 'translateX(-50%)',
            objectFit: 'contain'
          }}
          unoptimized
        />
      </div>
    );
  };

  const handleSignOut = async () => {
    await signOut({ redirectTo: '/auth/signin' });
  };

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
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', height: '36px' }}>
              <div style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: '#171717',
                letterSpacing: '-0.01em',
                transition: 'color 0.2s',
                lineHeight: '1'
              }}>
                FigTracker
              </div>
            </Link>

            <div className="desktop-nav" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              <Link
                href="/themes"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: pathname === '/themes' ? '600' : '500',
                  color: pathname === '/themes' ? '#171717' : '#525252',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  height: '36px',
                  borderBottom: pathname === '/themes' ? '2px solid #3b82f6' : 'none',
                  paddingBottom: '2px'
                }}
              >
                Themes
              </Link>

              <Link
                href="/inventory"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: pathname === '/inventory' ? '600' : '500',
                  color: pathname === '/inventory' ? '#171717' : '#525252',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  height: '36px',
                  borderBottom: pathname === '/inventory' ? '2px solid #3b82f6' : 'none',
                  paddingBottom: '2px'
                }}
              >
                Your Inventory
              </Link>

              <Link
                href="/collection"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: pathname === '/collection' ? '600' : '500',
                  color: pathname === '/collection' ? '#171717' : '#525252',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  height: '36px',
                  borderBottom: pathname === '/collection' ? '2px solid #3b82f6' : 'none',
                  paddingBottom: '2px'
                }}
              >
                Your Collection
              </Link>

              <Link
                href="/about"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: pathname === '/about' ? '600' : '500',
                  color: pathname === '/about' ? '#171717' : '#525252',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  height: '36px',
                  borderBottom: pathname === '/about' ? '2px solid #3b82f6' : 'none',
                  paddingBottom: '2px'
                }}
              >
                About
              </Link>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Link
                  href="/auth/signin"
                  style={{
                    padding: '10px 20px',
                    fontSize: 'var(--text-sm)',
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
                    fontSize: 'var(--text-sm)',
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

        {mobileMenuOpen && (
          <nav ref={mobileMenuRef} style={{
            background: '#fff',
            padding: '20px',
            paddingBottom: '40px'
          }}>
            <Link href="/themes" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'block',
              padding: '15px 0',
              borderBottom: '1px solid #f5f5f5',
              color: '#171717',
              textDecoration: 'none',
              fontSize: 'var(--text-base)'
            }}>
              Themes
            </Link>
            <Link href="/inventory" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'block',
              padding: '15px 0',
              borderBottom: '1px solid #f5f5f5',
              color: '#171717',
              textDecoration: 'none',
              fontSize: 'var(--text-base)'
            }}>
              Your Inventory
            </Link>
            <Link href="/collection" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'block',
              padding: '15px 0',
              borderBottom: '1px solid #f5f5f5',
              color: '#171717',
              textDecoration: 'none',
              fontSize: 'var(--text-base)'
            }}>
              Your Collection
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'block',
              padding: '15px 0',
              borderBottom: '1px solid #f5f5f5',
              color: '#171717',
              textDecoration: 'none',
              fontSize: 'var(--text-base)'
            }}>
              About
            </Link>
            <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'block',
              padding: '15px 0',
              borderBottom: '1px solid #f5f5f5',
              color: '#171717',
              textDecoration: 'none',
              fontSize: 'var(--text-base)'
            }}>
              Sign In
            </Link>
            <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'block',
              marginTop: '20px',
              padding: '15px',
              background: '#3b82f6',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: '600'
            }}>
              Sign Up
            </Link>
          </nav>
        )}
      </header>
    );
  }

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
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', height: '36px' }}>
            <div style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              letterSpacing: '-0.01em',
              transition: 'color 0.2s',
              lineHeight: '1'
            }}>
              FigTracker
            </div>
          </Link>

          <div className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            <Link
              href="/search"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: pathname === '/search' ? '600' : '500',
                color: pathname === '/search' ? '#171717' : '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                height: '36px',
                borderBottom: pathname === '/search' ? '2px solid #3b82f6' : 'none',
                paddingBottom: '2px'
              }}
            >
              Search
            </Link>

            <Link
              href="/themes"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: pathname === '/themes' ? '600' : '500',
                color: pathname === '/themes' ? '#171717' : '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                height: '36px',
                borderBottom: pathname === '/themes' ? '2px solid #3b82f6' : 'none',
                paddingBottom: '2px'
              }}
            >
              Themes
            </Link>

            <Link
              href="/inventory"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: pathname === '/inventory' ? '600' : '500',
                color: pathname === '/inventory' ? '#171717' : '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                height: '36px',
                borderBottom: pathname === '/inventory' ? '2px solid #3b82f6' : 'none',
                paddingBottom: '2px'
              }}
            >
              Your Inventory
            </Link>

            <Link
              href="/collection"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: pathname === '/collection' ? '600' : '500',
                color: pathname === '/collection' ? '#171717' : '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                height: '36px',
                borderBottom: pathname === '/collection' ? '2px solid #3b82f6' : 'none',
                paddingBottom: '2px'
              }}
            >
              Your Collection
            </Link>

            <Link
              href="/about"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: pathname === '/about' ? '600' : '500',
                color: pathname === '/about' ? '#171717' : '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                height: '36px',
                borderBottom: pathname === '/about' ? '2px solid #3b82f6' : 'none',
                paddingBottom: '2px'
              }}
            >
              About
            </Link>

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
                {renderAvatar(user.image, 36)}
              </button>

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
                  <div style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e5e5',
                    marginBottom: '8px'
                  }}>
                    <p style={{
                      fontSize: 'var(--text-sm)',
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
                      fontSize: 'var(--text-xs)',
                      color: '#737373',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/account"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      fontSize: 'var(--text-sm)',
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

                  <button
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      fontSize: 'var(--text-sm)',
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

      {mobileMenuOpen && (
        <nav ref={mobileMenuRef} style={{
          background: '#fff',
          padding: '20px',
          paddingBottom: '40px'
        }}>
          <Link href="/search" onClick={() => setMobileMenuOpen(false)} style={{
            display: 'block',
            padding: '15px 0',
            borderBottom: '1px solid #f5f5f5',
            color: '#171717',
            textDecoration: 'none',
            fontSize: 'var(--text-base)'
          }}>
            Search
          </Link>
          <Link href="/themes" onClick={() => setMobileMenuOpen(false)} style={{
            display: 'block',
            padding: '15px 0',
            borderBottom: '1px solid #f5f5f5',
            color: '#171717',
            textDecoration: 'none',
            fontSize: 'var(--text-base)'
          }}>
            Themes
          </Link>
          <Link href="/inventory" onClick={() => setMobileMenuOpen(false)} style={{
            display: 'block',
            padding: '15px 0',
            borderBottom: '1px solid #f5f5f5',
            color: '#171717',
            textDecoration: 'none',
            fontSize: 'var(--text-base)'
          }}>
            Your Inventory
          </Link>
          <Link href="/collection" onClick={() => setMobileMenuOpen(false)} style={{
            display: 'block',
            padding: '15px 0',
            borderBottom: '1px solid #f5f5f5',
            color: '#171717',
            textDecoration: 'none',
            fontSize: 'var(--text-base)'
          }}>
            Your Collection
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{
            display: 'block',
            padding: '15px 0',
            borderBottom: '1px solid #f5f5f5',
            color: '#171717',
            textDecoration: 'none',
            fontSize: 'var(--text-base)'
          }}>
            About
          </Link>
          <Link href="/account" onClick={() => setMobileMenuOpen(false)} style={{
            display: 'block',
            padding: '15px 0',
            borderBottom: '1px solid #f5f5f5',
            color: '#171717',
            textDecoration: 'none',
            fontSize: 'var(--text-base)'
          }}>
            Account Settings
          </Link>
          <button onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} style={{
            display: 'block',
            width: '100%',
            marginTop: '20px',
            padding: '15px',
            background: '#dc2626',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '8px',
            border: 'none',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Sign Out
          </button>
        </nav>
      )}
    </header>
  );
}
