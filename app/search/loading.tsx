export default function Loading() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '48px 16px'
    }}>
      {/* Search bar skeleton */}
      <div style={{
        marginBottom: '32px'
      }}>
        <div style={{
          height: 'var(--icon-2xl)',
          borderRadius: '12px',
          background: '#e5e5e5'
        }} />
      </div>

      {/* Results skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              overflow: 'hidden',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              height: '140px'
            }}
          >
            <div style={{
              width: '100px',
              background: '#e5e5e5'
            }} />
            <div style={{
              flex: 1,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                height: 'var(--icon-base)',
                width: '70%',
                borderRadius: '8px',
                background: '#e5e5e5'
              }} />
              <div style={{
                height: 'var(--icon-sm)',
                width: '40%',
                borderRadius: '8px',
                background: '#e5e5e5'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
