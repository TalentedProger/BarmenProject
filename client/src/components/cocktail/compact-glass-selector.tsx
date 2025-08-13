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

  const nextGlass = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % glassTypes.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevGlass = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + glassTypes.length) % glassTypes.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const selectCurrentGlass = () => {
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
    <div className="relative flex flex-col items-center h-full justify-between">
      {/* Navigation buttons positioned at main container edges with higher z-index */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevGlass}
        disabled={isTransitioning}
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 hover:bg-primary/10 w-16 h-16 z-50 transition-all duration-200 ${
          isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
        }`}
      >
        <ChevronLeft className="h-24 w-24" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextGlass}
        disabled={isTransitioning}
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 hover:bg-primary/10 w-16 h-16 z-50 transition-all duration-200 ${
          isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
        }`}
      >
        <ChevronRight className="h-24 w-24" />
      </Button>

      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Выберите стакан</h3>
        
        {/* Glass Image - centered without navigation interference */}
        <div className="flex items-center justify-center w-full">          
          <div className="flex flex-col items-center space-y-2">
            {/* Enlarged glass image with animation and elegant shadows */}
            <div className="w-64 h-72 flex items-center justify-center overflow-visible relative pointer-events-none">
              <div className="relative">
                <img
                  src={currentGlass.image}
                  alt={currentGlass.name}
                  className={`w-full h-full object-contain relative z-10 transition-all duration-300 ease-in-out ${
                    isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
                  }`}
                  loading="eager"
                  decoding="async"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    willChange: 'transform, opacity',
                    filter: 'drop-shadow(0 30px 60px rgba(138, 43, 226, 0.5)) drop-shadow(0 20px 40px rgba(0, 255, 255, 0.4))'
                  }}
                />
                
                {/* Enhanced glow effects behind the glass - more expressive */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-cyan-400/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-400/25 to-blue-400/25 rounded-full blur-2xl -z-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-t from-violet-400/35 to-cyan-300/35 rounded-full blur-xl -z-30"></div>
                
                {/* Enhanced base shadow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black/30 rounded-full blur-lg -z-40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Glass name closer to button */}
        <div className={`text-center transition-all duration-300 ease-in-out ${
          isTransitioning ? 'opacity-70 transform translate-y-1' : 'opacity-100 transform translate-y-0'
        }`}>
          <h4 className="text-foreground font-medium text-lg">{currentGlass.name}</h4>
          <p className="text-muted-foreground text-sm">{currentGlass.capacity}ml</p>
        </div>

        {/* Selection Button - smaller width with glowing shadow */}
        <Button
          onClick={selectCurrentGlass}
          className={`w-[70%] mt-4 transition-all duration-300 ${
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
        <div className="flex space-x-2 mt-4">
          {glassTypes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isTransitioning) return;
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 300);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground hover:bg-muted-foreground/80 hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}