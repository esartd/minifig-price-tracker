import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminArticlesPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect('/');
  }

  const articles = await prisma.article.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      translations: {
        where: { locale: 'en' },
        select: {
          title: true,
          description: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '8px',
            }}>
              Articles
            </h1>
            <p style={{ fontSize: '15px', color: '#737373' }}>
              Manage and create articles for FigTracker
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span>
            New Article
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {[
            { label: 'Total', count: articles.length, color: '#3b82f6' },
            { label: 'Published', count: articles.filter(a => a.status === 'published').length, color: '#10b981' },
            { label: 'Drafts', count: articles.filter(a => a.status === 'draft').length, color: '#f59e0b' },
            { label: 'Featured', count: articles.filter(a => a.featured).length, color: '#8b5cf6' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>
                {stat.count}
              </div>
              <div style={{ fontSize: '13px', color: '#737373', fontWeight: '500' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Articles List */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {articles.length === 0 ? (
            <div style={{
              padding: '80px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
                No articles yet
              </h3>
              <p style={{ fontSize: '15px', color: '#737373', marginBottom: '24px' }}>
                Create your first article to get started
              </p>
              <Link
                href="/admin/articles/new"
                style={{
                  display: 'inline-flex',
                  padding: '10px 20px',
                  background: '#3b82f6',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                Create Article
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #e5e5e5' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#737373', textTransform: 'uppercase' }}>
                    Title
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#737373', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#737373', textTransform: 'uppercase' }}>
                    Author
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#737373', textTransform: 'uppercase' }}>
                    Updated
                  </th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#737373', textTransform: 'uppercase' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {article.featured && (
                          <span style={{ fontSize: '16px' }}>⭐</span>
                        )}
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#171717', marginBottom: '2px' }}>
                            {article.translations[0]?.title || 'Untitled'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#737373' }}>
                            /{article.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: article.status === 'published' ? '#d1fae5' : article.status === 'draft' ? '#fef3c7' : '#f3f4f6',
                        color: article.status === 'published' ? '#065f46' : article.status === 'draft' ? '#92400e' : '#6b7280',
                      }}>
                        {article.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#525252' }}>
                      {article.author.name || article.author.email}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#525252' }}>
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          style={{
                            padding: '6px 12px',
                            background: '#f3f4f6',
                            color: '#374151',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            textDecoration: 'none',
                          }}
                        >
                          Edit
                        </Link>
                        {article.status === 'published' && (
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            style={{
                              padding: '6px 12px',
                              background: '#f3f4f6',
                              color: '#374151',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '500',
                              textDecoration: 'none',
                            }}
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Back Link */}
        <div style={{ marginTop: '32px' }}>
          <Link
            href="/admin/stats"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#3b82f6',
              textDecoration: 'none',
            }}
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
