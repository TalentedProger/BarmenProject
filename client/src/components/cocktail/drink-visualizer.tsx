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
            className="w-full h-full object-contain"
            style={{ 
              filter: 'drop-shadow(0 20px 40px rgba(138, 43, 226, 0.3)) drop-shadow(0 10px 20px rgba(0, 255, 255, 0.2))',
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
    const filledHeight = Math.min(glassHeight * 0.8, (totalVolume / selectedGlass.capacity) * glassHeight);
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

    return (
      <div className="flex justify-center">
        <div className="relative">
          <div 
            className={`relative w-32 h-48 bg-gradient-to-b from-gray-700/20 to-gray-900/40 border-2 overflow-hidden shadow-2xl transition-all duration-1000 ease-out ${
              isFull ? 'border-red-500 animate-pulse' : 'border-gray-500'
            }`}
            style={{ 
              clipPath: 'polygon(15% 0%, 85% 0%, 90% 100%, 10% 100%)',
              borderRadius: '3px 3px 8px 8px',
              boxShadow: isFull ? 
                '0 0 40px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.4), 0 8px 25px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.2)' :
                '0 8px 25px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
              filter: isFull ? 
                'drop-shadow(0 0 20px rgba(239, 68, 68, 0.7)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))' :
                'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
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
            
            {/* Full glass warning overlay */}
            {isFull && (
              <div 
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg z-30 animate-fadeInUp shadow-lg"
                style={{
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.5)'
                }}
              >
                Стакан полон
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
              </div>
            )}
          </div>
          
          {/* Tooltip */}
          {hoveredLayer && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap z-20"
                 style={{ color: hoveredLayer.color }}>
              {hoveredLayer.name}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-2xl font-semibold mb-4 text-foreground">
        Визуализация
      </h3>
      
      <div className="mb-6 flex-1 flex items-center justify-center gap-6">
        {/* Glass Image */}
        <div className="flex-shrink-0">
          {renderGlassImage()}
        </div>
        
        {/* Visualization Container */}
        <div className="flex-shrink-0">
          {renderVisualizationContainer()}
        </div>
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