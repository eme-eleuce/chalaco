/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
