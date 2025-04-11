"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse space-y-8 w-full max-w-6xl">
          <div className="bg-gray-700/50 aspect-video w-full rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-700/50 rounded-md w-3/4"></div>
            <div className="h-6 bg-gray-700/50 rounded-md w-1/2"></div>
            <div className="h-40 bg-gray-700/50 rounded-md w-full mt-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="aspect-video bg-gray-700/50 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen py-12 bg-black text-white">
      <div className="container mx-auto px-4 space-y-12">
        {/* Imagen principal */}
        {mainImage && (
          <div className="aspect-video w-full relative rounded-xl overflow-hidden bg-gray-800">
            <Image 
              src={mainImage.imageUrl}
              alt={project?.name || 'Imagen principal'}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={90}
            />
          </div>
        )}

        {/* Información del proyecto - Estructura en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Columna izquierda: name y year */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-wide leading-tight">
              {project?.name}
            </h1>
            <div className="w-20 h-1 bg-white"></div>
            <p className="text-2xl md:text-3xl text-white font-medium">
              {project?.year}
            </p>
          </div>
          
          {/* Columna derecha: client y description */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-white">Cliente:</span> <span className="text-green-500">{project?.client}</span>
            </h2>
            <div className="w-20 h-1 bg-white"></div>
            <p className="text-lg md:text-xl text-white leading-relaxed">
              {project?.description}
            </p>
          </div>
        </div>

        {/* Sección de video */}
        <div className="mt-12">
          <h2 className="text-3xl md:text-4xl font-black italic text-white tracking-wide mb-6">Video</h2>
          <div className="aspect-video w-full bg-gray-800/50 rounded-xl flex items-center justify-center">
            <p className="text-xl text-gray-300">Video disponible proximamente</p>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="mt-12">
          <h2 className="text-3xl md:text-4xl font-black italic text-white tracking-wide mb-8">Galería</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative group">
                <Image 
                  src={image.imageUrl}
                  alt={`${project?.name} - Imagen ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  quality={75}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Botón Volver */}
        <div className="mt-20 flex justify-center">
          <Link 
            href="/trabajos" 
            className="px-8 py-4 text-xl md:text-2xl font-bold text-black bg-white rounded-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none"
          >
            VOLVER A TRABAJOS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkDetails;