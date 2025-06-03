"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { IoMdArrowRoundBack, IoMdClose } from 'react-icons/io';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { supabase, BUCKET_NAME, SUPABASE_URL } from '../../utils/supabase';
import { getOptimizedImageUrl, generateSupabaseImageSrcSet } from '../../utils/imageUtils';

// Cache de URLs y blur data
const urlCache = new Map();

const getImageData = async (folder, imageName = 'image1') => {
  // Revisar si los datos están en caché
  const cacheKey = `${folder}/${imageName}`;
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey);
  }

  const extensions = ['png', 'jpg'];
  
  for (const ext of extensions) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${folder}/${imageName}.${ext}`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        const imageUrl = getOptimizedImageUrl(url);
        const imageData = {
          imageUrl,
          srcSet: generateSupabaseImageSrcSet(imageUrl)
        };
        // Guardar en caché
        urlCache.set(cacheKey, imageData);
        return imageData;
      }
    } catch (error) {
      // Error silencioso al verificar la imagen
    }
  }
  
  // Si no se encuentra ninguna imagen, usar fallback
  const fallbackUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${folder}/${imageName}.png`;
  const imageUrl = getOptimizedImageUrl(fallbackUrl);
  const imageData = {
    imageUrl,
    srcSet: generateSupabaseImageSrcSet(imageUrl)
  };
  // Guardar en caché
  urlCache.set(cacheKey, imageData);
  return imageData;
};

