'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { ArticleBlock } from '@/types/article';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Article metadata
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);

  // Translations
  const [translations, setTranslations] = useState({
    en: { title: '', description: '' },
    de: { title: '', description: '' },
    fr: { title: '', description: '' },
    es: { title: '', description: '' },
  });

  const [activeLocale, setActiveLocale] = useState<'en' | 'de' | 'fr' | 'es'>('en');

  // Content blocks
  const [contentBlocks, setContentBlocks] = useState<ArticleBlock[]>([]);

  const updateTranslation = (locale: string, field: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: {
        ...prev[locale as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    updateTranslation('en', 'title', value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  const saveDraft = async () => {
    if (!translations.en.title) {
      setError('Please enter a title');
      return;
    }

    if (!slug) {
      setError('Please enter a slug');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          category,
          featured,
          status: 'draft',
          contentBlocks,
          translations: Object.entries(translations).map(([locale, data]) => ({
            locale,
            ...data,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      const data = await response.json();
      router.push(`/admin/articles/${data.article.id}/edit`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    // TODO: Implement publish
    setError('Publishing will be available after saving draft');
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/admin/articles"
              style={{
                fontSize: '20px',
                textDecoration: 'none',
                color: '#737373',
              }}
            >
              ←
            </Link>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#171717' }}>
                New Article
              </h1>
              <p style={{ fontSize: '13px', color: '#737373' }}>
                Create a new article for FigTracker
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={saveDraft}
              disabled={saving}
              style={{
                padding: '10px 20px',
                background: '#f3f4f6',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={publish}
              disabled={saving}
              style={{
                padding: '10px 20px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                cursor: 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          maxWidth: '1400px',
          margin: '16px auto',
          padding: '12px 24px',
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '8px',
        }}>
          {error}
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
          {/* Main Editor */}
          <div>
            <ArticleEditor
              initialBlocks={contentBlocks}
              onChange={setContentBlocks}
            />
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Metadata */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#171717', marginBottom: '16px' }}>
                Article Settings
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#737373', display: 'block', marginBottom: '6px' }}>
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-url-slug"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#737373', display: 'block', marginBottom: '6px' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Guide, Tutorial, News..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      outline: 'none',
                    }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Featured Article
                  </span>
                </label>
              </div>
            </div>

            {/* Translations */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#171717', marginBottom: '16px' }}>
                Translations
              </h3>

              {/* Language tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid #e5e5e5' }}>
                {(['en', 'de', 'fr', 'es'] as const).map(locale => (
                  <button
                    key={locale}
                    onClick={() => setActiveLocale(locale)}
                    style={{
                      padding: '8px 16px',
                      background: activeLocale === locale ? '#3b82f6' : 'transparent',
                      color: activeLocale === locale ? '#ffffff' : '#737373',
                      border: 'none',
                      borderRadius: '6px 6px 0 0',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    {locale}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#737373', display: 'block', marginBottom: '6px' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={translations[activeLocale].title}
                    onChange={(e) =>
                      activeLocale === 'en'
                        ? handleTitleChange(e.target.value)
                        : updateTranslation(activeLocale, 'title', e.target.value)
                    }
                    placeholder="Article title..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#737373', display: 'block', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    value={translations[activeLocale].description}
                    onChange={(e) => updateTranslation(activeLocale, 'description', e.target.value)}
                    placeholder="Short description for article cards..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
