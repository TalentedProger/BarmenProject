import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { X, Filter, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import type { Ingredient } from "@shared/schema";

interface GeneratorFiltersProps {
  filters: GenerationFilters;
  onFiltersChange: (filters: GenerationFilters) => void;
  onReset: () => void;
}

export interface GenerationFilters {
  mode: string;
  requiredIngredients: number[];
  requiredCategories: string[];
  maxAlcoholContent: number;
  minAlcoholContent: number;
  maxPrice: number;
  preferredCategories: string[];
  glassType: string;
  complexity: 'simple' | 'medium' | 'complex';
  tastePreferences: {
    sweet: number;
    sour: number;
    bitter: number;
    alcohol: number;
  };
}

const CATEGORIES = [
  { id: 'alcohol', label: 'Алкоголь', color: 'bg-red-500' },
  { id: 'juice', label: 'Соки', color: 'bg-orange-500' },
  { id: 'syrup', label: 'Сиропы', color: 'bg-pink-500' },
  { id: 'mixer', label: 'Миксеры', color: 'bg-blue-500' },
  { id: 'soda', label: 'Газировка', color: 'bg-cyan-500' },
  { id: 'energy_drink', label: 'Энергетики', color: 'bg-amber-500' },
  { id: 'fruit', label: 'Фрукты', color: 'bg-green-500' },
  { id: 'bitter', label: 'Биттеры', color: 'bg-yellow-600' },
  { id: 'garnish', label: 'Декор', color: 'bg-purple-500' }
];

const GLASS_TYPES = [
  { value: 'any', label: 'Любой стакан' },
  { value: 'old-fashioned', label: 'Old-fashioned' },
  { value: 'highball', label: 'Highball' },
  { value: 'martini', label: 'Martini' },
  { value: 'shot', label: 'Shot' },
  { value: 'wine', label: 'Wine' },
  { value: 'beer', label: 'Beer' },
  { value: 'champagne', label: 'Champagne' }
];

export default function GeneratorFilters({ filters, onFiltersChange, onReset }: GeneratorFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showRequiredIngredients, setShowRequiredIngredients] = useState(false);

  // Загружаем ингредиенты для фильтров
  const { data: ingredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients'],
    queryFn: () => fetch('/api/ingredients').then(res => res.json()),
  });

  const updateFilters = (updates: Partial<GenerationFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleIngredient = (ingredientId: number) => {
    const newList = filters.requiredIngredients.includes(ingredientId)
      ? filters.requiredIngredients.filter(id => id !== ingredientId)
      : [...filters.requiredIngredients, ingredientId];

    updateFilters({ requiredIngredients: newList });
  };

  const toggleRequiredCategory = (categoryId: string) => {
    const newCategories = filters.requiredCategories.includes(categoryId)
      ? filters.requiredCategories.filter(id => id !== categoryId)
      : [...filters.requiredCategories, categoryId];
    
    updateFilters({ requiredCategories: newCategories });
  };

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.preferredCategories.includes(categoryId)
      ? filters.preferredCategories.filter(id => id !== categoryId)
      : [...filters.preferredCategories, categoryId];
    
    updateFilters({ preferredCategories: newCategories });
  };

  const updateTastePreference = (taste: keyof typeof filters.tastePreferences, value: number) => {
    updateFilters({
      tastePreferences: {
        ...filters.tastePreferences,
        [taste]: value
      }
    });
  };

  const hasActiveFilters = 
    filters.requiredIngredients.length > 0 ||
    filters.requiredCategories.length > 0 ||
    filters.maxAlcoholContent < 50 ||
    filters.minAlcoholContent > 0 ||
    filters.maxPrice < 5000 ||
    filters.preferredCategories.length > 0 ||
    (filters.glassType !== 'any' && filters.glassType !== '') ||
    filters.complexity !== 'simple';

  return (
    <Card className="glass-effect border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-neon-turquoise">
            <Filter className="h-5 w-5" />
            Фильтры генерации
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-xs bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Сбросить
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs border-neon-turquoise/50 text-neon-turquoise hover:bg-neon-turquoise/10"
            >
              {showAdvanced ? 'Скрыть' : 'Расширенные'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Основные фильтры */}
        <div className="space-y-4">
          {/* Крепость */}
          <div>
            <Label className="text-base font-semibold text-cream mb-2 block">
              Крепость: {filters.minAlcoholContent}% - {filters.maxAlcoholContent}%
            </Label>
            <div className="px-2">
              <Slider
                value={[filters.minAlcoholContent, filters.maxAlcoholContent]}
                onValueChange={([min, max]) => updateFilters({ 
                  minAlcoholContent: min, 
                  maxAlcoholContent: max 
                })}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Максимальная цена */}
          <div>
            <Label className="text-base font-semibold text-cream mb-2 block">
              Максимальная стоимость: {filters.maxPrice}₽
            </Label>
            <div className="px-2">
              <Slider
                value={[filters.maxPrice]}
                onValueChange={([value]) => updateFilters({ maxPrice: value })}
                max={5000}
                min={100}
                step={50}
                className="w-full"
              />
            </div>
          </div>

          {/* Предпочитаемые категории */}
          <div>
            <Label className="text-base font-semibold text-cream mb-3 block">
              Предпочитаемые категории
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.slice(0, 5).map((category) => (
                <Badge
                  key={category.id}
                  variant="default"
                  className={`cursor-pointer transition-all text-sm px-3 py-1.5 ${category.color} text-white border-2 text-center ${
                    filters.preferredCategories.includes(category.id) 
                      ? 'border-white shadow-lg opacity-100' 
                      : 'border-transparent opacity-70 hover:opacity-90'
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {CATEGORIES.slice(5).map((category) => (
                <Badge
                  key={category.id}
                  variant="default"
                  className={`cursor-pointer transition-all text-sm px-3 py-1.5 ${category.color} text-white border-2 text-center ${
                    filters.preferredCategories.includes(category.id) 
                      ? 'border-white shadow-lg opacity-100' 
                      : 'border-transparent opacity-70 hover:opacity-90'
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Расширенные фильтры */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-600">
            {/* Тип стакана */}
            <div>
              <Label className="text-base font-semibold text-cream mb-2 block">
                Тип стакана
              </Label>
              <Select value={filters.glassType} onValueChange={(value) => updateFilters({ glassType: value })} modal={false}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип стакана" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  className="max-h-[300px] overflow-y-auto"
                >
                  {GLASS_TYPES.map((glass) => (
                    <SelectItem key={glass.value} value={glass.value}>
                      {glass.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Сложность */}
            <div>
              <Label className="text-base font-semibold text-cream mb-2 block">
                Сложность рецепта
              </Label>
              <Select 
                value={filters.complexity} 
                onValueChange={(value: 'simple' | 'medium' | 'complex') => updateFilters({ complexity: value })}
                modal={false}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  className="max-h-[300px] overflow-y-auto"
                >
                  <SelectItem value="simple">Простой (2-3 ингредиента)</SelectItem>
                  <SelectItem value="medium">Средний (4-5 ингредиентов)</SelectItem>
                  <SelectItem value="complex">Сложный (6+ ингредиентов)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Вкусовые предпочтения */}
            <div className="pt-4 border-t border-gray-600">
              <Label className="text-base font-semibold text-cream mb-4 block">
                Вкусовые предпочтения
              </Label>
              <div className="space-y-4">
                {[
                  { key: 'sweet', label: 'Сладость', color: 'text-pink-400' },
                  { key: 'sour', label: 'Кислотность', color: 'text-yellow-400' },
                  { key: 'bitter', label: 'Горечь', color: 'text-green-400' },
                  { key: 'alcohol', label: 'Алкогольность', color: 'text-red-400' }
                ].map(({ key, label, color }) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-semibold ${color}`}>{label}</span>
                      <span className="text-xs text-cream">
                        {filters.tastePreferences[key as keyof typeof filters.tastePreferences]}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        value={[filters.tastePreferences[key as keyof typeof filters.tastePreferences]]}
                        onValueChange={([value]) => updateTastePreference(key as keyof typeof filters.tastePreferences, value)}
                        max={10}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Обязательные ингредиенты по категориям */}
            <div className="pt-4 border-t border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold text-cream">
                  Обязательные ингредиенты
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRequiredIngredients(!showRequiredIngredients)}
                  className="h-6 w-6 p-0 text-cream hover:bg-white/10"
                >
                  {showRequiredIngredients ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              {showRequiredIngredients && (
              <div className="space-y-2">
                {CATEGORIES.map((category) => {
                  const categoryIngredients = ingredients.filter(ing => ing.category === category.id);
                  const isExpanded = expandedCategories.includes(category.id);
                  const isCategorySelected = filters.requiredCategories.includes(category.id);
                  
                  if (categoryIngredients.length === 0) return null;
                  
                  // Группируем ингредиенты по названию (подкатегории)
                  const subcategories = Array.from(new Set(categoryIngredients.map(ing => ing.name)));
                  
                  return (
                    <div key={category.id} className="border border-gray-600 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1">
                          <Checkbox
                            id={`cat-${category.id}`}
                            checked={isCategorySelected}
                            onCheckedChange={() => toggleRequiredCategory(category.id)}
                          />
                          <label 
                            htmlFor={`cat-${category.id}`}
                            className="text-sm text-cream cursor-pointer font-semibold"
                          >
                            {category.label}
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoryExpanded(category.id)}
                          className="h-7 w-7 p-0 text-cream hover:bg-white/10"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-3 ml-6 space-y-2 max-h-40 overflow-y-auto">
                          {subcategories.map((subcatName) => {
                            const subcatIngredients = categoryIngredients.filter(ing => ing.name === subcatName);
                            const firstIng = subcatIngredients[0];
                            const isSubcatSelected = subcatIngredients.every(ing => filters.requiredIngredients.includes(ing.id));
                            
                            return (
                              <div key={subcatName} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`subcat-${category.id}-${subcatName}`}
                                  checked={isSubcatSelected}
                                  onCheckedChange={() => {
                                    // Toggle all ingredients of this subcategory
                                    const allSelected = subcatIngredients.every(ing => filters.requiredIngredients.includes(ing.id));
                                    if (allSelected) {
                                      // Remove all
                                      const newList = filters.requiredIngredients.filter(id => !subcatIngredients.find(ing => ing.id === id));
                                      updateFilters({ requiredIngredients: newList });
                                    } else {
                                      // Add all
                                      const idsToAdd = subcatIngredients.map(ing => ing.id).filter(id => !filters.requiredIngredients.includes(id));
                                      updateFilters({ requiredIngredients: [...filters.requiredIngredients, ...idsToAdd] });
                                    }
                                  }}
                                />
                                <label 
                                  htmlFor={`subcat-${category.id}-${subcatName}`}
                                  className="text-sm text-cream/90 cursor-pointer flex items-center gap-2"
                                >
                                  <div 
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: firstIng.color }}
                                  />
                                  {subcatName}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          </div>
        )}

        {/* Активные фильтры */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-600">
            <Label className="text-base font-semibold text-cream mb-3 block">
              Активные фильтры
            </Label>
            <div className="flex flex-wrap gap-2">
              {filters.requiredCategories.map(categoryId => {
                const category = CATEGORIES.find(cat => cat.id === categoryId);
                return category ? (
                  <Badge key={`req-cat-${categoryId}`} className="bg-green-600 text-sm px-3 py-1.5">
                    Обязательно: {category.label}
                    <X 
                      className="h-4 w-4 ml-1.5 cursor-pointer" 
                      onClick={() => toggleRequiredCategory(categoryId)}
                    />
                  </Badge>
                ) : null;
              })}
              {filters.requiredIngredients.map(id => {
                const ingredient = ingredients.find(ing => ing.id === id);
                return ingredient ? (
                  <Badge key={`req-${id}`} variant="default" className="bg-green-600 text-sm px-3 py-1.5">
                    {ingredient.name}
                    <X 
                      className="h-4 w-4 ml-1.5 cursor-pointer" 
                      onClick={() => toggleIngredient(id)}
                    />
                  </Badge>
                ) : null;
              })}
              {filters.preferredCategories.map(categoryId => {
                const category = CATEGORIES.find(cat => cat.id === categoryId);
                return category ? (
                  <Badge key={`cat-${categoryId}`} className={`${category.color} text-sm px-3 py-1.5`}>
                    {category.label}
                    <X 
                      className="h-4 w-4 ml-1.5 cursor-pointer" 
                      onClick={() => toggleCategory(categoryId)}
                    />
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
