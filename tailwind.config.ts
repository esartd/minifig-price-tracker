import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f59e0b',
        secondary: '#3b82f6',
      },
      // Apple-style 12-column grid system
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      // Consistent spacing based on Apple's design
      spacing: {
        'container-padding': 'clamp(1rem, 5vw, 5rem)',
        'gutter': 'clamp(1rem, 2vw, 2rem)',
      },
      // Container with max-widths
      maxWidth: {
        'container': '1200px',
        'container-sm': '980px',
        'container-lg': '1400px',
      },
    },
  },
  plugins: [],
}
export default config
