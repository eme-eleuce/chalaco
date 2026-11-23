import Nosotros from '../components/Nosotros';

export const metadata = {
  title: 'Nosotros',
  description:
    'Chalaco Films es una productora audiovisual de Guayaquil. Conoce nuestra visión, equipo y enfoque creativo en cine, publicidad y fotografía.',
  alternates: { canonical: '/nosotros' },
  openGraph: {
    title: 'Nosotros | Chalaco Films',
    description:
      'Productora audiovisual de Guayaquil. Historia, visión y compromiso creativo detrás de Chalaco Films.',
    url: '/nosotros',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function NosotrosPage() {
  return (
    <main className="min-h-screen">
      <Nosotros />
    </main>
  );
}
