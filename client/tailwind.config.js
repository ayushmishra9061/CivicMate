export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        civic: {
          ink: '#18212f',
          blue: '#2563eb',
          green: '#059669',
          amber: '#d97706',
          red: '#dc2626'
        }
      },
      boxShadow: {
        soft: '0 16px 50px rgba(24, 33, 47, 0.12)'
      }
    }
  },
  plugins: []
};
