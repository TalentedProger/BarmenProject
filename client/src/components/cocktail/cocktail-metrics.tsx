import { useCocktailStore } from '@/store/cocktail-store';
import { calculateCocktailStats } from '@/lib/cocktail-utils';
import { Zap, DollarSign, Droplets, Star, AlertTriangle } from 'lucide-react';

export function CocktailMetrics() {
  const { selectedGlass, ingredients } = useCocktailStore();
  const stats = calculateCocktailStats(ingredients);

  const getVolumeColor = () => {
    if (!selectedGlass) return 'text-gray-400';
    const percentage = (stats.totalVolume / selectedGlass.capacity) * 100;
    if (percentage < 50) return 'text-yellow-400';
    if (percentage < 80) return 'text-green-400';
    if (percentage < 100) return 'text-cyan-400';
    return 'text-red-400';
  };

  const getAbvColor = () => {
    if (stats.totalAbv < 5) return 'text-green-400';
    if (stats.totalAbv < 15) return 'text-yellow-400';
    if (stats.totalAbv < 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCostColor = () => {
    if (stats.totalCost < 100) return 'text-green-400';
    if (stats.totalCost < 300) return 'text-yellow-400';
    if (stats.totalCost < 500) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTasteRecommendations = () => {
    const recommendations = [];
    
    if (stats.tasteBalance?.sweet > 7) {
      recommendations.push({
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "Слишком сладко - добавьте кислоты",
        color: "text-yellow-400"
      });
    }
    
    if (stats.tasteBalance?.sour > 7) {
      recommendations.push({
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "Слишком кисло - добавьте сладости",
        color: "text-yellow-400"
      });
    }
    
    if (stats.tasteBalance?.bitter > 6) {
      recommendations.push({
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "Горьковато - добавьте сладкий сироп",
        color: "text-orange-400"
      });
    }
    
    if (stats.totalAbv > 30) {
      recommendations.push({
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "Высокая крепость - добавьте разбавитель",
        color: "text-red-400"
      });
    }
    
    if (stats.totalVolume > 0 && selectedGlass && stats.totalVolume < selectedGlass.capacity * 0.3) {
      recommendations.push({
        icon: <Droplets className="h-4 w-4" />,
        text: "Мало жидкости - добавьте ингредиенты",
        color: "text-blue-400"
      });
    }
    
    if (recommendations.length === 0 && stats.totalVolume > 0) {
      recommendations.push({
        icon: <Star className="h-4 w-4" />,
        text: "Отличный баланс!",
        color: "text-green-400"
      });
    }
    
    return recommendations;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Характеристики</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="text-white">Объем:</span>
            </div>
            <span className={`font-mono text-lg ${getVolumeColor()}`}>
              {stats.totalVolume}ml
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-white">Крепость:</span>
            </div>
            <span className={`font-mono text-lg ${getAbvColor()}`}>
              {stats.totalAbv.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-white">Стоимость:</span>
            </div>
            <span className={`font-mono text-lg ${getCostColor()}`}>
              ₽{stats.totalCost.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Capacity indicator */}
        {selectedGlass && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Заполнение стакана</span>
              <span>{((stats.totalVolume / selectedGlass.capacity) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((stats.totalVolume / selectedGlass.capacity) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Рекомендации</h3>
        
        <div className="space-y-3">
          {getTasteRecommendations().map((rec, index) => (
            <div key={index} className={`flex items-start space-x-3 ${rec.color}`}>
              <div className="flex-shrink-0 mt-0.5">
                {rec.icon}
              </div>
              <span className="text-sm">{rec.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}