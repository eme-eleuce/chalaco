import WorkDetails from '../../components/trabajos/WorkDetails';

export default function TrabajoDetailPage({ params }) {
  // Intentar convertir el ID a número (si era un string)
  const projectId = isNaN(parseInt(params.id)) ? params.id : parseInt(params.id);
  
  console.log('Página TrabajoDetailPage - ID recibido:', params.id);
  console.log('Página TrabajoDetailPage - ID procesado:', projectId);
  
  return (
    <main className="min-h-screen">
      <WorkDetails projectId={projectId} />
    </main>
  );
}
