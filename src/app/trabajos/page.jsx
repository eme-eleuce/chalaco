import Showcase from '../components/trabajos/Showcase'

export const metadata = {
  title: 'Trabajos | Chalaco Films',
  description: 'Explora nuestro portafolio de proyectos audiovisuales: producción publicitaria, cinematográfica, corporativa y documental',
};

export default function TrabajosPage() {
  return (
    <main className="min-h-screen">
      <Showcase />
    </main>
  )
}
