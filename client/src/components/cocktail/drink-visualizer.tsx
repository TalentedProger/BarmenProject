import { Card, CardContent } from "@/components/ui/card";
import { useCocktailStore } from "@/store/cocktail-store";
import { getIngredientColor } from "@/lib/cocktail-utils";
import { useState } from "react";

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

// Glass image mapping
const glassImageMap: Record<string, string> = {
  'shot': shotImage,
  'old-fashioned': oldFashionedImage,
  'highball': highballImage,
  'martini': martiniImage,
  'margarita': margaritaImage,
  'hurricane': hurricaneImage,
  'tumbler': tumblerImage,
  'snifter': snifterImage,
  'champagne-flute': champagneFlute,
  'beer-mug': beerMugImage,
  'red-wine': redWineImage,
  'white-wine': whiteWineImage,
  'sour': sourImage,
  'champagne-saucer': champagneSaucer,
};

export default function DrinkVisualizer() {
  const { selectedGlass, ingredients, cocktailStats } = useCocktailStore();
  const [hoveredLayer, setHoveredLayer] = useState<{ name: string; color: string } | null>(null);

  const renderGlassImage = () => {
    if (!selectedGlass) {
      return (
        <div className="w-32 h-48 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Выберите стакан</p>
        </div>
      );
    }

    const glassImage = glassImageMap[selectedGlass.shape] || glassImageMap['old-fashioned'];

    return (
      <div className="flex justify-center">
        <div className="relative w-32 h-48">
          <img
            src={glassImage}
            alt={selectedGlass.name}
            className="w-full h-full object-contain transition-all duration-1000"
            style={{ 
              filter: isOverfilled 
                ? 'drop-shadow(0 20px 40px rgba(239, 68, 68, 0.5)) drop-shadow(0 10px 20px rgba(239, 68, 68, 0.3))'
                : isFull && !isOverfilled
                ? 'drop-shadow(0 20px 40px rgba(34, 197, 94, 0.5)) drop-shadow(0 10px 20px rgba(34, 197, 94, 0.3))'
                : 'none',
            }}
          />
        </div>
      </div>
    );
  };

  const renderVisualizationContainer = () => {
    if (!selectedGlass) {
      return (
        <div className="w-32 h-48 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Выберите стакан</p>
        </div>
      );
    }

    const totalVolume = ingredients.reduce((sum, item) => {
      const amount = parseFloat(item.amount.toString());
      // Convert kg to ml for fruits (density approximation)
      const volumeInMl = item.ingredient.unit === 'kg' ? amount * 1000 : amount;
      return sum + volumeInMl;
    }, 0);
    
    const glassHeight = 192; // 48 * 4 = 192px
    // Максимальная высота заполнения 100%
    const filledHeight = Math.min(glassHeight, (totalVolume / selectedGlass.capacity) * glassHeight);
    const isFull = totalVolume >= selectedGlass.capacity;

    let currentHeight = 0;
    const layers = ingredients.map((item, index) => {
      const itemVolume = parseFloat(item.amount.toString());
      const layerHeight = totalVolume > 0 ? (itemVolume / totalVolume) * filledHeight : 0;
      const layer = {
        height: layerHeight,
        bottom: currentHeight,
        color: getIngredientColor(item.ingredient),
        name: item.ingredient.name,
        id: `layer-${index}`
      };
      currentHeight += layerHeight;
      return layer;
    });
    
    // Убираем дополнительный слой - заполнение теперь идет до 100%

    return (
      <div className="flex justify-center">
        <div className="relative">
          {/* Background circular glow when full or overfilled */}
          {(isFull || isOverfilled) && (
            <div 
              className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
              style={{
                background: isOverfilled 
                  ? 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.2) 40%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
                width: '200px',
                height: '200px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1,
                filter: 'blur(20px)'
              }}
            />
          )}
          
          <div 
            className="relative w-32 h-48 overflow-hidden transition-all duration-1000 ease-out"
            style={{ 
              borderRadius: '12px',
              border: '2px solid rgba(156, 163, 175, 0.4)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 6px 15px rgba(0, 0, 0, 0.4)',
              filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))',
              background: 'linear-gradient(to bottom, rgba(55, 65, 81, 0.3), rgba(17, 24, 39, 0.5))',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              }}
            >
            {/* Liquid layers */}
            {layers.map((layer, index) => (
              <div
                key={index}
                className="absolute left-0 right-0 liquid-layer opacity-90 cursor-pointer"
                style={{
                  height: `${layer.height}px`,
                  bottom: `${layer.bottom}px`,
                  background: `linear-gradient(to top, ${layer.color}, ${layer.color}dd)`,
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={() => setHoveredLayer({ name: layer.name, color: layer.color })}
                onMouseLeave={() => setHoveredLayer(null)}
              />
            ))}
            
            {/* Ice cubes effect */}
            {ingredients.some(item => item.ingredient.category === 'ice') && (
              <>
                <div className="absolute top-4 left-4 w-4 h-4 bg-blue-200 rounded opacity-80 animate-pulse"></div>
                <div className="absolute top-8 right-6 w-3 h-3 bg-blue-200 rounded opacity-80 animate-pulse"></div>
                <div className="absolute top-12 left-6 w-2 h-2 bg-blue-200 rounded opacity-80 animate-pulse"></div>
              </>
            )}
            
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 w-2"></div>
            </div>
          </div>
          
          {/* Tooltip removed - now shown above visualization */}
        </div>
      </div>
    );
  };

  // Calculate volume and fullness status
  const totalVolume = ingredients.reduce((sum, item) => {
    const amount = parseFloat(item.amount.toString());
    const volumeInMl = item.ingredient.unit === 'kg' ? amount * 1000 : amount;
    return sum + volumeInMl;
  }, 0);
  
  const capacity = selectedGlass?.capacity || 300;
  const fillPercentage = totalVolume / capacity;
  const isFull = selectedGlass && fillPercentage >= 1.0;
  const isOverfilled = selectedGlass && fillPercentage > 1.0;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-2xl font-semibold mb-4 text-foreground text-center">
        Визуализация
      </h3>
      
      {/* Hovered ingredient name display */}
      <div className="text-center mb-2 h-8 flex items-center justify-center">
        {hoveredLayer && (
          <p 
            className="text-sm font-medium animate-fadeIn"
            style={{
              color: hoveredLayer.color,
              textShadow: `0 0 10px ${hoveredLayer.color}88`,
            }}
          >
            {hoveredLayer.name}
          </p>
        )}
      </div>
      
      <div className="mb-4 flex-1 flex items-center justify-center gap-6">
        {/* Glass Image */}
        <div className="flex-shrink-0">
          {renderGlassImage()}
        </div>
        
        {/* Visualization Container */}
        <div className="flex-shrink-0">
          {renderVisualizationContainer()}
        </div>
      </div>
      
      {/* Status text - moved after visualization */}
      <div className="text-center mb-4 h-8 flex items-center justify-center">
        {isFull && !isOverfilled && (
          <p 
            className="text-sm md:text-lg font-bold animate-fadeInUp"
            style={{
              color: '#22c55e',
              textShadow: '0 0 4px rgba(34, 197, 94, 0.6), 0 0 8px rgba(34, 197, 94, 0.3)',
              filter: 'drop-shadow(0 1px 2px rgba(34, 197, 94, 0.3))'
            }}
          >
            Стакан заполнен
          </p>
        )}
        {isOverfilled && (
          <p 
            className="text-sm md:text-lg font-bold animate-fadeInUp"
            style={{
              color: '#ef4444',
              textShadow: '0 0 4px rgba(239, 68, 68, 0.6), 0 0 8px rgba(239, 68, 68, 0.3)',
              filter: 'drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))'
            }}
          >
            Стакан переполнен
          </p>
        )}
      </div>
      
      {/* Glass Info */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Объем:</span>
          <span className="text-foreground font-semibold">
            {selectedGlass?.capacity || 0}ml
          </span>
        </div>
      </div>
    </div>
  );
}