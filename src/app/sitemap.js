export default async function sitemap() {
  // URLs base del sitio
  const baseUrl = 'https://www.chalacofilms.com';
  
  // Rutas principales del sitio
  const routes = [
    '',
    '/trabajos',
    '/nosotros',
    '/servicios',
    '/contacto',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
