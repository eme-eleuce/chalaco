import Showcase from '../components/trabajos/Showcase'

export const metadata = {
  title: 'Trabajos',
  description:
    'Portafolio de Chalaco Films: comerciales, videoclips, institucional, documentales y más producciones audiovisuales realizadas en Ecuador.',
  alternates: { canonical: '/trabajos' },
  openGraph: {
    title: 'Trabajos | Chalaco Films',
    description:
      'Explora el portafolio audiovisual de Chalaco Films: publicidad, cine, videoclips y contenido creativo.',
    url: '/trabajos',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function TrabajosPage() {
  return (
    <main className="min-h-screen">
      <Showcase />
    </main>
  )
}
