import { Card, CardContent } from "@/components/ui/card";
import { useCocktailStore } from "@/store/cocktail-store";
import { getIngredientColor } from "@/lib/cocktail-utils";

export default function DrinkVisualizer() {
  const { selectedGlass, ingredients, cocktailStats } = useCocktailStore();

  const renderGlass = () => {
    if (!selectedGlass) {
      return (
        <div className="w-32 h-48 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Выберите стакан</p>
        </div>
      );
    }

    const totalVolume = ingredients.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0);
    const glassHeight = 192; // 48 * 4 = 192px
    const filledHeight = Math.min(glassHeight * 0.8, (totalVolume / selectedGlass.capacity) * glassHeight);

    let currentHeight = 0;
    const layers = ingredients.map((item, index) => {
      const itemVolume = parseFloat(item.amount.toString());
      const layerHeight = (itemVolume / totalVolume) * filledHeight;
      const layer = {
        height: layerHeight,
        bottom: currentHeight,
        color: getIngredientColor(item.ingredient),
        name: item.ingredient.name
      };
      currentHeight += layerHeight;
      return layer;
    });

    const getGlassShape = () => {
      switch (selectedGlass.shape) {
        case 'martini':
          return 'polygon(30% 0%, 70% 0%, 90% 100%, 10% 100%)';
        case 'shot':
          return 'polygon(25% 0%, 75% 0%, 80% 100%, 20% 100%)';
        case 'highball':
          return 'polygon(20% 0%, 80% 0%, 85% 100%, 15% 100%)';
        default: // old-fashioned, rocks
          return 'polygon(15% 0%, 85% 0%, 90% 100%, 10% 100%)';
      }
    };

    return (
      <div className="flex justify-center">
        <div 
          className="relative w-32 h-48 bg-gradient-to-b from-transparent to-gray-800 border-2 border-gray-400 overflow-hidden"
          style={{ clipPath: getGlassShape() }}
        >
          {/* Liquid layers */}
          {layers.map((layer, index) => (
            <div
              key={index}
              className="absolute left-0 right-0 liquid-layer opacity-90"
              style={{
                height: `${layer.height}px`,
                bottom: `${layer.bottom}px`,
                background: `linear-gradient(to top, ${layer.color}, ${layer.color}dd)`,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
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
          
          {/* Glass shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 w-2 animate-pulse"></div>
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
      
      {/* Drink Stats */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Объем:</span>
          <span className="text-foreground font-semibold">
            {cocktailStats.totalVolume}ml
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Крепость:</span>
          <span className="text-foreground font-semibold">
            {cocktailStats.totalAbv}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Стоимость:</span>
          <span className="text-foreground font-semibold">
            {cocktailStats.totalCost}₽
          </span>
        </div>
      </div>
    </div>
  );
}
