import { useState, useMemo, useCallback, useTransition, useDeferredValue, memo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCocktailStore } from "@/store/cocktail-store";
import { calculateCocktailStats } from "@/lib/cocktail-utils";
import IngredientCard from "./IngredientCard";
import type { Ingredient } from "@shared/schema";

// Главные категории: только 3 (алкоголь, соки, лёд) для однострочного списка
const MAIN_CATEGORIES = [
  { id: 'alcohol', label: 'Алкоголь', color: 'bg-neon-turquoise' },
  { id: 'juice', label: 'Соки', color: 'bg-neon-amber' },
  { id: 'ice', label: 'Лёд', color: 'bg-gray-500' },
];

// Доп. категории: остальные, включая перенесенные "Сиропы"
const ADDITIONAL_CATEGORIES = [
  { id: 'syrup', label: 'Сиропы', color: 'bg-neon-pink' },
  { id: 'soda', label: 'Газировка', color: 'bg-cyan-500' },
  { id: 'energy_drink', label: 'Энергетики', color: 'bg-amber-500' },
  { id: 'fruit', label: 'Фрукты', color: 'bg-neon-purple' },
  { id: 'bitter', label: 'Биттеры', color: 'bg-red-600' },
  { id: 'garnish', label: 'Декор', color: 'bg-green-600' },
];

// Цвет рамки для выбранной категории (соответствует прежнему фону)
const BORDER_CLASS: Record<string, string> = {
  alcohol: 'border-neon-turquoise',
  juice: 'border-neon-amber',
  syrup: 'border-neon-pink',
  ice: 'border-gray-500',
  soda: 'border-cyan-500',
  energy_drink: 'border-amber-500',
  fruit: 'border-neon-purple',
  bitter: 'border-red-600',
  garnish: 'border-green-600',
};

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

// Мемоизированный компонент карточки ингредиента
const MemoizedIngredientCard = memo(IngredientCard, (prev, next) => {
  return (
    prev.ingredient.id === next.ingredient.id &&
    prev.disabled === next.disabled &&
    prev.glassCapacity === next.glassCapacity &&
    prev.currentTotalVolume === next.currentTotalVolume
  );
});

export default function IngredientRecommendations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alcohol');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { ingredients, addIngredient, selectedGlass } = useCocktailStore();
  const [isWide1535, setIsWide1535] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 1535 : false);

  useEffect(() => {
    const onResize = () => setIsWide1535(window.innerWidth >= 1535);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  
  // Отложенное значение для поиска - не блокирует UI
  const deferredSearchQuery = useDeferredValue(searchQuery);
  
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
  // Используем deferredSearchQuery для неблокирующего поиска
  const filteredIngredients = useMemo(() => {
    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase();
      // Оптимизация: ограничиваем результаты до 50 для быстрого рендеринга
      const results = [];
      for (let i = 0; i < allIngredients.length && results.length < 50; i++) {
        if (allIngredients[i].name.toLowerCase().includes(query)) {
          results.push(allIngredients[i]);
        }
      }
      return results;
    }
    
    let ingredients = categoryIngredients;
    
    if (selectedSubtype) {
      ingredients = categoryIngredients.filter(ingredient =>
        ingredient.subtype?.toLowerCase() === selectedSubtype.toLowerCase() ||
        ingredient.name.toLowerCase().includes(selectedSubtype.toLowerCase())
      );
    }
    
    return ingredients;
  }, [deferredSearchQuery, allIngredients, categoryIngredients, selectedSubtype]);
  
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
  
  // Обработчик поиска без startTransition - используем useDeferredValue вместо этого
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
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
          autoComplete="off"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* Category Selection - hide when searching */}
      {!searchQuery.trim() && (
        <div className="mb-4">
          {/* Collapsed row: однострочно (алкоголь, соки, лёд [+газировка при >=1535]) слева + круглая кнопка раскрытия справа */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar flex-nowrap">
              {(() => {
                const collapsedIds = isWide1535 ? ['alcohol', 'soda', 'juice', 'ice'] : ['alcohol', 'juice', 'ice'];
                const getCat = (id: string) => MAIN_CATEGORIES.find(c => c.id === id) || ADDITIONAL_CATEGORIES.find(c => c.id === id);
                const collapsedCats = collapsedIds.map(id => getCat(id)).filter(Boolean) as {id:string,label:string,color:string}[];
                return collapsedCats.map((category) => {
                const isActive = selectedCategory === category.id;
                const borderCls = isActive ? `${BORDER_CLASS[category.id] || ''} border-2 text-white` : 'border border-border text-muted-foreground';
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubtype('');
                    }}
                    className={`h-10 px-3 text-sm rounded-lg transition-colors bg-muted flex items-center justify-center font-medium whitespace-nowrap flex-shrink-0 ${borderCls}`}
                  >
                    {category.label}
                  </button>
                );
                });
              })()}
            </div>
            <button
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="ml-2 w-10 h-10 rounded-full neon-outline-purple flex items-center justify-center flex-shrink-0"
              aria-expanded={showMoreCategories}
            >
              {showMoreCategories ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {/* Expanded view: все категории в одну линию с переносами */}
          {showMoreCategories && (
            <div className="flex flex-wrap gap-2 mb-2 w-full">
              {ADDITIONAL_CATEGORIES.filter(c => !(isWide1535 && c.id === 'soda')).map((category) => {
                const isActive = selectedCategory === category.id;
                const borderCls = isActive ? `${BORDER_CLASS[category.id] || ''} border-2 text-white` : 'border border-border text-muted-foreground';
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`h-10 px-3 text-sm rounded-lg transition-colors bg-muted flex items-center justify-center font-medium whitespace-nowrap ${borderCls}`}
                  >
                    {category.label}
                  </button>
                );
              })}
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
              {deferredSearchQuery.trim() ? 'Ингредиенты не найдены' : 'Нет доступных ингредиентов'}
            </p>
          ) : (
            <div className="space-y-2 pb-2">
              {filteredIngredients.map((ingredient) => {
                const existingIngredient = ingredients.find(item => item.ingredient.id === ingredient.id);
                return (
                  <MemoizedIngredientCard
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