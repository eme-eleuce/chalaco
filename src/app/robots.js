export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: 'https://www.chalacofilms.com/sitemap.xml',
    host: 'https://www.chalacofilms.com',
  };
}
