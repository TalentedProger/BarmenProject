import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RecipeCard from "@/components/recipe/recipe-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User as UserIcon, 
  Martini, 
  Heart, 
  Trophy, 
  Clock, 
  TrendingUp,
  Edit,
  Trash2,
  Camera,
  Save,
  LogOut
} from "lucide-react";
import type { Recipe, User } from "@shared/schema";
import { useLocation } from "wouter";

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
  const [editingProfile, setEditingProfile] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  useEffect(() => {
    if (user && (user as any)?.nickname) {
      setNickname((user as any).nickname);
    }
  }, [user]);

  // Fetch user recipes
  const { data: userRecipes = [], isLoading: recipesLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes/user"],
    enabled: isAuthenticated
  });

  // Fetch user favorites
  const { data: favoriteRecipes = [], isLoading: favoritesLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated
  });

  useEffect(() => {
    if (favoriteRecipes?.length > 0) {
      setUserFavorites(new Set(favoriteRecipes.map((recipe: Recipe) => recipe.id)));
    }
  }, [favoriteRecipes]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { nickname: string; profileImageUrl?: string }) => {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка обновления профиля');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Профиль обновлен",
        description: "Ваш никнейм успешно изменен",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setEditingProfile(false);
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить профиль",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Выход выполнен",
        description: "До встречи!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setLocation('/');
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из аккаунта",
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверка размера файла (макс 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Ошибка",
          description: "Размер файла не должен превышать 2MB",
          variant: "destructive",
        });
        return;
      }

      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ошибка",
          description: "Можно загружать только изображения",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        toast({
          title: "Фото загружено",
          description: "Не забудьте сохранить изменения",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (nickname.trim().length < 2) {
      toast({
        title: "Ошибка",
        description: "Никнейм должен содержать минимум 2 символа",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate({ 
      nickname: nickname.trim(),
      profileImageUrl: profileImage || undefined
    });
  };

  const deleteRecipeMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      await apiRequest("DELETE", `/api/recipes/${recipeId}`);
    },
    onSuccess: () => {
      toast({
        title: "Рецепт удален",
        description: "Рецепт успешно удален из вашего профиля",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
    },
    onError: (error) => {
      toast({
        title: "Демо режим",
        description: "В демо режиме нельзя удалять рецепты",
        variant: "destructive",
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async ({ recipeId, isFavorite }: { recipeId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        // Remove from favorites
        return await apiRequest("DELETE", `/api/favorites/${recipeId}`);
      } else {
        // Add to favorites
        return await apiRequest("POST", "/api/favorites", { recipeId });
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
      
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      
      toast({
        title: isFavorite ? "Удалено из избранного" : "Добавлено в избранное",
        description: isFavorite ? "Рецепт удален из избранного" : "Рецепт добавлен в избранное",
      });
    },
    onError: (error) => {
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
    setLocation(`/recipe/${recipeId}`);
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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-graphite text-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Загрузка...</h2>
          </div>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Новичок": return "text-green-400";
      case "Любитель": return "text-blue-400";
      case "Мастер": return "text-purple-400";
      case "Профессионал": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const userLevel = getUserLevel(userRecipes.length);

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      <section className="pt-48 pb-16 bg-gradient-to-b from-night-blue to-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <UserIcon className="mr-3 h-8 w-8 text-neon-pink" />
                <h2 className="font-bold text-neon-pink text-[28px]">
                  Мой Профиль
                </h2>
              </div>
              <p className="text-cream text-[16px]">Отслеживайте свои рецепты и достижения</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8 mb-8">
              {/* User Profile Card */}
              <Card className="glass-effect border-none shadow-xl shadow-slate-500/15 hover:shadow-lg hover:shadow-slate-400/10 transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="flex justify-between items-center">
                      <span>Профиль</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingProfile(!editingProfile)}
                        className="text-neon-turquoise hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="text-center mb-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={profileImage || (user as any)?.profileImageUrl} alt={(user as any)?.nickname} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-turquoise to-neon-purple text-black text-2xl font-bold">
                        {(user as any)?.nickname?.charAt(0)?.toUpperCase() || (user as any)?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {editingProfile ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="nickname" className="text-white/90 font-medium">Никнейм</Label>
                          <Input
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-neon-turquoise"
                            placeholder="Ваш никнейм"
                          />
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                            className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all duration-300"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Установить фото
                          </Button>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </div>
                        <div className="mt-6">
                          <Button
                            size="sm"
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                            className="w-full bg-gradient-to-r from-neon-turquoise to-electric text-black"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-neon-turquoise mb-1">
                          {(user as any)?.nickname || 'Пользователь'}
                        </h3>
                        <p className="text-sm text-white/70 mb-2">{(user as any)?.email || ''}</p>
                        <Badge className="text-neon-amber border-neon-amber" variant="outline">
                          {getUserLevel(userRecipes.length)}
                        </Badge>

                      </>
                    )}
                  </div>
                  
                  {!editingProfile && (
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
                          {favoriteRecipes?.length || 0}
                        </span>
                      </div>
                      <Button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        variant="outline"
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-neon-turquoise/10 to-electric/5 border border-neon-turquoise/20 backdrop-blur-md shadow-md shadow-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/15 transition-all duration-300 flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-turquoise/5 to-transparent"></div>
                <CardContent className="relative p-6 text-center w-full">
                  <div className="bg-gradient-to-br from-neon-turquoise/20 to-electric/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-neon-turquoise text-2xl" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-neon-turquoise to-electric bg-clip-text text-transparent mb-2">
                    {userRecipes.reduce((sum, recipe) => sum + (recipe.ratingCount || 0), 0)}
                  </h3>
                  <p className="text-white/80 font-medium">Общих оценок</p>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-neon-amber/10 to-yellow-500/5 border border-neon-amber/20 backdrop-blur-md shadow-md shadow-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/15 transition-all duration-300 flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-amber/5 to-transparent"></div>
                <CardContent className="relative p-6 text-center w-full">
                  <div className="bg-gradient-to-br from-neon-amber/20 to-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-neon-amber text-2xl" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-neon-amber to-yellow-400 bg-clip-text text-transparent mb-2">
                    {userRecipes.filter(recipe => parseFloat(recipe.rating?.toString() || '0') >= 4.5).length}
                  </h3>
                  <p className="text-white/80 font-medium">Топ рецептов</p>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-neon-pink/10 to-purple-500/5 border border-neon-pink/20 backdrop-blur-md shadow-md shadow-pink-500/10 hover:shadow-lg hover:shadow-pink-500/15 transition-all duration-300 flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 to-transparent"></div>
                <CardContent className="relative p-6 text-center w-full">
                  <div className="bg-gradient-to-br from-neon-pink/20 to-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-neon-pink text-2xl" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-neon-pink to-purple-400 bg-clip-text text-transparent mb-2">
                    {userRecipes.filter(recipe => {
                      const createdAt = new Date(recipe.createdAt!);
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return createdAt > weekAgo;
                    }).length}
                  </h3>
                  <p className="text-white/80 font-medium">За эту неделю</p>
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
