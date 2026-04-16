interface AuthLayoutProps {
  children: React.ReactNode;
  footerText?: string;
}

export default function AuthLayout({ children, footerText = 'Track LEGO minifig prices with real-time Bricklink data' }: AuthLayoutProps) {
  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px'
      }}>
        {/* Form Card */}
        <div className="auth-card" style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '64px',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)'
        }}>
          {children}
        </div>

        {/* Footer Text */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.6'
          }}>
            {footerText}
          </p>
        </div>
      </div>
    </div>
  );
}
