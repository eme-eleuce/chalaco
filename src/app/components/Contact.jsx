"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
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
          className="flex flex-col md:flex-row items-center justify-center md:justify-evenly space-y-12 md:space-y-0 md:space-x-8 mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/chalacofilms/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row items-center md:items-start group md:w-1/3 lg:w-2/5"
          >
            <div className="md:mr-8">
              <FaInstagram className="text-7xl md:text-8xl text-white group-hover:text-green-500 transition-colors duration-300" />
            </div>
            <span className="mt-4 md:mt-6 text-2xl md:text-3xl lg:text-4xl font-medium group-hover:text-green-500 transition-colors duration-300">
              @chalacofilms
            </span>
          </a>
          
          {/* Correo electrónico */}
          <a 
            href="mailto:info@chalacofilms.com" 
            className="flex flex-col md:flex-row items-center md:items-start group md:w-1/3 lg:w-2/5"
          >
            <div className="md:mr-8">
              <FaEnvelope className="text-7xl md:text-8xl text-white group-hover:text-green-500 transition-colors duration-300" />
            </div>
            <span className="mt-4 md:mt-6 text-2xl md:text-3xl lg:text-4xl font-medium group-hover:text-green-500 transition-colors duration-300">
              info@chalacofilms.com
            </span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;