// Unified Design System for consistent UI elements

export const DesignSystem = {
  // Button Styles
  button: {
    primary: {
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      background: '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none'
    },
    primaryDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    secondary: {
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#525252',
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none'
    },
    small: {
      padding: '12px 24px',
      fontSize: '15px',
      fontWeight: '500'
    }
  },

  // Input Styles
  input: {
    base: {
      width: '100%',
      padding: '16px 20px',
      fontSize: '16px',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      color: '#171717',
      background: '#ffffff',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    disabled: {
      background: '#f5f5f5',
      color: '#737373',
      cursor: 'not-allowed'
    }
  },

  // Select/Dropdown Styles
  select: {
    base: {
      padding: '16px 20px',
      fontSize: '16px',
      fontWeight: '500',
      color: '#525252',
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s'
    }
  },

  // Label Styles
  label: {
    base: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#525252',
      marginBottom: '12px',
      letterSpacing: '0.01em'
    }
  },

  // Link Styles
  link: {
    primary: {
      color: '#3b82f6',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    button: {
      display: 'inline-block',
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      background: '#3b82f6',
      borderRadius: '8px',
      textDecoration: 'none',
      transition: 'all 0.2s'
    }
  },

  // Focus States
  focus: {
    ring: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },

  // Helper function to merge styles
  merge: (...styles: any[]) => Object.assign({}, ...styles)
};

// Focus handlers for inputs
export const inputFocusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#3b82f6';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#e5e5e5';
    e.currentTarget.style.boxShadow = 'none';
  }
};
