// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        // pdfjs-dist has an optional require('canvas') for Node.
        // In the browser build we don't want it resolved.
        canvas: false,
      };
      return config;
    },
  };
  
  module.exports = nextConfig;
  