/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui colors
        border: 'var(--cms-border-secondary)',
        input: 'var(--cms-border-secondary)',
        ring: 'var(--cms-primary)',
        background: 'var(--cms-bg-primary)',
        foreground: 'var(--cms-text-primary)',
        muted: {
          DEFAULT: 'var(--cms-bg-secondary)',
          foreground: 'var(--cms-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--cms-bg-hover)',
          foreground: 'var(--cms-text-primary)',
        },
        popover: {
          DEFAULT: 'var(--cms-bg-primary)',
          foreground: 'var(--cms-text-primary)',
        },

        // 品牌色
        primary: 'var(--cms-primary)',
        'primary-hover': 'var(--cms-primary-hover)',
        'primary-light': 'var(--cms-primary-light)',
        'primary-lighter': 'var(--cms-primary-lighter)',
        'primary-lightest': 'var(--cms-primary-lightest)',
        secondary: 'var(--cms-secondary)',
        'secondary-light': 'var(--cms-secondary-light)',
        'secondary-lighter': 'var(--cms-secondary-lighter)',

        // 語義色
        success: 'var(--cms-success)',
        danger: 'var(--cms-danger)',
        'danger-hover': 'var(--cms-danger-hover)',

        // 文字色
        'text-primary': 'var(--cms-text-primary)',
        'text-secondary': 'var(--cms-text-secondary)',
        'text-tertiary': 'var(--cms-text-tertiary)',
        'text-muted': 'var(--cms-text-muted)',
        'text-disabled': 'var(--cms-text-disabled)',

        // 背景色
        'bg-primary': 'var(--cms-bg-primary)',
        'bg-secondary': 'var(--cms-bg-secondary)',
        'bg-tertiary': 'var(--cms-bg-tertiary)',
        'bg-quaternary': 'var(--cms-bg-quaternary)',
        'bg-hover': 'var(--cms-bg-hover)',

        // 邊框色
        'border-primary': 'var(--cms-border-primary)',
        'border-secondary': 'var(--cms-border-secondary)',
        'border-tertiary': 'var(--cms-border-tertiary)',
        'border-light': 'var(--cms-border-light)',

        // 滾動條
        'scrollbar-track': 'var(--cms-scrollbar-track)',
        'scrollbar-thumb': 'var(--cms-scrollbar-thumb)',
        'scrollbar-thumb-hover': 'var(--cms-scrollbar-thumb-hover)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
