import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RecipeCard from "@/components/recipe/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Grid3X3,
  List,
  Trash2
} from "lucide-react";
import type { Recipe } from "@shared/schema";

export default function Favorites() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "dateAdded">("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Fetch user favorites
  const { data: favoriteRecipes = [], isLoading: favoritesLoading, refetch } = useQuery<Recipe[]>({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated
  });

  // Filter and sort recipes
  const filteredRecipes = favoriteRecipes
    .filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "rating":
          comparison = (parseFloat(a.rating || "0") - parseFloat(b.rating || "0"));
          break;
        case "dateAdded":
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(favoriteRecipes.map(recipe => recipe.category).filter(Boolean)))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#1B1B1F] to-[#0A0A0D] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#1B1B1F] to-[#0A0A0D]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-32">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4 gap-4">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-pink-500 fill-current flex-shrink-0" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white whitespace-nowrap">
              Избранные рецепты
            </h1>
          </div>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Ваша коллекция любимых коктейлей — всегда под рукой
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-400/30">
              {favoriteRecipes.length} рецептов
            </Badge>
            {favoriteRecipes.length > 0 && (
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                Средний рейтинг: {(favoriteRecipes.reduce((sum, recipe) => sum + parseFloat(recipe.rating || "0"), 0) / favoriteRecipes.length).toFixed(1)}
              </Badge>
            )}
          </div>
        </div>

        {favoriteRecipes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-12 border border-white/10 max-w-md mx-auto">
              <Heart className="w-20 h-20 text-zinc-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Пока пусто
              </h2>
              <p className="text-zinc-400 mb-8">
                Добавьте рецепты в избранное, чтобы они появились здесь
              </p>
              <Button 
                onClick={() => setLocation('/catalog')}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                Найти рецепты
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Controls Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full lg:flex-1 lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <Input
                    placeholder="Поиск по названию или описанию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-zinc-400 w-full"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-cyan-500 text-white"
                          : "bg-white/10 text-zinc-300 hover:bg-white/20"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "all" ? "Все" : category}
                    </Badge>
                  ))}
                </div>

                {/* Sort and View Controls */}
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="dateAdded">По дате добавления</option>
                    <option value="name">По названию</option>
                    <option value="rating">По рейтингу</option>
                  </select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="text-zinc-300 hover:text-white"
                  >
                    {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>

                  <div className="flex border border-white/20 rounded-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`${viewMode === "grid" ? "bg-white/10" : ""} text-zinc-300 hover:text-white rounded-none`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`${viewMode === "list" ? "bg-white/10" : ""} text-zinc-300 hover:text-white rounded-none`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-zinc-400">
                Показано {filteredRecipes.length} из {favoriteRecipes.length} рецептов
              </p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-zinc-400 hover:text-white"
                >
                  Очистить поиск
                </Button>
              )}
            </div>

            {/* Recipes Grid/List */}
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
                  <Search className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ничего не найдено
                  </h3>
                  <p className="text-zinc-400">
                    Попробуйте изменить параметры поиска
                  </p>
                </div>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {filteredRecipes.map((recipe) => (
                  <div key={recipe.id} className={viewMode === "list" ? "flex" : ""}>
                    <RecipeCard 
                      recipe={recipe} 
                      className={viewMode === "list" ? "flex-1" : ""}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
