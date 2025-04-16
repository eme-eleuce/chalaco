"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

const servicesList = [
  {
    id: 1,
    title: "Fotografía",
    description: "Producción y desarrollo de fotografía publicitaria, editorial y de eventos. Servicios personalizados que van desde la conceptualización creativa hasta la entrega final, adaptados a las necesidades de marcas, medios y particulares.",
    imageUrl: "/photos/2.jpg" // Imagen real de fotografía
  },
  {
    id: 2,
    title: "Producción Audiovisual",
    description: "Con un enfoque 360° en la creación de piezas publicitarias, documentales, musicales, institucionales y cualquier formato requerido. Acompañamos cada etapa del proceso desde la idea hasta la entrega final para ofrecer soluciones creativas y efectivas, adaptadas a las necesidades de cada cliente.",
    imageUrl: "/photos/5.jpg" // Imagen real de producción audiovisual
  },
  {
    id: 3,
    title: "LiveStream",
    description: "Servicios de livestream profesional con sistema multicámara, ideal para eventos corporativos, culturales, deportivos o sociales. Contamos con internet móvil dedicado para asegurar una transmisión fluida y sin interrupciones.",
    imageUrl: "/photos/9.jpg" // Imagen real de livestream
  },
  {
    id: 4,
    title: "Post/VFX",
    description: "Postproducción y efectos visuales (VFX) orientados a la creación de composiciones digitales que hacen posible lo imposible. Utilizamos técnicas en 2D y 3D para integrar elementos visuales que no pueden ser grabados, aportando valor narrativo a través de la edición, colorización y diseño visual.",
    imageUrl: "/photos/1.jpg" // Imagen real de post/vfx
  },
  {
    id: 5,
    title: "Contenido Digital",
    description: "Producción de contenido digital para redes sociales, enfocado en potenciar la presencia de marcas con piezas audiovisuales creativas, dinámicas y adaptadas a cada plataforma. Desarrollamos contenido pensado para conectar con la audiencia y generar impacto.",
    imageUrl: "/photos/8.jpg" // Imagen real de contenido digital
  },
  {
    id: 6,
    title: "Animación 3D",
    description: "Orientada a la creación de personajes, productos hiperrealistas y mundos visuales desde la conceptualización hasta el render final. Damos vida a ideas únicas a través de esta técnica, creando historias visuales que capturan la atención y despiertan emociones.",
    imageUrl: "/photos/7.jpg" // Imagen real de animación 3D
  },
  {
    id: 7,
    title: "Diseño Sonoro",
    description: "Diseño sonoro y musicalización para proyectos audiovisuales y radiales. Creamos efectos de sonido originales, jingles, musicalizaciones y cuñas para radio, cuidando cada detalle para potenciar la identidad sonora de tu marca o historia.",
    imageUrl: "/photos/3.jpg" // Mantenemos placeholder para los servicios sin imagen
  },
  {
    id: 8,
    title: "Gestión de Redes",
    description: "Gestión estratégica de redes sociales, desde la planificación de contenido hasta la publicación, análisis y respuesta a la comunidad. Creamos calendarios visuales alineados con los objetivos de la marca, optimizando el alcance, la interacción y el crecimiento orgánico.",
    imageUrl: "/photos/6.jpg" // Mantenemos placeholder para los servicios sin imagen
  }
];

// Componente para cada servicio individual con animación
const ServiceItem = ({ service, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  // Alternar la posición de la imagen (izquierda/derecha) según el índice
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      ref={ref}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 py-16 border-b border-gray-800`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
    >
      {/* Imagen del servicio */}
      <div className="w-full md:w-2/5">
        <div className="aspect-video relative rounded-xl overflow-hidden">
          {service.imageUrl.includes('placeholder') ? (
            // Mostrar placeholder si no hay imagen real
            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 text-xl font-bold">Imagen de {service.title}</span>
            </div>
          ) : (
            // Mostrar imagen real si existe
            <Image 
              src={service.imageUrl}
              alt={`Imagen de ${service.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover w-full h-full scale-110"
              quality={70}
              priority={index < 2} // Priorizar carga de las primeras imágenes
            />
          )}
        </div>
      </div>
      
      {/* Información del servicio */}
      <div className="w-full md:w-3/5 flex flex-col justify-center space-y-6">
        <h2 className="text-green-500 text-4xl md:text-5xl lg:text-6xl font-black italic tracking-wide leading-tight">
          {service.title}
        </h2>
        <div className="w-20 h-1 bg-white"></div>
        <div className="roboto-font text-justify text-xl md:text-2xl text-white font-light leading-relaxed opacity-90 space-y-4 normal-case">
          {service.description.split('\n').map((paragraph, idx) => (
            paragraph.trim() && <p key={idx} className="normal-case">{paragraph}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal de Servicios
const Services = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: false, amount: 0.3 });
  
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-15 bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Encabezado con animación */}
        <motion.div 
          ref={headerRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="mt-10 mt-10 text-6xl md:text-8xl xl:text-9xl 2xl:text-[12rem] font-black text-white mb-20 text-center tracking-tight leading-none">
            SERVICIOS
          </h1>
          <p className="text-2xl md:text-3xl max-w-3xl mx-auto">
            Ofrecemos una amplia gama de servicios creativos para ayudarte a destacar en el mundo digital y audiovisual.
          </p>
        </motion.div>
        
        {/* Lista de servicios */}
        <div className="space-y-12">
          {servicesList.map((service, index) => (
            <ServiceItem key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;