import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
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

export default function IngredientRecommendations() {
  const [selectedCategory, setSelectedCategory] = useState('alcohol');
  const { addIngredient } = useCocktailStore();

  const { data: availableIngredients = [], isLoading } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', selectedCategory],
  });

  const handleAddIngredient = (ingredient: Ingredient) => {
    const defaultAmount = ingredient.unit === 'ml' ? 30 : 1;
    addIngredient(ingredient, defaultAmount);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Рекомендации
      </h3>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Available Ingredients */}
      <div className="flex-1">
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
                    <div className="h-4 bg-muted-foreground rounded w-24"></div>
                  </div>
                  <div className="h-8 bg-muted-foreground rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : availableIngredients.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Нет доступных ингредиентов</p>
          ) : (
            <div className="space-y-2">
              {availableIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: ingredient.color }}
                    ></div>
                    <div>
                      <p className="font-semibold text-foreground">{ingredient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ingredient.abv}% ABV • ₽{ingredient.pricePerLiter}/л
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddIngredient(ingredient)}
                    className="h-8 w-8 p-0"
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
  );
}