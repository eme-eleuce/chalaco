// No se necesita "use client" aquí porque es una página del servidor

import Services from '../components/Services';

export const metadata = {
  title: 'Servicios | Chalaco Films',
  description: 'Conoce los servicios audiovisuales que ofrece Chalaco Films: producción publicitaria, cinematográfica, corporativa, documental y creativa',
};

export default function ServiciosPage() {
  return <Services />;
}
