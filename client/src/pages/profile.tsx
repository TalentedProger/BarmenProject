import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RecipeCard from "@/components/recipe/recipe-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Martini, 
  Heart, 
  Trophy, 
  Clock, 
  TrendingUp,
  Edit,
  Trash2
} from "lucide-react";
import type { Recipe } from "@shared/schema";

export default function Profile() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Необходима авторизация",
        description: "Выполняется перенаправление на страницу входа...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user recipes
  const { data: userRecipes = [], isLoading: recipesLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/users", user?.id, "recipes"],
    enabled: isAuthenticated && !!user?.id,
  });

  // Fetch user favorites
  const { data: favoriteRecipes = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "favorites"],
    enabled: isAuthenticated && !!user?.id,
    select: (data: any[]) => data.map(fav => fav.recipe),
  });

  useEffect(() => {
    if (favoriteRecipes) {
      setUserFavorites(new Set(favoriteRecipes.map((recipe: Recipe) => recipe.id)));
    }
  }, [favoriteRecipes]);

  const deleteRecipeMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      await apiRequest("DELETE", `/api/recipes/${recipeId}`);
    },
    onSuccess: () => {
      toast({
        title: "Рецепт удален",
        description: "Рецепт успешно удален из вашего профиля",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "recipes"] });
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
        title: "Ошибка удаления",
        description: "Не удалось удалить рецепт. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

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

  const handleDeleteRecipe = (recipeId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот рецепт?")) {
      deleteRecipeMutation.mutate(recipeId);
    }
  };

  const getUserLevel = (recipeCount: number) => {
    if (recipeCount < 5) return "Новичок";
    if (recipeCount < 15) return "Любитель";
    if (recipeCount < 30) return "Мастер";
    return "Профессионал";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Новичок": return "text-green-400";
      case "Любитель": return "text-blue-400";
      case "Мастер": return "text-purple-400";
      case "Профессионал": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-turquoise"></div>
      </div>
    );
  }

  const userLevel = getUserLevel(userRecipes.length);

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      <section className="pt-20 pb-16 bg-gradient-to-b from-night-blue to-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-neon-turquoise">
                <User className="inline mr-3 h-10 w-10" />
                Мой Профиль
              </h2>
              <p className="text-xl text-cream">Отслеживайте свои рецепты и достижения</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8 mb-8">
              {/* User Info */}
              <Card className="glass-effect border-none">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-neon-turquoise to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="text-night-blue text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-neon-turquoise mb-1">
                      {user?.firstName || user?.email?.split('@')[0] || 'Пользователь'}
                    </h3>
                    <p className={`text-sm ${getLevelColor(userLevel)}`}>
                      {userLevel}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-cream">Рецептов создано:</span>
                      <span className="text-neon-amber font-semibold">
                        {userRecipes.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cream">Любимых рецептов:</span>
                      <span className="text-neon-pink font-semibold">
                        {favoriteRecipes.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cream">Уровень:</span>
                      <Badge className={`${getLevelColor(userLevel)} border-current`} variant="outline">
                        {userLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card className="glass-effect border-none">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="text-neon-turquoise text-4xl mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-neon-turquoise mb-2">
                    {userRecipes.reduce((sum, recipe) => sum + (recipe.ratingCount || 0), 0)}
                  </h3>
                  <p className="text-cream">Общих оценок</p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-none">
                <CardContent className="p-6 text-center">
                  <Trophy className="text-neon-amber text-4xl mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-neon-amber mb-2">
                    {userRecipes.filter(recipe => parseFloat(recipe.rating?.toString() || '0') >= 4.5).length}
                  </h3>
                  <p className="text-cream">Топ рецептов</p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-none">
                <CardContent className="p-6 text-center">
                  <Clock className="text-neon-pink text-4xl mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-neon-pink mb-2">
                    {userRecipes.filter(recipe => {
                      const createdAt = new Date(recipe.createdAt!);
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return createdAt > weekAgo;
                    }).length}
                  </h3>
                  <p className="text-cream">За эту неделю</p>
                </CardContent>
              </Card>
            </div>

            {/* Recipes Tabs */}
            <Tabs defaultValue="my-recipes" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-graphite">
                <TabsTrigger 
                  value="my-recipes" 
                  className="data-[state=active]:bg-neon-turquoise data-[state=active]:text-night-blue"
                >
                  <Martini className="mr-2 h-4 w-4" />
                  Мои Рецепты ({userRecipes.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites"
                  className="data-[state=active]:bg-neon-pink data-[state=active]:text-night-blue"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Избранное ({favoriteRecipes.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-recipes" className="mt-6">
                {recipesLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
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
                ) : userRecipes.length === 0 ? (
                  <div className="text-center py-12">
                    <Martini className="text-gray-400 text-6xl mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Вы еще не создали ни одного рецепта</p>
                    <p className="text-gray-500 mt-2">Перейдите в конструктор, чтобы создать свой первый коктейль!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userRecipes.map((recipe) => (
                      <div key={recipe.id} className="relative group">
                        <RecipeCard
                          recipe={recipe}
                          onFavorite={handleFavorite}
                          onView={handleViewRecipe}
                          isFavorite={userFavorites.has(recipe.id)}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 bg-neon-turquoise/20 hover:bg-neon-turquoise/40"
                              onClick={() => handleViewRecipe(recipe.id)}
                            >
                              <Edit className="h-4 w-4 text-neon-turquoise" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/40"
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              disabled={deleteRecipeMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-6">
                {favoritesLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
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
                ) : favoriteRecipes.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="text-gray-400 text-6xl mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">У вас нет избранных рецептов</p>
                    <p className="text-gray-500 mt-2">Добавьте понравившиеся рецепты в избранное из каталога</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRecipes.map((recipe: Recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onFavorite={handleFavorite}
                        onView={handleViewRecipe}
                        isFavorite={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
