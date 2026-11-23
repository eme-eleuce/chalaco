import Contact from '../components/Contact';

export const metadata = {
  title: 'Contacto',
  description:
    'Contacta a Chalaco Films en Guayaquil para tu próximo proyecto audiovisual. Escríbenos a info@chalacofilms.com o por Instagram @chalacofilms.',
  alternates: { canonical: '/contacto' },
  openGraph: {
    title: 'Contacto | Chalaco Films',
    description:
      'Hablemos de tu proyecto. Chalaco Films — productora audiovisual en Guayaquil, Ecuador.',
    url: '/contacto',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function ContactoPage() {
  return <Contact />;
}
