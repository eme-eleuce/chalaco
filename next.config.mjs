/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para imágenes
  images: {
    domains: ['bsrvywfejjtrrcobljvv.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bsrvywfejjtrrcobljvv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // Asegurarse de que las rutas sean case-insensitive
  async rewrites() {
    return [
      {
        source: '/servicios',
        destination: '/servicios',
      },
      {
        source: '/Servicios',
        destination: '/servicios',
      },
      {
        source: '/SERVICIOS',
        destination: '/servicios',
      }
    ];
  },
};

export default nextConfig;
