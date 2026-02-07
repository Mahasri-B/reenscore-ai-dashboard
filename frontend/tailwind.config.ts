import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        // 🎮 GAMING CYBERPUNK PALETTE
        neon: {
          pink: '#FF006E',      // Hot pink neon
          purple: '#8338EC',    // Electric purple
          blue: '#3A86FF',      // Cyber blue
          cyan: '#00F5FF',      // Neon cyan
          green: '#06FFA5',     // Matrix green
          yellow: '#FFBE0B',    // Warning yellow
          orange: '#FB5607',    // Energy orange
        },
        dark: {
          950: '#050814',       // Deepest black
          900: '#0A0E27',       // Main background
          800: '#151932',       // Card background
          700: '#1E2139',       // Elevated surface
          600: '#252A48',       // Border
          500: '#2D3250',       // Hover state
        },
        glow: {
          pink: 'rgba(255, 0, 110, 0.5)',
          purple: 'rgba(131, 56, 236, 0.5)',
          blue: 'rgba(58, 134, 255, 0.5)',
          cyan: 'rgba(0, 245, 255, 0.5)',
          green: 'rgba(6, 255, 165, 0.5)',
        },
        // Legacy compatibility
        energy: {
          400: '#06FFA5',
          500: '#06FFA5',
          600: '#05CC84',
        },
        accent: {
          400: '#FF006E',
          500: '#FF006E',
          600: '#CC0058',
=======
        // Aurora surface colors
        aurora: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#0a0f1a',
          surface: '#111827',
          'surface-light': '#1e293b',
        },
        // Violet accent scale
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
>>>>>>> d05045a (hk commit full ui refreshed)
        },
        cyber: {
          400: '#00F5FF',
          500: '#00F5FF',
          600: '#00C4CC',
        },
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(135deg, #0A0E27 0%, #1E2139 50%, #0A0E27 100%)',
        'neon-gradient': 'linear-gradient(135deg, #FF006E 0%, #8338EC 50%, #3A86FF 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00F5FF 0%, #8338EC 50%, #FF006E 100%)',
        'matrix-gradient': 'linear-gradient(180deg, #06FFA5 0%, #00F5FF 100%)',
        'cyber-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238338EC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'hex-pattern': "url(\"data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FF006E' fill-opacity='0.03'%3E%3Cpolygon points='13.99 9.25 13.99 1.5 17.5 0 21.01 1.5 21.01 9.25 17.5 10.75'/%3E%3Cpolygon points='13.99 39.25 13.99 31.5 17.5 30 21.01 31.5 21.01 39.25 17.5 40.75'/%3E%3Cpolygon points='0 24.25 0 16.5 3.51 15 7.02 16.5 7.02 24.25 3.51 25.75'/%3E%3Cpolygon points='27.99 24.25 27.99 16.5 24.48 15 20.97 16.5 20.97 24.25 24.48 25.75'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.6), 0 0 40px rgba(255, 0, 110, 0.3), 0 0 60px rgba(255, 0, 110, 0.1)',
        'neon-purple': '0 0 20px rgba(131, 56, 236, 0.6), 0 0 40px rgba(131, 56, 236, 0.3), 0 0 60px rgba(131, 56, 236, 0.1)',
        'neon-blue': '0 0 20px rgba(58, 134, 255, 0.6), 0 0 40px rgba(58, 134, 255, 0.3), 0 0 60px rgba(58, 134, 255, 0.1)',
        'neon-cyan': '0 0 20px rgba(0, 245, 255, 0.6), 0 0 40px rgba(0, 245, 255, 0.3), 0 0 60px rgba(0, 245, 255, 0.1)',
        'neon-green': '0 0 20px rgba(6, 255, 165, 0.6), 0 0 40px rgba(6, 255, 165, 0.3), 0 0 60px rgba(6, 255, 165, 0.1)',
        'gaming': '0 8px 32px rgba(131, 56, 236, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'cyber': '0 0 30px rgba(0, 245, 255, 0.5), inset 0 0 20px rgba(0, 245, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
<<<<<<< HEAD
        'flicker': 'flicker 3s linear infinite',
        'glitch': 'glitch 1s linear infinite',
=======
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'aurora-flow': 'auroraFlow 8s ease-in-out infinite',
        'particle-float': 'particleFloat 10s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'aurora-pulse': 'auroraPulse 4s ease-in-out infinite alternate',
>>>>>>> d05045a (hk commit full ui refreshed)
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.4), 0 0 30px rgba(131, 56, 236, 0.2)',
            filter: 'brightness(1)',
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(255, 0, 110, 0.8), 0 0 60px rgba(131, 56, 236, 0.6), 0 0 80px rgba(58, 134, 255, 0.4)',
            filter: 'brightness(1.2)',
          },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)',
            opacity: '1',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 245, 255, 0.8), 0 0 60px rgba(131, 56, 236, 0.6)',
            opacity: '0.8',
          },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0' },
          '43%': { opacity: '0' },
          '43.01%': { opacity: '1' },
          '47.99%': { opacity: '1' },
          '48%': { opacity: '0' },
          '49%': { opacity: '0' },
          '49.01%': { opacity: '1' },
        },
<<<<<<< HEAD
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
=======
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)' },
        },
        auroraFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        particleFloat: {
          '0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.6' },
          '33%': { transform: 'translateY(-30px) translateX(20px) scale(1.1)', opacity: '0.8' },
          '66%': { transform: 'translateY(-10px) translateX(-15px) scale(0.9)', opacity: '0.5' },
          '100%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        auroraPulse: {
          '0%': { opacity: '0.4', transform: 'scale(1)' },
          '100%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'aurora-gradient': 'linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6)',
      },
>>>>>>> d05045a (hk commit full ui refreshed)
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
