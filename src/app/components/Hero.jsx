"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [showLogo, setShowLogo] = useState(true);
  
  // Efecto para manejar la carga inicial
  useEffect(() => {
    // Ocultar el logo después de un tiempo para mostrar el video
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1000); // 1 segundo con el logo
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="sticky top-0 w-full h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover max-w-full"
        autoPlay
        muted
        loop
        playsInline // Mejor soporte en iOS
      >
        <source src="/videos/herohero.mp4" type="video/mp4" />
      </video>

      {/* Logo durante la carga inicial - sobrepuesto a todo incluyendo navbar */}
      <div className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-300 ${showLogo ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none z-0'}`}>
        <div className="animate-heartbeat">
          <Image
            src="/photos/logob.png"
            alt="Chalaco Films"
            width={250}
            height={250}
            priority
          />
        </div>
      </div>

      {/* Overlay opcional para textos o efectos */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
