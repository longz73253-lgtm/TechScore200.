/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations de performance
  reactStrictMode: true,

  // Compression
  compress: true,

  // Optimisation du build
  swcMinify: true,

  // Optimisation des polices
  optimizeFonts: true,
};

export default nextConfig;
