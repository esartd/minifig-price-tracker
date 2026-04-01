// Color palette
export const colors = {
  primary: {
    blue: '#007aff',
    blueDark: '#0071e3',
  },
  gray: {
    50: '#fafafa',
    100: '#f5f5f7',
    200: '#e8e8ed',
    300: '#d2d2d7',
    400: '#86868b',
    500: '#6b7280',
    600: '#424245',
    900: '#1d1d1f',
  },
  green: {
    700: '#15803d',
  },
  red: {
    50: '#fef2f2',
    200: '#fecaca',
    600: '#dc2626',
  },
  background: '#f0f0f2',
};

// Border radius values
export const borderRadius = {
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
};

// Gradient styles
export const gradients = {
  primary: 'linear-gradient(135deg, #007aff 0%, #0071e3 100%)',
  primaryAlpha: 'linear-gradient(135deg, rgba(0, 122, 255, 0.95) 0%, rgba(0, 113, 227, 0.95) 100%)',
  text: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
};

// Shadow styles
export const shadows = {
  sm: '0 1px 3px rgba(0, 122, 255, 0.3)',
  md: '0 2px 6px rgba(0, 122, 255, 0.4)',
  card: '0 4px 24px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
  cardHover: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
};

// Animation easings
export const easings = {
  smooth: 'cubic-bezier(0.14, 1, 0.34, 1)',
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// Breakpoints (matches Tailwind defaults)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
