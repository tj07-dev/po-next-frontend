/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     domains: ['i.pravatar.cc'],
//   },
// };
// module.exports = nextConfig;

const nextConfig = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});
module.exports = nextConfig({ reactStrictMode: true, swcMinify: true });

// module.exports = withPWA({});
