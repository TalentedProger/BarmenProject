import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCocktailStore } from '@/store/cocktail-store';

// Local glass type for UI components
interface LocalGlassType {
  id: string;
  name: string;
  capacity: number;
  image: string;
}

// Import glass images
import shotImage from '@/assets/glass-images-new/shot.png';
import oldFashionedImage from '@/assets/glass-images-new/old-fashioned.png';
import highballImage from '@/assets/glass-images-new/highball.png';
import martiniImage from '@/assets/glass-images-new/martini.png';
import margaritaImage from '@/assets/glass-images-new/margarita.png';
import hurricaneImage from '@/assets/glass-images-new/hurricane.png';
import tumblerImage from '@/assets/glass-images-new/tumbler.png';
import snifterImage from '@/assets/glass-images-new/snifter.png';
import champagneFlute from '@/assets/glass-images-new/champagne-flute.png';
import beerMugImage from '@/assets/glass-images-new/beer-mug.png';
import redWineImage from '@/assets/glass-images-new/red-wine.png';
import whiteWineImage from '@/assets/glass-images-new/white-wine.png';
import sourImage from '@/assets/glass-images-new/sour.png';
import champagneSaucer from '@/assets/glass-images-new/champagne-saucer.png';

const glassTypes: LocalGlassType[] = [
  { id: 'shot', name: 'Шот', capacity: 50, image: shotImage },
  { id: 'old-fashioned', name: 'Олд Фэшн', capacity: 300, image: oldFashionedImage },
  { id: 'highball', name: 'Хайбол', capacity: 270, image: highballImage },
  { id: 'martini', name: 'Коктейльная рюмка', capacity: 150, image: martiniImage },
  { id: 'margarita', name: 'Маргарита', capacity: 250, image: margaritaImage },
  { id: 'hurricane', name: 'Харрикейн', capacity: 450, image: hurricaneImage },
  { id: 'tumbler', name: 'Тумблер', capacity: 300, image: tumblerImage },
  { id: 'snifter', name: 'Коньячный бокал', capacity: 350, image: snifterImage },
  { id: 'champagne-flute', name: 'Фужер для шампанского', capacity: 170, image: champagneFlute },
  { id: 'beer-mug', name: 'Пивная кружка', capacity: 500, image: beerMugImage },
  { id: 'red-wine', name: 'Бокал для красного вина', capacity: 300, image: redWineImage },
  { id: 'white-wine', name: 'Бокал для белого вина', capacity: 260, image: whiteWineImage },
  { id: 'sour', name: 'Бокал сауэр', capacity: 120, image: sourImage },
  { id: 'champagne-saucer', name: 'Чаша для шампанского', capacity: 180, image: champagneSaucer },
];

export function CompactGlassSelector() {
  const { selectedGlass, setSelectedGlass } = useCocktailStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Предзагрузка изображений
  useEffect(() => {
    glassTypes.forEach(glass => {
      const img = new Image();
      img.src = glass.image;
    });
  }, []);

  const nextGlass = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % glassTypes.length);
    setTimeout(() => setIsTransitioning(false), 200);
  }, [isTransitioning]);

  const prevGlass = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + glassTypes.length) % glassTypes.length);
    setTimeout(() => setIsTransitioning(false), 200);
  }, [isTransitioning]);

  const selectCurrentGlass = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const glass = glassTypes[currentIndex];
    setSelectedGlass({
      id: currentIndex + 1,
      name: glass.name,
      capacity: glass.capacity,
      shape: glass.id,
      createdAt: new Date()
    });
  }, [currentIndex, setSelectedGlass]);

  const goToIndex = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 200);
  }, [isTransitioning, currentIndex]);

  const currentGlass = glassTypes[currentIndex];
  const isSelected = selectedGlass?.shape === currentGlass.id;

  return (
    <div 
      className="flex flex-col items-center w-full"
      style={{ 
        contain: 'layout style paint',
        isolation: 'isolate',
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Выберите стакан
      </h3>
      
      {/* Carousel container - fixed height, no overflow */}
      <div 
        className="relative w-full flex items-center justify-center"
        style={{ 
          height: '260px',
          maxWidth: '100%',
          contain: 'layout style',
          overflow: 'hidden'
        }}
      >
        {/* Left button - inside container bounds */}
        <button
          type="button"
          onClick={prevGlass}
          disabled={isTransitioning}
          aria-label="Предыдущий стакан"
          className="absolute z-10 flex items-center justify-center text-white/80 hover:text-white disabled:opacity-50"
          style={{ 
            left: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: isTransitioning ? 'not-allowed' : 'pointer',
            padding: 0
          }}
        >
          <ChevronLeft style={{ width: '32px', height: '32px' }} strokeWidth={2.5} />
        </button>
        
        {/* Glass image container - centered, contained */}
        <div 
          style={{ 
            width: '160px',
            height: '200px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            contain: 'layout style paint',
            overflow: 'hidden'
          }}
        >
          {/* Simple glow - contained within bounds */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '120px',
              height: '120px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(138, 43, 226, 0.25) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />
          
          {/* Glass image */}
          <img
            src={currentGlass.image}
            alt={currentGlass.name}
            width={140}
            height={180}
            loading="eager"
            decoding="async"
            style={{ 
              maxWidth: '140px',
              maxHeight: '180px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              opacity: isTransitioning ? 0.7 : 1,
              transition: 'opacity 150ms ease-out',
              filter: 'drop-shadow(0 15px 30px rgba(138, 43, 226, 0.35))'
            }}
          />
        </div>
        
        {/* Right button - inside container bounds */}
        <button
          type="button"
          onClick={nextGlass}
          disabled={isTransitioning}
          aria-label="Следующий стакан"
          className="absolute z-10 flex items-center justify-center text-white/80 hover:text-white disabled:opacity-50"
          style={{ 
            right: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: isTransitioning ? 'not-allowed' : 'pointer',
            padding: 0
          }}
        >
          <ChevronRight style={{ width: '32px', height: '32px' }} strokeWidth={2.5} />
        </button>
      </div>

      {/* Glass info */}
      <div className="text-center mt-3">
        <h4 className="text-foreground font-medium text-lg">{currentGlass.name}</h4>
        <p className="text-muted-foreground text-sm">{currentGlass.capacity}ml</p>
      </div>

      {/* Select button */}
      <Button
        type="button"
        onClick={selectCurrentGlass}
        className={`mt-4 ${
          isSelected
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
        }`}
        style={{ 
          minWidth: '140px', 
          maxWidth: '180px',
          paddingLeft: '24px',
          paddingRight: '24px'
        }}
      >
        {isSelected ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Выбран
          </>
        ) : (
          'Выбрать'
        )}
      </Button>

      {/* Dots indicator - contained */}
      <div 
        className="flex flex-wrap justify-center gap-1.5 mt-4"
        style={{ 
          maxWidth: '100%',
          padding: '0 8px',
          overflow: 'hidden'
        }}
      >
        {glassTypes.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => goToIndex(index, e)}
            aria-label={`Стакан ${index + 1}`}
            style={{ 
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              background: index === currentIndex 
                ? 'hsl(var(--primary))' 
                : 'hsl(var(--muted-foreground) / 0.5)',
              transition: 'background 150ms ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}