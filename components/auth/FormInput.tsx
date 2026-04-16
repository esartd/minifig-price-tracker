interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
}

export default function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
  minLength,
}: FormInputProps) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label htmlFor={id} style={{
        display: 'block',
        fontSize: 'var(--text-sm)',
        fontWeight: '500',
        color: '#525252',
        marginBottom: '12px',
        letterSpacing: '0.01em'
      }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        minLength={minLength}
        style={{
          width: '100%',
          padding: '16px 20px',
          fontSize: 'var(--text-base)',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          color: '#171717',
          background: 'white',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s'
        }}
        placeholder={placeholder}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#e5e5e5';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
