import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RecipeCard from "@/components/recipe/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, ChevronDown } from "lucide-react";
import type { Recipe } from "@shared/schema";

export default function Catalog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());

  const ITEMS_PER_PAGE = 12;

  // Fetch recipes
  const { data: recipes = [], isLoading: recipesLoading, refetch } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes", {
      search: searchQuery,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      limit: ITEMS_PER_PAGE,
      offset: currentPage * ITEMS_PER_PAGE
    }],
  });

  // Fetch user favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "favorites"],
    enabled: isAuthenticated && !!user?.id,
    select: (data: any[]) => data.map(fav => fav.recipeId),
  });

  useEffect(() => {
    if (favorites) {
      setUserFavorites(new Set(favorites));
    }
  }, [favorites]);

  const favoriteMutation = useMutation({
    mutationFn: async ({ recipeId, isFavorite }: { recipeId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        await apiRequest("DELETE", `/api/users/${user?.id}/favorites/${recipeId}`);
      } else {
        await apiRequest("POST", `/api/users/${user?.id}/favorites`, { recipeId });
      }
    },
    onSuccess: (_, { recipeId, isFavorite }) => {
      const newFavorites = new Set(userFavorites);
      if (isFavorite) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      setUserFavorites(newFavorites);
      
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "favorites"] });
      
      toast({
        title: isFavorite ? "Удалено из избранного" : "Добавлено в избранное",
        description: isFavorite ? "Рецепт удален из избранного" : "Рецепт добавлен в избранное",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Ошибка авторизации",
          description: "Выполняется перенаправление на страницу входа...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Ошибка",
        description: "Не удалось обновить избранное. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const handleFavorite = (recipeId: string) => {
    const isFavorite = userFavorites.has(recipeId);
    favoriteMutation.mutate({ recipeId, isFavorite });
  };

  const handleViewRecipe = (recipeId: string) => {
    // In a real app, this would navigate to recipe detail page
    toast({
      title: "Функция в разработке",
      description: "Просмотр детальной информации о рецепте будет доступен в следующих версиях",
    });
  };

  const handleSearch = () => {
    setCurrentPage(0);
    refetch();
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      <section className="pt-20 pb-16 bg-gradient-to-b from-night-blue to-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-neon-amber">
              <Search className="inline mr-3 h-10 w-10" />
              Каталог Рецептов
            </h2>
            <p className="text-xl text-cream max-w-2xl mx-auto">
              Откройте для себя тысячи проверенных рецептов от профессиональных барменов
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="glass-effect border-none mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
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
                
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] bg-night-blue border-gray-600 focus:border-neon-turquoise">
                      <SelectValue placeholder="Все категории" />
                    </SelectTrigger>
                    <SelectContent className="bg-night-blue border-gray-600">
                      <SelectItem value="">Все категории</SelectItem>
                      <SelectItem value="classic">Классические</SelectItem>
                      <SelectItem value="summer">Летние</SelectItem>
                      <SelectItem value="shot">Шоты</SelectItem>
                      <SelectItem value="nonalcoholic">Безалкогольные</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[180px] bg-night-blue border-gray-600 focus:border-neon-turquoise">
                      <SelectValue placeholder="Любая сложность" />
                    </SelectTrigger>
                    <SelectContent className="bg-night-blue border-gray-600">
                      <SelectItem value="">Любая сложность</SelectItem>
                      <SelectItem value="easy">Легкая</SelectItem>
                      <SelectItem value="medium">Средняя</SelectItem>
                      <SelectItem value="hard">Сложная</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={handleSearch}
                    className="bg-neon-turquoise text-night-blue hover:bg-neon-turquoise/90"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Поиск
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Grid */}
          {recipesLoading && currentPage === 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="glass-effect border-none animate-pulse">
                  <div className="w-full h-48 bg-gray-700 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                      <div className="h-4 bg-gray-700 rounded w-12"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Рецепты не найдены</p>
              <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onFavorite={handleFavorite}
                    onView={handleViewRecipe}
                    isFavorite={userFavorites.has(recipe.id)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {recipes.length === ITEMS_PER_PAGE && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    disabled={recipesLoading}
                    className="glow-button bg-neon-purple text-night-blue px-8 py-3 hover:bg-neon-purple/90"
                  >
                    <ChevronDown className="mr-2 h-4 w-4" />
                    {recipesLoading ? "Загрузка..." : "Показать еще"}
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
