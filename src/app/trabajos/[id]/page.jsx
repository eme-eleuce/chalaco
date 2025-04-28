import WorkDetails from '../../components/trabajos/WorkDetails';
import { createClient } from '@supabase/supabase-js';

// Función para generar metadatos dinámicos basados en el ID del proyecto
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const projectId = isNaN(parseInt(resolvedParams.id)) ? resolvedParams.id : parseInt(resolvedParams.id);
  
  // Inicializar cliente Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Intentar con múltiples formatos para asegurar que encontramos el proyecto
    let projectData = null;
    
    // Intento 1: Como está
    const result1 = await supabase
      .from('page')
      .select('*')
      .eq('id', projectId)
      .single();
    
    // Intento 2: Como número
    const result2 = await supabase
      .from('page')
      .select('*')
      .eq('id', parseInt(projectId))
      .single();
    
    // Intento 3: Como string
    const result3 = await supabase
      .from('page')
      .select('*')
      .eq('id', String(projectId))
      .single();
    
    // Usar el primer resultado exitoso
    if (result1.data) {
      projectData = result1.data;
    } else if (result2.data) {
      projectData = result2.data;
    } else if (result3.data) {
      projectData = result3.data;
    }
    
    // Si encontramos el proyecto, devolver metadatos personalizados
    if (projectData && projectData.title) {
      return {
        title: `${projectData.title} | Chalaco Films`,
        description: projectData.description || 'Proyecto audiovisual de Chalaco Films',
      };
    }
  } catch (error) {
    console.error('Error al obtener metadatos:', error);
    // En caso de error, continuamos para devolver metadatos genéricos
  }
  
  // Metadatos por defecto si no se encuentra el proyecto
  return {
    title: 'Trabajo | Chalaco Films',
    description: 'Detalles de proyecto audiovisual de Chalaco Films',
  };
}

export default async function TrabajoDetailPage({ params }) {
  // Asegurarse de que params sea esperado antes de acceder a sus propiedades
  const resolvedParams = await params;
  
  // Intentar convertir el ID a número (si era un string)
  const projectId = isNaN(parseInt(resolvedParams.id)) ? resolvedParams.id : parseInt(resolvedParams.id);
  
  return (
    <main className="min-h-screen">
      <WorkDetails projectId={projectId} />
    </main>
  );
}
