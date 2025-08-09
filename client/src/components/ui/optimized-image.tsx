import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  quality?: 'low' | 'medium' | 'high';
  placeholder?: 'blur' | 'skeleton' | 'none';
  sizes?: string;
  draggable?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  priority = false,
  width,
  height,
  style,
  onLoad,
  onError,
  quality = 'medium',
  placeholder = 'skeleton',
  sizes,
  draggable = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Intersection Observer для lazy loading
  useEffect(() => {
    if (!priority && !isInView) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Начинаем загрузку за 50px до появления
          threshold: 0.01,
        }
      );

      if (placeholderRef.current) {
        observer.observe(placeholderRef.current);
      }

      return () => observer.disconnect();
    }
  }, [priority, isInView]);

  // Preload для критических изображений
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Генерация srcSet для responsive изображений
  const generateSrcSet = (originalSrc: string) => {
    if (!originalSrc.includes('attached_assets')) return undefined;
    
    // Для карточек коктейлей создаем разные размеры
    const baseUrl = originalSrc.replace('/attached_assets/', '');
    return [
      `${originalSrc} 1x`,
      // В будущем можно добавить сжатые версии
    ].join(', ');
  };

  const getOptimizedSrc = (originalSrc: string, quality: string) => {
    // В будущем здесь можно добавить логику сжатия изображений
    return originalSrc;
  };

  const renderPlaceholder = () => {
    if (placeholder === 'none') return null;

    if (placeholder === 'skeleton') {
      return (
        <div
          ref={placeholderRef}
          className={cn(
            'bg-gradient-to-br from-gray-800 to-gray-900 image-skeleton rounded-lg',
            'flex items-center justify-center optimized-image',
            className
          )}
          style={{ 
            aspectRatio: width && height ? `${width}/${height}` : '16/9',
            ...style 
          }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      );
    }

    return (
      <div
        ref={placeholderRef}
        className={cn(
          'bg-gray-800 rounded-lg backdrop-blur-sm',
          'flex items-center justify-center',
          className
        )}
        style={{ 
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          ...style 
        }}
      >
        <div className="text-gray-400 text-sm">Загрузка...</div>
      </div>
    );
  };

  if (hasError) {
    return (
      <div
        className={cn(
          'bg-gray-800 rounded-lg flex items-center justify-center',
          'border border-red-500/20',
          className
        )}
        style={{ 
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          ...style 
        }}
      >
        <div className="text-red-400 text-sm text-center p-4">
          Ошибка загрузки изображения
        </div>
      </div>
    );
  }

  if (!isInView && !priority) {
    return renderPlaceholder();
  }

  return (
    <div className="relative">
      {!isLoaded && renderPlaceholder()}
      <img
        ref={imgRef}
        src={getOptimizedSrc(src, quality)}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        className={cn(
          'transition-opacity duration-300 optimized-image image-card',
          isLoaded ? 'opacity-100 lazy-load loaded' : 'opacity-0 absolute inset-0 lazy-load',
          className
        )}
        style={{
          ...style,
          ...(width && height ? { aspectRatio: `${width}/${height}` } : {}),
        }}
        loading={priority ? 'eager' : loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        draggable={draggable}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;