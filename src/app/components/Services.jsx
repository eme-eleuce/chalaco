"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useInView } from 'framer-motion';

const servicesList = [
  {
    id: 1,
    title: "Fotografía",
    description: "Producción y desarrollo de fotografía publicitaria, editorial y de eventos. Servicios personalizados que van desde la conceptualización creativa hasta la entrega final, adaptados a las necesidades de marcas, medios y particulares.",
    imageUrl: "/photos/2.jpg"
  },
  {
    id: 2,
    title: "Producción Audiovisual",
    description: "Con un enfoque 360° en la creación de piezas publicitarias, documentales, musicales, institucionales y cualquier formato requerido. Acompañamos cada etapa del proceso desde la idea hasta la entrega final para ofrecer soluciones creativas y efectivas, adaptadas a las necesidades de cada cliente.",
    imageUrl: "/photos/5.jpg"
  },
  {
    id: 3,
    title: "LiveStream",
    description: "Servicios de livestream profesional con sistema multicámara, ideal para eventos corporativos, culturales, deportivos o sociales. Contamos con internet móvil dedicado para asegurar una transmisión fluida y sin interrupciones.",
    imageUrl: "/photos/9.jpg"
  },
  {
    id: 4,
    title: "Post/VFX",
    description: "Postproducción y efectos visuales (VFX) orientados a la creación de composiciones digitales que hacen posible lo imposible. Utilizamos técnicas en 2D y 3D para integrar elementos visuales que no pueden ser grabados, aportando valor narrativo a través de la edición, colorización y diseño visual.",
    imageUrl: "/photos/1.jpg"
  },
  {
    id: 5,
    title: "Contenido Digital",
    description: "Producción de contenido digital para redes sociales, enfocado en potenciar la presencia de marcas con piezas audiovisuales creativas, dinámicas y adaptadas a cada plataforma. Desarrollamos contenido pensado para conectar con la audiencia y generar impacto.",
    imageUrl: "/photos/8.jpg"
  },
  {
    id: 6,
    title: "Animación 3D",
    description: "Orientada a la creación de personajes, productos hiperrealistas y mundos visuales desde la conceptualización hasta el render final. Damos vida a ideas únicas a través de esta técnica, creando historias visuales que capturan la atención y despiertan emociones.",
    imageUrl: "/photos/7.jpg"
  },
  {
    id: 7,
    title: "Diseño Sonoro",
    description: "Diseño sonoro y musicalización para proyectos audiovisuales y radiales. Creamos efectos de sonido originales, jingles, musicalizaciones y cuñas para radio, cuidando cada detalle para potenciar la identidad sonora de tu marca o historia.",
    imageUrl: "/photos/3.jpg"
  },
  {
    id: 8,
    title: "Gestión de Redes",
    description: "Gestión estratégica de redes sociales, desde la planificación de contenido hasta la publicación, análisis y respuesta a la comunidad. Creamos calendarios visuales alineados con los objetivos de la marca, optimizando el alcance, la interacción y el crecimiento orgánico.",
    imageUrl: "/photos/6.jpg"
  }
];

const ServiceCard = ({ service, index, onOpen }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.button
      type="button"
      ref={ref}
      onClick={() => {
        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
          onOpen();
        }
      }}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-left transition-colors duration-300 hover:border-green-500/50 hover:bg-white/[0.06] md:cursor-default"
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 2) * 0.08 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.imageUrl}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          quality={70}
          priority={index < 4}
        />
        {/* Precarga la URL estática para que el modal móvil la muestre al instante */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.imageUrl} alt="" className="hidden" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4 md:p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-wide leading-tight text-green-500">
            {service.title}
          </h2>
          <span className="mt-0.5 shrink-0 text-white/50 text-lg leading-none md:hidden" aria-hidden>
            +
          </span>
        </div>
        <div className="h-0.5 w-8 sm:w-10 bg-white/80" />
        {/* Descripción solo visible en tablet/desktop */}
        <p className="roboto-font hidden normal-case text-sm md:block md:text-base leading-relaxed text-white/80">
          {service.description}
        </p>
      </div>
    </motion.button>
  );
};

const ServiceDetailModal = ({ service, onClose }) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6 md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-detail-title"
        className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#121212] sm:rounded-2xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div className="relative aspect-[16/10] shrink-0 bg-black">
          {/* Misma URL que precarga la card → sale de caché del navegador */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.imageUrl}
            alt={service.title}
            className="absolute inset-0 h-full w-full object-cover"
            decoding="sync"
            fetchPriority="high"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl text-white"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-3">
          <h2
            id="service-detail-title"
            className="text-2xl font-bold tracking-wide leading-tight text-green-500"
          >
            {service.title}
          </h2>
          <div className="h-0.5 w-10 bg-white/80" />
          <p className="roboto-font normal-case text-base leading-relaxed text-white/85">
            {service.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Services = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 });
  const [selected, setSelected] = useState(null);

  // Precarga imágenes en móvil para abrir el detalle sin espera
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    servicesList.forEach((service) => {
      const img = new window.Image();
      img.src = service.imageUrl;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16 pt-24 text-white md:pt-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <motion.div
          ref={headerRef}
          className="mb-10 text-center sm:mb-14 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="mb-6 mt-10 text-5xl font-black tracking-tight leading-none text-white sm:text-6xl md:mb-10 md:text-8xl xl:text-9xl 2xl:text-[12rem]">
            SERVICIOS
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-xl md:text-3xl">
            Ofrecemos una amplia gama de servicios creativos para ayudarte a destacar en el mundo digital y audiovisual.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {servicesList.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onOpen={() => setSelected(service)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <ServiceDetailModal
            service={selected}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Services;
