/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Environment variables
  env: {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  },

  // Image configuration
  images: {
    // Allow images from YouTube domains
    domains: [
      'i.ytimg.com',    // YouTube thumbnail images
      'img.youtube.com', // YouTube channel images
    ],
  },
};

module.exports = nextConfig; 