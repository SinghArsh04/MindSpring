// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
    // any other PostCSS plugins…
  ]
}
