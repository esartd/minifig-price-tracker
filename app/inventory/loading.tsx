export default function Loading() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 16px'
    }}>
      {/* Header skeleton */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          height: '32px',
          width: '200px',
          borderRadius: '8px',
          background: '#e5e5e5'
        }} />
        <div style={{
          height: '40px',
          width: '120px',
          borderRadius: '8px',
          background: '#e5e5e5'
        }} />
      </div>

      {/* Items skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              padding: '20px',
              gap: '16px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e5e5'
            }}
          >
            {/* Image skeleton */}
            <div style={{
              width: '80px',
              height: '100px',
              borderRadius: '8px',
              background: '#e5e5e5'
            }} />

            {/* Info skeleton */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <div style={{
                height: '18px',
                width: '60%',
                borderRadius: '8px',
                background: '#e5e5e5'
              }} />
              <div style={{
                height: '14px',
                width: '30%',
                borderRadius: '8px',
                background: '#e5e5e5'
              }} />
              <div style={{
                height: '20px',
                width: '40%',
                borderRadius: '8px',
                background: '#e5e5e5'
              }} />
            </div>

            {/* Actions skeleton */}
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '108px',
                height: '32px',
                borderRadius: '8px',
                background: '#e5e5e5'
              }} />
              <div style={{
                width: '32px',
                height: '32px',
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
