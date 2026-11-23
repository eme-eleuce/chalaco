import Services from '../components/Services';

export const metadata = {
  title: 'Servicios',
  description:
    'Servicios de Chalaco Films: fotografía, producción audiovisual, livestream, postproducción y VFX, contenido digital, animación 3D, diseño sonoro y gestión de redes.',
  alternates: { canonical: '/servicios' },
  openGraph: {
    title: 'Servicios | Chalaco Films',
    description:
      'Fotografía, producción audiovisual, livestream, post/VFX, contenido digital, animación 3D, diseño sonoro y gestión de redes en Guayaquil.',
    url: '/servicios',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function ServiciosPage() {
  return <Services />;
}
