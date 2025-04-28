"use client";

import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function Nosotros() {
  const titleRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);
  
  const isTitleInView = useInView(titleRef, { once: true, threshold: 0.2 });
  const isSection1InView = useInView(section1Ref, { once: true, threshold: 0.2 });
  const isSection2InView = useInView(section2Ref, { once: true, threshold: 0.2 });
  const isSection3InView = useInView(section3Ref, { once: true, threshold: 0.2 });
  const isSection4InView = useInView(section4Ref, { once: true, threshold: 0.2 });
  const isSection5InView = useInView(section5Ref, { once: true, threshold: 0.2 });
  
  const titleControls = useAnimation();
  const section1Controls = useAnimation();
  const section2Controls = useAnimation();
  const section3Controls = useAnimation();
  const section4Controls = useAnimation();
  const section5Controls = useAnimation();
  
  useEffect(() => {
    if (isTitleInView) {
      titleControls.start({ opacity: 1, y: 0 });
    }
    if (isSection1InView) {
      section1Controls.start({ opacity: 1, y: 0 });
    }
    if (isSection2InView) {
      section2Controls.start({ opacity: 1, y: 0 });
    }
    if (isSection3InView) {
      section3Controls.start({ opacity: 1, y: 0 });
    }
    if (isSection4InView) {
      section4Controls.start({ opacity: 1, y: 0 });
    }
    if (isSection5InView) {
      section5Controls.start({ opacity: 1, y: 0 });
    }
  }, [isTitleInView, isSection1InView, isSection2InView, isSection3InView, isSection4InView, isSection5InView, titleControls, section1Controls, section2Controls, section3Controls, section4Controls, section5Controls]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          ref={titleRef}
          className="mt-10 mt-10 text-6xl md:text-8xl xl:text-9xl 2xl:text-[12rem] font-black text-white mb-20 text-center tracking-tight leading-none"
          initial={{ opacity: 0, y: 50 }}
          animate={titleControls}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          NOSOTROS
        </motion.h1>
        
        {/* Quiénes somos */}
        <motion.div 
          ref={section1Ref}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={section1Controls}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-green-500">Quiénes somos</h2>
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed">
            En Chalaco Films contamos historias que trascienden. Somos una productora audiovisual fundada en Guayaquil, Ecuador, especializada en crear contenido visual de alto impacto para marcas, medios y proyectos editoriales.
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed mt-6">
            Nuestro enfoque combina creatividad cinematográfica, dirección de arte precisa y un storytelling auténtico que conecta.
          </p>
        </motion.div>
        
        {/* Qué hacemos */}
        <motion.div 
          ref={section2Ref}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={section2Controls}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-green-500">Qué hacemos</h2>
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed">
            Desde campañas publicitarias y contenido digital, hasta fotografía editorial y producción deportiva, transformamos ideas en narrativas visuales poderosas. Cada proyecto es una oportunidad para elevar la comunicación de nuestros clientes con imágenes que inspiran, emocionan y venden.
          </p>
        </motion.div>
        
        {/* Nuestro compromiso */}
        <motion.div 
          ref={section3Ref}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={section3Controls}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-green-500">Nuestro compromiso</h2>
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed">
            Más que producir piezas audiovisuales, en Chalaco Films construimos experiencias. Creemos en la calidad, en el craft detrás de cada imagen, y en la pasión como motor creativo. Trabajamos de la mano con nuestros clientes para materializar su visión, siempre buscando superar expectativas.
          </p>
        </motion.div>
        
        {/* Trayectoria */}
        <motion.div 
          ref={section4Ref}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={section4Controls}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-green-500">Trayectoria</h2>
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed">
            Con experiencia reconocida a nivel nacional e internacional, hemos colaborado con marcas líderes, medios de comunicación y organismos deportivos. Nuestro trabajo ha sido galardonado en certámenes como los Budapest International Foto Awards, One Eyeland Awards, entre otros.
          </p>
        </motion.div>
        
        {/* Misión */}
        <motion.div 
          ref={section5Ref}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={section5Controls}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-green-500">Misión</h2>
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed">
            Contar historias que impacten, conecten y generen valor real para nuestros clientes y su audiencia.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
