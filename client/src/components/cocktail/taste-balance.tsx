import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCocktailStore } from "@/store/cocktail-store";

export default function TasteBalance() {
  const { cocktailStats } = useCocktailStore();

  const tasteMetrics = [
    { 
      name: 'Сладость', 
      value: cocktailStats.tasteBalance.sweet, 
      color: 'bg-pink-500',
      textColor: 'text-pink-400' 
    },
    { 
      name: 'Кислота', 
      value: cocktailStats.tasteBalance.sour, 
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400' 
    },
    { 
      name: 'Горечь', 
      value: cocktailStats.tasteBalance.bitter, 
      color: 'bg-orange-500',
      textColor: 'text-orange-400' 
    },
    { 
      name: 'Алкоголь', 
      value: cocktailStats.tasteBalance.alcohol, 
      color: 'bg-red-500',
      textColor: 'text-red-400' 
    },
  ];

  return (
    <Card className="glass-effect border-none">
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-6 text-neon-amber">
          Баланс вкуса
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tasteMetrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className={`text-lg font-semibold ${metric.textColor} mb-2`}>
                {metric.name}
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${metric.color}`}
                  style={{ width: `${(metric.value / 10) * 100}%` }}
                />
              </div>
              <span className="text-cream font-semibold">
                {metric.value.toFixed(1)}/10
              </span>
            </div>
          ))}
        </div>
        
        {/* Recommendations */}
        <div className="mt-6 p-4 bg-charcoal rounded-lg">
          <h4 className="text-lg font-semibold text-neon-turquoise mb-2">Рекомендации</h4>
          <div className="space-y-1 text-sm text-cream">
            {cocktailStats.tasteBalance.sweet > 7 && (
              <p className="text-yellow-400">• Слишком сладко - добавьте кислоты</p>
            )}
            {cocktailStats.tasteBalance.sour > 7 && (
              <p className="text-pink-400">• Слишком кисло - добавьте сладости</p>
            )}
            {cocktailStats.tasteBalance.bitter > 6 && (
              <p className="text-orange-400">• Много горечи - разбавьте соком</p>
            )}
            {cocktailStats.tasteBalance.alcohol > 8 && (
              <p className="text-red-400">• Очень крепко - добавьте безалкогольные ингредиенты</p>
            )}
            {cocktailStats.totalVolume < 50 && (
              <p className="text-gray-400">• Маленький объем - добавьте больше ингредиентов</p>
            )}
            {cocktailStats.totalVolume > 400 && (
              <p className="text-gray-400">• Большой объем - уменьшите количество</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
