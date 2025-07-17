import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCocktailStore } from "@/store/cocktail-store";
import type { Ingredient } from "@shared/schema";

const CATEGORIES = [
  { id: 'alcohol', label: 'Алкоголь', color: 'bg-neon-turquoise' },
  { id: 'juice', label: 'Соки', color: 'bg-neon-amber' },
  { id: 'syrup', label: 'Сиропы', color: 'bg-neon-pink' },
  { id: 'fruit', label: 'Фрукты', color: 'bg-neon-purple' },
  { id: 'ice', label: 'Лёд', color: 'bg-gray-500' },
];

export default function IngredientSelector() {
  const [selectedCategory, setSelectedCategory] = useState('alcohol');
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useCocktailStore();

  const { data: availableIngredients = [], isLoading } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', selectedCategory],
  });

  const handleAddIngredient = (ingredient: Ingredient) => {
    const defaultAmount = ingredient.unit === 'ml' ? 30 : 1;
    addIngredient(ingredient, defaultAmount);
  };

  const handleUpdateAmount = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    updateIngredient(index, amount);
  };

  const getCategoryColor = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId)?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Available Ingredients Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-neon-pink">
          Ингредиенты
        </h3>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className={`${
                selectedCategory === category.id 
                  ? `${category.color} text-night-blue` 
                  : 'border-gray-600 hover:border-neon-turquoise'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Available Ingredients */}
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-3 text-cream">Доступные</h4>
          <ScrollArea className="h-40">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-charcoal rounded-lg animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                      <div className="h-4 bg-gray-600 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gray-600 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : availableIngredients.length === 0 ? (
              <p className="text-center text-gray-400 py-4">Нет доступных ингредиентов</p>
            ) : (
              <div className="space-y-2">
                {availableIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between p-3 bg-charcoal rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: ingredient.color }}
                      ></div>
                      <div>
                        <p className="font-semibold text-cream">{ingredient.name}</p>
                        <p className="text-sm text-gray-400">
                          {ingredient.abv}% ABV • ₽{ingredient.pricePerLiter}/л
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddIngredient(ingredient)}
                      className="bg-neon-turquoise text-night-blue hover:bg-neon-turquoise/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Added Ingredients Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-400">Добавленные ингредиенты</h3>
        <ScrollArea className="h-40">
          {ingredients.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Пока нет добавленных ингредиентов</p>
          ) : (
            <div className="space-y-2">
              {ingredients.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-charcoal rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.ingredient.color }}
                    ></div>
                    <div>
                      <p className="font-semibold text-cream">{item.ingredient.name}</p>
                      <Badge variant="outline" className={getCategoryColor(item.ingredient.category)}>
                        {item.ingredient.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleUpdateAmount(index, e.target.value)}
                      className="w-20 bg-night-blue border-gray-600 focus:border-neon-turquoise"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-sm text-cream">{item.unit}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeIngredient(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
