// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: '#005689',
      main: '#0084c6',
      bright: '#00b2ff',
      pastel: '#90dcff',
    },
    textColor: {
      DEFAULT: '#005689',
      main: '#0084c6',
      error: '#ab0613',
    },
    backgroundColor: {
      light: '#f1f8fc',
      primary: '#005689',
      main: '#0084c6',
      bright: '#00b2ff',
      pastel: '#90dcff',
      faded: '#f1f8fc',
      error: '#ab0613',
      errorfaded:'#c70000',
    },
  },
},

  plugins: [],
};
