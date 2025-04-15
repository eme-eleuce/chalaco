"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, BUCKET_NAME, SUPABASE_URL } from '../../utils/supabase';
import { getOptimizedImageUrl, generateSupabaseImageSrcSet } from '../../utils/imageUtils';

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
        const imageData = {
          imageUrl,
          srcSet: generateSupabaseImageSrcSet(imageUrl)
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
    srcSet: generateSupabaseImageSrcSet(imageUrl)
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

const categories = [
  'Todos',
  'Comerciales',
  'Fotos',
  'Videoclips',
  'Institucional'
];

const Showcase = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [animateProjects, setAnimateProjects] = useState(true);
  const projectsPerPage = 6; // Cambiado a 6 para tener una cuadrícula 2x3

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      
      try {
        if (!supabase) {
          throw new Error('No se pudo establecer conexión con la base de datos');
        }

        // Obtener todos los proyectos de la categoría seleccionada
        let query = supabase
          .from('page')
          .select('*')
          .order('id', { ascending: true });

        if (selectedCategory !== 'Todos') {
          query = query.eq('category', selectedCategory);
        }

        const { data: allProjects, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(`Error al obtener proyectos: ${fetchError.message}`);
        }

        // Calcular el total de páginas basado en todos los proyectos
        const totalProjects = allProjects.length;
        const calculatedTotalPages = Math.ceil(totalProjects / projectsPerPage);
        console.log('Pagination info:', { totalProjects, calculatedTotalPages, currentPage });
        setTotalPages(calculatedTotalPages);

        // Obtener solo los proyectos de la página actual
        const startIndex = (currentPage - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        const projectsData = allProjects.slice(startIndex, endIndex);

        if (!allProjects || !Array.isArray(allProjects)) {
          throw new Error('No se encontraron proyectos');
        }

        // Procesar los proyectos
        const projectsWithImages = await Promise.all(projectsData.map(async (project) => {
          const imageData = await getImageData(project.storage_folder);
          return {
            ...project,
            ...imageData
          };
        }));

        setProjects(projectsWithImages);
      } catch (error) {
        console.error('Error en fetchProjects:', error);
        setError(error.message || 'Hubo un error al cargar los proyectos');
        setProjects([]); // Limpiar proyectos en caso de error
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchProjects();
  }, [selectedCategory, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // Primero activamos la animación de salida
      setAnimateProjects(false);
      
      // Después de un breve retraso, cambiamos de página y activamos la animación de entrada
      setTimeout(() => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Pequeño retraso para asegurar que la animación de entrada se active después del cambio de página
        setTimeout(() => {
          setAnimateProjects(true);
        }, 100);
      }, 300);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    // Reducir el número máximo de botones en móvil para evitar desbordamiento
    const maxButtons = window.innerWidth < 640 ? 3 : 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    // Botón anterior
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-6 py-3 text-xl md:text-2xl font-bold text-white border-2 border-white rounded-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]"
      >
        ←
      </button>
    );

    // Números de página
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-6 py-3 text-xl md:text-2xl font-bold rounded-xl transition-all ${currentPage === i
            ? 'bg-white text-[#0a0a0a] shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none'
            : 'text-white border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none'}`}
        >
          {i}
        </button>
      );
    }

    // Botón siguiente
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-6 py-3 text-xl md:text-2xl font-bold text-white border-2 border-white rounded-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]"
      >
        →
      </button>
    );

    return buttons;
  };

  // Mostrar mensaje de error si existe
  if (error) {
    return (
      <section className="min-h-screen py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">¡Ups! Algo salió mal</h2>
            <p className="text-lg md:text-xl mb-8">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setCurrentPage(1);
                setSelectedCategory('Todos');
              }}
              className="px-8 py-4 text-xl font-bold bg-white text-black rounded-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar pantalla de carga inicial solo en la primera carga
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

  return (
    <section className="min-h-screen py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-6xl md:text-8xl xl:text-9xl 2xl:text-[12rem] font-black text-white mb-20 text-center tracking-tight leading-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          TRABAJOS
        </motion.h2>
        
        {/* Filtro de categorías */}
        <motion.div 
          className="flex justify-center gap-4 md:gap-8 mb-16 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 + index * 0.1 }}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1); // Resetear a la primera página al cambiar categoría
                setAnimateProjects(false);
                setTimeout(() => setAnimateProjects(true), 100);
              }}
              className={`px-8 py-4 text-xl md:text-2xl font-bold rounded-xl transition-all ${selectedCategory === category
                ? 'bg-white text-[#0a0a0a] shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none'
                : 'text-white border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none'}`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
        
        <div className="space-y-8">
          {error ? (
            <div className="text-red-500 text-center text-xl">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {/* Grid de proyectos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading ? (
                  Array(6).fill(0).map((_, index) => (
                    <ProjectSkeleton key={index} />
                  ))
                ) : (
                  <AnimatePresence mode="wait">
                    {animateProjects && projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ 
                          duration: 0.6, 
                          ease: "easeOut",
                          delay: index * 0.1 // Efecto escalonado
                        }}
                      >
                        <Link 
                          href={`/trabajos/${encodeURIComponent(project.id)}`} 
                          className="flex flex-col space-y-4 group cursor-pointer"
                          onClick={() => console.log('Navegando al proyecto:', project)}
                        >
                          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                            <Image
                              src={project.imageUrl}
                              alt={project.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              quality={75}
                              priority={index < 3} // Priorizar carga de las primeras 3 imágenes
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                          </div>
                          <div className="space-y-2 px-1 group">
                            <h3 className="text-2xl md:text-3xl font-black italic text-white tracking-wide leading-tight group-hover:text-green-500 transition-colors">{project.name}</h3>
                            <div className="w-12 h-1 bg-white my-3 group-hover:bg-green-500 transition-colors"></div>
                            <p className="text-lg md:text-xl lg:text-2xl text-white font-medium">
                              {project.client} <span className="opacity-75 mx-3">|</span> <span className="text-green-500">{project.category}</span>
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}
          
          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mt-12 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.8 }}
            >
              {renderPaginationButtons()}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Showcase;