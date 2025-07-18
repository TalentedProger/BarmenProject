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
import { Save, RotateCcw, Share2, AlertCircle } from "lucide-react";
import { useCocktailStore } from "@/store/cocktail-store";
import { generateCocktailName, validateCocktailIngredients, calculateCocktailStats } from "@/lib/cocktail-utils";
import { useState } from "react";

export default function Constructor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");

  const {
    selectedGlass,
    ingredients,
    cocktailStats,
    clearIngredients,
    recalculateStats
  } = useCocktailStore();
  
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
    onError: (error) => {
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить рецепт. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const handleSaveRecipe = () => {
    const validationErrors = validateCocktailIngredients(ingredients);
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

    const defaultName = recipeName || generateCocktailName();
    setRecipeName(defaultName);
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    const recipeData = {
      name: recipeName,
      description: recipeDescription,
      glassTypeId: selectedGlass?.id,
      totalVolume: currentStats.totalVolume,
      totalAbv: currentStats.totalAbv,
      totalCost: currentStats.totalCost,
      tasteBalance: currentStats.tasteBalance,
      category: "custom",
      difficulty: "easy",
      isPublic: true,
      ingredients: ingredients.map((item, index) => ({
        ingredientId: item.ingredient.id,
        amount: parseFloat(item.amount.toString()),
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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-b from-charcoal to-graphite">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Конструктор Коктейлей
            </h2>
            <p className="text-xl text-zinc max-w-2xl mx-auto">
              Создавайте уникальные напитки слой за слоем с автоматическим расчетом параметров
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* Left Sidebar - Expanded by 15% */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="bg-card border border-border rounded-lg p-6 flex-1">
                <IngredientRecommendations />
              </div>
            </div>

            {/* Center Content - Reduced by 15% */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              {/* Glass Selector or Drink Visualizer */}
              <div className="bg-card border border-border rounded-lg p-8 flex-1">
                {!selectedGlass ? (
                  <CompactGlassSelector />
                ) : (
                  <DrinkVisualizer />
                )}
              </div>
              
              {/* Small Recommendations Container */}
              <div className="bg-card border border-border rounded-lg p-4 h-32">
                <h4 className="text-sm font-semibold text-foreground mb-2">Быстрые советы</h4>
                <p className="text-xs text-muted-foreground">
                  {ingredients.length === 0 
                    ? "Добавьте ингредиенты из левого меню для получения советов"
                    : "Рецепт выглядит сбалансированно! Попробуйте добавить лед для охлаждения."
                  }
                </p>
              </div>
            </div>

            {/* Right Sidebar - Expanded by 15% */}
            <div className="lg:col-span-3 flex flex-col space-y-6">
              {/* Cocktail Metrics */}
              <div className="bg-card border border-border rounded-lg p-4 flex-1">
                <CocktailMetrics />
              </div>
              
              {/* Added Ingredients */}
              <div className="bg-card border border-border rounded-lg p-4 flex-1">
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
                    {validateCocktailIngredients(ingredients).map((error, index) => (
                      <p key={index} className="text-yellow-400 text-sm">• {error}</p>
                    ))}
                    {validateCocktailIngredients(ingredients).length === 0 && (
                      <p className="text-green-400 text-sm">✓ Рецепт готов к сохранению</p>
                    )}
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
                disabled={ingredients.length === 0 || !selectedGlass || saveRecipeMutation.isPending}
                className="bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90"
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
            <DialogTitle className="text-foreground">Сохранить рецепт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipe-name" className="text-foreground">Название коктейля</Label>
              <Input
                id="recipe-name"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Введите название..."
                className="bg-input border-border"
              />
            </div>
            <div>
              <Label htmlFor="recipe-description" className="text-foreground">Описание (необязательно)</Label>
              <Textarea
                id="recipe-description"
                value={recipeDescription}
                onChange={(e) => setRecipeDescription(e.target.value)}
                placeholder="Опишите вкус и особенности коктейля..."
                className="bg-input border-border"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
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
