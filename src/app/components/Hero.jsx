"use client";

import { useState } from 'react';

export default function Hero() {
  const [currentVideo, setCurrentVideo] = useState(0);
  
  // Lista de videos en el orden que quieres que se reproduzcan
  const videos = [
    '3.mp4',
    '5.mp4',
    '1.mp4',
    '2.mp4',
    // Agrega más videos aquí
  ];

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

      {/* Overlay opcional para textos o efectos */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
