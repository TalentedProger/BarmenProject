import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCocktailStore } from "@/store/cocktail-store";
import IngredientCard from "./IngredientCard";
import type { Ingredient } from "@shared/schema";

const CATEGORIES = [
  { id: 'alcohol', label: 'Алкоголь', color: 'bg-neon-turquoise' },
  { id: 'juice', label: 'Соки', color: 'bg-neon-amber' },
  { id: 'syrup', label: 'Сиропы', color: 'bg-neon-pink' },
  { id: 'fruit', label: 'Фрукты', color: 'bg-neon-purple' },
  { id: 'ice', label: 'Лёд', color: 'bg-gray-500' },
];

export default function IngredientRecommendations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alcohol');
  const { ingredients, addIngredient } = useCocktailStore();

  // Fetch all categories to enable search across all ingredients
  const { data: alcoholIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'alcohol' }],
    queryFn: () => fetch('/api/ingredients?category=alcohol').then(res => res.json()),
  });
  const { data: juiceIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'juice' }],
    queryFn: () => fetch('/api/ingredients?category=juice').then(res => res.json()),
  });
  const { data: syrupIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'syrup' }],
    queryFn: () => fetch('/api/ingredients?category=syrup').then(res => res.json()),
  });
  const { data: fruitIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'fruit' }],
    queryFn: () => fetch('/api/ingredients?category=fruit').then(res => res.json()),
  });
  const { data: iceIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'ice' }],
    queryFn: () => fetch('/api/ingredients?category=ice').then(res => res.json()),
  });

  const { data: categoryIngredients = [], isLoading } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: selectedCategory }],
    queryFn: () => fetch(`/api/ingredients?category=${selectedCategory}`).then(res => res.json()),
  });

  // Combine all ingredients for search
  const allIngredients = useMemo(() => [
    ...alcoholIngredients,
    ...juiceIngredients,
    ...syrupIngredients,
    ...fruitIngredients,
    ...iceIngredients,
  ], [alcoholIngredients, juiceIngredients, syrupIngredients, fruitIngredients, iceIngredients]);

  // Filter ingredients based on search query
  const filteredIngredients = useMemo(() => {
    if (searchQuery.trim()) {
      return allIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return categoryIngredients;
  }, [searchQuery, allIngredients, categoryIngredients]);

  const handleAddIngredient = (ingredient: Ingredient, amount: number) => {
    const existingIngredient = ingredients.find(item => item.ingredient.id === ingredient.id);
    if (existingIngredient) {
      return; // Already added
    }
    
    addIngredient(ingredient, amount);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-foreground text-center">
        Ингредиенты
      </h3>
      
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск ингредиентов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Category Tabs - hide when searching */}
      {!searchQuery.trim() && (
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Available Ingredients */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {isLoading && !searchQuery.trim() ? (
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
          ) : filteredIngredients.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {searchQuery.trim() ? 'Ингредиенты не найдены' : 'Нет доступных ингредиентов'}
            </p>
          ) : (
            <div className="space-y-2 pb-2">
              {filteredIngredients.map((ingredient) => {
                const existingIngredient = ingredients.find(item => item.ingredient.id === ingredient.id);
                return (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    onAdd={handleAddIngredient}
                    disabled={!!existingIngredient}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}