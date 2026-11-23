import WorkDetails from '../../components/trabajos/WorkDetails';
import { createClient } from '@supabase/supabase-js';

function truncate(text, max = 160) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function projectImageUrl(storageFolder) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !storageFolder) return '/photos/logob.png';
  return `${supabaseUrl}/storage/v1/object/public/chalaco/${storageFolder}/image1_thumb.jpg`;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const projectId = isNaN(parseInt(resolvedParams.id))
    ? resolvedParams.id
    : parseInt(resolvedParams.id);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      title: 'Trabajo',
      description: 'Proyecto audiovisual de Chalaco Films',
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    let projectData = null;

    const result1 = await supabase.from('page').select('*').eq('id', projectId).single();
    const result2 = await supabase.from('page').select('*').eq('id', parseInt(projectId)).single();
    const result3 = await supabase.from('page').select('*').eq('id', String(projectId)).single();

    if (result1.data) projectData = result1.data;
    else if (result2.data) projectData = result2.data;
    else if (result3.data) projectData = result3.data;

    if (projectData?.name) {
      const title = projectData.name;
      const description = truncate(
        projectData.description ||
          `Proyecto audiovisual de Chalaco Films${projectData.client ? ` para ${projectData.client}` : ''}.`
      );
      const image = projectImageUrl(projectData.storage_folder);
      const path = `/trabajos/${projectData.id}`;

      return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
          title: `${title} | Chalaco Films`,
          description,
          type: 'article',
          url: path,
          locale: 'es_EC',
          siteName: 'Chalaco Films',
          images: [
            {
              url: image,
              width: 800,
              height: 600,
              alt: title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${title} | Chalaco Films`,
          description,
          images: [image],
        },
      };
    }
  } catch (error) {
    console.error('Error al obtener metadatos:', error);
  }

  return {
    title: 'Trabajo',
    description: 'Detalles de proyecto audiovisual de Chalaco Films',
  };
}

export default async function TrabajoDetailPage({ params }) {
  const resolvedParams = await params;
  const projectId = isNaN(parseInt(resolvedParams.id))
    ? resolvedParams.id
    : parseInt(resolvedParams.id);

  return (
    <main className="min-h-screen">
      <WorkDetails projectId={projectId} />
    </main>
  );
}
