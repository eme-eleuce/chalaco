"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_BLUR =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"><rect width="100%" height="100%" fill="#1a1a1a"/></svg>'
  );

/**
 * next/image with pulse placeholder + fade-in when ready
 */
export default function SmoothImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className = "",
  quality = 75,
  priority = false,
  blurDataURL,
  onLoad,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  return (
    <>
      {!loaded && (
        <div
          className="absolute inset-0 bg-gray-800 animate-pulse"
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL || FALLBACK_BLUR}
        className={`${className} transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleLoad}
        {...rest}
      />
    </>
  );
}
