import React, { useState, useEffect, useMemo, useCallback, useDeferredValue, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Star, Heart, Clock, TrendingUp, SlidersHorizontal, X, Grid3X3, List, SortAsc, SortDesc } from "lucide-react";
import { getCocktails, type CocktailData } from "@/data/cocktails";
import { Link } from "wouter";

// Вынесены наружу для оптимизации - не будут пересоздаваться при каждом рендере
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'classic': return 'Классический';
    case 'summer': return 'Летний';
    case 'shot': return 'Шот';
    case 'nonalcoholic': return 'Безалкогольный';
    default: return category;
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'Легкий';
    case 'medium': return 'Средний';
    case 'hard': return 'Сложный';
    default: return difficulty;
  }
};

// Компонент карточки коктейля - мемоизирован для оптимизации
const CocktailCard = React.memo(({ 
  cocktail, 
  isFavorite, 
  onFavorite,
  priority = false
}: { 
  cocktail: CocktailData; 
  isFavorite: boolean;
  onFavorite: (id: string, isFavorite: boolean) => void;
  priority?: boolean;
}) => {

  return (
    <Card className="cocktail-card group relative glass-effect border-none shadow-xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 w-full max-w-sm mx-auto" style={{ height: '420px', minHeight: '420px' }}>
      {/* Фоновое изображение с фиксированными размерами для предотвращения CLS */}
      <div className="absolute inset-0" style={{ aspectRatio: '3/4' }}>
        <img 
          src={cocktail.image} 
          alt={cocktail.name}
          className="cocktail-image w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          width="320"
          height="420"
          style={{ contentVisibility: 'auto' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      </div>

      {/* Кнопка избранного */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 z-10 h-8 w-8 p-0 bg-black/30 hover:bg-black/50 backdrop-blur-sm"
        onClick={() => onFavorite(cocktail.id, isFavorite)}
      >
        <Heart 
          className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
        />
      </Button>

      <CardContent className="relative z-10 p-0 h-[420px] flex flex-col">
        {/* Заголовок и описание - более компактный */}
        <div className="bg-black/60 backdrop-blur-sm p-3 text-center border-b border-white/10" style={{ minHeight: '72px' }}>
          <h3 className="text-white text-lg font-bold mb-1 drop-shadow-lg">
            {cocktail.name}
          </h3>
          <p className="text-white/90 text-xs italic line-clamp-1 drop-shadow-md">
            {cocktail.description}
          </p>
        </div>

        {/* Теги */}
        <div className="flex gap-2 p-2 items-start" style={{ minHeight: '50px' }}>
          <span className="flex-1 text-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800/90 text-neon-amber border border-neon-amber/60 shadow-lg backdrop-blur-sm"
            style={{
              textShadow: '0 0 8px rgba(255, 193, 7, 0.8)',
              boxShadow: '0 0 12px rgba(255, 193, 7, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
            {getCategoryLabel(cocktail.category)}
          </span>
          <span className={`flex-1 text-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800/90 border border-white/30 shadow-lg backdrop-blur-sm ${getDifficultyColor(cocktail.difficulty)}`}
            style={{
              boxShadow: '0 0 12px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
            {getDifficultyLabel(cocktail.difficulty)}
          </span>
        </div>

        {/* Спейсер */}
        <div className="flex-1" />

        {/* Статистика - без прозрачного фона и в новом формате */}
        <div className="p-3 space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-white/90 font-medium">Крепость: <span className="text-neon-turquoise font-semibold">{cocktail.abv}%</span></span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-white/90 font-medium">Объем: <span className="text-neon-purple font-semibold">{cocktail.volume}мл</span></span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-white/90 font-medium flex items-center">
              Рейтинг: <span className="text-white font-medium ml-1">{cocktail.rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mx-1" />
              <span className="text-white/60">({cocktail.reviewCount})</span>
            </span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-white/90 font-medium">Стоимость: <span className="text-neon-amber font-semibold">{cocktail.cost}₽</span></span>
          </div>
        </div>

        {/* Кнопка просмотра */}
        <div className="p-3 pt-2 flex justify-center" style={{ minHeight: '56px' }}>
          <Link href={`/recipe/${cocktail.id}`} className="w-3/5">
            <Button 
              className="recipe-button w-full text-white font-medium text-sm py-2 rounded-lg shadow-lg relative overflow-hidden"
              style={{
                background: 'linear-gradient(45deg, rgba(139, 69, 255, 0.9), rgba(0, 247, 239, 0.9), rgba(255, 20, 147, 0.9), rgba(139, 69, 255, 0.9))',
                backgroundSize: '300% 300%',
                animation: 'shimmer 3s ease-in-out infinite',
                boxShadow: '0 4px 15px rgba(139, 69, 255, 0.4), 0 2px 8px rgba(0, 247, 239, 0.3)'
              }}
            >
              <span className="relative z-10">Открыть рецепт</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});
CocktailCard.displayName = 'CocktailCard';

export default function Catalog() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "difficulty">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxPreparationTime, setMaxPreparationTime] = useState(30);
  const [displayedItems, setDisplayedItems] = useState(12);
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
  
  // Оптимизация: используем useDeferredValue для неблокирующего поиска
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [isPending, startTransition] = useTransition();
  
  // Debounce для поиска - улучшает INP
  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  }, []);

  const ITEMS_PER_LOAD = 12;

  // Мемоизированные отфильтрованные коктейли для оптимизации
  const filteredCocktailsData = useMemo(() => {
    let cocktails = getCocktails({
      search: deferredSearchQuery,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      difficulty: selectedDifficulty === "all" ? undefined : selectedDifficulty,
    });

    // Дополнительные фильтры
    if (minRating > 0) {
      cocktails = cocktails.filter(cocktail => parseFloat(cocktail.rating) >= minRating);
    }

    if (maxPreparationTime < 30) {
      cocktails = cocktails.filter(cocktail => (cocktail.preparationTime || 10) <= maxPreparationTime);
    }

    // Сортировка
    cocktails.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "rating":
          comparison = parseFloat(a.rating) - parseFloat(b.rating);
          break;
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          comparison = (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 2) - 
                      (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 2);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return cocktails;
  }, [deferredSearchQuery, selectedCategory, selectedDifficulty, sortBy, sortOrder, minRating, maxPreparationTime]);

  // Получаем отображаемые коктейли с учетом лимита - мемоизировано
  const displayedCocktails = useMemo(() => {
    return filteredCocktailsData.slice(0, displayedItems);
  }, [filteredCocktailsData, displayedItems]);
  
  // Сброс пагинации при изменении фильтров
  useEffect(() => {
    setDisplayedItems(ITEMS_PER_LOAD);
  }, [deferredSearchQuery, selectedCategory, selectedDifficulty, sortBy, sortOrder, minRating, maxPreparationTime]);

  const handleSearch = useCallback(() => {
    // Поиск происходит автоматически через useMemo
  }, []);

  const handleLoadMore = useCallback(() => {
    setDisplayedItems(prev => prev + ITEMS_PER_LOAD);
  }, []);

  const handleFavorite = useCallback((cocktailId: string, isFavorite: boolean) => {
    const newFavorites = new Set(userFavorites);
    if (isFavorite) {
      newFavorites.delete(cocktailId);
    } else {
      newFavorites.add(cocktailId);
    }
    setUserFavorites(newFavorites);
    
    toast({
      title: isFavorite ? "Удалено из избранного" : "Добавлено в избранное",
      description: isFavorite ? "Рецепт удален из избранного" : "Рецепт добавлен в избранное",
    });
  }, [userFavorites, toast]);

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      <section className="pt-48 pb-16 bg-gradient-to-b from-night-blue to-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-amber via-yellow-400 to-neon-amber bg-clip-text text-transparent" 
                style={{ textShadow: '0 0 20px rgba(255, 193, 7, 0.5), 0 0 40px rgba(255, 193, 7, 0.3)' }}>
              Каталог Рецептов
            </h2>
            <p className="text-lg md:text-xl text-cream max-w-2xl mx-auto">
              Откройте для себя тысячи проверенных рецептов от профессиональных барменов
            </p>
          </div>
          {/* Search and Filters */}
          <Card className="glass-effect border-none mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Поиск коктейлей по названию, ингредиентам..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 pr-10 bg-night-blue border-gray-600 focus:border-neon-turquoise"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Main Filters Row */}
                <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                  <Select value={selectedCategory} onValueChange={(value) => startTransition(() => setSelectedCategory(value))} modal={false}>
                    <SelectTrigger className="flex-1 min-w-[140px] bg-night-blue border-gray-600 focus:border-neon-turquoise">
                      <SelectValue placeholder="Все категории" />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      className="bg-night-blue border-gray-600 max-h-[300px] overflow-y-auto"
                    >
                      <SelectItem value="all">Все категории</SelectItem>
                      <SelectItem value="classic">Классические</SelectItem>
                      <SelectItem value="summer">Летние</SelectItem>
                      <SelectItem value="shot">Шоты</SelectItem>
                      <SelectItem value="nonalcoholic">Безалкогольные</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedDifficulty} onValueChange={(value) => startTransition(() => setSelectedDifficulty(value))} modal={false}>
                    <SelectTrigger className="flex-1 min-w-[120px] bg-night-blue border-gray-600 focus:border-neon-turquoise">
                      <SelectValue placeholder="Сложность" />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      className="bg-night-blue border-gray-600 max-h-[300px] overflow-y-auto"
                    >
                      <SelectItem value="all">Любая сложность</SelectItem>
                      <SelectItem value="easy">Легкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="hard">Сложный</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort Controls */}
                  <Select value={sortBy} onValueChange={(value: "name" | "rating" | "difficulty") => startTransition(() => setSortBy(value))} modal={false}>
                    <SelectTrigger className="flex-1 min-w-[120px] bg-night-blue border-gray-600 focus:border-neon-turquoise">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      className="bg-night-blue border-gray-600 max-h-[300px] overflow-y-auto"
                    >
                      <SelectItem value="name">По названию</SelectItem>
                      <SelectItem value="rating">По рейтингу</SelectItem>
                      <SelectItem value="difficulty">По сложности</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="border-gray-600 text-gray-300 hover:text-white hover:border-neon-turquoise"
                  >
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`${viewMode === "grid" ? "bg-neon-turquoise text-black" : "text-gray-300 hover:text-white"} rounded-none`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`${viewMode === "list" ? "bg-neon-turquoise text-black" : "text-gray-300 hover:text-white"} rounded-none`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Advanced Filters Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="border-gray-600 text-gray-300 hover:text-white hover:border-neon-turquoise"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Фильтры
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <div className="border-t border-gray-600 pt-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Rating Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Минимальный рейтинг: {minRating}</label>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.5"
                          value={minRating}
                          onChange={(e) => setMinRating(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>0</span>
                          <span>2.5</span>
                          <span>5</span>
                        </div>
                      </div>

                      {/* Preparation Time Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Время приготовления: {maxPreparationTime === 30 ? "любое" : `до ${maxPreparationTime} мин`}
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          step="5"
                          value={maxPreparationTime}
                          onChange={(e) => setMaxPreparationTime(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>5 мин</span>
                          <span>15 мин</span>
                          <span>30+ мин</span>
                        </div>
                      </div>
                    </div>

                    {/* Reset Filters */}
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMinRating(0);
                          setMaxPreparationTime(30);
                          setSelectedCategory("all");
                          setSelectedDifficulty("all");
                          setSearchQuery("");
                        }}
                        className="border-gray-600 text-gray-300 hover:text-white hover:border-red-500"
                      >
                        Сбросить все фильтры
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          {filteredCocktailsData.length > 0 && (
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">
                Показано {displayedCocktails.length} из {filteredCocktailsData.length} рецептов
              </p>
              {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || minRating > 0 || maxPreparationTime < 30) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMinRating(0);
                    setMaxPreparationTime(30);
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                    setSearchQuery("");
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  Очистить фильтры
                </Button>
              )}
            </div>
          )}

          {/* Cocktails Display */}
          {filteredCocktailsData.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">Рецепты не найдены</p>
                <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
              </div>
            </div>
          ) : (
            <>
              {/* Grid or List View */}
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr"
                  : "space-y-4"
              }>
                {displayedCocktails.map((cocktail, index) => (
                  <div key={cocktail.id} className={viewMode === "list" ? "flex" : ""}>
                    <CocktailCard
                      cocktail={cocktail}
                      onFavorite={handleFavorite}
                      isFavorite={userFavorites.has(cocktail.id)}
                      priority={index < 4}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {displayedItems < filteredCocktailsData.length && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    className="glow-button bg-neon-purple text-night-blue px-8 py-3 hover:bg-neon-purple/90 font-semibold rounded-xl shadow-lg"
                    style={{
                      boxShadow: '0 0 15px rgba(139, 69, 255, 0.4), 0 0 30px rgba(139, 69, 255, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Показать еще ({filteredCocktailsData.length - displayedItems} осталось)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}