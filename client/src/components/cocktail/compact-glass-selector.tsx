import { useState } from 'react';
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
  { id: 'martini', name: 'Коктейльная рюмка (Martini Glass)', capacity: 150, image: martiniImage },
  { id: 'margarita', name: 'Маргарита', capacity: 250, image: margaritaImage },
  { id: 'hurricane', name: 'Харрикейн', capacity: 450, image: hurricaneImage },
  { id: 'tumbler', name: 'Тумблер', capacity: 300, image: tumblerImage },
  { id: 'snifter', name: 'Коньячный бокал (Snifter)', capacity: 350, image: snifterImage },
  { id: 'champagne-flute', name: 'Фужер для шампанского (Champagne Flute)', capacity: 170, image: champagneFlute },
  { id: 'beer-mug', name: 'Пивная кружка', capacity: 500, image: beerMugImage },
  { id: 'red-wine', name: 'Бокал для красного вина', capacity: 300, image: redWineImage },
  { id: 'white-wine', name: 'Бокал для белого вина', capacity: 260, image: whiteWineImage },
  { id: 'sour', name: 'Бокал сауэр', capacity: 120, image: sourImage },
  { id: 'champagne-saucer', name: 'Чаша для шампанского (Champagne Saucer)', capacity: 180, image: champagneSaucer },
];

export function CompactGlassSelector() {
  const { selectedGlass, setSelectedGlass } = useCocktailStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextGlass = () => {
    setCurrentIndex((prev) => (prev + 1) % glassTypes.length);
  };

  const prevGlass = () => {
    setCurrentIndex((prev) => (prev - 1 + glassTypes.length) % glassTypes.length);
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
      {/* Navigation buttons positioned at main container edges */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevGlass}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 hover:bg-primary/10 w-16 h-16 z-10"
      >
        <ChevronLeft className="h-24 w-24" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextGlass}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 hover:bg-primary/10 w-16 h-16 z-10"
      >
        <ChevronRight className="h-24 w-24" />
      </Button>

      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Выберите стакан</h3>
        
        {/* Glass Image - centered without navigation interference */}
        <div className="flex items-center justify-center w-full">          
          <div className="flex flex-col items-center space-y-2">
            {/* Enlarged glass image */}
            <div className="w-64 h-72 flex items-center justify-center">
              <img
                src={currentGlass.image}
                alt={currentGlass.name}
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Glass name closer to button */}
        <div className="text-center">
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
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-primary'
                  : 'bg-muted-foreground hover:bg-muted-foreground/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}