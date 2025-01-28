/**
 * PostCSS Configuration
 * This file configures the CSS processing pipeline
 * 
 * Plugins:
 * - tailwindcss: Process Tailwind CSS classes
 * - autoprefixer: Add vendor prefixes
 * - cssnano: Minify CSS in production
 */
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false }
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: { removeAll: true },
      }],
    } : false
  },
}
