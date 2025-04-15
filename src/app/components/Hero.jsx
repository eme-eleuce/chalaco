"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  
  // Lista de videos en el orden que quieres que se reproduzcan
  const videos = [
    '3.mp4',
    '5.mp4',
    '1.mp4',
    '2.mp4',
    // Agrega más videos aquí
  ];

  // Efecto para manejar la carga inicial
  useEffect(() => {
    // Ocultar el logo después de un tiempo para mostrar el video
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1000); // 1 segundo con el logo
    
    return () => clearTimeout(timer);
  }, []);

  // Cambiar al siguiente video cuando termine el actual
  const handleVideoEnd = () => {
    setCurrentVideo(prev => (prev + 1) % videos.length);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        key={videos[currentVideo]} // Key para forzar la recarga del video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        onEnded={handleVideoEnd}
        playsInline // Mejor soporte en iOS
      >
        <source src={`/videos/${videos[currentVideo]}`} type="video/mp4" />
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
