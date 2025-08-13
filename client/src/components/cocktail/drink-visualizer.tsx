import { Card, CardContent } from "@/components/ui/card";
import { useCocktailStore } from "@/store/cocktail-store";
import { getIngredientColor } from "@/lib/cocktail-utils";

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

  const renderGlass = () => {
    if (!selectedGlass) {
      return (
        <div className="w-48 h-64 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Выберите стакан</p>
        </div>
      );
    }

    const totalVolume = ingredients.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0);
    const glassHeight = 256; // 64 * 4 = 256px
    const filledHeight = Math.min(glassHeight * 0.75, (totalVolume / selectedGlass.capacity) * glassHeight * 0.75);

    let currentHeight = 0;
    const layers = ingredients.map((item, index) => {
      const itemVolume = parseFloat(item.amount.toString());
      const layerHeight = totalVolume > 0 ? (itemVolume / totalVolume) * filledHeight : 0;
      const layer = {
        height: layerHeight,
        bottom: currentHeight,
        color: getIngredientColor(item.ingredient),
        name: item.ingredient.name
      };
      currentHeight += layerHeight;
      return layer;
    });

    const glassImage = glassImageMap[selectedGlass.shape] || glassImageMap['old-fashioned'];

    return (
      <div className="flex justify-center">
        <div className="relative w-48 h-64">
          {/* Glass container with liquid layers */}
          <div className="relative w-full h-full overflow-hidden">
            {/* Liquid layers background */}
            <div className="absolute inset-0 flex justify-center items-end">
              <div className="relative w-32 h-48 overflow-hidden">
                {/* Liquid layers */}
                {layers.length > 0 && layers.map((layer, index) => (
                  <div
                    key={index}
                    className="absolute left-4 right-4 liquid-layer opacity-90 rounded-sm"
                    style={{
                      height: `${layer.height}px`,
                      bottom: `${20 + layer.bottom}px`,
                      background: `linear-gradient(to top, ${layer.color}, ${layer.color}dd)`,
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '2px',
                      marginLeft: '10px',
                      marginRight: '10px',
                    }}
                  />
                ))}
                
                {/* Ice cubes effect */}
                {ingredients.some(item => item.ingredient.category === 'ice') && filledHeight > 20 && (
                  <>
                    <div className="absolute w-3 h-3 bg-blue-200 rounded opacity-80 animate-pulse" 
                         style={{ bottom: `${30 + filledHeight * 0.7}px`, left: '20px' }}></div>
                    <div className="absolute w-2 h-2 bg-blue-200 rounded opacity-80 animate-pulse"
                         style={{ bottom: `${25 + filledHeight * 0.5}px`, right: '25px' }}></div>
                    <div className="absolute w-2 h-2 bg-blue-200 rounded opacity-80 animate-pulse"
                         style={{ bottom: `${35 + filledHeight * 0.3}px`, left: '25px' }}></div>
                  </>
                )}
              </div>
            </div>

            {/* Glass image overlay */}
            <img
              src={glassImage}
              alt={selectedGlass.name}
              className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
              style={{ 
                filter: 'drop-shadow(0 20px 40px rgba(138, 43, 226, 0.3)) drop-shadow(0 10px 20px rgba(0, 255, 255, 0.2))',
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-2xl font-semibold mb-4 text-foreground">
        Визуализация
      </h3>
      
      <div className="mb-6 flex-1 flex items-center justify-center">
        {renderGlass()}
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
