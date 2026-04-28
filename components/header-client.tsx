'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { UserIcon, CubeIcon, StarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from './TranslationProvider';

interface HeaderClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function HeaderClient({ user }: HeaderClientProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);
  const [legoDropdownOpen, setLegoDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileBrowseOpen, setMobileBrowseOpen] = useState(false);
  const [mobileLegoOpen, setMobileLegoOpen] = useState(false);
  const [highlightWishlist, setHighlightWishlist] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const browseDropdownRef = useRef<HTMLDivElement>(null);
  const legoDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (browseDropdownRef.current && !browseDropdownRef.current.contains(event.target as Node)) {
        setBrowseDropdownOpen(false);
      }
      if (legoDropdownRef.current && !legoDropdownRef.current.contains(event.target as Node)) {
        setLegoDropdownOpen(false);
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

  // Listen for wishlist added event
  useEffect(() => {
    const handleWishlistAdded = () => {
      setDropdownOpen(true);
      setHighlightWishlist(true);
      setTimeout(() => setHighlightWishlist(false), 2000);
    };

    window.addEventListener('wishlistAdded', handleWishlistAdded);
    return () => window.removeEventListener('wishlistAdded', handleWishlistAdded);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
        setMobileBrowseOpen(false);
        setMobileLegoOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

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
                {t('navigation.search')}
              </Link>

              {/* Browse Dropdown */}
              <div style={{ position: 'relative' }} ref={browseDropdownRef}>
                <button
                  onClick={() => setBrowseDropdownOpen(!browseDropdownOpen)}
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: '#525252',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '36px',
                    padding: 0
                  }}
                >
                  {t('navigation.browse')}
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {browseDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '12px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e5e5',
                    minWidth: '220px',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    <Link href="/themes" onClick={() => setBrowseDropdownOpen(false)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      <UserIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                      <span>{t('navigation.themes.minifigures')}</span>
                    </Link>
                    <Link href="/sets-themes" onClick={() => setBrowseDropdownOpen(false)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      <CubeIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                      <span>{t('navigation.themes.sets')}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Your LEGO Dropdown for logged-out users */}
              <div style={{ position: 'relative' }} ref={legoDropdownRef}>
                <button
                  onClick={() => setLegoDropdownOpen(!legoDropdownOpen)}
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: '#525252',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '36px',
                    padding: 0
                  }}
                >
                  {t('navigation.yourLego')}
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {legoDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '12px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e5e5',
                    minWidth: '240px',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    {/* Minifigures Section */}
                    <div style={{ padding: '12px 20px 8px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Minifigures
                    </div>
                    <Link href="/auth/signin?callbackUrl=/inventory" onClick={() => setLegoDropdownOpen(false)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      <CurrencyDollarIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                      <span>Minifigures for Sale</span>
                    </Link>
                    <Link href="/auth/signin?callbackUrl=/collection" onClick={() => setLegoDropdownOpen(false)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      <StarIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                      <span>Minifigures to Keep</span>
                    </Link>

                    {/* Sets Section */}
                    <div style={{ padding: '12px 20px 8px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Sets
                    </div>
                    <Link href="/auth/signin?callbackUrl=/sets-inventory" onClick={() => setLegoDropdownOpen(false)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      <CurrencyDollarIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                      <span>Sets for Sale</span>
                    </Link>
                    <Link href="/auth/signin?callbackUrl=/sets-collection" onClick={() => setLegoDropdownOpen(false)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      <StarIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                      <span>Sets to Keep</span>
                    </Link>
                  </div>
                )}
              </div>

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
                {t('navigation.about')}
              </Link>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <LanguageSwitcher />
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
                  {t('navigation.signIn')}
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
                  {t('navigation.signUp')}
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
              <svg style={{ width: 'var(--icon-lg)', height: 'var(--icon-lg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav ref={mobileMenuRef} style={{
            background: '#fff',
            padding: '16px 16px 32px',
            borderTop: '1px solid #f5f5f5'
          }}>
            <Link href="/search" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #f5f5f5',
              color: '#171717',
              textDecoration: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              minHeight: '44px'
            }}>
              Search
            </Link>

            {/* Browse Dropdown */}
            <div style={{ borderBottom: '1px solid #f5f5f5' }}>
              <button
                onClick={() => setMobileBrowseOpen(!mobileBrowseOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  color: '#171717',
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '44px'
                }}
              >
                <span>Themes</span>
                <svg
                  style={{
                    width: '20px',
                    height: '20px',
                    transition: 'transform 0.2s',
                    transform: mobileBrowseOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    flexShrink: 0
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileBrowseOpen && (
                <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
                  <Link href="/themes" onClick={() => setMobileMenuOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    color: '#525252',
                    textDecoration: 'none',
                    fontSize: 'var(--text-base)',
                    minHeight: '44px'
                  }}>
                    <UserIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    <span>Minifigure Themes</span>
                  </Link>
                  <Link href="/sets-themes" onClick={() => setMobileMenuOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    color: '#525252',
                    textDecoration: 'none',
                    fontSize: 'var(--text-base)',
                    minHeight: '44px'
                  }}>
                    <CubeIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    <span>Set Themes</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Your LEGO Dropdown for mobile logged-out users */}
            <div style={{ borderBottom: '1px solid #f5f5f5' }}>
              <button
                onClick={() => setMobileLegoOpen(!mobileLegoOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  color: '#171717',
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '44px'
                }}
              >
                <span>Your LEGO</span>
                <svg
                  style={{
                    width: '20px',
                    height: '20px',
                    transition: 'transform 0.2s',
                    transform: mobileLegoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    flexShrink: 0
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileLegoOpen && (
                <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
                  <div style={{ padding: '8px 0 4px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Minifigures
                  </div>
                  <Link href="/auth/signin?callbackUrl=/inventory" onClick={() => setMobileMenuOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    color: '#525252',
                    textDecoration: 'none',
                    fontSize: 'var(--text-base)',
                    minHeight: '44px'
                  }}>
                    <CurrencyDollarIcon style={{ width: '20px', height: '20px', flexShrink: 0, color: '#737373' }} />
                    <span>Minifigures for Sale</span>
                  </Link>
                  <Link href="/auth/signin?callbackUrl=/collection" onClick={() => setMobileMenuOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    color: '#525252',
                    textDecoration: 'none',
                    fontSize: 'var(--text-base)',
                    minHeight: '44px'
                  }}>
                    <StarIcon style={{ width: '20px', height: '20px', flexShrink: 0, color: '#737373' }} />
                    <span>Minifigures to Keep</span>
                  </Link>

                  <div style={{ padding: '12px 0 4px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Sets
                  </div>
                  <Link href="/auth/signin?callbackUrl=/sets-inventory" onClick={() => setMobileMenuOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    color: '#525252',
                    textDecoration: 'none',
                    fontSize: 'var(--text-base)',
                    minHeight: '44px'
                  }}>
                    <CurrencyDollarIcon style={{ width: '20px', height: '20px', flexShrink: 0, color: '#737373' }} />
                    <span>Sets for Sale</span>
                  </Link>
                  <Link href="/auth/signin?callbackUrl=/sets-collection" onClick={() => setMobileMenuOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    color: '#525252',
                    textDecoration: 'none',
                    fontSize: 'var(--text-base)',
                    minHeight: '44px'
                  }}>
                    <StarIcon style={{ width: '20px', height: '20px', flexShrink: 0, color: '#737373' }} />
                    <span>Sets to Keep</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Other Links */}
            <div style={{
              marginTop: '32px'
            }}>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '1px solid #f5f5f5',
                color: '#171717',
                textDecoration: 'none',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                minHeight: '44px'
              }}>
                {t('navigation.about')}
              </Link>
              <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '1px solid #f5f5f5',
                color: '#171717',
                textDecoration: 'none',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                minHeight: '44px'
              }}>
                {t('navigation.signIn')}
              </Link>
            </div>
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

            {/* Browse Dropdown */}
            <div style={{ position: 'relative' }} ref={browseDropdownRef}>
              <button
                onClick={() => setBrowseDropdownOpen(!browseDropdownOpen)}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: '#525252',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '36px',
                  padding: 0
                }}
              >
                Browse
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {browseDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '12px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e5e5',
                  minWidth: '220px',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  <Link href="/themes" onClick={() => setBrowseDropdownOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    color: '#171717',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    borderBottom: '1px solid #f5f5f5',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <UserIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                    <span>Minifigure Themes</span>
                  </Link>
                  <Link href="/sets-themes" onClick={() => setBrowseDropdownOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    color: '#171717',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <CubeIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                    <span>Set Themes</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Your LEGO Dropdown */}
            <div style={{ position: 'relative' }} ref={legoDropdownRef}>
              <button
                onClick={() => setLegoDropdownOpen(!legoDropdownOpen)}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: '#525252',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '36px',
                  padding: 0
                }}
              >
                Your LEGO
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {legoDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '12px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e5e5',
                  minWidth: '240px',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  {/* Minifigures Section */}
                  <div style={{ padding: '12px 20px 8px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Minifigures
                  </div>
                  <Link href="/inventory" onClick={() => setLegoDropdownOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    color: '#171717',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    borderBottom: '1px solid #f5f5f5',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <CurrencyDollarIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                    <span>Minifigures for Sale</span>
                  </Link>
                  <Link href="/collection" onClick={() => setLegoDropdownOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    color: '#171717',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    borderBottom: '1px solid #f5f5f5',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <StarIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                    <span>Minifigures to Keep</span>
                  </Link>

                  {/* Sets Section */}
                  <div style={{ padding: '12px 20px 8px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Sets
                  </div>
                  <Link href="/sets-inventory" onClick={() => setLegoDropdownOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    color: '#171717',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    borderBottom: '1px solid #f5f5f5',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <CurrencyDollarIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                    <span>Sets for Sale</span>
                  </Link>
                  <Link href="/sets-collection" onClick={() => setLegoDropdownOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    color: '#171717',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <StarIcon style={{ width: '20px', height: '20px', color: '#525252' }} />
                    <span>Sets to Keep</span>
                  </Link>
                </div>
              )}
            </div>

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

            <LanguageSwitcher />

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
                    <svg style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', color: '#737373' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => {
                      setDropdownOpen(false);
                      setHighlightWishlist(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      color: highlightWishlist ? '#ffffff' : '#171717',
                      background: highlightWishlist ? '#171717' : 'transparent',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!highlightWishlist) {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!highlightWishlist) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <svg style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', color: highlightWishlist ? '#ffffff' : '#737373', transition: 'color 0.3s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Wishlist
                  </Link>

                  {user.email === 'erickkosysu@gmail.com' && (
                    <Link
                      href="/admin/stats"
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
                      <svg style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', color: '#737373' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}

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
                    <svg style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
            <svg style={{ width: 'var(--icon-lg)', height: 'var(--icon-lg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav ref={mobileMenuRef} style={{
          background: '#fff',
          padding: '16px 16px 32px',
          borderTop: '1px solid #f5f5f5'
        }}>
          <Link href="/search" onClick={() => setMobileMenuOpen(false)} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #f5f5f5',
            color: '#171717',
            textDecoration: 'none',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            minHeight: '44px'
          }}>
            Search
          </Link>

          {/* Browse Dropdown */}
          <div style={{ borderBottom: '1px solid #f5f5f5' }}>
            <button
              onClick={() => {
                setMobileBrowseOpen(!mobileBrowseOpen);
                if (!mobileBrowseOpen) setMobileLegoOpen(false); // Close other dropdown
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                background: 'none',
                border: 'none',
                color: '#171717',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: '44px'
              }}
            >
              <span>Themes</span>
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                  transition: 'transform 0.2s',
                  transform: mobileBrowseOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  flexShrink: 0
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileBrowseOpen && (
              <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
                <Link href="/themes" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-base)',
                  minHeight: '44px'
                }}>
                  <UserIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <span>Minifigure Themes</span>
                </Link>
                <Link href="/sets-themes" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-base)',
                  minHeight: '44px'
                }}>
                  <CubeIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <span>Set Themes</span>
                </Link>
              </div>
            )}
          </div>

          {/* About Link */}
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #f5f5f5',
            color: '#171717',
            textDecoration: 'none',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            minHeight: '44px'
          }}>
            About
          </Link>

          {/* Your LEGO Dropdown */}
          <div style={{ borderBottom: '1px solid #f5f5f5' }}>
            <button
              onClick={() => {
                setMobileLegoOpen(!mobileLegoOpen);
                if (!mobileLegoOpen) setMobileBrowseOpen(false); // Close other dropdown
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                background: 'none',
                border: 'none',
                color: '#171717',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: '44px'
              }}
            >
              <span>Your LEGO</span>
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                  transition: 'transform 0.2s',
                  transform: mobileLegoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  flexShrink: 0
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileLegoOpen && (
              <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '600',
                  color: '#a3a3a3',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 0 4px',
                  marginTop: '4px'
                }}>
                  Minifigures
                </div>
                <Link href="/inventory" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-base)',
                  minHeight: '44px'
                }}>
                  <CurrencyDollarIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <span>For Sale</span>
                </Link>
                <Link href="/collection" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-base)',
                  minHeight: '44px'
                }}>
                  <StarIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <span>To Keep</span>
                </Link>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '600',
                  color: '#a3a3a3',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 0 4px',
                  marginTop: '16px'
                }}>
                  Sets
                </div>
                <Link href="/sets-inventory" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-base)',
                  minHeight: '44px'
                }}>
                  <CurrencyDollarIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <span>For Sale</span>
                </Link>
                <Link href="/sets-collection" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-base)',
                  minHeight: '44px'
                }}>
                  <StarIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <span>To Keep</span>
                </Link>
              </div>
            )}
          </div>

          {/* Account & Personal Links */}
          <div style={{
            marginTop: '32px'
          }}>
            <Link href="/account" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 0',
              borderBottom: '1px solid #f5f5f5',
              color: '#171717',
              textDecoration: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              minHeight: '44px'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#737373', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Settings
            </Link>
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 0',
              borderBottom: '1px solid #f5f5f5',
              color: '#171717',
              textDecoration: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              minHeight: '44px'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#737373', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </Link>
            {user?.email === 'erickkosysu@gmail.com' && (
              <Link href="/admin/stats" onClick={() => setMobileMenuOpen(false)} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 0',
                borderBottom: '1px solid #f5f5f5',
                color: '#171717',
                textDecoration: 'none',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                minHeight: '44px'
              }}>
                <svg style={{ width: '20px', height: '20px', color: '#737373', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Admin Dashboard
              </Link>
            )}
          </div>
          <button onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            marginTop: '20px',
            padding: '15px',
            background: '#dc2626',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </nav>
      )}
    </header>
  );
}
