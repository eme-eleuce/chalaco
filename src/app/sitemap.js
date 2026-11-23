import { createClient } from '@supabase/supabase-js';

const baseUrl = 'https://www.chalacofilms.com';

export default async function sitemap() {
  const routes = ['', '/trabajos', '/nosotros', '/servicios', '/contacto'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  let projectRoutes = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase
        .from('page')
        .select('id, created_at')
        .order('id', { ascending: false });

      projectRoutes = (data || []).map((project) => ({
        url: `${baseUrl}/trabajos/${project.id}`,
        lastModified: project.created_at || new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error al generar sitemap de trabajos:', error);
  }

  return [...routes, ...projectRoutes];
}
