import { useState, useMemo, useCallback, useTransition } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCocktailStore } from "@/store/cocktail-store";
import { calculateCocktailStats } from "@/lib/cocktail-utils";
import IngredientCard from "./IngredientCard";
import type { Ingredient } from "@shared/schema";

const CATEGORIES = [
  { id: 'alcohol', label: 'Алкоголь', color: 'bg-neon-turquoise' },
  { id: 'juice', label: 'Соки', color: 'bg-neon-amber' },
  { id: 'syrup', label: 'Сиропы', color: 'bg-neon-pink' },
  { id: 'ice', label: 'Лёд', color: 'bg-gray-500' },
];

const ALCOHOL_TYPES = [
  'Водка', 'Виски', 'Бурбон', 'Джин', 'Ром', 'Текила', 'Бренди', 'Коньяк',
  'Ликёр', 'Настойка', 'Вермут', 'Пиво', 'Вино красное', 'Вино белое', 'Вино розовое', 
  'Вино игристое', 'Игристое вино', 'Шампанское', 'Абсент', 'Кальвадос', 'Граппа', 'Марсала'
];

const JUICE_TYPES = [
  'Апельсиновый', 'Яблочный', 'Ананасовый', 'Клюквенный', 'Лимонный',
  'Лаймовый', 'Томатный', 'Грейпфрутовый', 'Вишневый'
];

const SYRUP_TYPES = [
  'Простой', 'Кокосовый', 'Гренадин', 'Карамельный', 'Ванильный',
  'Мятный', 'Малиновый', 'Клубничный', 'Шоколадный'
];

const SODA_TYPES = [
  'Кола', 'Лимонад', 'Апельсиновая', 'Лимон-Лайм', 'Цитрус', 'Фруктовая', 'Коктейли'
];

const ENERGY_DRINK_TYPES = [
  'Red Bull', 'Adrenaline', 'Flash Up', 'Lit Energy', 'Gorilla', 'Burn', 'Tornado', 'Volt Energy'
];

export default function IngredientRecommendations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alcohol');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { ingredients, addIngredient, selectedGlass } = useCocktailStore();
  
  // Вычисляем текущий общий объем для передачи в IngredientCard
  const currentStats = calculateCocktailStats(ingredients);

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
  const { data: bitterIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'bitter' }],
    queryFn: () => fetch('/api/ingredients?category=bitter').then(res => res.json()),
  });
  const { data: garnishIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'garnish' }],
    queryFn: () => fetch('/api/ingredients?category=garnish').then(res => res.json()),
  });
  const { data: sodaIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'soda' }],
    queryFn: () => fetch('/api/ingredients?category=soda').then(res => res.json()),
  });
  const { data: energyDrinkIngredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients', { category: 'energy_drink' }],
    queryFn: () => fetch('/api/ingredients?category=energy_drink').then(res => res.json()),
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
    ...bitterIngredients,
    ...garnishIngredients,
    ...sodaIngredients,
    ...energyDrinkIngredients,
  ], [alcoholIngredients, juiceIngredients, syrupIngredients, fruitIngredients, iceIngredients, bitterIngredients, garnishIngredients, sodaIngredients, energyDrinkIngredients]);

  // Filter ingredients based on search query and subtype
  const filteredIngredients = useMemo(() => {
    if (searchQuery.trim()) {
      return allIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    let ingredients = categoryIngredients;
    
    if (selectedSubtype) {
      ingredients = categoryIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(selectedSubtype.toLowerCase())
      );
    }
    
    return ingredients;
  }, [searchQuery, allIngredients, categoryIngredients, selectedSubtype]);
  
  const getSubtypeOptions = (category: string) => {
    switch (category) {
      case 'alcohol': return ALCOHOL_TYPES;
      case 'juice': return JUICE_TYPES;
      case 'syrup': return SYRUP_TYPES;
      case 'soda': return SODA_TYPES;
      case 'energy_drink': return ENERGY_DRINK_TYPES;
      default: return [];
    }
  };

  const handleAddIngredient = useCallback((ingredient: Ingredient, amount: number) => {
    startTransition(() => {
      const existingIngredient = ingredients.find(item => item.ingredient.id === ingredient.id);
      if (existingIngredient) {
        return;
      }
      
      addIngredient(ingredient, amount);
    });
  }, [ingredients, addIngredient]);
  
  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  }, []);
  
  const handleCategoryChange = useCallback((category: string) => {
    startTransition(() => {
      setSelectedCategory(category);
      setSelectedSubtype('');
    });
  }, []);

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
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Category Tabs - hide when searching */}
      {!searchQuery.trim() && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex flex-wrap gap-2 flex-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedSubtype('');
                  }}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="ml-auto flex-shrink-0 px-3 py-1.5 text-sm rounded-full bg-neon-purple text-white hover:bg-neon-purple/80 flex items-center justify-center transition-colors font-semibold shadow-md self-start"
            >
              {showMoreCategories ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          </div>
          
          {/* Expanded categories */}
          {showMoreCategories && (
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { id: 'soda', label: 'Газировка', color: 'bg-cyan-500' },
                { id: 'energy_drink', label: 'Энергетики', color: 'bg-amber-500' },
                { id: 'fruit', label: 'Фрукты', color: 'bg-neon-purple' },
                { id: 'bitter', label: 'Биттеры', color: 'bg-red-600' },
                { id: 'garnish', label: 'Декор', color: 'bg-green-600' },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
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
          
          {/* Type selector */}
          {getSubtypeOptions(selectedCategory).length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-foreground mb-2 text-center">Выберите тип</h4>
              <Select 
                value={selectedSubtype || undefined} 
                onValueChange={(value) => setSelectedSubtype(value === "all" ? "" : value)} 
                modal={false}
              >
                <SelectTrigger className="w-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/30 text-white hover:border-purple-400/50 focus:border-neon-turquoise focus:ring-2 focus:ring-neon-turquoise/20 transition-all duration-300 pr-3">
                  <SelectValue placeholder="Все типы" />
                </SelectTrigger>
                <SelectContent 
                  className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-purple-500/30 backdrop-blur-xl max-h-[300px] overflow-y-auto"
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <SelectItem 
                    value="all" 
                    className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 cursor-pointer transition-colors"
                  >
                    Все типы
                  </SelectItem>
                  {getSubtypeOptions(selectedCategory).map((type) => (
                    <SelectItem 
                      key={type} 
                      value={type}
                      className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 cursor-pointer transition-colors"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Available Ingredients */}
      <div className="flex-1 overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto pr-1">
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
                    glassCapacity={selectedGlass?.capacity}
                    currentTotalVolume={currentStats.totalVolume}
                    ingredientIndex={ingredients.length}
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