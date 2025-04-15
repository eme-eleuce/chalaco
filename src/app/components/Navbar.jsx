"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HiBars3 } from "react-icons/hi2";
import { IoMdClose } from 'react-icons/io';
import { FaInstagram, FaLinkedinIn, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  
  // Efecto para mostrar la navbar con una demora después de cargar la página
  // Esperamos a que termine la animación del splash screen (800ms + 500ms de transición)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavbarVisible(true);
    }, 1500); // Tiempo suficiente para que termine el splash screen
    
    return () => clearTimeout(timer);
  }, []);

  // Efecto para controlar la visibilidad del logo basado en el scroll
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      // Mostrar logo solo cuando estamos en la parte superior (con un pequeño margen)
      setShowLogo(position < 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Llamar una vez para establecer el estado inicial
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: 'HOME', path: '/' },
    { name: 'TRABAJOS', path: '/trabajos' },
    { name: 'SERVICIOS', path: '/servicios' },
    { name: 'NOSOTROS', path: '/nosotros' },
    { name: 'CONTACTO', path: '/contacto' },
  ];

  const contactInfo = {
    address: {
      title: 'DIRECCIÓN',
      lines: [
        'Calle José Maria Egas y Av. Francisco de Orellana',
        'Guayaquil, Ecuador'
      ]
    },
    social: {
      title: 'REDES SOCIALES',
      links: [
        { name: 'Instagram', url: 'https://www.instagram.com/chalacofilms/', icon: FaInstagram },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/company/chalaco-films/', icon: FaLinkedinIn }
      ]
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center px-8 pt-0 md:px-12 md:pt-2">
          {/* Logo con animación de entrada */}
          <motion.div 
            className="flex-shrink-0 w-fit h-fit"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: navbarVisible ? (isMenuOpen || !showLogo ? 0 : 1) : 0, 
              y: navbarVisible ? 0 : -20,
              scale: isMenuOpen ? 0.8 : 1
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link href="/" className="block w-fit h-fit mt-5" onClick={closeMenu}>
              <Image 
                src="/photos/logob.png"
                alt="Logo"
                width={260}
                height={260}
                className="w-[150px] h-[95px] md:w-[200px] md:h-[100px] lg:w-[240px] lg:h-[140px] scale-105 transition-all duration-300 hover:scale-100"
                priority
              />
            </Link>
          </motion.div>

          {/* Botón hamburguesa con animación de entrada */}
          <motion.button 
            className="text-white p-2 rounded-lg transition-all duration-300 mix-blend-difference z-50"
            onClick={toggleMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: navbarVisible ? 1 : 0, y: navbarVisible ? 0 : -20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IoMdClose className="text-4xl lg:text-5xl" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiBars3 className="text-4xl lg:text-5xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Menú de navegación */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 backdrop-blur-md ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Fondo desenfocado */}
        <div className="absolute inset-0 bg-black/70" onClick={closeMenu} />
        
        {/* Menú móvil */}
        <div className={`md:hidden relative h-full flex flex-col px-6 sm:px-8  text-white transition-all duration-300 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} overflow-y-auto`}>
          <div className="flex flex-col h-full">
            <nav className="flex flex-col space-y-4 sm:space-y-10 mt-20">
              {menuItems.map((item) => (
                <div key={item.path}>
                  <Link
                    href={item.path}
                    className={`block text-6xl sm:text-5xl md:text-6xl font-bold transition-all duration-300 mix-blend-difference hover:text-green-500 ${pathname === item.path ? 'text-green-500' : ''} ${item.name === 'HOME' ? 'text-green-500' : ''}`}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Línea divisora verde */}
            <div className="w-full h-0.5 bg-green-500 my-6 sm:my-8" />

            {/* Información de contacto móvil */}
            <div className="flex flex-col space-y-6 sm:space-y-8 mb-6">
              {/* Dirección */}
              <div>
                <h3 className="text-3xl sm:text-3xl font-bold mb-2 sm:mb-4 flex items-center">
                  {contactInfo.address.title}
                  <FaMapMarkerAlt className="ml-2 text-green-500 mb-2" />
                </h3>
                {contactInfo.address.lines.map((line, index) => (
                  <p key={index} className="text-lg sm:text-lg">{line}</p>
                ))}
              </div>

              {/* Social */}
              <div>
                <h3 className="text-3xl sm:text-3xl font-bold mb-2 sm:mb-4">{contactInfo.social.title}</h3>
                <div className="flex gap-4 sm:gap-6">
                  {contactInfo.social.links.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl sm:text-4xl transition-all duration-300 mix-blend-difference hover:text-green-500"
                        aria-label={link.name}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menú desktop */}
        <div className={`hidden md:flex relative h-full justify-between px-24 lg:px-32 text-white transition-all duration-300 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Menú principal desktop */}
          <nav className="flex flex-col justify-center h-full space-y-8">
            {menuItems.map((item) => (
              <div key={item.path}>
                <Link
                  href={item.path}
                  className={`block text-5xl lg:text-7xl xl:text-8xl font-bold transition-all duration-300 mix-blend-difference hover:text-green-500 ${pathname === item.path ? 'text-green-500' : ''} ${item.name === 'HOME' ? 'text-green-500' : ''}`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>

          {/* Información de contacto desktop */}
          <div className="flex flex-col justify-center pb-12 space-y-8">
            {/* Dirección */}
            <div>
              <h3 className="text-4xl font-bold mb-6 flex items-center">
                {contactInfo.address.title}
                <FaMapMarkerAlt className="ml-2 text-green-500 mb-3" />
              </h3>
              {contactInfo.address.lines.map((line, index) => (
                <p key={index} className="text-xl">{line}</p>
              ))}
            </div>

            {/* Social */}
            <div>
              <h3 className="text-4xl font-bold mb-6">{contactInfo.social.title}</h3>
              <div className="flex gap-8">
                {contactInfo.social.links.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-5xl transition-all duration-300 mix-blend-difference hover:text-green-500"
                      aria-label={link.name}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
