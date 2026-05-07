'use client';

import { useState, useEffect, useRef } from 'react';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { ArticlePreview } from '@/components/admin/ArticlePreview';
import { ArticleBlock } from '@/types/article';

export default function CMSDemoPage() {
  const [contentBlocks, setContentBlocks] = useState<ArticleBlock[]>([
    {
      id: 'block-1',
      type: 'heading',
      level: 2,
      text: 'Welcome to the Article Editor',
    },
    {
      id: 'block-2',
      type: 'paragraph',
      text: 'This is a **paragraph block** with some *italic text*. You can write your content here and use basic markdown formatting. Perfect for introductions and body content.',
    },
    {
      id: 'block-3',
      type: 'callout',
      calloutType: 'tip',
      content: '**Pro Tip:** Click the ↑↓ buttons to reorder blocks, or click 🗑 to delete them. Try adding your own blocks with the "+ Add Block" button!',
    },
    {
      id: 'block-4',
      type: 'heading',
      level: 2,
      text: 'Key Features',
    },
    {
      id: 'block-5',
      type: 'list',
      ordered: false,
      items: [
        'Block-based editor inspired by Apple Newsroom',
        'Drag & drop image uploads',
        'Live preview mode',
        'Multiple content types: headings, paragraphs, images, callouts, comparisons',
      ],
    },
    {
      id: 'block-6',
      type: 'heading',
      level: 2,
      text: 'FigTracker vs BrickLink',
    },
    {
      id: 'block-7',
      type: 'comparison',
      items: [
        {
          title: 'FigTracker',
          icon: '🚀',
          pros: [
            'Modern, intuitive interface',
            'Real-time price updates',
            'Free to use',
            'Mobile-friendly design',
          ],
          cons: [
            'Newer platform',
            'Smaller community',
          ],
        },
        {
          title: 'BrickLink',
          icon: '🧱',
          pros: [
            'Largest LEGO marketplace',
            'Established community',
            'Comprehensive catalog',
          ],
          cons: [
            'Outdated interface',
            'Complex for beginners',
            'Slower updates',
          ],
        },
      ],
    },
    {
      id: 'block-8',
      type: 'divider',
    },
    {
      id: 'block-9',
      type: 'heading',
      level: 3,
      text: 'Getting Started',
    },
    {
      id: 'block-10',
      type: 'paragraph',
      text: 'Ready to create your own article? Click "+ Add Block" below to add more content, or edit any existing block by clicking on it.',
    },
    {
      id: 'block-11',
      type: 'callout',
      calloutType: 'info',
      content: '**Note:** This is a demo. Once you apply the database migration, you can save articles and publish them live!',
    },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState('Getting Started with FigTracker');
  const [slug, setSlug] = useState('getting-started-with-figtracker');
  const [author, setAuthor] = useState('FigTracker Team');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autosaving, setAutosaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const autoSave = async () => {
    if (!title || contentBlocks.length === 0) return;

    setAutosaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save to localStorage for demo
    localStorage.setItem('cms-demo-autosave', JSON.stringify({
      title,
      slug,
      author,
      contentBlocks,
      savedAt: new Date().toISOString(),
    }));

    setLastSaved(new Date());
    setAutosaving(false);
  };

  // Autosave every 30 seconds
  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      autoSave();
    }, 30000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [title, slug, author, contentBlocks]);

  // Load autosave on mount
  useEffect(() => {
    const saved = localStorage.getItem('cms-demo-autosave');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const savedDate = new Date(data.savedAt);
        const hoursSinceLastSave = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60);

        // Only restore if saved within last 24 hours
        if (hoursSinceLastSave < 24) {
          const shouldRestore = confirm(
            `Found autosaved work from ${savedDate.toLocaleString()}.\n\nRestore it?`
          );
          if (shouldRestore) {
            setTitle(data.title);
            setSlug(data.slug);
            setAuthor(data.author);
            setContentBlocks(data.contentBlocks);
            setLastSaved(savedDate);
          }
        }
      } catch (e) {
        console.error('Failed to restore autosave:', e);
      }
    }
  }, []);

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSaving(false);
    setSaved(true);
    setLastSaved(new Date());

    // Clear autosave after manual save
    localStorage.removeItem('cms-demo-autosave');

    // Show success message
    alert(`✓ Article ${status === 'draft' ? 'saved as draft' : 'published'}!\n\nSlug: ${slug}\nBlocks: ${contentBlocks.length}\n\nNote: This is a demo. Once you fix the database migration, this will actually save to the database and be available at:\n/articles/${slug}`);

    setTimeout(() => setSaved(false), 3000);
  };

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
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#171717', marginBottom: '4px' }}>
                Article CMS Demo
              </h1>
              <p style={{ fontSize: '14px', color: '#737373' }}>
                Apple Newsroom-style block editor (No login required!)
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ minHeight: '20px' }}>
                {autosaving && (
                  <span style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600' }}>
                    💾 Saving...
                  </span>
                )}
                {!autosaving && lastSaved && (
                  <span style={{ fontSize: '13px', color: '#737373' }}>
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                {saved && (
                  <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>
                    ✓ Saved
                  </span>
                )}
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
                  {saving ? 'Saving...' : 'Save Draft'}
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
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '32px auto', padding: '0 24px' }}>
        {!showPreview && (
          <div style={{
            background: '#e0f2fe',
            border: '1px solid #38bdf8',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0369a1', marginBottom: '8px' }}>
              🎉 Welcome to the Article CMS!
            </h2>
            <p style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: '1.6' }}>
              This is a <strong>working demo</strong> of the block-based article editor. Try:
            </p>
            <ul style={{ fontSize: '14px', color: '#0c4a6e', marginTop: '12px', paddingLeft: '20px' }}>
              <li>Click "+ Add Block" to add content blocks</li>
              <li>Drag & drop images (base64 encoded for demo)</li>
              <li>Rearrange blocks with ↑↓ buttons</li>
              <li>Create callouts, comparisons, lists, and more</li>
              <li>Click "Preview" to see how it looks published</li>
            </ul>
            <p style={{ fontSize: '13px', color: '#0369a1', marginTop: '12px', fontStyle: 'italic' }}>
              Note: This is a demo - your changes won't be saved to the database. Full version available at /admin/articles after login setup.
            </p>
          </div>
        )}

        {showPreview ? (
          <ArticlePreview blocks={contentBlocks} title={title} author={author} />
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
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderTop: 'none',
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
                URL: <span style={{ fontFamily: 'monospace', color: '#3b82f6' }}>/articles/{slug}</span>
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
