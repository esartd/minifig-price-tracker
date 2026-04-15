interface BadgeProps {
  icon: React.ReactNode;
  text: string;
  variant?: 'primary' | 'success';
}

export default function Badge({ icon, text, variant = 'primary' }: BadgeProps) {
  const variantStyles = {
    primary: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      color: '#ffffff',
    },
    success: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#15803d',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        background: style.background,
        border: style.border,
        borderRadius: '32px',
        marginBottom: '40px',
        lineHeight: 1,
      }}
    >
      <div style={{ width: '22px', height: '22px', color: style.color, flexShrink: 0 }}>
        {icon}
      </div>
      <span
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: style.color,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </div>
  );
}
