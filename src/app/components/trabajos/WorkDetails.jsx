"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
      console.log(`Error checking ${ext} image:`, error);
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
    
    console.log('Imágenes encontradas:', imageFiles);
    return imageFiles;
  } catch (error) {
    console.error('Error en getAllImagesInFolder:', error);
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
    console.log('WorkDetails montado con projectId:', projectId);
    
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        console.log('Intentando obtener proyecto con ID:', projectId);
        
        // Verificar que el ID es válido
        if (!projectId) {
          throw new Error('ID de proyecto no válido');
        }
        
        console.log('Tipo de projectId:', typeof projectId);
        
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
          
        console.log('Respuestas de Supabase:', { 
          original: result1,
          comoNumero: result2,
          comoString: result3
        });
        
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
        
        console.log('Proyecto datos procesados:', projectData);

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

        console.log('Datos procesados:', { 
          project: projectData,
          mainImage: mainImageData,
          galleryImages: galleryImagesData 
        });
        
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

  console.log('Renderizando con estado:', { project, mainImage, galleryImages });
  
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
          <VideoSection />
        )}

        {/* Galería de imágenes */}
        <GallerySection project={project} galleryImages={galleryImages} />
        
        {/* Botón Volver */}
        <BackButtonSection />
      </motion.div>
    </motion.div>
  );
};

// Componente para la imagen principal con animación basada en scroll
const MainImageSection = ({ mainImage, project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <motion.div 
      ref={ref}
      className="aspect-video w-full relative rounded-xl overflow-hidden bg-gray-800"
      initial={{ y: 30 }}
      animate={isInView ? { y: 0 } : { y: 30 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Image 
          src={mainImage.imageUrl}
          alt={project?.name || 'Imagen principal'}
          fill
          sizes="100vw"
          className="object-contain md:object-cover"
          priority
          quality={70}
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
        <p className="text-xl md:text-2xl lg:text-3xl text-white font-medium flex items-center justify-center md:justify-start">
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
        <h2 className="text-3xl md:text-4xl font-bold">
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

// Componente para la sección de video con animación basada en scroll
const VideoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <motion.div 
      ref={ref}
      className="mt-12 md:px-8 lg:px-12"
      initial={{ y: 30 }}
      animate={isInView ? { y: 0 } : { y: 30 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-wide mb-6">Video</h2>
      <div className="mx-auto aspect-video w-full md:w-4/5 lg:w-3/4 xl:w-2/3 bg-gray-800/50 rounded-xl flex items-center justify-center">
        <p className="text-xl text-gray-300">Video disponible proximamente</p>
      </div>
    </motion.div>
  );
};

// Componente para la galería de imágenes con animación basada en scroll
const GallerySection = ({ project, galleryImages }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
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
              className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative group"
            >
              <Image 
                src={image.imageUrl}
                alt={`${project?.name} - Imagen ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                quality={75}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
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