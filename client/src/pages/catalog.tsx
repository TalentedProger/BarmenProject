import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Star, Heart, Clock, TrendingUp } from "lucide-react";
import { getCocktails, type CocktailData } from "@/data/cocktails";
import { Link } from "wouter";

// Компонент карточки коктейля
const CocktailCard = ({ 
  cocktail, 
  isFavorite, 
  onFavorite 
}: { 
  cocktail: CocktailData; 
  isFavorite: boolean;
  onFavorite: (id: string, isFavorite: boolean) => void;
}) => {
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

  return (
    <Card className="group relative overflow-hidden glass-effect border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-slate-800/50 to-slate-900/50 w-full max-w-sm mx-auto">
      {/* Фоновое изображение */}
      <div className="absolute inset-0">
        <img 
          src={cocktail.image} 
          alt={cocktail.name}
          className="w-full h-full object-cover transition-transform duration-300"
          id="cocktail-image"
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

      <CardContent className="relative z-10 p-0 h-[420px] sm:h-[400px] flex flex-col">
        {/* Заголовок и описание - более компактный */}
        <div className="bg-black/60 backdrop-blur-sm p-3 text-center border-b border-white/10">
          <h3 className="text-white text-lg font-bold mb-1 drop-shadow-lg">
            {cocktail.name}
          </h3>
          <p className="text-white/90 text-xs italic line-clamp-1 drop-shadow-md">
            {cocktail.description}
          </p>
        </div>

        {/* Теги */}
        <div className="flex flex-wrap gap-2 p-2 min-h-[50px] items-start">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800/90 text-neon-amber border border-neon-amber/60 shadow-lg backdrop-blur-sm"
            style={{
              textShadow: '0 0 8px rgba(255, 193, 7, 0.8)',
              boxShadow: '0 0 12px rgba(255, 193, 7, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
            {getCategoryLabel(cocktail.category)}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800/90 border border-white/30 shadow-lg backdrop-blur-sm ${getDifficultyColor(cocktail.difficulty)}`}
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
            <span className="text-white/90 font-medium">Рейтинг: <span className="text-white font-medium">{cocktail.rating}</span><Star className="h-4 w-4 fill-yellow-400 text-yellow-400 inline ml-0.5" /><span className="text-white/60">({cocktail.reviewCount})</span></span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-white/90 font-medium">Стоимость: <span className="text-neon-amber font-semibold">{cocktail.cost}₽</span></span>
          </div>
        </div>

        {/* Кнопка просмотра */}
        <div className="p-3 pt-2 flex justify-center">
          <Link href={`/recipe/${cocktail.id}`} className="w-3/5">
            <Button 
              className="w-full text-white font-medium transition-all duration-500 text-sm py-2 rounded-lg shadow-lg hover:shadow-2xl relative overflow-hidden group"
              style={{
                background: 'linear-gradient(45deg, rgba(139, 69, 255, 0.9), rgba(0, 247, 239, 0.9), rgba(255, 20, 147, 0.9), rgba(139, 69, 255, 0.9))',
                backgroundSize: '300% 300%',
                animation: 'shimmer 3s ease-in-out infinite',
                boxShadow: '0 4px 15px rgba(139, 69, 255, 0.4), 0 2px 8px rgba(0, 247, 239, 0.3)'
              }}
              onMouseEnter={(e) => {
                const button = e.currentTarget;
                const card = button.closest('.group');
                if (card) {
                  const img = card.querySelector('#cocktail-image') as HTMLImageElement;
                  if (img) {
                    img.style.transform = 'scale(1.1)';
                    img.style.transition = 'transform 0.3s ease';
                  }
                }
              }}
              onMouseLeave={(e) => {
                const button = e.currentTarget;
                const card = button.closest('.group');
                if (card) {
                  const img = card.querySelector('#cocktail-image') as HTMLImageElement;
                  if (img) {
                    img.style.transform = 'scale(1)';
                    img.style.transition = 'transform 0.3s ease';
                  }
                }
              }}
            >
              <span className="relative z-10">Открыть рецепт</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Catalog() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [displayedItems, setDisplayedItems] = useState(12);
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
  const [filteredCocktails, setFilteredCocktails] = useState<CocktailData[]>([]);

  const ITEMS_PER_LOAD = 12;

  // Получаем отфильтрованные коктейли
  useEffect(() => {
    const filtered = getCocktails({
      search: searchQuery,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      difficulty: selectedDifficulty === "all" ? undefined : selectedDifficulty,
    });
    setFilteredCocktails(filtered);
    setDisplayedItems(ITEMS_PER_LOAD);
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Получаем отображаемые коктейли с учетом лимита
  const displayedCocktails = filteredCocktails.slice(0, displayedItems);

  const handleSearch = () => {
    // Поиск происходит автоматически через useEffect
  };

  const handleLoadMore = () => {
    setDisplayedItems(prev => prev + ITEMS_PER_LOAD);
  };

  const handleFavorite = (cocktailId: string, isFavorite: boolean) => {
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
  };

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-b from-night-blue to-charcoal">
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
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Поиск коктейлей..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 bg-night-blue border-gray-600 focus:border-neon-turquoise"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="flex-1 min-w-0 bg-night-blue border-gray-600 focus:border-neon-turquoise">
                      <SelectValue placeholder="Все категории" />
                    </SelectTrigger>
                    <SelectContent className="bg-night-blue border-gray-600">
                      <SelectItem value="all">Все категории</SelectItem>
                      <SelectItem value="classic">Классические</SelectItem>
                      <SelectItem value="summer">Летние</SelectItem>
                      <SelectItem value="shot">Шоты</SelectItem>
                      <SelectItem value="nonalcoholic">Безалкогольные</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="flex-1 min-w-0 bg-night-blue border-gray-600 focus:border-neon-turquoise">
                      <SelectValue placeholder="Любая сложность" />
                    </SelectTrigger>
                    <SelectContent className="bg-night-blue border-gray-600">
                      <SelectItem value="all">Любая сложность</SelectItem>
                      <SelectItem value="easy">Легкая</SelectItem>
                      <SelectItem value="medium">Средняя</SelectItem>
                      <SelectItem value="hard">Сложная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleSearch}
                    className="bg-neon-turquoise text-night-blue hover:bg-neon-turquoise/90 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
                    style={{
                      boxShadow: '0 0 15px rgba(0, 247, 239, 0.4), 0 0 30px rgba(0, 247, 239, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <Filter className="mr-2 h-5 w-5" />
                    Поиск
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cocktails Grid */}
          {filteredCocktails.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Рецепты не найдены</p>
              <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <>
              {/* Адаптивная сетка: 1 на мобильных, 2 на планшетах, 3 на десктопе */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                {displayedCocktails.map((cocktail) => (
                  <CocktailCard
                    key={cocktail.id}
                    cocktail={cocktail}
                    onFavorite={handleFavorite}
                    isFavorite={userFavorites.has(cocktail.id)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {displayedItems < filteredCocktails.length && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    className="glow-button bg-neon-purple text-night-blue px-8 py-3 hover:bg-neon-purple/90 font-semibold rounded-xl shadow-lg"
                    style={{
                      boxShadow: '0 0 15px rgba(139, 69, 255, 0.4), 0 0 30px rgba(139, 69, 255, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Показать еще ({filteredCocktails.length - displayedItems} осталось)
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