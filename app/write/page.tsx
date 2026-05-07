'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { ArticlePreview } from '@/components/admin/ArticlePreview';
import { ArticleBlock } from '@/types/article';

export default function WriteArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contentBlocks, setContentBlocks] = useState<ArticleBlock[]>([
    {
      id: 'block-1',
      type: 'heading',
      level: 2,
      text: 'Your Article Title Here',
    },
    {
      id: 'block-2',
      type: 'paragraph',
      text: 'Start writing your article content here...',
    },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.email !== 'erickkosysu@gmail.com') {
      router.push('/');
    }
  }, [status, session, router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title || contentBlocks.length === 0) {
      alert('Please add a title and at least one content block');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          status,
          featured: false,
          contentBlocks,
          translations: [
            {
              locale: 'en',
              title,
              description: contentBlocks.find(b => b.type === 'paragraph')?.text?.substring(0, 160) || '',
            }
          ],
          readTimeMinutes: Math.ceil(contentBlocks.filter(b => b.type === 'paragraph').length * 1.5),
          category: 'Guide',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save article');
      }

      const data = await response.json();

      setSaving(false);
      setSaved(true);
      setLastSaved(new Date());

      setTimeout(() => setSaved(false), 3000);

      if (status === 'published') {
        alert(`✓ Article published!\n\nYou can view it at:\n/articles/${slug}`);
      } else {
        alert(`✓ Article saved as draft!`);
      }

    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save article. Please try again.');
      setSaving(false);
    }
  };

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
      }}>
        <div style={{ fontSize: '18px', color: '#737373' }}>Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session || session.user?.email !== 'erickkosysu@gmail.com') {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px 24px',
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#171717', marginBottom: '4px' }}>
              Write Article
            </h1>
            <p style={{ fontSize: '14px', color: '#737373' }}>
              {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Start writing your article'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
            <button
              onClick={() => handleSave('draft')}
              disabled={saving || !title || contentBlocks.length === 0}
              style={{
                padding: '10px 16px',
                background: saving || !title || contentBlocks.length === 0 ? '#d1d5db' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                cursor: saving || !title || contentBlocks.length === 0 ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Draft'}
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                padding: '10px 16px',
                background: showPreview ? '#10b981' : '#f3f4f6',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: showPreview ? '#ffffff' : '#374151',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {showPreview ? '← Edit' : 'Preview →'}
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving || !title || contentBlocks.length === 0}
              style={{
                padding: '10px 16px',
                background: saving || !title || contentBlocks.length === 0 ? '#93c5fd' : '#3b82f6',
                border: 'none',
                whiteSpace: 'nowrap',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                cursor: saving || !title || contentBlocks.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '32px auto', padding: '0 24px' }}>
        {showPreview ? (
          <ArticlePreview blocks={contentBlocks} title={title} author="FigTracker Team" />
        ) : (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article title..."
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '24px',
                  fontWeight: '600',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px 12px 0 0',
                  background: '#ffffff',
                  borderBottom: '1px solid #f3f4f6',
                }}
              />
              <div style={{
                padding: '12px 20px',
                background: '#fafafa',
                border: '1px solid #e5e5e5',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                fontSize: '14px',
                color: '#737373',
              }}>
                URL: <span style={{ fontFamily: 'monospace', color: '#3b82f6' }}>/articles/{slug || 'your-article-slug'}</span>
              </div>
            </div>
            <ArticleEditor
              initialBlocks={contentBlocks}
              onChange={setContentBlocks}
            />
          </div>
        )}
      </div>
    </div>
  );
}
