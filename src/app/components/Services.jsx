"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

const servicesList = [
  {
    id: 1,
    title: "Fotografía",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.",
    imageUrl: "/placeholder-gray.jpg" // Placeholder por ahora
  },
  {
    id: 2,
    title: "Producción Audiovisual",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.",
    imageUrl: "/placeholder-gray.jpg"
  },
  {
    id: 3,
    title: "LiveStream",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.",
    imageUrl: "/placeholder-gray.jpg"
  },
  {
    id: 4,
    title: "Post/VFX",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.",
    imageUrl: "/placeholder-gray.jpg"
  },
  {
    id: 5,
    title: "Contenido Digital",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.",
    imageUrl: "/placeholder-gray.jpg"
  },
  {
    id: 6,
    title: "Animación 3D",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.",
    imageUrl: "/placeholder-gray.jpg"
  },
  {
    id: 7,
    title: "Diseño Sonoro",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.",
    imageUrl: "/placeholder-gray.jpg"
  },
  {
    id: 8,
    title: "Gestión de Redes",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.",
    imageUrl: "/placeholder-gray.jpg"
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
      <div className="w-full md:w-1/2">
        <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-700">
          {/* Placeholder gris por ahora */}
          <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 text-xl font-bold">Imagen de {service.title}</span>
          </div>
        </div>
      </div>
      
      {/* Información del servicio */}
      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic text-white tracking-wide leading-tight">
          {service.title}
        </h2>
        <div className="w-20 h-1 bg-white"></div>
        <div className="text-xl md:text-2xl text-white font-light leading-relaxed opacity-90 space-y-4 normal-case">
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
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Encabezado con animación */}
        <motion.div 
          ref={headerRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-wider">
            SERVICIOS
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-80">
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