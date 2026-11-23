"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { IoMdArrowRoundBack, IoMdClose } from 'react-icons/io';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { supabase, BUCKET_NAME, SUPABASE_URL } from '../../utils/supabase';
import { getOptimizedImageUrl, generateSupabaseImageSrcSet } from '../../utils/imageUtils';
import SmoothImage from '../SmoothImage';

// Cache de URLs y blur data
const urlCache = new Map();

const publicImageUrl = (folder, fileName) =>
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${folder}/${fileName}`;

const getCoverUrls = (folder) => ({
  imageUrl: getOptimizedImageUrl(publicImageUrl(folder, 'image1.jpg')),
  thumbUrl: getOptimizedImageUrl(publicImageUrl(folder, 'image1_thumb.jpg')),
  srcSet: generateSupabaseImageSrcSet(publicImageUrl(folder, 'image1.jpg')),
});

const getImageData = async (folder, imageName = 'image1') => {
  const cacheKey = `${folder}/${imageName}`;
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey);
  }

  // Migración: todo está en .jpg; solo hacemos fallback a .png si hace falta
  for (const ext of ['jpg', 'png']) {
    const url = publicImageUrl(folder, `${imageName}.${ext}`);
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        const imageUrl = getOptimizedImageUrl(url);
        const imageData = {
          imageUrl,
          srcSet: generateSupabaseImageSrcSet(imageUrl)
        };
        urlCache.set(cacheKey, imageData);
        return imageData;
      }
    } catch (error) {
      // Error silencioso al verificar la imagen
    }
  }

  const fallbackUrl = publicImageUrl(folder, `${imageName}.jpg`);
  const imageUrl = getOptimizedImageUrl(fallbackUrl);
  const imageData = {
    imageUrl,
    srcSet: generateSupabaseImageSrcSet(imageUrl)
  };
  urlCache.set(cacheKey, imageData);
  return imageData;
};

const getAllImagesInFolder = async (folder) => {
  try {
    const possibleImages = Array.from({ length: 10 }, (_, i) => `image${i + 1}`);

    const imagePromises = possibleImages.map(async (imageName) => {
      for (const ext of ['jpg', 'png']) {
        try {
          const url = publicImageUrl(folder, `${imageName}.${ext}`);
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            return { name: imageName, extension: ext };
          }
        } catch (e) {
          // continue
        }
      }
      return null;
    });

    const results = await Promise.all(imagePromises);
    return results.filter(Boolean);
  } catch (error) {
    return [];
  }
};

const WorkDetails = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setGalleryImages([]);

        if (!projectId) {
          throw new Error('ID de proyecto no válido');
        }

        const id = parseInt(projectId, 10);
        const { data: projectData, error: projectError } = await supabase
          .from('page')
          .select('*')
          .eq('id', Number.isNaN(id) ? projectId : id)
          .single();

        if (projectError) {
          throw new Error(`Error al obtener proyecto: ${projectError.message}`);
        }

        if (!projectData) {
          throw new Error('No se encontró el proyecto');
        }

        const projectObj = Array.isArray(projectData) ? projectData[0] : projectData;
        const cover = getCoverUrls(projectObj.storage_folder);

        // Mostrar hero + datos de inmediato (sin HEAD ni esperar galería)
        setProject(projectObj);
        setMainImage(cover);
        setLoading(false);
        setInitialLoad(false);

        // Galería en segundo plano
        const imagesList = await getAllImagesInFolder(projectObj.storage_folder);
        const galleryImagesData = await Promise.all(
          imagesList.map(async (imageFile) => {
            const imageData = await getImageData(projectObj.storage_folder, imageFile.name);
            return {
              name: imageFile.name,
              ...imageData
            };
          })
        );
        setGalleryImages(galleryImagesData);
      } catch (error) {
        console.error('Error en fetchProjectDetails:', error);
        setError(error.message || 'Hubo un error al cargar los detalles del proyecto');
        setLoading(false);
        setInitialLoad(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  // Mostrar pantalla de carga inicial con logo animado
  if (initialLoad && loading) {
    return (
      <section className="min-h-screen py-16 bg-black">
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="animate-heartbeat">
            <Image
              src="/photos/carga.png"
              alt="Cargando..."
              width={280}
              height={160}
              priority
              className="w-44 sm:w-56 md:w-64 h-auto"
            />
          </div>
        </div>
      </section>
    );
  }
  
  // Componente de esqueleto para cargas subsecuentes
  const ProjectDetailsSkeleton = () => (
    <div className="min-h-screen py-12 bg-black text-white">
      <div className="container mx-auto px-4 space-y-12 animate-pulse">
        {/* Esqueleto de imagen principal */}
        <div className="aspect-video w-full relative rounded-xl overflow-hidden bg-gray-800">
          <div className="absolute inset-0 bg-gray-700/50"></div>
        </div>
        
        {/* Esqueleto de información del proyecto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-2">
          {/* Columna izquierda */}
          <div className="space-y-4 md:px-8 lg:px-12">
            <div className="h-16 md:h-20 bg-gray-700/50 rounded-md w-3/4"></div>
            <div className="w-20 h-1 bg-gray-700/50 my-3"></div>
            <div className="h-8 bg-gray-700/50 rounded-md w-1/3"></div>
          </div>
          
          {/* Columna derecha */}
          <div className="space-y-4 md:px-8 lg:px-12">
            <div className="h-12 md:h-16 bg-gray-700/50 rounded-md w-full"></div>
            <div className="w-20 h-1 bg-gray-700/50 my-3"></div>
            <div className="h-40 bg-gray-700/50 rounded-md w-full"></div>
          </div>
        </div>
        
        {/* Esqueleto de sección de video */}
        <div className="mt-12 md:px-8 lg:px-12">
          <div className="h-10 bg-gray-700/50 rounded-md w-1/4 mb-6"></div>
          <div className="aspect-video w-full bg-gray-800/70 rounded-xl"></div>
        </div>
        
        {/* Esqueleto de galería */}
        <div className="mt-12 md:px-8 lg:px-12">
          <div className="h-10 bg-gray-700/50 rounded-md w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="aspect-video bg-gray-800/70 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!initialLoad && loading) {
    return <ProjectDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  
  return (
    <div className="bg-[#0a0a0a] text-white">
      {mainImage && (
        <ProjectHeroParallax mainImage={mainImage} project={project} />
      )}

      <ProjectDetailsSection project={project} />

      <div className="relative z-10 bg-[#0a0a0a] w-full px-6 sm:px-8 md:px-12 lg:px-16 pb-4">
        {(project?.category === 'Comerciales' || project?.category === 'Videoclips' || project?.category === 'Institucional') && (
          <VideoSection project={project} />
        )}

        <GallerySection project={project} galleryImages={galleryImages} />
        <BackButtonSection />
      </div>
    </div>
  );
};

// Solo imagen sticky — el título vive únicamente en el bloque de scroll
const ProjectHeroParallax = ({ mainImage, project }) => {
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);

  useEffect(() => {
    setThumbLoaded(false);
    setFullLoaded(false);
  }, [mainImage.imageUrl]);

  return (
    <div className="sticky top-0 w-full h-screen overflow-hidden bg-gray-900">
      {/* Placeholder mientras llega el thumb */}
      {!thumbLoaded && !fullLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" aria-hidden="true" />
      )}

      {mainImage.thumbUrl && (
        <Image
          src={mainImage.thumbUrl}
          alt=""
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-500 ${thumbLoaded || fullLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority
          quality={60}
          onLoad={() => setThumbLoaded(true)}
        />
      )}
      <Image
        src={mainImage.imageUrl}
        alt={project?.name || 'Imagen principal'}
        fill
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ${fullLoaded ? 'opacity-100' : 'opacity-0'}`}
        priority
        quality={80}
        onLoad={() => setFullLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />
    </div>
  );
};

