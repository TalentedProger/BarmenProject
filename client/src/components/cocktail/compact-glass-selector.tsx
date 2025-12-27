import { useState, useEffect } from 'react';
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

  // Предзагрузка изображений для плавной анимации
  useEffect(() => {
    glassTypes.forEach(glass => {
      const img = new Image();
      img.src = glass.image;
    });
  }, []);

  const nextGlass = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % glassTypes.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevGlass = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + glassTypes.length) % glassTypes.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const selectCurrentGlass = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const glass = glassTypes[currentIndex];
    setSelectedGlass({
      id: currentIndex + 1, // Convert to numeric ID for database compatibility
      name: glass.name,
      capacity: glass.capacity,
      shape: glass.id, // Use string ID as shape
      createdAt: new Date()
    });
  };

  const currentGlass = glassTypes[currentIndex];
  const isSelected = selectedGlass?.shape === currentGlass.id;

  return (
    <div className="relative flex flex-col items-center h-full justify-between overflow-hidden">
      {/* Navigation buttons - contained within parent */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevGlass}
        disabled={isTransitioning}
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 z-30 p-0 transition-opacity duration-300 text-white hover:text-white hover:bg-transparent ${
          isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}
        style={{ background: 'transparent', transform: 'translateY(-50%)' }}
      >
        <ChevronLeft className="h-10 w-10 sm:h-16 sm:w-16" strokeWidth={3} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextGlass}
        disabled={isTransitioning}
        className={`absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 z-30 p-0 transition-opacity duration-300 text-white hover:text-white hover:bg-transparent ${
          isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}
        style={{ background: 'transparent', transform: 'translateY(-50%)' }}
      >
        <ChevronRight className="h-10 w-10 sm:h-16 sm:w-16" strokeWidth={3} />
      </Button>

      <div className="flex flex-col items-center space-y-6 w-full px-12 sm:px-16">
        <h3 className="text-lg font-semibold text-foreground mb-4">Выберите стакан</h3>
        
        {/* Glass Image - centered without navigation interference */}
        <div className="flex items-center justify-center w-full">          
          <div className="flex flex-col items-center space-y-8">
            {/* Enlarged glass image with animation and elegant shadows */}
            <div className="w-48 h-56 sm:w-64 sm:h-72 flex items-center justify-center overflow-hidden relative pointer-events-none">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={currentGlass.image}
                  alt={currentGlass.name}
                  className={`max-w-full max-h-full object-contain relative z-10 transition-all duration-300 ease-in-out ${
                    isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
                  }`}
                  loading="eager"
                  decoding="async"
                  width="256"
                  height="288"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'drop-shadow(0 30px 60px rgba(138, 43, 226, 0.5)) drop-shadow(0 20px 40px rgba(0, 255, 255, 0.4))'
                  }}
                />
                
                {/* Enhanced glow effects behind the glass - contained */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-500/30 to-cyan-400/30 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-pink-400/25 to-blue-400/25 rounded-full blur-2xl -z-20"></div>
                
                {/* Enhanced base shadow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 sm:w-32 sm:h-6 bg-black/30 rounded-full blur-lg -z-40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Glass name closer to button */}
        <div className={`text-center transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-70' : 'opacity-100'
        }`}>
          <h4 className="text-foreground font-medium text-lg">{currentGlass.name}</h4>
          <p className="text-muted-foreground text-sm">{currentGlass.capacity}ml</p>
        </div>

        {/* Selection Button - smaller width with glowing shadow */}
        <Button
          onClick={selectCurrentGlass}
          className={`w-[70%] max-w-[200px] mt-4 transition-all duration-300 ${
            isSelected
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/50'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 hover:shadow-primary/70'
          }`}
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

        {/* Dots Indicator - moved below button */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4 max-w-full px-4">
          {glassTypes.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isTransitioning) return;
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 300);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground hover:bg-muted-foreground/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}