
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, BUCKET_NAME, SUPABASE_URL } from '../utils/supabase';
import { getOptimizedImageUrl, generateSupabaseImageSrcSet, getBlurDataUrl } from '../utils/imageUtils';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Cache de URLs de imágenes
const imageUrlCache = new Map();

// Cache de URLs y blur data
const urlCache = new Map();

const getImageData = async (folder) => {
  // Revisar si los datos están en caché
  if (urlCache.has(folder)) {
    return urlCache.get(folder);
  }

  const extensions = ['png', 'jpg'];
  
  for (const ext of extensions) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${folder}/image1.${ext}`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        const imageUrl = getOptimizedImageUrl(url);
        // Generar una versión muy pequeña para el blur
        const tinyImageUrl = `${url}?width=20&quality=20&format=webp`;
        const imageData = {
          imageUrl,
          srcSet: generateSupabaseImageSrcSet(imageUrl),
          blurDataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            `<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
              <rect width='100%' height='100%' fill='rgb(31, 41, 55)'/>
              <filter id='b' color-interpolation-filters='sRGB'>
                <feGaussianBlur stdDeviation='20'/>
              </filter>
              <image
                preserveAspectRatio='none'
                filter='url(#b)'
                x='0'
                y='0'
                width='100%'
                height='100%'
                href='${tinyImageUrl}'
              />
            </svg>`
          )}`
        };
        // Guardar en caché
        urlCache.set(folder, imageData);
        return imageData;
      }
    } catch (error) {
      console.log(`Error checking ${ext} image:`, error);
    }
  }
  
  // Si no se encuentra ninguna imagen, usar fallback
  const fallbackUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${folder}/image1.png`;
  const imageUrl = getOptimizedImageUrl(fallbackUrl);
  const imageData = {
    imageUrl,
    srcSet: generateSupabaseImageSrcSet(imageUrl),
    blurDataUrl: getBlurDataUrl()
  };
  // Guardar en caché
  urlCache.set(folder, imageData);
  return imageData;
};

const ProjectSkeleton = ({ large = false }) => (
  <div className="flex flex-col space-y-4 animate-pulse">
    <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gray-700/50"></div>
    </div>
    <div className="space-y-2 px-1">
      <div className={`h-8 ${large ? 'md:h-12' : 'md:h-8'} bg-gray-700/50 rounded-md w-3/4`}></div>
      <div className="w-12 h-1 bg-gray-700/50 my-3"></div>
      <div className="h-6 bg-gray-700/50 rounded-md w-1/2"></div>
    </div>
  </div>
);

const Banner = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        console.log('Fetching from page table...');
        console.log('Supabase URL:', SUPABASE_URL);
        console.log('Bucket name:', BUCKET_NAME);
        
        console.log('Supabase client:', supabase);
        
        // Generar 5 números aleatorios únicos entre 1 y 26
        const randomIds = Array.from({ length: 26 }, (_, i) => i + 1)
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);

        const { data: projectsData, error: projectsError } = await supabase
          .from('page')
          .select('*')
          .in('id', randomIds);

        console.log('Raw response:', { projectsData, projectsError });

        if (projectsError) {
          console.log('Error details:', {
            message: projectsError.message,
            details: projectsError.details,
            hint: projectsError.hint
          });
          throw projectsError;
        }

        console.log('Projects data:', projectsData);

        if (!projectsData || projectsData.length === 0) {
          setError('No se encontraron proyectos en la base de datos');
          return;
        }

        // Procesar primero los 2 proyectos principales
        const mainProjects = await Promise.all(projectsData.slice(0, 2).map(async (project) => {
          const imageData = await getImageData(project.storage_folder);
          return {
            ...project,
            ...imageData
          };
        }));

        // Establecer los primeros proyectos inmediatamente
        setProjects(mainProjects);

        // Procesar el resto de proyectos
        const remainingProjects = await Promise.all(projectsData.slice(2).map(async (project) => {
          const imageData = await getImageData(project.storage_folder);
          return {
            ...project,
            ...imageData
          };
        }));

        // Actualizar con todos los proyectos
        setProjects([...mainProjects, ...remainingProjects]);
      } catch (error) {
        console.error('Error in fetchProjects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
    <section className="min-h-screen w-full flex items-center justify-center bg-green-500 text-black">
      <div className="w-full max-w-[2000px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 pt-4 pb-8 md:py-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold tracking-wider leading-tight">
              ¡SOMOS CHALACO FILMS!
            </h1>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <button
              className="px-12 py-6 text-3xl sm:text-4xl font-bold bg-black text-white rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none"
            >
              SERVICIOS
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Sección de Trabajos */}
    <section className="min-h-screen w-full bg-black text-white py-16 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      <div className="max-w-[2000px] mx-auto">
        <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[12rem] font-bold mb-16 text-center tracking-wider">
          TRABAJOS
        </h2>
        
        {error ? (
          <div className="text-red-500 text-center text-xl">{error}</div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-8">
            {/* Primera fila: 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <ProjectSkeleton large />
              <ProjectSkeleton large />
            </div>
            
            {/* Segunda fila: 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Primera fila: 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {projects.slice(0, 2).map((project, index) => (
                <div key={project.id} className="flex flex-col space-y-4">
                  <div className="group aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                    <Image
                      src={project.imageUrl}
                      alt={project.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      quality={75}
                      placeholder="blur"
                      blurDataURL={project.blurDataUrl}
                      priority={index === 0}
                    />
                  </div>
                  <div className="space-y-2 px-1">
                    <h3 className="text-2xl md:text-4xl xl:text-5xl font-black italic text-white tracking-wide leading-tight">{project.name}</h3>
                    <div className="w-12 h-1 bg-white my-3"></div>
                    <p className="text-base md:text-xl text-white">
                      {project.client} <span className="opacity-75">|</span> <span className="text-green-500">{project.category}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Segunda fila: 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.slice(2, 5).map((project, index) => (
                <div key={project.id} className="flex flex-col space-y-4">
                  <div className="group aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                    <Image
                      src={project.imageUrl}
                      alt={project.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1080px) 33vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      quality={75}
                      placeholder="blur"
                      blurDataURL={project.blurDataUrl}
                      priority={false}
                    />
                  </div>
                  <div className="space-y-2 px-1">
                    <h3 className="text-2xl md:text-2xl font-black italic text-white tracking-wide leading-tight">{project.name}</h3>
                    <div className="w-8 h-1 bg-white my-2"></div>
                    <p className="text-base md:text-lg text-white">
                      {project.client} <span className="opacity-75">|</span> <span className="text-green-500">{project.category}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botón Ver Más Trabajos */}
            <div className="flex justify-center mt-16">
              <Link 
                href="/trabajos"
                className="px-12 py-6 text-3xl sm:text-4xl font-bold bg-white text-black rounded-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none"
              >
                VER MÁS TRABAJOS
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default Banner;