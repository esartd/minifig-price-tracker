'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { UserIcon, CubeIcon, StarIcon, CurrencyDollarIcon, UsersIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderSearch from './HeaderSearch';
import { useTranslation } from './TranslationProvider';

/** Narrowest the header search box is allowed to get before the header
 *  collapses. Mirrored by minWidth on .header-search-slot. */
const MIN_SEARCH_WIDTH = 240;
/** The two 24px flex gaps in header row 1. */
const ROW_ONE_GAPS = 48;

/**
 * The nav row, in priority order.
 *
 * The list is short on purpose. An eleven-item flat row was tried first, on
 * the theory that Amazon and Walmart carry about that many -- but they carry
 * eleven department-scale categories, and this site has roughly six things
 * that genuinely deserve the top level. Padding the row out to match only
 * diluted them, so the occasional-use tools moved into TOOLS_NAV below.
 *
 * Listings is not here either, and for a different reason: /listing-generator
 * is an SEO landing page, not the tool. The real generator is
 * listing-generator-form.tsx and it lives on each minifigure and set page,
 * because it needs to know which item you are selling. A nav entry labelled
 * "Listings" promised a tool and delivered a brochure, so it sits under
 * Resources with the other explainers.
 *
 * Whatnot in particular is deliberately NOT top-level. See the affiliate note
 * in CLAUDE.md: it is unproven next to eBay and should not displace anything
 * until there is real revenue to compare. Top-level nav is exactly the kind of
 * promotion that note rules out, and it points off-site from the most valuable
 * real estate on the page.
 *
 * The labels stay terse because checkNavigationFit collapses the entire header
 * to a hamburger when this row will not fit, so the longest locale sets the
 * breakpoint for everyone. Measured at 1024px, Polish and French are the
 * binding cases -- not English, and not German as you would expect. Measure
 * those two before adding an entry or a longer word.
 */
const PLAIN_NAV: Array<{ href: string; key: string; fallback: string }> = [
  { href: '/themes',            key: 'navPrimary.minifigures', fallback: 'Minifigures' },
  { href: '/sets-themes',       key: 'navPrimary.sets',        fallback: 'Sets' },
  { href: '/retiring-soon',     key: 'navPrimary.retiring',    fallback: 'Retiring Soon' },
  { href: '/collectors',        key: 'navPrimary.community',   fallback: 'Community' },
];

/** Real tools, but occasional-use -- they earn a menu, not a headline slot. */
const TOOLS_NAV: Array<{ href: string; key: string; fallback: string }> = [
  { href: '/identify',    key: 'navPrimary.identify', fallback: 'Identify' },
  { href: '/export',      key: 'navPrimary.export',   fallback: 'Export' },
  { href: '/marketplace', key: 'navPrimary.whatnot',  fallback: 'Whatnot' },
];

/**
 * Where the "Your LEGO" menu sits, by sign-in state.
 *
 * A returning signed-in user comes back for their own collection, so it leads.
 * A first-time visitor arriving from a search engine has no collection at all,
 * and leading with an empty room says nothing about what this site does -- so
 * for them the catalog comes first and Your LEGO follows it as an invitation.
 * Costing nothing, because the two header trees below are already separate.
 */
