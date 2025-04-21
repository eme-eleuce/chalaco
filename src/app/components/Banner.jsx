"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import RotatingText from './RotatingText';
import './RotatingText.css';

const Banner = () => {
  // Referencias para detectar cuando los elementos están en el viewport
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Estados de visibilidad para cada elemento
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const isTitleInView = useInView(titleRef, { once: false, amount: 0.5 });
  const isDescriptionInView = useInView(descriptionRef, { once: false, amount: 0.3 });
  const isButtonInView = useInView(buttonRef, { once: false, amount: 0.8 });
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-screen w-full flex items-center justify-center bg-green-500 text-[#0a0a0a] overflow-hidden"
    >
      <div className="w-full max-w-[2000px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 pt-2 pb-4 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-15 md:gap-10">
          <motion.div 
            ref={titleRef}
            className="w-full md:w-1/2 text-center md:text-left overflow-hidden"
            initial={{ x: -50 }}
            animate={isTitleInView ? { x: 0 } : { x: -50 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold tracking-wider leading-none mb-5 md:mb-0">
              ¡SOMOS CHALACO FILMS!
            </h1>
          </motion.div>
          <motion.div 
            className="w-full md:w-1/2 overflow-hidden text-center md:text-left"
            initial={{ x: 50 }}
            animate={isDescriptionInView ? { x: 0 } : { x: 50 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <motion.div 
              ref={descriptionRef}
              className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight mb-8 md:mb-6 font-medium overflow-hidden"
            >
              <span>Somos una productora audiovisual con más de 10 años de trayectoria, especializada en producción audiovisual{" "}</span>
              <RotatingText
                texts={['publicitaria', 'cinematográfica', 'corporativa', 'documental', 'creativa']}
                mainClassName="text-white inline-flex bg-[#0a0a0a] px-3 py-1 rounded-md text-3xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl"
                staggerFrom="last"
                initial={{ y: "100%", rotate: -5, scale: 0.9 }}
                animate={{ y: 0, rotate: 0, scale: 1 }}
                exit={{ y: "-120%", rotate: 5, scale: 0.9 }}
                staggerDuration={0.03}
                splitLevelClassName="overflow-hidden"
                elementLevelClassName="transition-colors duration-150"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                rotationInterval={2500}
                splitBy="words"
              />
              <span></span>
              
              <motion.div 
                className="text-4xl sm:text-4xl md:text-4xl mt-4 md:mt-6 text-[#0a0a0a] overflow-hidden"
                initial={{ y: 20 }}
                animate={isDescriptionInView ? { y: 0 } : { y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              >
                ¿Tienes un proyecto en mente?
              </motion.div>
            </motion.div>
            <motion.div
              ref={buttonRef}
              className="overflow-visible mb-3 md:mb-6 pb-1 md:pb-2 flex justify-center md:justify-start"
              initial={{ y: 30 }}
              animate={isButtonInView ? { y: 0 } : { y: 30 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            >
              <Link href="/contacto">
                <button
                  className="mt-5 md:mt-0 px-8 py-5 sm:px-12 sm:py-6 text-4xl sm:text-4xl font-bold bg-[#0a0a0a] text-white rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none relative z-10"
                >
                  CONVERSEMOS
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;