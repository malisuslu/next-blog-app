/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "img.freepik.com",
      "lh3.googleusercontent.com",
      "images.pexels.com",
      "firebasestorage.googleapis.com",
    ],
  },
};

module.exports = nextConfig;
