/**
 * PostCSS Configuration
 * 
 * Configures PostCSS plugins for CSS processing:
 * - TailwindCSS integration
 * - CSS optimization and transformation
 * - Custom plugin configuration
 * 
 * @type {import('postcss').ConfigurationFile}
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // TailwindCSS processor
  },
};

export default config;
