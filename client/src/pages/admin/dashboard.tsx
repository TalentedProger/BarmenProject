import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Wine, 
  ChefHat, 
  Settings, 
  TrendingUp, 
  Activity,
  Shield,
  Database,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import IngredientsManager from "@/components/admin/IngredientsManager";
import { apiRequest } from "@/lib/queryClient";

interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  totalIngredients: number;
  activeUsers: number;
}

interface RecentActivity {
  recipes: any[];
  users: any[];
}

interface AdminDashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Загружаем данные дашборда
  const { data: dashboardData, isLoading, error } = useQuery<AdminDashboardData>({
    queryKey: ['/api/admin/dashboard'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/dashboard');
      return response.json();
    },
  });

  // Загружаем права доступа пользователя
  const { data: permissions } = useQuery({
    queryKey: ['/api/admin/permissions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/permissions');
      return response.json();
    },
  });

  if (error) {
    return (
      <div className="min-h-screen bg-night-blue text-ice-white">
        <Header />
        <div className="container mx-auto px-4 pt-32">
          <Card className="glass-effect border-red-500">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Доступ запрещен</h2>
              <p className="text-cream">У вас нет прав для доступа к админ панели</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-neon-purple">
              <Settings className="inline mr-3 h-10 w-10" />
              Админ панель
            </h1>
            <p className="text-xl text-cream">
              Управление контентом и пользователями
            </p>
            {permissions && (
              <Badge className="mt-2 bg-neon-turquoise text-night-blue">
                Роль: {permissions.role}
              </Badge>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="ingredients">Ингредиенты</TabsTrigger>
              <TabsTrigger value="recipes">Рецепты</TabsTrigger>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
            </TabsList>

            {/* Вкладка "Обзор" */}
            <TabsContent value="overview">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="glass-effect border-none animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-600 rounded mb-2"></div>
                        <div className="h-8 bg-gray-600 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {/* Статистические карточки */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="glass-effect border-none">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-cream">Пользователи</p>
                            <p className="text-3xl font-bold text-neon-turquoise">
                              {dashboardData?.stats.totalUsers || 0}
                            </p>
                          </div>
                          <Users className="h-8 w-8 text-neon-turquoise" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-effect border-none">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-cream">Рецепты</p>
                            <p className="text-3xl font-bold text-neon-amber">
                              {dashboardData?.stats.totalRecipes || 0}
                            </p>
                          </div>
                          <ChefHat className="h-8 w-8 text-neon-amber" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-effect border-none">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-cream">Ингредиенты</p>
                            <p className="text-3xl font-bold text-neon-pink">
                              {dashboardData?.stats.totalIngredients || 0}
                            </p>
                          </div>
                          <Wine className="h-8 w-8 text-neon-pink" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-effect border-none">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-cream">Активные</p>
                            <p className="text-3xl font-bold text-green-400">
                              {dashboardData?.stats.activeUsers || 0}
                            </p>
                          </div>
                          <Activity className="h-8 w-8 text-green-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Недавняя активность */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-effect border-none">
                      <CardHeader>
                        <CardTitle className="text-neon-amber">
                          <TrendingUp className="inline mr-2 h-5 w-5" />
                          Недавние рецепты
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {dashboardData?.recentActivity.recipes.length ? (
                          <div className="space-y-3">
                            {dashboardData.recentActivity.recipes.map((recipe, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div>
                                  <p className="font-semibold text-cream">{recipe.name}</p>
                                  <p className="text-sm text-gray-400">
                                    {recipe.category} • {recipe.difficulty}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-400 py-4">
                            Нет недавних рецептов
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="glass-effect border-none">
                      <CardHeader>
                        <CardTitle className="text-neon-turquoise">
                          <Users className="inline mr-2 h-5 w-5" />
                          Новые пользователи
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {dashboardData?.recentActivity.users.length ? (
                          <div className="space-y-3">
                            {dashboardData.recentActivity.users.map((user, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div>
                                  <p className="font-semibold text-cream">{user.nickname}</p>
                                  <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                                <Badge variant="outline">
                                  {user.role || 'user'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-400 py-4">
                            Нет новых пользователей
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Вкладка "Ингредиенты" */}
            <TabsContent value="ingredients">
              <IngredientsManager />
            </TabsContent>

            <TabsContent value="recipes">
              <Card className="glass-effect border-none">
                <CardContent className="p-8 text-center">
                  <ChefHat className="h-16 w-16 text-neon-amber mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Управление рецептами</h3>
                  <p className="text-cream mb-4">
                    Модерация и управление рецептами пользователей
                  </p>
                  <Button className="bg-neon-amber text-night-blue">
                    <Eye className="mr-2 h-4 w-4" />
                    Просмотреть рецепты
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="glass-effect border-none">
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 text-neon-turquoise mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Управление пользователями</h3>
                  <p className="text-cream mb-4">
                    Просмотр пользователей и управление ролями
                  </p>
                  <Button className="bg-neon-turquoise text-night-blue">
                    <Settings className="mr-2 h-4 w-4" />
                    Управлять пользователями
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
