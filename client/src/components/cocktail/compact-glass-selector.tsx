import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCocktailStore } from '@/store/cocktail-store';

// Import glass images
import martiniGlass from '@/assets/glass-images/martini.svg';
import highballGlass from '@/assets/glass-images/highball.svg';
import shotGlass from '@/assets/glass-images/shot.svg';
import rocksGlass from '@/assets/glass-images/rocks.svg';
import wineGlass from '@/assets/glass-images/wine.svg';

const glassTypes = [
  { id: 'martini', name: 'Мартини', capacity: 150, image: martiniGlass },
  { id: 'highball', name: 'Хайбол', capacity: 350, image: highballGlass },
  { id: 'shot', name: 'Шот', capacity: 50, image: shotGlass },
  { id: 'rocks', name: 'Рокс', capacity: 200, image: rocksGlass },
  { id: 'wine', name: 'Вино', capacity: 180, image: wineGlass },
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
      id: glass.id,
      name: glass.name,
      capacity: glass.capacity,
    });
  };

  const currentGlass = glassTypes[currentIndex];
  const isSelected = selectedGlass?.id === currentGlass.id;

  return (
    <div className="flex flex-col items-center h-full justify-between">
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Выберите стакан</h3>
        
        {/* Glass Image with Navigation - Arrows at container edges */}
        <div className="relative flex items-center justify-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevGlass}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 hover:bg-primary/10 w-12 h-12"
          >
            <ChevronLeft className="h-12 w-12" />
          </Button>
          
          <div className="flex flex-col items-center space-y-2">
            {/* Enlarged glass image */}
            <div className="w-48 h-56 flex items-center justify-center">
              <img
                src={currentGlass.image}
                alt={currentGlass.name}
                className="max-w-full max-h-full filter drop-shadow-lg"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextGlass}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 hover:bg-primary/10 w-12 h-12"
          >
            <ChevronRight className="h-12 w-12" />
          </Button>
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