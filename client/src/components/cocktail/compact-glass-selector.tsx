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
    <div className="flex flex-col items-center space-y-4 bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">Выберите стакан</h3>
      
      {/* Glass Image with Navigation */}
      <div className="relative flex items-center justify-center w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevGlass}
          className="absolute left-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex flex-col items-center space-y-3">
          <div className="w-24 h-32 flex items-center justify-center">
            <img
              src={currentGlass.image}
              alt={currentGlass.name}
              className="max-w-full max-h-full filter drop-shadow-lg"
            />
          </div>
          
          <div className="text-center">
            <h4 className="text-white font-medium">{currentGlass.name}</h4>
            <p className="text-cyan-400 text-sm">{currentGlass.capacity}ml</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextGlass}
          className="absolute right-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Selection Button */}
      <Button
        onClick={selectCurrentGlass}
        className={`w-full ${
          isSelected
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-cyan-600 hover:bg-cyan-700 text-white'
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

      {/* Dots Indicator */}
      <div className="flex space-x-2">
        {glassTypes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-cyan-400'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}