const DESKTOP_MIN_WIDTH = 1024; // escritorio real

const ProjectDetailsSection = ({ project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.12 });
  const [isDesktop, setIsDesktop] = useState(null); // null hasta medir la pantalla

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const paragraphs = (project?.description || '')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const gradientStyle = {
    background:
      'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.25) 20%, rgba(10,10,10,0.85) 48%, #0a0a0a 65%, #0a0a0a 100%)',
  };

  if (isDesktop === null) {
    return <section ref={ref} className="relative z-10 w-full min-h-[40vh]" />;
  }

  return (
    <section ref={ref} className="relative z-10 w-full" style={gradientStyle}>
      {isDesktop ? (
        /*
          Escritorio: primera vista = imagen + título izq | cliente der.
          La descripción queda debajo del fold (hay que scrollear).
        */
        <div style={{ marginTop: '-42vh' }}>
          <div
            className="px-12 xl:px-24"
            style={{
              minHeight: '42vh',
              display: 'flex',
              alignItems: 'flex-end',
              paddingBottom: '4rem',
            }}
          >
            <div
              className="w-full max-w-[2000px] mx-auto"
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '3rem',
              }}
            >
              <div style={{ flex: '1 1 55%', minWidth: 0, maxWidth: '60%' }}>
                <motion.h1
                  className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wider text-white drop-shadow-lg leading-[1.05]"
                  initial={{ opacity: 0, y: 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                  {project?.name}
                </motion.h1>
                <motion.div
                  className="mt-5 w-20 h-1 bg-green-500"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
                  style={{ originX: 0 }}
                />
              </div>

              <motion.p
                className="text-3xl lg:text-4xl font-bold tracking-wide"
                style={{ textAlign: 'right', maxWidth: '35%', flexShrink: 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
              >
                <span className="text-white/90">Cliente:</span>{' '}
                <span className="text-green-500">{project?.client}</span>
              </motion.p>
            </div>
          </div>

          <div className="px-12 xl:px-24 pb-12 pt-10">
            <div className="w-full max-w-[2000px] mx-auto space-y-8">
              <div className="space-y-6 roboto-font text-xl lg:text-2xl leading-relaxed text-white/90 max-w-4xl text-justify">
                {paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    className="normal-case text-justify"
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <motion.div
                className="w-20 h-1 bg-white"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
                style={{ originX: 0 }}
              />

              <motion.p
                className="roboto-font text-2xl lg:text-3xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              >
                {project?.year && project.year.trim() !== '' ? (
                  <>
                    <span>{project.year}</span>
                    <span className="opacity-50 mx-3">—</span>
                  </>
                ) : null}
                <span className="text-green-500">{project?.category}</span>
              </motion.p>
            </div>
          </div>
        </div>
      ) : (
        /* Móvil / tablet: título + cliente apilados abajo */
        <>
          <div
            className="px-5 sm:px-8 flex flex-col justify-end pb-6"
            style={{ marginTop: '-78vh', minHeight: '78vh' }}
          >
            <div className="space-y-4">
              <motion.h1
                className="text-4xl sm:text-5xl font-bold tracking-wider text-white drop-shadow-lg leading-[1.05] break-words"
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                {project?.name}
              </motion.h1>
              <motion.div
                className="w-14 h-1 bg-green-500"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
                style={{ originX: 0 }}
              />
              <motion.p
                className="text-xl sm:text-2xl font-bold tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
              >
                <span className="text-white/90">Cliente:</span>{' '}
                <span className="text-green-500">{project?.client}</span>
              </motion.p>
            </div>
          </div>

          <div className="px-5 sm:px-8 pb-10 pt-6 space-y-6">
            <div className="space-y-4 roboto-font text-base sm:text-lg leading-relaxed text-white/90 text-justify">
              {paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="normal-case text-justify"
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
            <motion.div
              className="w-14 h-1 bg-white"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
              style={{ originX: 0 }}
            />
            <motion.p
              className="roboto-font text-lg sm:text-xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            >
              {project?.year && project.year.trim() !== '' ? (
                <>
                  <span>{project.year}</span>
                  <span className="opacity-50 mx-3">—</span>
                </>
              ) : null}
              <span className="text-green-500">{project?.category}</span>
            </motion.p>
          </div>
        </>
      )}
    </section>
  );
};

// Función para extraer el ID de video de YouTube de una URL
const getYoutubeVideoId = (url) => {
  if (!url) return null;
  
  // Patrones comunes de URLs de YouTube
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,  // youtube.com/watch?v=XXXX
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,               // youtu.be/XXXX
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i      // youtube.com/embed/XXXX
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Componente para la sección de video con animación basada en scroll
const VideoSection = ({ project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Extraer el ID del video de YouTube del enlace del proyecto
  const videoId = project?.link ? getYoutubeVideoId(project.link) : null;
  
  // Efecto para simular carga del iframe
  useEffect(() => {
    if (videoId) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [videoId]);
  
  return (
    <motion.div 
      ref={ref}
      className="pt-4 md:pt-6 md:px-0"
      initial={{ y: 30 }}
      animate={isInView ? { y: 0 } : { y: 30 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-wide mb-6">Video</h2>
      <div className="mx-auto aspect-video w-full md:w-4/5 lg:w-3/4 xl:w-2/3 bg-gray-800/50 rounded-xl overflow-hidden">
        {videoId ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 z-10">
                <div className="w-16 h-16 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            )}
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            ></iframe>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-xl text-gray-300">Video disponible próximamente</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Componente para la galería de imágenes con animación basada en scroll
// Componente Skeleton para mostrar mientras se carga la imagen
const ImageSkeleton = () => (
  <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
  </div>
);

// Componente para el visor de imágenes a pantalla completa
const ImageViewer = ({ isOpen, images, currentIndex, onClose, onPrev, onNext, project }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Resetear el estado de carga cuando cambia la imagen
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);
  
  // Manejar teclas para navegación
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);
  
  // Bloquear scroll y ocultar navbar (el hamburguesa queda por encima si no)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('lightbox-open');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('lightbox-open');
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('lightbox-open');
    };
  }, [isOpen]);
  
  if (!isOpen || !mounted) return null;

  const viewer = (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[9999] bg-black w-screen h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        {/* Botón de cierre */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Evitar doble cierre
            onClose();
          }}
          className="absolute top-4 right-4 z-[10000] text-white text-4xl md:text-5xl lg:text-6xl hover:text-green-500 transition-colors p-2"
          aria-label="Cerrar visor"
        >
          <IoMdClose />
        </button>
        
        {/* Botón anterior */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Evitar cierre al navegar
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white text-5xl hover:text-green-500 transition-colors"
          aria-label="Imagen anterior"

        >
          <IoChevronBackOutline />
        </button>
        
        {/* Botón siguiente */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Evitar cierre al navegar
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white text-5xl hover:text-green-500 transition-colors"
          aria-label="Imagen siguiente"

        >
          <IoChevronForwardOutline />
        </button>
        
        {/* Contador de imágenes */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg bg-black/50 px-4 py-2 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
        
        {/* Imagen actual */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center px-8 sm:px-16"
          onClick={(e) => e.stopPropagation()} // Evitar que los clics en la imagen cierren el visor
        >
          {isLoading && <ImageSkeleton />}
          <Image 
            src={images[currentIndex].imageUrl}
            alt={`${project?.name} - Imagen ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            quality={85}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(viewer, document.body);
};

const GalleryItem = ({ image, index, projectName, onOpen }) => {
  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={imageRef}
      initial={{ y: 20 }}
      animate={isImageInView ? { y: 0 } : { y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer"
      onClick={() => onOpen(index)}
    >
      <SmoothImage
        src={image.imageUrl}
        alt={`${projectName} - Imagen ${index + 1}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        quality={75}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
    </motion.div>
  );
};

const GallerySection = ({ project, galleryImages }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };
  
  const closeViewer = () => {
    setViewerOpen(false);
  };
  
  const goToPrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(galleryImages.length - 1);
    }
  };
  
  const goToNextImage = () => {
    if (currentImageIndex < galleryImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };
  
  return (
    <>
      <motion.div 
        ref={ref}
        className="pt-6 md:pt-8"
        initial={{ y: 30 }}
        animate={isInView ? { y: 0 } : { y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-black italic text-white tracking-wide mb-8">Galería</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <GalleryItem
              key={image.name || index}
              image={image}
              index={index}
              projectName={project?.name}
              onOpen={openViewer}
            />
          ))}
        </div>
      </motion.div>
      
      <ImageViewer 
        isOpen={viewerOpen}
        images={galleryImages}
        currentIndex={currentImageIndex}
        onClose={closeViewer}
        onPrev={goToPrevImage}
        onNext={goToNextImage}
        project={project}
      />
    </>
  );
};

// Componente para el botón de volver con animación basada en scroll
const BackButtonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  
  return (
    <motion.div 
      ref={ref}
      className="mt-20 flex justify-center"
      initial={{ y: 20 }}
      animate={isInView ? { y: 0 } : { y: 20 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <Link 
        href="/trabajos" 
        className="px-10 py-6 mb-10 text-2xl md:text-3xl lg:text-4xl font-bold text-black bg-white rounded-xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none"
      >
        VOLVER A TRABAJOS
      </Link>
    </motion.div>
  );
};

export default WorkDetails;