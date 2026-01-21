import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CompactGlassSelector } from "@/components/cocktail/compact-glass-selector";
import IngredientSelector from "@/components/cocktail/ingredient-selector";
import IngredientRecommendations from "@/components/cocktail/ingredient-recommendations";
import DrinkVisualizer from "@/components/cocktail/drink-visualizer";
import { CocktailMetrics } from "@/components/cocktail/cocktail-metrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, RotateCcw, Share2, AlertCircle, GlassWater, FileText, Martini } from "lucide-react";
import { useCocktailStore } from "@/store/cocktail-store";
import { generateCocktailName, validateCocktailIngredients, calculateCocktailStats } from "@/lib/cocktail-utils";
import { useState, useEffect } from "react";

export default function Constructor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    selectedGlass,
    ingredients,
    cocktailStats,
    clearIngredients,
    recalculateStats,
    recipeName: storeName,
    recipeDescription: storeDescription
  } = useCocktailStore();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [recipeName, setRecipeName] = useState(storeName || "");
  const [recipeDescription, setRecipeDescription] = useState(storeDescription || "");

  // Update local state when store values change
  useEffect(() => {
    if (storeName) setRecipeName(storeName);
    if (storeDescription) setRecipeDescription(storeDescription);
  }, [storeName, storeDescription]);
  
  const currentStats = calculateCocktailStats(ingredients);

  const saveRecipeMutation = useMutation({
    mutationFn: async (recipeData: any) => {
      return await apiRequest("POST", "/api/recipes", recipeData);
    },
    onSuccess: () => {
      toast({
        title: "Рецепт сохранен",
        description: "Ваш коктейль успешно сохранен в каталог",
      });
      setShowSaveDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
    },
    onError: (error: any) => {
      // Check if it's an authentication error
      const isAuthError = error?.message?.includes('Not authenticated') || 
                          error?.message?.includes('401') ||
                          error?.status === 401;
      
      if (isAuthError) {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Требуется авторизация
            </div>
          ),
          description: "Чтобы сохранить рецепт нужно зарегистрироваться/войти в аккаунт",
          variant: "destructive",
        });
      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Ошибка сохранения
            </div>
          ),
          description: error?.message || "Не удалось сохранить рецепт. Попробуйте еще раз.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSaveRecipe = () => {
    // Only block on critical errors, not warnings or tips
    const validationErrors = validateCocktailIngredients(ingredients, selectedGlass || undefined);
    if (validationErrors.length > 0) {
      toast({
        title: "Ошибка валидации",
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    if (!selectedGlass) {
      toast({
        title: "Выберите стакан",
        description: "Для сохранения рецепта необходимо выбрать тип стакана",
        variant: "destructive",
      });
      return;
    }
    
    if (ingredients.length === 0) {
      toast({
        title: "Добавьте ингредиенты",
        description: "Невозможно сохранить пустой рецепт",
        variant: "destructive",
      });
      return;
    }

    const defaultName = recipeName || generateCocktailName();
    setRecipeName(defaultName);
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    const recipeData = {
      name: recipeName,
      description: recipeDescription,
      glassTypeId: selectedGlass?.id,
      totalVolume: Math.round(currentStats.totalVolume),
      totalAbv: currentStats.totalAbv.toString(),
      totalCost: currentStats.totalCost.toString(),
      tasteBalance: currentStats.tasteBalance,
      category: "custom",
      difficulty: "easy",
      isPublic: true,
      ingredients: ingredients.map((item, index) => ({
        ingredientId: item.ingredient.id,
        amount: parseFloat(item.amount.toString()).toString(),
        unit: item.unit,
        order: index + 1
      }))
    };

    saveRecipeMutation.mutate(recipeData);
  };

  const handleReset = () => {
    clearIngredients();
    setRecipeName("");
    setRecipeDescription("");
    toast({
      title: "Конструктор очищен",
      description: "Все ингредиенты удалены. Можете начать заново.",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: recipeName || "Мой коктейль",
      text: `Попробуйте этот коктейль: ${currentStats.totalVolume}ml, ${currentStats.totalAbv}% ABV`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на конструктор скопирована в буфер обмена",
      });
    }
  };

  return (
    <div 
      className="min-h-screen bg-background text-foreground"
      style={{ 
        overflowX: 'hidden', 
        maxWidth: '100vw',
        width: '100%'
      }}
    >
      <Header />
      
      <section 
        className="pt-56 pb-16 bg-gradient-to-br from-purple-950 via-purple-950/95 to-blue-950 backdrop-blur-sm"
        style={{ 
          overflowX: 'hidden',
          maxWidth: '100%'
        }}
      >
        <div 
          className="container mx-auto px-4"
          style={{ 
            overflowX: 'hidden',
            maxWidth: '100%'
          }}
        >
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative" style={{ contain: 'layout' }}>
                <Martini 
                  className="w-16 h-16 text-purple-400" 
                  strokeWidth={1.5}
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))'
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
                    filter: 'blur(16px)'
                  }}
                />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Конструктор Коктейлей
            </h2>
            <p className="text-xl text-zinc max-w-2xl mx-auto mb-6">
              Создавайте уникальные напитки слой за слоем с автоматическим расчетом параметров
            </p>
            <div className="max-w-3xl mx-auto">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-4 min-h-[600px]" style={{ maxWidth: '100%' }}>
            {/* Left Sidebar - Ingredients - order-3 on mobile */}
            <div className="lg:col-span-4 flex flex-col order-3 lg:order-1" style={{ minWidth: 0 }}>
              <div className="bg-card border border-border rounded-lg p-4 flex-1 overflow-hidden">
                <IngredientRecommendations />
              </div>
            </div>

            {/* Center Content - Reduced width - order-1 on mobile (Glass first) */}
            <div className="lg:col-span-4 flex flex-col space-y-4 order-1 lg:order-2" style={{ minWidth: 0, overflow: 'hidden' }}>
              {/* Glass Selector or Drink Visualizer */}
              <div 
                className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-4 sm:p-6 flex-1"
                style={{ 
                  overflow: 'hidden'
                }}
              >
                {!selectedGlass ? (
                  <CompactGlassSelector />
                ) : (
                  <DrinkVisualizer />
                )}
              </div>
              
              {/* Added Ingredients - show on mobile as third element - order-2 on mobile */}
              <div className="bg-card border border-border rounded-lg p-4 lg:hidden overflow-hidden order-2 lg:order-none">
                <IngredientSelector />
              </div>
              
              {/* Quick Tips - desktop version with full logic */}
              <div className="bg-card border border-border rounded-lg p-4 h-32 hidden lg:block overflow-y-auto">
                <h4 className="text-lg font-semibold text-foreground mb-2">Быстрые советы</h4>
                <div className="space-y-1 text-xs">
                  {(() => {
                    const stats = calculateCocktailStats(ingredients);
                    const recommendations: { text: string; color: string; priority: number }[] = [];
                    
                    // Начальные сценарии - когда ничего не выбрано
                    if (!selectedGlass && ingredients.length === 0) {
                      return [{ text: "Выберите стакан, чтобы начать создание коктейля", color: "text-muted-foreground", priority: 0 }];
                    }
                    
                    if (selectedGlass && ingredients.length === 0) {
                      return [
                        { text: `${selectedGlass.name} выбран (${selectedGlass.capacity}ml)`, color: "text-blue-400", priority: 0 },
                        { text: "Добавьте базовый алкоголь из меню слева", color: "text-muted-foreground", priority: 1 }
                      ];
                    }
                    
                    // КРИТИЧЕСКИЕ проверки (красные) - высший приоритет
                    if (selectedGlass && stats.totalVolume > selectedGlass.capacity) {
                      const overflow = stats.totalVolume - selectedGlass.capacity;
                      recommendations.push({
                        text: `⚠️ Переполнение на ${overflow.toFixed(0)}ml! Уменьшите объем`,
                        color: "text-red-500",
                        priority: 100
                      });
                    }
                    
                    if (stats.totalAbv > 40) {
                      recommendations.push({
                        text: "⚠️ Опасно крепкий! Добавьте сок или содовую",
                        color: "text-red-500",
                        priority: 99
                      });
                    }
                    
                    // ПРЕДУПРЕЖДЕНИЯ (оранжевые/желтые)
                    if (stats.totalAbv > 30 && stats.totalAbv <= 40) {
                      recommendations.push({
                        text: "Высокая крепость - разбавьте соком или содовой",
                        color: "text-orange-400",
                        priority: 80
                      });
                    }
                    
                    if (stats.tasteBalance?.sweet > 8) {
                      recommendations.push({
                        text: "Очень сладко - добавьте цитрус или биттер",
                        color: "text-yellow-400",
                        priority: 70
                      });
                    } else if (stats.tasteBalance?.sweet > 6) {
                      recommendations.push({
                        text: "Сладковато - сбалансируйте лимоном/лаймом",
                        color: "text-yellow-400",
                        priority: 60
                      });
                    }
                    
                    if (stats.tasteBalance?.sour > 8) {
                      recommendations.push({
                        text: "Очень кисло - добавьте сироп или ликер",
                        color: "text-yellow-400",
                        priority: 70
                      });
                    } else if (stats.tasteBalance?.sour > 6) {
                      recommendations.push({
                        text: "Кисловато - добавьте немного сладости",
                        color: "text-yellow-400",
                        priority: 60
                      });
                    }
                    
                    if (stats.tasteBalance?.bitter > 7) {
                      recommendations.push({
                        text: "Горьковато - смягчите сладким сиропом",
                        color: "text-orange-400",
                        priority: 65
                      });
                    }
                    
                    // ИНФОРМАЦИОННЫЕ советы (синие)
                    if (stats.totalVolume > 0 && selectedGlass && stats.totalVolume < selectedGlass.capacity * 0.3) {
                      recommendations.push({
                        text: `Мало жидкости (${Math.round(stats.totalVolume)}/${selectedGlass.capacity}ml)`,
                        color: "text-blue-400",
                        priority: 40
                      });
                    }
                    
                    if (stats.totalVolume > 0 && selectedGlass && stats.totalVolume >= selectedGlass.capacity * 0.7 && stats.totalVolume < selectedGlass.capacity) {
                      recommendations.push({
                        text: `Почти готово! Осталось ${(selectedGlass.capacity - stats.totalVolume).toFixed(0)}ml`,
                        color: "text-blue-400",
                        priority: 30
                      });
                    }
                    
                    // Проверка наличия базового алкоголя
                    const hasBaseAlcohol = ingredients.some(i => 
                      ['vodka', 'rum', 'gin', 'tequila', 'whiskey', 'brandy'].includes(i.ingredient.category)
                    );
                    if (!hasBaseAlcohol && ingredients.length > 0 && stats.totalAbv < 5) {
                      recommendations.push({
                        text: "Нет базового алкоголя - добавьте для классического коктейля",
                        color: "text-blue-400",
                        priority: 35
                      });
                    }
                    
                    // Проверка наличия льда для освежающих напитков
                    const hasIce = ingredients.some(i => i.ingredient.category === 'ice');
                    if (!hasIce && stats.tasteBalance?.refreshing && stats.tasteBalance.refreshing > 3) {
                      recommendations.push({
                        text: "💡 Добавьте лёд для освежающего эффекта",
                        color: "text-cyan-400",
                        priority: 25
                      });
                    }
                    
                    // ПОЗИТИВНЫЕ сообщения (зеленые)
                    if (recommendations.filter(r => r.priority >= 60).length === 0 && stats.totalVolume > 0) {
                      if (selectedGlass && stats.totalVolume >= selectedGlass.capacity * 0.8 && stats.totalVolume <= selectedGlass.capacity) {
                        recommendations.push({
                          text: "✓ Идеальный объем!",
                          color: "text-green-400",
                          priority: 20
                        });
                      }
                      
                      if (stats.totalAbv >= 10 && stats.totalAbv <= 25) {
                        recommendations.push({
                          text: "✓ Оптимальная крепость",
                          color: "text-green-400",
                          priority: 19
                        });
                      }
                      
                      const balance = stats.tasteBalance;
                      if (balance && balance.sweet <= 6 && balance.sour <= 6 && balance.bitter <= 5) {
                        recommendations.push({
                          text: "✓ Отличный баланс вкуса!",
                          color: "text-green-400",
                          priority: 18
                        });
                      }
                    }
                    
                    // Сортируем по приоритету и берем топ-3
                    return recommendations
                      .sort((a, b) => b.priority - a.priority)
                      .slice(0, 3);
                  })().map((rec, index) => (
                    <p key={index} className={rec.color}>• {rec.text}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Metrics and Ingredients - order-4 on mobile */}
            <div className="lg:col-span-4 flex flex-col space-y-4 h-full order-4 lg:order-3">
              {/* Cocktail Metrics */}
              <div className="bg-card border border-border rounded-lg p-4 flex-shrink-0">
                <CocktailMetrics />
              </div>
              
              {/* Quick Tips - moved here for mobile */}
              <div className="bg-card border border-border rounded-lg p-4 h-32 lg:hidden overflow-y-auto">
                <h4 className="text-lg font-semibold text-foreground mb-2">Быстрые советы</h4>
                <div className="space-y-1 text-xs">
                  {(() => {
                    const stats = calculateCocktailStats(ingredients);
                    const recommendations: { text: string; color: string; priority: number }[] = [];
                    
                    // Начальные сценарии - когда ничего не выбрано
                    if (!selectedGlass && ingredients.length === 0) {
                      return [{ text: "Выберите стакан, чтобы начать создание коктейля", color: "text-muted-foreground", priority: 0 }];
                    }
                    
                    if (selectedGlass && ingredients.length === 0) {
                      return [
                        { text: `${selectedGlass.name} выбран (${selectedGlass.capacity}ml)`, color: "text-blue-400", priority: 0 },
                        { text: "Добавьте базовый алкоголь из меню слева", color: "text-muted-foreground", priority: 1 }
                      ];
                    }
                    
                    // КРИТИЧЕСКИЕ проверки (красные) - высший приоритет
                    if (selectedGlass && stats.totalVolume > selectedGlass.capacity) {
                      const overflow = stats.totalVolume - selectedGlass.capacity;
                      recommendations.push({
                        text: `⚠️ Переполнение на ${overflow.toFixed(0)}ml! Уменьшите объем`,
                        color: "text-red-500",
                        priority: 100
                      });
                    }
                    
                    if (stats.totalAbv > 40) {
                      recommendations.push({
                        text: "⚠️ Опасно крепкий! Добавьте сок или содовую",
                        color: "text-red-500",
                        priority: 99
                      });
                    }
                    
                    // ПРЕДУПРЕЖДЕНИЯ (оранжевые/желтые)
                    if (stats.totalAbv > 30 && stats.totalAbv <= 40) {
                      recommendations.push({
                        text: "Высокая крепость - разбавьте соком или содовой",
                        color: "text-orange-400",
                        priority: 80
                      });
                    }
                    
                    if (stats.tasteBalance?.sweet > 8) {
                      recommendations.push({
                        text: "Очень сладко - добавьте цитрус или биттер",
                        color: "text-yellow-400",
                        priority: 70
                      });
                    } else if (stats.tasteBalance?.sweet > 6) {
                      recommendations.push({
                        text: "Сладковато - сбалансируйте лимоном/лаймом",
                        color: "text-yellow-400",
                        priority: 60
                      });
                    }
                    
                    if (stats.tasteBalance?.sour > 8) {
                      recommendations.push({
                        text: "Очень кисло - добавьте сироп или ликер",
                        color: "text-yellow-400",
                        priority: 70
                      });
                    } else if (stats.tasteBalance?.sour > 6) {
                      recommendations.push({
                        text: "Кисловато - добавьте немного сладости",
                        color: "text-yellow-400",
                        priority: 60
                      });
                    }
                    
                    if (stats.tasteBalance?.bitter > 7) {
                      recommendations.push({
                        text: "Горьковато - смягчите сладким сиропом",
                        color: "text-orange-400",
                        priority: 65
                      });
                    }
                    
                    // ИНФОРМАЦИОННЫЕ советы (синие)
                    if (stats.totalVolume > 0 && selectedGlass && stats.totalVolume < selectedGlass.capacity * 0.3) {
                      recommendations.push({
                        text: `Мало жидкости (${Math.round(stats.totalVolume)}/${selectedGlass.capacity}ml)`,
                        color: "text-blue-400",
                        priority: 40
                      });
                    }
                    
                    if (stats.totalVolume > 0 && selectedGlass && stats.totalVolume >= selectedGlass.capacity * 0.7 && stats.totalVolume < selectedGlass.capacity) {
                      recommendations.push({
                        text: `Почти готово! Осталось ${(selectedGlass.capacity - stats.totalVolume).toFixed(0)}ml`,
                        color: "text-blue-400",
                        priority: 30
                      });
                    }
                    
                    // Проверка наличия базового алкоголя
                    const hasBaseAlcohol = ingredients.some(i => 
                      ['vodka', 'rum', 'gin', 'tequila', 'whiskey', 'brandy'].includes(i.ingredient.category)
                    );
                    if (!hasBaseAlcohol && ingredients.length > 0 && stats.totalAbv < 5) {
                      recommendations.push({
                        text: "Нет базового алкоголя - добавьте для классического коктейля",
                        color: "text-blue-400",
                        priority: 35
                      });
                    }
                    
                    // Проверка наличия льда для освежающих напитков
                    const hasIce = ingredients.some(i => i.ingredient.category === 'ice');
                    if (!hasIce && stats.tasteBalance?.refreshing && stats.tasteBalance.refreshing > 3) {
                      recommendations.push({
                        text: "💡 Добавьте лёд для освежающего эффекта",
                        color: "text-cyan-400",
                        priority: 25
                      });
                    }
                    
                    // ПОЗИТИВНЫЕ сообщения (зеленые)
                    if (recommendations.filter(r => r.priority >= 60).length === 0 && stats.totalVolume > 0) {
                      if (selectedGlass && stats.totalVolume >= selectedGlass.capacity * 0.8 && stats.totalVolume <= selectedGlass.capacity) {
                        recommendations.push({
                          text: "✓ Идеальный объем!",
                          color: "text-green-400",
                          priority: 20
                        });
                      }
                      
                      if (stats.totalAbv >= 10 && stats.totalAbv <= 25) {
                        recommendations.push({
                          text: "✓ Оптимальная крепость",
                          color: "text-green-400",
                          priority: 19
                        });
                      }
                      
                      const balance = stats.tasteBalance;
                      if (balance && balance.sweet <= 6 && balance.sour <= 6 && balance.bitter <= 5) {
                        recommendations.push({
                          text: "✓ Отличный баланс вкуса!",
                          color: "text-green-400",
                          priority: 18
                        });
                      }
                    }
                    
                    // Сортируем по приоритету и берем топ-3
                    return recommendations
                      .sort((a, b) => b.priority - a.priority)
                      .slice(0, 3);
                  })().map((rec, index) => (
                    <p key={index} className={rec.color}>• {rec.text}</p>
                  ))}
                </div>
              </div>
              
              {/* Added Ingredients - show on desktop only */}
              <div className="bg-card border border-border rounded-lg p-4 hidden lg:flex flex-col overflow-hidden flex-1">
                <IngredientSelector />
              </div>
            </div>
          </div>

          {/* Validation Warnings */}
          {ingredients.length > 0 && (
            <div className="mt-8">
              <Card className="glass-effect border-none">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-amber-500">Анализ рецепта</h3>
                  </div>
                  <div className="space-y-2">
                    {(() => {
                      const messages = validateCocktailIngredients(ingredients, selectedGlass || undefined);
                      return messages.map((msg, index) => {
                        // Определяем цвет по типу сообщения
                        let colorClass = "text-yellow-400";
                        if (msg.startsWith("⚠️") || msg.includes("Опасн") || msg.includes("превышен")) {
                          colorClass = "text-red-400";
                        } else if (msg.startsWith("⚡")) {
                          colorClass = "text-orange-400";
                        } else if (msg.startsWith("💡")) {
                          colorClass = "text-blue-400";
                        } else if (msg.startsWith("✓") || msg.startsWith("✨")) {
                          colorClass = "text-green-400";
                        }
                        return (
                          <p key={index} className={`text-sm ${colorClass}`}>• {msg}</p>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSaveRecipe}
                disabled={
                  ingredients.length === 0 || 
                  !selectedGlass || 
                  saveRecipeMutation.isPending ||
                  validateCocktailIngredients(ingredients, selectedGlass || undefined).some(msg => 
                    msg.startsWith("⚠️") || msg.includes("Добавьте хотя бы") || msg.includes("Слишком маленький") || msg.includes("Опасная крепость")
                  )
                }
                className="bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2 h-4 w-4" />
                {saveRecipeMutation.isPending ? "Сохранение..." : "Сохранить рецепт"}
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-8 py-3"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Начать заново
              </Button>
              
              <Button
                onClick={handleShare}
                variant="outline"
                className="px-8 py-3"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Поделиться
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Save Recipe Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-neon-purple text-center text-2xl font-bold">Сохранить рецепт</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="recipe-name" className="text-foreground text-base font-semibold mb-3 flex items-center gap-2">
                <GlassWater className="h-4 w-4" />
                Название коктейля
              </Label>
              <Input
                id="recipe-name"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Введите название..."
                className="bg-input border-border"
              />
            </div>
            <div>
              <Label htmlFor="recipe-description" className="text-foreground text-base font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Описание (необязательно)
              </Label>
              <Textarea
                id="recipe-description"
                value={recipeDescription}
                onChange={(e) => setRecipeDescription(e.target.value)}
                placeholder="Опишите вкус и особенности коктейля..."
                className="bg-input border-border"
                rows={3}
              />
            </div>
            <div className="flex justify-center space-x-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
                className="border-gray-600 text-cream hover:bg-gray-700"
              >
                Отмена
              </Button>
              <Button
                onClick={handleConfirmSave}
                disabled={!recipeName.trim() || saveRecipeMutation.isPending}
                className="bg-neon-turquoise text-night-blue hover:bg-neon-turquoise/90"
              >
                {saveRecipeMutation.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
