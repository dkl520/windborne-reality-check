module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        ping: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
};