const getAllImagesInFolder = async (folder) => {
  try {
    // En lugar de intentar listar todos los archivos del folder (que puede estar dando error),
    // probaremos un enfoque alternativo con nombres de archivos predecibles
    
    // Generamos un arreglo con posibles nombres de imagen (image1, image2, etc.)
    const possibleImages = Array.from({ length: 10 }, (_, i) => `image${i + 1}`);
    
    // Para cada posible nombre, verificamos si existe en ambas extensiones
    const imagePromises = possibleImages.flatMap(imageName => {
      return ['png', 'jpg'].map(async ext => {
        try {
          const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${folder}/${imageName}.${ext}`;
          const response = await fetch(url, { method: 'HEAD' });
          
          if (response.ok) {
            return { name: `${imageName}`, extension: ext };
          }
          return null;
        } catch (e) {
          return null;
        }
      });
    });
    
    // Resolvemos todas las promesas y filtramos los nulos
    const results = await Promise.all(imagePromises);
    const imageFiles = results.filter(Boolean);
    
    return imageFiles;
  } catch (error) {
    // Error silencioso al buscar imágenes en la carpeta
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
        
        // Verificar que el ID es válido
        if (!projectId) {
          throw new Error('ID de proyecto no válido');
        }
        
        
        // Intentar con ambas formas: string y número
        let projectData = null;
        let projectError = null;
        
        // Intento 1: Como está
        const result1 = await supabase
          .from('page')
          .select('*')
          .eq('id', projectId)
          .single();
        
        // Intento 2: Como número
        const result2 = await supabase
          .from('page')
          .select('*')
          .eq('id', parseInt(projectId))
          .single();
        
        // Intento 3: Como string
        const result3 = await supabase
          .from('page')
          .select('*')
          .eq('id', String(projectId))
          .single();
        
        // Usar el primer resultado exitoso
        if (result1.data) {
          projectData = Array.isArray(result1.data) ? result1.data[0] : result1.data;
        } else if (result2.data) {
          projectData = Array.isArray(result2.data) ? result2.data[0] : result2.data;
        } else if (result3.data) {
          projectData = Array.isArray(result3.data) ? result3.data[0] : result3.data;
        } else {
          // Si ninguno funciona, usar el primer error
          projectError = result1.error || result2.error || result3.error;
        }
        

        if (projectError) {
          throw new Error(`Error al obtener proyecto: ${projectError.message}`);
        }

        if (!projectData) {
          throw new Error('No se encontró el proyecto');
        }

        // Obtener imagen principal
        const mainImageData = await getImageData(projectData.storage_folder, 'image1');

        // Obtener lista de todas las imágenes disponibles
        const imagesList = await getAllImagesInFolder(projectData.storage_folder);
        
        // Procesar todas las imágenes para la galería
        const galleryImagesData = await Promise.all(
          imagesList.map(async (imageFile) => {
            const imageName = imageFile.name; // Ya no necesitamos split porque ya tenemos solo el nombre sin extensión
            const imageData = await getImageData(projectData.storage_folder, imageName);
            return {
              name: imageName,
              ...imageData
            };
          })
        );
        
        // Asegurarse de que projectData es un objeto, no un array
        const projectObj = Array.isArray(projectData) ? projectData[0] : projectData;
        
        setProject(projectObj);
        setMainImage(mainImageData);
        setGalleryImages(galleryImagesData);
      } catch (error) {
        console.error('Error en fetchProjectDetails:', error);
        setError(error.message || 'Hubo un error al cargar los detalles del proyecto');
      } finally {
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
              src="/photos/logob.png"
              alt="Loading..."
              width={250}
              height={250}
              priority
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
    <motion.div 
      className="min-h-screen pt-30 md:py-12 bg-[#0a0a0a] text-white"
    >
      <motion.div 
        className="container mx-auto px-4 space-y-12"
      >
        {mainImage && (
          <MainImageSection mainImage={mainImage} project={project} />
        )}

        {/* Información del proyecto - Estructura en dos columnas */}
        <ProjectInfoSection project={project} />

        {/* Sección de video - Solo para Comerciales, Videoclips o Institucional */}
        {(project?.category === 'Comerciales' || project?.category === 'Videoclips' || project?.category === 'Institucional') && (
          <VideoSection project={project} />
        )}

        {/* Galería de imágenes */}
        <GallerySection project={project} galleryImages={galleryImages} />
        
        {/* Botón Volver */}
        <BackButtonSection />
      </motion.div>
    </motion.div>
  );
};

// Componente de skeleton para la imagen principal
const MainImageSkeleton = () => (
  <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
    <div className="w-20 h-20 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
  </div>
);

// Componente para la imagen principal con animación basada en scroll
const MainImageSection = ({ mainImage, project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Precarga de la imagen usando una técnica compatible con Next.js
  useEffect(() => {
    // Usamos el objeto global window para acceder al constructor Image nativo del navegador
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = mainImage.imageUrl;
    }
  }, [mainImage.imageUrl]);
  
  return (
    <motion.div 
      ref={ref}
      className="aspect-video w-full md:w-11/12 lg:w-10/12 mx-auto relative rounded-xl overflow-hidden bg-gray-800"
      initial={{ y: 30 }}
      animate={isInView ? { y: 0 } : { y: 30 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading && <MainImageSkeleton />}
        <Image 
          src={mainImage.imageUrl}
          alt={project?.name || 'Imagen principal'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 75vw"
          className="object-contain md:object-cover scale-100"
          priority={true}
          quality={60}
          loading="eager"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxODE4MTgiLz48L3N2Zz4="
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </motion.div>
  );
};

// Componente para la información del proyecto con animación basada en scroll
const ProjectInfoSection = ({ project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <motion.div 
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 px-2 md:px-18"
    >
      {/* Columna izquierda: name y year */}
      <motion.div 
        className="space-y-4 text-center md:text-left md:pr-0"
        initial={{ x: -20 }}
        animate={isInView ? { x: 0 } : { x: -20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-6xl font-black italic text-white tracking-wide leading-tight">
          {project?.name}
        </h1>
        <div className="w-20 h-1 bg-white mx-auto md:mx-0"></div>
        <p className="roboto-font text-xl md:text-2xl lg:text-3xl text-white font-medium flex items-center justify-center md:justify-start">
          {project?.year && project?.year.trim() !== '' ? (
            <>
              {project.year} <span className="opacity-75 mx-3 text-lg">-</span>
            </>
          ) : null}
          <span className="text-green-500">{project?.category}</span>
        </p>
      </motion.div>
      
      {/* Columna derecha: client y description */}
      <motion.div 
        className="space-y-4 lg:mt-10 md:pl-0"
        initial={{ x: 20 }}
        animate={isInView ? { x: 0 } : { x: 20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="roboto-font text-3xl md:text-4xl font-bold">
          <span className="text-white">Cliente:</span> <span className="text-green-500"> {project?.client}</span>
        </h2>
        <div className="w-20 h-1 bg-white"></div>
        <div className="text-xl md:text-2xl lg:text-2xl text-white roboto-font leading-relaxed  space-y-6 text-justify ">
          {project?.description?.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index} className="normal-case">{paragraph}</p>
          ))}
        </div>
      </motion.div>
    </motion.div>
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
      className="mt-12 md:px-8 lg:px-12"
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
  
  // Bloquear scroll cuando el visor está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 bg-black w-screen h-screen flex items-center justify-center"
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
          className="absolute top-4 right-4 z-50 text-white text-4xl md:text-5xl lg:text-6xl hover:text-green-500 transition-colors p-2"
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
      // Si estamos en la primera imagen, ir a la última (navegación circular)
      setCurrentImageIndex(galleryImages.length - 1);
    }
  };
  
  const goToNextImage = () => {
    if (currentImageIndex < galleryImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      // Si estamos en la última imagen, volver a la primera (navegación circular)
      setCurrentImageIndex(0);
    }
  };
  
  return (
    <>
      <motion.div 
        ref={ref}
        className={`${project?.category === 'Fotos' ? 'mt-6' : 'mt-12'} md:px-8 lg:px-12`}
        initial={{ y: 30 }}
        animate={isInView ? { y: 0 } : { y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-black italic text-white tracking-wide mb-8">Galería</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => {
            const imageRef = useRef(null);
            const isImageInView = useInView(imageRef, { once: false, amount: 0.2 });
            
            return (
              <motion.div
                key={index}
                ref={imageRef}
                initial={{ y: 20 }}
                animate={isImageInView ? { y: 0 } : { y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer"
                onClick={() => openViewer(index)}
              >
                <Image 
                  src={image.imageUrl}
                  alt={`${project?.name} - Imagen ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  quality={75}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Visor de imágenes */}
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