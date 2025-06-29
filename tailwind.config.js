/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in-down': 'fade-in-down 0.8s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'fade-in': 'fade-in 1s ease-out',
        'slide-right': 'slide-right 1.5s ease-out',
        'slide-left': 'slide-left 1.5s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-right': {
          '0%': {
            width: '0',
          },
          '100%': {
            width: '2rem',
          },
        },
        'slide-left': {
          '0%': {
            width: '0',
          },
          '100%': {
            width: '2rem',
          },
        },
        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translateX(-5px)',
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translateX(5px)',
          },
        },
      },
      animationDelay: {
        '300': '0.3s',
        '500': '0.5s',
        '2000': '2s',
        '4000': '4s',
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        'white': {
          '5': 'rgba(255, 255, 255, 0.05)',
          '10': 'rgba(255, 255, 255, 0.1)',
          '20': 'rgba(255, 255, 255, 0.2)',
          '30': 'rgba(255, 255, 255, 0.3)',
        }
      }
    },
  },
  plugins: [],
}
