/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations de performance
  reactStrictMode: true,
  
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Compression
  compress: true,
  
  // Optimisation du build
  swcMinify: true,
  
  // Optimisation des polices
  optimizeFonts: true,
};

export default nextConfig;
