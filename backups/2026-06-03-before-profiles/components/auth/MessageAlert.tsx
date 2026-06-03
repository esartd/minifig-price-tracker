interface MessageAlertProps {
  type: 'error' | 'success';
  message: string;
}

export default function MessageAlert({ type, message }: MessageAlertProps) {
  const styles = {
    error: {
      background: '#fee2e2',
      border: '1px solid #fca5a5',
      color: '#991b1b',
    },
    success: {
      background: '#d1fae5',
      border: '1px solid #6ee7b7',
      color: '#065f46',
    },
  };

  const style = styles[type];

  return (
    <div style={{
      marginBottom: '32px',
      padding: '16px 20px',
      background: style.background,
      border: style.border,
      borderRadius: '12px'
    }}>
      <p style={{
        fontSize: 'var(--text-sm)',
        color: style.color,
        fontWeight: '500'
      }}>
        {message}
      </p>
    </div>
  );
}