const YOUR_LEGO_INDEX = { signedIn: 0, signedOut: 2 } as const;

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
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileBrowseOpen, setMobileBrowseOpen] = useState(false);
  const [mobileLegoOpen, setMobileLegoOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileLanguageOpen, setMobileLanguageOpen] = useState(false);
  const [highlightWishlist, setHighlightWishlist] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const browseDropdownRef = useRef<HTMLDivElement>(null);
  const legoDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [useMobileLayout, setUseMobileLayout] = useState(false);
  const navIntrinsicWidth = useRef(0);
  const authIntrinsicWidth = useRef(0);
  /**
   * The search text lives here, not inside HeaderSearch, for two reasons: the
   * desktop slot and the mobile row are two separate instances (one is always
   * display:none) and must agree, and if useMobileLayout flips mid-typing the
   * surviving instance keeps what was typed. One useState serves both header
   * trees below -- they are two returns from this same function.
   */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Keep the box showing a term only while the page is actually about it.
   *
   * On /search, seed from ?q= so the results show what was searched for and
   * stay editable -- that page dropped its own input once the header gained
   * one, and without this the results carried no visible record of the query.
   *
   * Everywhere else, clear it. The box lives in the layout, so its value used
   * to survive navigation: searching "Din Djarin" and then clicking Retiring
   * Soon left the term sitting above a page with no relationship to it, which
   * reads as though the results are filtered by it. Clearing also covers
   * arriving on an item page from the dropdown -- you have got where you were
   * going, and the search that took you there is spent.
   *
   * Reads window.location rather than useSearchParams(): this component is in
   * the root layout, and useSearchParams() there opts every page into
   * client-side rendering. Keyed on pathname only, so typing in the box while
   * already on /search is never clobbered by that page's own URL updates.
   */
  useEffect(() => {
    if (pathname !== '/search') {
      setSearchQuery((current) => (current === '' ? current : ''));
      return;
    }
    const fromUrl = new URLSearchParams(window.location.search).get('q') || '';
    setSearchQuery((current) => (current === fromUrl ? current : fromUrl));
  }, [pathname]);
  // The mobile menu used to be pinned at a hard-coded top: 73px, which is the
  // desktop header's height. The mobile header is 65px, so the menu floated 8px
  // below it and left a white band between the header's bottom border and the
  // menu's own top border. Measure instead. headerRef moves between two
  // <header> elements when the layout switches, hence the dependency below.
  const [headerHeight, setHeaderHeight] = useState(73);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [useMobileLayout]);

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
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
      // Mobile menu click-outside handler - only run when menu is open
      if (mobileMenuOpen && mobileMenuRef.current && mobileMenuButtonRef.current) {
        const clickedMenu = mobileMenuRef.current.contains(event.target as Node);
        const clickedButton = mobileMenuButtonRef.current.contains(event.target as Node);

        if (!clickedMenu && !clickedButton) {
          console.log('Clicked outside, closing menu');
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

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

  // Dynamic layout switching based on navigation width
  useEffect(() => {
    const checkNavigationFit = () => {
      if (!headerRef.current) return;

      const header = headerRef.current;
      const headerWidth = header.offsetWidth;

      // Always use mobile layout below 1000px to prevent text wrapping
      if (headerWidth < 1000) {
        setUseMobileLayout(true);
        return;
      }

      const logo = header.querySelector('.header-logo') as HTMLElement;
      const desktopNav = header.querySelector('.desktop-nav') as HTMLElement;
      const authSection = header.querySelector('.desktop-auth') as HTMLElement;

      if (!logo) return;

      // Cache the last non-zero widths. The nav and auth blocks are
      // display:none while collapsed and report 0, so re-entering desktop mode
      // would otherwise measure zero for a frame, conclude "it fits", and flip
      // straight back -- a strobing header on every resize.
      if (desktopNav?.offsetWidth) navIntrinsicWidth.current = desktopNav.offsetWidth;
      if (authSection?.offsetWidth) authIntrinsicWidth.current = authSection.offsetWidth;

      // The header is two rows now, so the old single formula
      // (logo + nav + auth vs header width) no longer describes anything real:
      // those three no longer share a row. Worse, the search box is flex:1, so
      // row 1 always exactly fills the header and the sum would always say
      // "too wide". The two rows fail independently, so measure them that way.
      const rowOneFits =
        logo.offsetWidth + MIN_SEARCH_WIDTH + authIntrinsicWidth.current + ROW_ONE_GAPS <= headerWidth;

      // .desktop-nav is display:inline-flex specifically so this stays the
      // content's width. As a plain flex child on its own full-width row it
      // would report the row's width instead, which is always >= headerWidth,
      // and the header would collapse to a hamburger on a 27-inch monitor.
      const navFits = navIntrinsicWidth.current <= headerWidth;

      setUseMobileLayout(!(rowOneFits && navFits));
    };

    // Check on mount and resize
    checkNavigationFit();
    window.addEventListener('resize', checkNavigationFit);

    // Recheck when translations load (language-specific text lengths)
    const timeout = setTimeout(checkNavigationFit, 100);

    return () => {
      window.removeEventListener('resize', checkNavigationFit);
      clearTimeout(timeout);
    };
  }, [t]);

  // Close mobile menu when switching to desktop layout
  useEffect(() => {
    if (!useMobileLayout && mobileMenuOpen) {
      setMobileMenuOpen(false);
      setMobileBrowseOpen(false);
      setMobileLegoOpen(false);
    }
  }, [useMobileLayout, mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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

  /**
   * One renderer for every plain nav link, used by both header trees. The row
   * used to be hand-written per tree, which meant each label change was two
   * edits and drift was invisible until someone signed in.
   */
  const renderNavLink = ({ href, key, fallback }: { href: string; key: string; fallback: string }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        key={href}
        href={href}
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: active ? '600' : '500',
          color: active ? '#171717' : '#525252',
          textDecoration: 'none',
          transition: 'color 0.2s',
          lineHeight: '1',
          display: 'flex',
          alignItems: 'center',
          height: '36px',
          borderTop: '2px solid transparent',
          borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
          whiteSpace: 'nowrap'
        }}
      >
        {t(key) || fallback}
      </Link>
    );
  };

  /**
   * Mobile menu rows, from the same PLAIN_NAV/TOOLS_NAV arrays the desktop row
   * uses, so the two can no longer drift apart. The mobile menu used to be a
   * separate hand-written list and had quietly fallen a whole restructure
   * behind the desktop nav.
   */
  const renderMobileNavLink = ({ href, key, fallback }: { href: string; key: string; fallback: string }) => (
    <Link
      key={href}
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid #f5f5f5',
        color: '#171717',
        textDecoration: 'none',
        fontSize: 'var(--text-base)',
        fontWeight: '600',
        minHeight: '44px'
      }}
    >
      {t(key) || fallback}
    </Link>
  );

  if (!user) {
    return (
      <header ref={headerRef} style={{
        position: 'sticky',
        top: 0,
        zIndex: 10000,
        background: mobileMenuOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 32px'
        }}>
            {/* Two rows, the way Amazon, Walmart and eBay do it: logo + search +
                account on top, category nav underneath. It was a single 1fr auto 1fr
                grid at 72px, which centred the nav between the logo and the auth
                block -- but a search box in row 1 grows to absorb every spare pixel,
                so there is no slack left to centre anything against and the grid
                stopped earning its keep. Splitting the rows is also what keeps the
                nav from competing with the search box for width: dropping a 280px
                box into the old single row would have moved the collapse-to-hamburger
                point from ~1000px to ~1300px, putting ordinary laptops on the mobile
                menu. German, Dutch and Portuguese labels are already what push it. */}
            <div className="header-row-main" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              height: '64px',
              // The divider between the two rows lives here, not on .desktop-nav.
              // That nav is inline-flex so checkNavigationFit can measure its own
              // content width -- which means a border on it stops where the labels
              // stop, roughly half way across the header. Suppressed on mobile,
              // where the row below is the search box rather than the nav.
              borderBottom: useMobileLayout ? 'none' : '1px solid #f5f5f5'
            }}>
            <Link href="/" className="header-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', height: '36px', justifySelf: 'start' }}>
              <div style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: '#171717',
                letterSpacing: '-0.01em',
                transition: 'color 0.2s',
                lineHeight: '1'
              }}>
                IntoBrick
              </div>
            </Link>

            <div className="header-search-slot" style={{
              display: useMobileLayout ? 'none' : 'block',
              flex: '1 1 auto',
              /* Mirrors MIN_SEARCH_WIDTH in checkNavigationFit above. */
              minWidth: '240px',
              maxWidth: '720px'
            }}>
              <HeaderSearch value={searchQuery} onValueChange={setSearchQuery} variant="desktop" />
            </div>

            <div className="desktop-auth" style={{
              display: useMobileLayout ? 'none' : 'flex',
              alignItems: 'center',
              gap: '12px',
              justifySelf: 'end'
            }}>
                <LanguageSwitcher />
                <Link
                  href="/auth/signin"
                  style={{
                    padding: '10px 16px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '500',
                    color: '#525252',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t('navigation.signIn')}
                </Link>
                <Link
                  href="/auth/signup"
                  style={{
                    padding: '10px 16px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: '#3b82f6',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t('navigation.signUp')}
                </Link>
            </div>

            <button
              ref={mobileMenuButtonRef}
              className="mobile-menu-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger clicked, current state:', mobileMenuOpen);
                const newState = !mobileMenuOpen;
                console.log('Setting mobile menu to:', newState);
                setMobileMenuOpen(newState);
              }}
              style={{
                display: useMobileLayout ? 'block' : 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: '#171717',
                zIndex: 1001
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

            {/* Row 2: the nav that used to share row 1 with the logo.
            
                display:inline-flex is load-bearing. checkNavigationFit reads this
                element's offsetWidth to decide whether long translated labels
                overflow, and a plain flex element on its own full-width row reports
                the row's width rather than its content's -- which is always wider
                than the header, so the check would collapse to a hamburger on a
                27-inch monitor. inline-flex keeps the measurement intrinsic. */}
            <nav className="desktop-nav" style={{
              display: useMobileLayout ? 'none' : 'inline-flex',
              alignItems: 'center',
              // 20px, not 24: eleven items at 24px put Polish 15px over the usable
              // width at 1024px, which would have collapsed the header to a hamburger.
              gap: '20px',
              height: '44px'
            }}>
              {/* Catalog first for a stranger: someone arriving from a search engine
                  has no collection yet, so leading with an empty room would say nothing
                  about what this site is. Your LEGO follows it as an invitation. */}
              {PLAIN_NAV.slice(0, YOUR_LEGO_INDEX.signedOut).map(renderNavLink)}

              {/* Your LEGO Dropdown for logged-out users */}
              <div style={{ position: 'relative' }} ref={legoDropdownRef}>
                <button
                  onClick={() => setLegoDropdownOpen(!legoDropdownOpen)}
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: '500',
                    color: '#525252',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '36px',
                    // Same 2px the sibling links reserve for their active underline,
                    // so every item in the row has identical box metrics.
                    borderTop: '2px solid transparent',
                    borderBottom: '2px solid transparent',
                    padding: 0,
                    lineHeight: '1',
                    whiteSpace: 'nowrap'
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
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e5e5',
                    minWidth: '240px',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    {/* Minifigures Section */}
                    <div style={{ padding: '12px 20px 8px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {t('navigation.minifigures') || 'Minifigures'}
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
                      <span>{t('navigation.minifigsForSale')}</span>
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
                      <span>{t('navigation.minifigsToKeep')}</span>
                    </Link>

                    {/* Sets Section */}
                    <div style={{ padding: '12px 20px 8px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {t('navigation.sets') || 'Sets'}
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
                      <span>{t('navigation.setsForSale')}</span>
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
                      <span>{t('navigation.setsToKeep')}</span>
                    </Link>
                  </div>
                )}
              </div>

              {PLAIN_NAV.slice(YOUR_LEGO_INDEX.signedOut).map(renderNavLink)}


              {/* Tools: real features, but occasional-use, so they get a menu rather
                  than a headline slot. Whatnot lives here deliberately -- see the note on
                  TOOLS_NAV and the affiliate section of CLAUDE.md. */}
              <div style={{ position: 'relative' }} ref={toolsDropdownRef}>
                <button
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: '500',
                    color: '#525252',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '36px',
                    borderTop: '2px solid transparent',
                    borderBottom: '2px solid transparent',
                    padding: 0,
                    lineHeight: '1',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t('navPrimary.tools') || 'Tools'}
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {toolsDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '12px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e5e5',
                    minWidth: '200px',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    {TOOLS_NAV.map(({ href, key, fallback }, idx) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setToolsDropdownOpen(false)}
                        style={{
                          display: 'block',
                          padding: '14px 20px',
                          color: '#171717',
                          textDecoration: 'none',
                          fontSize: 'var(--text-sm)',
                          borderBottom: idx < TOOLS_NAV.length - 1 ? '1px solid #f5f5f5' : 'none',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        {t(key) || fallback}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Dropdown -- About, Articles, Support (Community/Premium stay standalone) */}
              <div style={{ position: 'relative' }} ref={resourcesDropdownRef}>
                <button
                  onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: (pathname === '/about' || pathname === '/articles' || pathname.startsWith('/articles/') || pathname === '/support') ? '600' : '500',
                    color: (pathname === '/about' || pathname === '/articles' || pathname.startsWith('/articles/') || pathname === '/support') ? '#171717' : '#525252',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '36px',
                    // Same 2px the sibling links reserve for their active underline,
                    // so every item in the row has identical box metrics.
                    borderTop: '2px solid transparent',
                    borderBottom: '2px solid transparent',
                    padding: 0,
                    lineHeight: '1',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t('navigation.resources') || 'Resources'}
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {resourcesDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '12px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e5e5',
                    minWidth: '180px',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    <Link href="/about" onClick={() => setResourcesDropdownOpen(false)} style={{
                      display: 'block',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      {t('navigation.about')}
                    </Link>
                    <Link href="/articles" onClick={() => setResourcesDropdownOpen(false)} style={{
                      display: 'block',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      {t('navigation.articles') || 'Articles'}
                    </Link>
                    <Link href="/listing-generator" onClick={() => setResourcesDropdownOpen(false)} style={{
                      display: 'block',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      {t('navPrimary.listings') || 'Listings'}
                    </Link>
                    <Link
                      href="/support"
                      onClick={async () => {
                        setResourcesDropdownOpen(false);
                        try {
                          await fetch('/api/track-event', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              event: 'nav_support_click',
                              properties: { location: 'desktop_logged_out' }
                            })
                          });
                        } catch (error) {
                          console.error('Failed to track support click:', error);
                        }
                      }}
                      style={{
                        display: 'block',
                        padding: '12px 20px',
                        color: '#171717',
                        textDecoration: 'none',
                        fontSize: 'var(--text-sm)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      {t('navigation.support') || 'Support'}
                    </Link>
                  </div>
                )}
              </div>

              {/* No Premium link here on purpose.
                  Premium is not sold to logged-out visitors any more -- the
                  goal for a stranger is to get them to sign up, and the
                  logged-in header (location: desktop_logged_in /
                  mobile_logged_in) still carries it for people who have. Same
                  reason the identifier card is hidden from the logged-out
                  homepage in components/HomeMoreFeatures.tsx. */}
            </nav>

            {/* Row 2 on mobile: search, permanently visible rather than buried in
                the hamburger. Rendered unconditionally in mobile mode so the header's
                offsetHeight stays constant -- headerHeight is measured from it to
                position the fixed mobile menu. */}
            <div className="mobile-search-row" style={{
              display: useMobileLayout ? 'block' : 'none',
              paddingBottom: '12px'
            }}>
              <HeaderSearch value={searchQuery} onValueChange={setSearchQuery} variant="mobile" />
            </div>
        </div>

        {mobileMenuOpen && (
          <nav ref={mobileMenuRef} style={{
            position: 'fixed',
            top: `${headerHeight}px`,
            left: '0px',
            right: '0px',
            bottom: '0px',
            width: '100%',
            height: `calc(100vh - ${headerHeight}px)`,
            background: '#ffffff',
            padding: '0 16px 32px',
                        zIndex: 10000,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {/* Same order as the desktop row, from the same array. Tools items are
                flat here rather than behind a menu: the desktop grouping exists to save
                horizontal width, which a vertical phone menu does not need, and flat
                rows are one tap instead of two. */}
            {PLAIN_NAV.slice(0, YOUR_LEGO_INDEX.signedOut).map(renderMobileNavLink)}

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
                <span>{t('navigation.yourLego')}</span>
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
                    {t('navigation.minifigures')}
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
                    <span>{t('navigation.minifigsForSale')}</span>
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
                    <span>{t('navigation.minifigsToKeep')}</span>
                  </Link>

                  <div style={{ padding: '12px 0 4px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {t('navigation.sets')}
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
                    <span>{t('navigation.setsForSale')}</span>
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
                    <span>{t('navigation.setsToKeep')}</span>
                  </Link>
                </div>
              )}
            </div>
            {/* Retiring Soon and Community follow Your LEGO, matching the
                signed-out desktop order. */}
            {PLAIN_NAV.slice(YOUR_LEGO_INDEX.signedOut).map(renderMobileNavLink)}


            {/* Other Links */}
            <div style={{
              // No gap: each row has a bottom border, so a bare 32px void
              // between two of them read as a missing item rather than a
              // group break. The icons already mark the second group.
              marginTop: 0
            }}>
              {/* Community -- desktop lists it between Your LEGO and Resources
                  for logged-out visitors, but this menu omitted it entirely, so
                  /collectors was unreachable from a signed-out phone. */}

              {/* Resources Dropdown for mobile logged-out users -- About, Articles, Support */}
              <div style={{ borderBottom: '1px solid #f5f5f5' }}>
              {/* TOOLS_MOBILE_DONE -- Identify, Export, Whatnot. */}
              {TOOLS_NAV.map(renderMobileNavLink)}

                <button
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
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
                  <span>{t('navigation.resources') || 'Resources'}</span>
                  <svg
                    style={{
                      width: '20px',
                      height: '20px',
                      transition: 'transform 0.2s',
                      transform: mobileResourcesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileResourcesOpen && (
                  <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
                    <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      color: '#525252',
                      textDecoration: 'none',
                      fontSize: 'var(--text-base)',
                      minHeight: '44px'
                    }}>
                      {t('navigation.about')}
                    </Link>
                    <Link href="/articles" onClick={() => setMobileMenuOpen(false)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      color: '#525252',
                      textDecoration: 'none',
                      fontSize: 'var(--text-base)',
                      minHeight: '44px'
                    }}>
                      {t('navigation.articles') || 'Articles'}
                    </Link>
                    <Link
                      href="/support"
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        try {
                          await fetch('/api/track-event', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              event: 'nav_support_click',
                              properties: { location: 'mobile_logged_out' }
                            })
                          });
                        } catch (error) {
                          console.error('Failed to track support click:', error);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 0',
                        color: '#525252',
                        textDecoration: 'none',
                        fontSize: 'var(--text-base)',
                        minHeight: '44px'
                      }}
                    >
                      {t('navigation.support') || 'Support'}
                    </Link>
                  </div>
                )}
              </div>

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

              {/* Language Dropdown */}
              <div>
                <button
                  onClick={() => setMobileLanguageOpen(!mobileLanguageOpen)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: 'var(--text-base)',
                    fontWeight: '600',
                    color: '#171717',
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: '44px'
                  }}
                >
                  {t('navigation.language') || 'Language'}
                  <svg
                    style={{
                      width: '20px',
                      height: '20px',
                      transform: mobileLanguageOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileLanguageOpen && (
                  <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
                    {[
                      { code: 'en', name: 'English' },
                      { code: 'es', name: 'Español' },
                      { code: 'fr', name: 'Français' },
                      { code: 'de', name: 'Deutsch' },
                      { code: 'it', name: 'Italiano' },
                      { code: 'pt', name: 'Português' },
                      { code: 'pl', name: 'Polski' },
                      { code: 'nl', name: 'Nederlands' },
                      { code: 'sv', name: 'Svenska' },
                      { code: 'ja', name: '日本語' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          const pathname = window.location.pathname;
                          const newUrl = `https://${lang.code === 'en' ? '' : `${lang.code}.`}figtracker.com${pathname}`;
                          window.location.href = newUrl;
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 0',
                          color: '#525252',
                          background: 'none',
                          border: 'none',
                          fontSize: 'var(--text-base)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          minHeight: '44px',
                          width: '100%'
                        }}
                      >
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} style={{
              display: 'block',
              marginTop: '20px',
              padding: '15px',
              background: '#3b82f6',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: '600'
            }}>
              {t('navigation.signUp') || 'Sign Up'}
            </Link>
          </nav>
        )}
      </header>
    );
  }

  return (
    <header ref={headerRef} style={{
      position: 'sticky',
      top: 0,
      zIndex: 10000,
      background: mobileMenuOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e5e5e5'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 32px'
      }}>
          {/* Two rows, the way Amazon, Walmart and eBay do it: logo + search +
              account on top, category nav underneath. It was a single 1fr auto 1fr
              grid at 72px, which centred the nav between the logo and the auth
              block -- but a search box in row 1 grows to absorb every spare pixel,
              so there is no slack left to centre anything against and the grid
              stopped earning its keep. Splitting the rows is also what keeps the
              nav from competing with the search box for width: dropping a 280px
              box into the old single row would have moved the collapse-to-hamburger
              point from ~1000px to ~1300px, putting ordinary laptops on the mobile
              menu. German, Dutch and Portuguese labels are already what push it. */}
          <div className="header-row-main" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            height: '64px',
            // The divider between the two rows lives here, not on .desktop-nav.
            // That nav is inline-flex so checkNavigationFit can measure its own
            // content width -- which means a border on it stops where the labels
            // stop, roughly half way across the header. Suppressed on mobile,
            // where the row below is the search box rather than the nav.
            borderBottom: useMobileLayout ? 'none' : '1px solid #f5f5f5'
          }}>
          <Link href="/" className="header-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', height: '36px', justifySelf: 'start' }}>
            <div style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              color: '#171717',
              letterSpacing: '-0.01em',
              transition: 'color 0.2s',
              lineHeight: '1'
            }}>
              IntoBrick
            </div>
          </Link>

          <div className="header-search-slot" style={{
            display: useMobileLayout ? 'none' : 'block',
            flex: '1 1 auto',
            /* Mirrors MIN_SEARCH_WIDTH in checkNavigationFit above. */
            minWidth: '240px',
            maxWidth: '720px'
          }}>
            <HeaderSearch value={searchQuery} onValueChange={setSearchQuery} variant="desktop" />
          </div>

          {/* A sibling of .desktop-nav, not a child of it. Nested, it rode
              along on the right-hand side and pushed the links off centre --
              and checkNavigationFit double-counted its width, since
              desktopNav.offsetWidth already contained it. */}
          <div className="desktop-auth" style={{
            display: useMobileLayout ? 'none' : 'flex',
            alignItems: 'center',
            gap: '16px',
            justifySelf: 'end'
          }}>
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
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e5e5',
                  padding: '8px',
                  // The only floating panel on the site with no zIndex. Every
                  // other menu sets 1000; this one relied on source order and
                  // would fall behind any positioned content it overlapped.
                  zIndex: 1000,
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
                      {user.name || t('navigation.user') || 'User'}
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
                    {t('navigation.accountSettings')}
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
                    {t('navigation.wishlist')}
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
                      {t('navigation.adminDashboard')}
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
                    {t('navigation.signOut')}
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
              display: useMobileLayout ? 'block' : 'none',
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

          {/* Row 2: the nav that used to share row 1 with the logo.
          
              display:inline-flex is load-bearing. checkNavigationFit reads this
              element's offsetWidth to decide whether long translated labels
              overflow, and a plain flex element on its own full-width row reports
              the row's width rather than its content's -- which is always wider
              than the header, so the check would collapse to a hamburger on a
              27-inch monitor. inline-flex keeps the measurement intrinsic. */}
          <nav className="desktop-nav" style={{
            display: useMobileLayout ? 'none' : 'inline-flex',
            alignItems: 'center',
            // 20px, not 24: eleven items at 24px put Polish 15px over the usable
            // width at 1024px, which would have collapsed the header to a hamburger.
            gap: '20px',
            height: '44px'
          }}>
            {/* Your LEGO Dropdown */}
            <div style={{ position: 'relative' }} ref={legoDropdownRef}>
              <button
                onClick={() => setLegoDropdownOpen(!legoDropdownOpen)}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '500',
                  color: '#525252',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '36px',
                  padding: 0,
                  whiteSpace: 'nowrap'
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
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e5e5',
                  minWidth: '240px',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  {/* Minifigures Section */}
                  <div style={{ padding: '12px 20px 8px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {t('navigation.minifigures')}
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
                    <span>{t('navigation.minifigsForSale')}</span>
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
                    <span>{t('navigation.minifigsToKeep')}</span>
                  </Link>

                  {/* Sets Section */}
                  <div style={{ padding: '12px 20px 8px', fontSize: '11px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {t('navigation.sets')}
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
                    <span>{t('navigation.setsForSale')}</span>
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
                    <span>{t('navigation.setsToKeep')}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Your LEGO leads here: a signed-in visitor came back for their own
                collection. */}
            {PLAIN_NAV.map(renderNavLink)}


            {/* Tools: real features, but occasional-use, so they get a menu rather
                than a headline slot. Whatnot lives here deliberately -- see the note on
                TOOLS_NAV and the affiliate section of CLAUDE.md. */}
            <div style={{ position: 'relative' }} ref={toolsDropdownRef}>
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '500',
                  color: '#525252',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '36px',
                  borderTop: '2px solid transparent',
                  borderBottom: '2px solid transparent',
                  padding: 0,
                  lineHeight: '1',
                  whiteSpace: 'nowrap'
                }}
              >
                {t('navPrimary.tools') || 'Tools'}
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {toolsDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '12px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e5e5',
                  minWidth: '200px',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  {TOOLS_NAV.map(({ href, key, fallback }, idx) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setToolsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '14px 20px',
                        color: '#171717',
                        textDecoration: 'none',
                        fontSize: 'var(--text-sm)',
                        borderBottom: idx < TOOLS_NAV.length - 1 ? '1px solid #f5f5f5' : 'none',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      {t(key) || fallback}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown -- About, Articles, Support (Community/Premium stay standalone) */}
            <div style={{ position: 'relative' }} ref={resourcesDropdownRef}>
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: (pathname === '/about' || pathname === '/articles' || pathname.startsWith('/articles/') || pathname === '/support') ? '600' : '500',
                  color: (pathname === '/about' || pathname === '/articles' || pathname.startsWith('/articles/') || pathname === '/support') ? '#171717' : '#525252',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '36px',
                  padding: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                {t('navigation.resources') || 'Resources'}
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {resourcesDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '12px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e5e5',
                  minWidth: '180px',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  <Link href="/about" onClick={() => setResourcesDropdownOpen(false)} style={{
                    display: 'block',
                    padding: '12px 20px',
                    color: '#171717',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    borderBottom: '1px solid #f5f5f5',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    {t('navigation.about')}
                  </Link>
                  <Link href="/articles" onClick={() => setResourcesDropdownOpen(false)} style={{
                    display: 'block',
                    padding: '12px 20px',
                    color: '#171717',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    borderBottom: '1px solid #f5f5f5',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    {t('navigation.articles') || 'Articles'}
                  </Link>
                    <Link href="/listing-generator" onClick={() => setResourcesDropdownOpen(false)} style={{
                      display: 'block',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      {t('navPrimary.listings') || 'Listings'}
                    </Link>
                  <Link
                    href="/support"
                    onClick={async () => {
                      setResourcesDropdownOpen(false);
                      try {
                        await fetch('/api/track-event', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            event: 'nav_support_click',
                            properties: { location: 'desktop_logged_in' }
                          })
                        });
                      } catch (error) {
                        console.error('Failed to track support click:', error);
                      }
                    }}
                    style={{
                      display: 'block',
                      padding: '12px 20px',
                      color: '#171717',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    {t('navigation.support') || 'Support'}
                  </Link>
                </div>
              )}
            </div>

              {/* No Premium link in the nav at all now, signed in or out.
                  Premium is sold at the point where someone hits the feature
                  -- the upgrade prompt on /identify, and anywhere else a
                  gate appears -- rather than as a standing tab. A nav link
                  asks people to go shopping; a prompt at the gate arrives
                  when they already want the thing. The footer still links
                  /premium for anyone looking for it deliberately. */}
          </nav>

          {/* Row 2 on mobile: search, permanently visible rather than buried in
              the hamburger. Rendered unconditionally in mobile mode so the header's
              offsetHeight stays constant -- headerHeight is measured from it to
              position the fixed mobile menu. */}
          <div className="mobile-search-row" style={{
            display: useMobileLayout ? 'block' : 'none',
            paddingBottom: '12px'
          }}>
            <HeaderSearch value={searchQuery} onValueChange={setSearchQuery} variant="mobile" />
          </div>
      </div>

      {mobileMenuOpen && (
        <nav ref={mobileMenuRef} style={{
          position: 'fixed',
          top: `${headerHeight}px`,
          left: '0px',
          right: '0px',
          bottom: '0px',
          width: '100%',
          height: `calc(100vh - ${headerHeight}px)`,
          background: '#ffffff',
          padding: '0 16px 32px',
                    zIndex: 10000,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
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
              <span>{t('navigation.yourLego')}</span>
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
                  {t('navigation.minifigures')}
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
                  <span>{t('navigation.forSale')}</span>
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
                  <span>{t('navigation.toKeep')}</span>
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
                  {t('navigation.sets')}
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
                  <span>{t('navigation.forSale')}</span>
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
                  <span>{t('navigation.toKeep')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Same order as the desktop row, from the same array. Tools items are
              flat here rather than behind a menu: the desktop grouping exists to save
              horizontal width, which a vertical phone menu does not need, and flat
              rows are one tap instead of two. */}
          {PLAIN_NAV.map(renderMobileNavLink)}

          {/* Collectors Link */}

          {/* Resources Dropdown for mobile logged-in users -- About, Articles, Support */}
          <div style={{ borderBottom: '1px solid #f5f5f5' }}>
          {/* TOOLS_MOBILE_DONE -- Identify, Export, Whatnot. */}
          {TOOLS_NAV.map(renderMobileNavLink)}

            <button
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
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
              <span>{t('navigation.resources') || 'Resources'}</span>
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                  transition: 'transform 0.2s',
                  transform: mobileResourcesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  flexShrink: 0
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileResourcesOpen && (
              <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 0',
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-base)',
                  minHeight: '44px'
                }}>
                  {t('navigation.about')}
                </Link>
                <Link href="/articles" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 0',
                  color: '#525252',
                  textDecoration: 'none',
                  fontSize: 'var(--text-base)',
                  minHeight: '44px'
                }}>
                  {t('navigation.articles') || 'Articles'}
                </Link>
                <Link
                  href="/support"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    try {
                      await fetch('/api/track-event', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          event: 'nav_support_click',
                          properties: { location: 'mobile_logged_in' }
                        })
                      });
                    } catch (error) {
                      console.error('Failed to track support click:', error);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 0',
                    color: '#525252',
                    textDecoration: 'none',
                    fontSize: 'var(--text-base)',
                    minHeight: '44px'
                  }}
                >
                  {t('navigation.support') || 'Support'}
                </Link>
              </div>
            )}
          </div>


          {/* Account & Personal Links */}
          <div style={{
            // See above -- a bordered list cannot show an unlabelled gap
            // without it looking broken.
            marginTop: 0
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
              {t('navigation.accountSettings')}
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
              {t('navigation.wishlist')}
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
                {t('navigation.adminDashboard')}
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
            background: '#ef4444',
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
            {t('navigation.signOut')}
          </button>
        </nav>
      )}
    </header>
  );
}
