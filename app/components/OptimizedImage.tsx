import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For images that should load immediately
  fallbackSrc?: string; // Fallback image if the main one fails
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  fallbackSrc,
  style,
  loading = 'lazy',
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    // Try WebP version first if the source is a jpg/jpeg/png
    if (typeof window !== 'undefined') {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (webpSrc !== src) {
        return webpSrc;
      }
    }
    return src;
  });
  const imgRef = useRef<HTMLImageElement>(null);

  // Determine if image should be loaded immediately or lazily
  const shouldLoadImmediately = priority || typeof window === 'undefined';

  useEffect(() => {
    if (!imgRef.current || shouldLoadImmediately) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(imgRef.current!);
        }
      },
      { threshold: 0.1, rootMargin: '50px' } // Start loading when 10% visible or within 50px of viewport
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [shouldLoadImmediately]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    // If WebP failed, try original format
    if (currentSrc !== src) {
      setCurrentSrc(src);
      setHasError(false);
    } else if (fallbackSrc) {
      // If original failed, try fallback
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Calculate aspect ratio if dimensions are provided
  const aspectRatioStyle = width && height
    ? { aspectRatio: `${width}/${height}`, height: 'auto' }
    : {};

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ ...style, ...aspectRatioStyle }}
    >
      {(isLoading || hasError) && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {hasError ? (
            <span className="text-gray-500 text-sm">Failed to load image</span>
          ) : (
            <div className="w-1/4 h-1/4 bg-gray-300 rounded-full animate-pulse" />
          )}
        </div>
      )}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: hasError && !fallbackSrc ? 'none' : 'block' }}
      />
    </div>
  );
};

export default OptimizedImage;