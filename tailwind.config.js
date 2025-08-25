/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                bg: {
                    DEFAULT: '#0B0F14',
                    light: '#FFFFFF',
                },
                surface: {
                    DEFAULT: '#121821',
                    light: '#F8FAFC',
                },
                card: {
                    DEFAULT: '#17202B',
                    light: '#FFFFFF',
                },
                primary: {
                    DEFAULT: '#7C5CFC',
                    contrast: '#FFFFFF',
                    light: '#7C5CFC',
                },
                accent: {
                    DEFAULT: '#22C55E',
                    light: '#22C55E',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    light: '#F59E0B',
                },
                danger: {
                    DEFAULT: '#EF4444',
                    light: '#EF4444',
                },
                muted: {
                    DEFAULT: '#94A3B8',
                    light: '#64748B',
                },
                text: {
                    DEFAULT: '#E5E7EB',
                    light: '#1F2937',
                },
            },
            fontSize: {
                base: ['16px', { lineHeight: '1.5' }],
                sm: ['14px', { lineHeight: '1.5' }],
                lg: ['18px', { lineHeight: '1.5' }],
                xl: ['20px', { lineHeight: '1.4' }],
                '2xl': ['24px', { lineHeight: '1.3' }],
            },
            borderRadius: {
                DEFAULT: '12px',
                lg: '16px',
                xl: '20px',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            minHeight: {
                'touch': '44px',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
                'soft-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
            },
            transitionDuration: {
                '150': '150ms',
                '200': '200ms',
            },
        },
    },
    plugins: [],
}
