'use client';

import { useState } from 'react';
import { ArrowUpOnSquareIcon, LinkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SocialShareProps {
  title: string;
  url: string;
  position?: 'top' | 'bottom';
}

export function SocialShare({ title, url, position = 'bottom' }: SocialShareProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Try native share first on mobile
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        // User cancelled or error - show our menu
        setShowMenu(true);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  if (position === 'top') {
    // Inline share icons under author
    return (
      <div style={{
        display: 'block',
        margin: 0,
        padding: 0,
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'flex-start',
          margin: 0,
          padding: 0,
        }}>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Twitter"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            flexShrink: 0,
            margin: 0,
            padding: 0,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '50%',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            flexShrink: 0,
            margin: 0,
            padding: 0,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '50%',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/>
          </svg>
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            flexShrink: 0,
            margin: 0,
            padding: 0,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '50%',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        <a
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Reddit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            flexShrink: 0,
            margin: 0,
            padding: 0,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '50%',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
        </a>

        <button
          onClick={copyLink}
          title={copied ? 'Link copied!' : 'Copy link'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            flexShrink: 0,
            margin: 0,
            padding: 0,
            background: '#ffffff',
            border: copied ? '1px solid #10b981' : '1px solid #e5e5e5',
            borderRadius: '50%',
            color: copied ? '#10b981' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.color = '#3b82f6';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.borderColor = '#e5e5e5';
              e.currentTarget.style.color = '#6b7280';
            }
          }}
        >
          {copied ? (
            <CheckIcon style={{ width: '14px', height: '14px' }} />
          ) : (
            <LinkIcon style={{ width: '14px', height: '14px' }} />
          )}
        </button>
        </div>
      </div>
    );
  }

  // Bottom share section (cleaner than before)
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '32px 0',
      borderTop: '1px solid #e5e5e5',
      margin: '48px 0 0',
    }}>
      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        color: '#737373',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Share Article
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Twitter"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            margin: 0,
            padding: 0,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '50%',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            margin: 0,
            padding: 0,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '50%',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/>
          </svg>
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            margin: 0,
            padding: 0,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '50%',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        <button
          onClick={copyLink}
          title={copied ? 'Link copied!' : 'Copy link'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            background: '#ffffff',
            border: copied ? '1px solid #10b981' : '1px solid #e5e5e5',
            borderRadius: '50%',
            color: copied ? '#10b981' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.borderColor = '#e5e5e5';
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {copied ? (
            <CheckIcon style={{ width: '18px', height: '18px' }} />
          ) : (
            <LinkIcon style={{ width: '18px', height: '18px' }} />
          )}
        </button>
      </div>
    </div>
  );
}
