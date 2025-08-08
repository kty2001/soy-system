/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3f51b5',
        secondary: '#f50057',
        background: '#f5f5f5',
        surface: '#ffffff',
        textPrimary: '#000000',
        textSecondary: '#444444',
        border: '#cccccc',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'round': '50%',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'md': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'lg': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
      },
      screens: {
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
      },
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      fontFamily: {
        'sans': ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'false',
} 

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./public/index.html"
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Primary Colors
//         primary: {
//           50: '#f0f9ff',
//           100: '#e0f2fe', 
//           200: '#bae6fd',
//           300: '#7dd3fc',
//           400: '#38bdf8',
//           500: '#2c5282', // Main primary
//           600: '#1a365d', // Darker primary
//           700: '#164e63',
//           800: '#155e75',
//           900: '#0c4a6e',
//           DEFAULT: '#2c5282'
//         },
        
//         secondary: {
//           50: '#f8fafc',
//           100: '#f1f5f9',
//           200: '#e2e8f0',
//           300: '#cbd5e1',
//           400: '#94a3b8',
//           500: '#64748b',
//           600: '#475569',
//           700: '#334155',
//           800: '#1e293b',
//           900: '#0f172a',
//           DEFAULT: '#64748b'
//         },

//         success: {
//           50: '#f0fff4',
//           100: '#dcfce7',
//           200: '#bbf7d0', 
//           300: '#86efac',
//           400: '#4ade80',
//           500: '#38a169',
//           600: '#16a34a',
//           700: '#15803d',
//           800: '#166534',
//           900: '#14532d',
//           DEFAULT: '#38a169'
//         },

//         warning: {
//           50: '#fffbeb',
//           100: '#fef3c7',
//           200: '#fde68a',
//           300: '#fcd34d', 
//           400: '#fbbf24',
//           500: '#d69e2e',
//           600: '#d97706',
//           700: '#b45309',
//           800: '#92400e',
//           900: '#78350f',
//           DEFAULT: '#d69e2e'
//         },

//         danger: {
//           50: '#fef2f2',
//           100: '#fee2e2',
//           200: '#fecaca',
//           300: '#fca5a5',
//           400: '#f87171',
//           500: '#e53e3e',
//           600: '#dc2626',
//           700: '#b91c1c', 
//           800: '#991b1b',
//           900: '#7f1d1d',
//           DEFAULT: '#e53e3e'
//         },

//         info: {
//           50: '#eff6ff',
//           100: '#dbeafe',
//           200: '#bfdbfe',
//           300: '#93c5fd',
//           400: '#60a5fa',
//           500: '#3182ce',
//           600: '#2563eb',
//           700: '#1d4ed8',
//           800: '#1e40af',
//           900: '#1e3a8a',
//           DEFAULT: '#3182ce'
//         },

//         background: {
//           50: '#ffffff',
//           100: '#f8fafc',
//           200: '#f1f5f9',
//           300: '#e2e8f0',
//           400: '#cbd5e1',
//           500: '#94a3b8',
//           DEFAULT: '#f7fafc'
//         },

//         surface: {
//           50: '#ffffff',
//           100: '#f8fafc', 
//           200: '#f1f5f9',
//           300: '#e2e8f0',
//           DEFAULT: '#ffffff' 
//         },

    
//         textPrimary: '#2d3748',
//         textSecondary: '#4a5568', 
//         textMuted: '#718096',
//         textLight: '#a0aec0',

//         // Border Colors
//         border: {
//           50: '#f7fafc',
//           100: '#edf2f7',
//           200: '#e2e8f0', // Main border
//           300: '#cbd5e1',
//           400: '#a0aec0',
//           DEFAULT: '#e2e8f0'
//         },

//         borderLight: '#f0f4f8'
//       },

//       // 그라데이션 색상
//       backgroundImage: {
//         'gradient-primary': 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
//         'gradient-surface': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
//         'gradient-packaging': 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%)'
//       },

//       // 그림자
//       boxShadow: {
//         'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         'DEFAULT': '0 4px 6px rgba(0, 0, 0, 0.05)',
//         'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//         'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
//         'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
//         'packaging': '0 8px 25px rgba(26, 54, 93, 0.15)',
//         'packaging-lg': '0 15px 35px rgba(26, 54, 93, 0.2)'
//       },

//       // 폰트 패밀리
//       fontFamily: {
//         'noto': ['Noto Sans KR', 'sans-serif'],
//         'sans': ['Noto Sans KR', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
//       },

//       // 애니메이션 속도
//       transitionDuration: {
//         'fast': '200ms',
//         'normal': '300ms', 
//         'slow': '500ms'
//       },

//       // 커스텀 spacing
//       spacing: {
//         '18': '4.5rem',
//         '88': '22rem',
//         '128': '32rem'
//       },

//       // 반응형 breakpoints
//       screens: {
//         'xs': '475px',
//         '3xl': '1920px'
//       }
//     }
//   },
//   plugins: [
//     // 커스텀 유틸리티 추가
//     function({ addUtilities }) {
//       const newUtilities = {
//         '.text-gradient-primary': {
//           background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
//           '-webkit-background-clip': 'text',
//           '-webkit-text-fill-color': 'transparent',
//           'background-clip': 'text'
//         },
//         '.backdrop-blur-packaging': {
//           'backdrop-filter': 'blur(10px)',
//           '-webkit-backdrop-filter': 'blur(10px)'
//         }
//       }
//       addUtilities(newUtilities)
//     }
//   ]
// }
