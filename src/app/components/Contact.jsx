"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const ref = useRef(null);
  // Cambiamos 'once: false' a 'once: true' para que la animación solo ocurra una vez
  // y los elementos permanezcan visibles después de aparecer
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Encabezado con animación */}
        <motion.div 
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="mt-10 text-6xl md:text-8xl xl:text-9xl 2xl:text-[12rem] font-black text-white mb-20 text-center tracking-tight leading-none">
            CONTACTO
          </h1>
          <p className="text-2xl md:text-3xl max-w-3xl mx-auto">
            Ponte en contacto con nosotros a través de nuestras redes sociales o correo electrónico.
          </p>
        </motion.div>
        
        {/* Iconos de contacto */}
        <motion.div 
          className="flex flex-col items-center justify-center space-y-16 mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {/* Dirección */}
          <div className="w-full max-w-3xl text-center">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-medium mb-4 text-green-500">
              Dirección
            </span>
            <span className="block text-2xl md:text-3xl max-w-3xl">
              Calle José Maria Egas y Av. Francisco de Orellana
            </span>
            <span className="block text-2xl md:text-3xl max-w-3xl">
              Guayaquil, Ecuador
            </span>
          </div>
          
          {/* Contenedor para Instagram y Correo en desktop */}
          <div className="w-full flex flex-col md:flex-row md:justify-center md:space-x-16 md:space-y-0 space-y-16">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/chalacofilms/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col md:flex-row items-center md:items-start group"
            >
              <div className="md:mr-8 mb-4 md:mb-0">
                <FaInstagram className="text-7xl md:text-8xl text-white group-hover:text-green-500 transition-colors duration-300" />
              </div>
              <span className="mt-2 md:mt-6 text-2xl md:text-3xl lg:text-4xl font-medium group-hover:text-green-500 transition-colors duration-300">
                @chalacofilms
              </span>
            </a>
            
            {/* Correo electrónico */}
            <a 
              href="mailto:info@chalacofilms.com" 
              className="flex flex-col md:flex-row items-center md:items-start group"
            >
              <div className="md:mr-8 mb-4 md:mb-0">
                <FaEnvelope className="text-7xl md:text-8xl text-white group-hover:text-green-500 transition-colors duration-300" />
              </div>
              <span className="mt-2 md:mt-6 text-2xl md:text-3xl lg:text-4xl font-medium group-hover:text-green-500 transition-colors duration-300">
                info@chalacofilms.com
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;