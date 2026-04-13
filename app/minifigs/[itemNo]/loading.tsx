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
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: '#e5e5e5'
        }} />
        <div style={{
          flex: 1,
          height: '20px',
          borderRadius: '8px',
          background: '#e5e5e5'
        }} />
      </div>

      {/* Main content skeleton */}
      <div style={{
        display: 'flex',
        gap: '32px',
        marginBottom: '48px',
        flexDirection: 'column'
      }}>
        {/* Image skeleton */}
        <div style={{
          width: '300px',
          height: '400px',
          borderRadius: '12px',
          background: '#e5e5e5'
        }} />

        {/* Details skeleton */}
        <div style={{ flex: 1 }}>
          <div style={{
            height: '32px',
            width: '60%',
            borderRadius: '8px',
            background: '#e5e5e5',
            marginBottom: '16px'
          }} />
          <div style={{
            height: '24px',
            width: '40%',
            borderRadius: '8px',
            background: '#e5e5e5',
            marginBottom: '32px'
          }} />
          <div style={{
            height: '120px',
            borderRadius: '12px',
            background: '#e5e5e5'
          }} />
        </div>
      </div>
    </div>
  );
}
