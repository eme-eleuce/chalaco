// Constantes para tamaños de imagen
const IMAGE_SIZES = {
  thumbnail: 320,
  small: 640,
  medium: 1080,
  large: 1920
};

// Cache para URLs de imágenes transformadas
const urlCache = new Map();

export function getOptimizedImageUrl(url, width = IMAGE_SIZES.medium) {
  if (!url) return '';
  
  // Check if it's a Supabase URL
  if (url.includes('supabase.co')) {
    // Crear una clave única para el cache
    const cacheKey = `${url}-${width}`;
    
    // Verificar si ya existe en el cache
    if (urlCache.has(cacheKey)) {
      return urlCache.get(cacheKey);
    }

    // Limitar el ancho máximo
    const limitedWidth = Math.min(width, IMAGE_SIZES.large);
    
    // Add transform parameters to the URL
    const baseUrl = url.split('?')[0];
    const optimizedUrl = `${baseUrl}?width=${limitedWidth}&quality=75&format=webp`;
    
    // Guardar en cache
    urlCache.set(cacheKey, optimizedUrl);
    return optimizedUrl;
  }
  
  return url;
}

export function getBlurDataUrl(width = 10, height = 10) {
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#333" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="0.5s" repeatCount="indefinite"  />
    </svg>
  `).toString('base64')}`;
}

// Helper to generate srcSet for responsive images
export function generateSupabaseImageSrcSet(url) {
  if (!url || !url.includes('supabase.co')) return '';
  
  const baseUrl = url.split('?')[0];
  const sizes = [
    IMAGE_SIZES.thumbnail,
    IMAGE_SIZES.small,
    IMAGE_SIZES.medium,
    IMAGE_SIZES.large
  ];
  
  return sizes
    .map(size => {
      const optimizedUrl = getOptimizedImageUrl(baseUrl, size);
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

// Preload an array of images with specific sizes
export function preloadImages(urls, size = IMAGE_SIZES.medium) {
  if (typeof window === 'undefined') return;
  
  urls.forEach(url => {
    const optimizedUrl = getOptimizedImageUrl(url, size);
    const img = new Image();
    img.src = optimizedUrl;
  });
}

// Función para limpiar el cache de URLs
export function clearUrlCache() {
  urlCache.clear();
}

// Exportar tamaños de imagen para uso en componentes
export const imageSizes = IMAGE_SIZES;
