import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dice2, Crown, Bolt, Sun, Leaf, Flame, Save, Edit, Sparkles } from "lucide-react";

// Import glass images for visualization
import shotImage from '@/assets/glass-images-new/shot.png';
import oldFashionedImage from '@/assets/glass-images-new/old-fashioned.png';
import highballImage from '@/assets/glass-images-new/highball.png';
import martiniImage from '@/assets/glass-images-new/martini.png';
import margaritaImage from '@/assets/glass-images-new/margarita.png';
import hurricaneImage from '@/assets/glass-images-new/hurricane.png';
import tumblerImage from '@/assets/glass-images-new/tumbler.png';
import snifterImage from '@/assets/glass-images-new/snifter.png';
import champagneFlute from '@/assets/glass-images-new/champagne-flute.png';
import beerMugImage from '@/assets/glass-images-new/beer-mug.png';
import redWineImage from '@/assets/glass-images-new/red-wine.png';
import whiteWineImage from '@/assets/glass-images-new/white-wine.png';
import sourImage from '@/assets/glass-images-new/sour.png';
import champagneSaucer from '@/assets/glass-images-new/champagne-saucer.png';

// Glass image mapping
const glassImageMap: Record<string, string> = {
  'shot': shotImage,
  'old-fashioned': oldFashionedImage,
  'highball': highballImage,
  'martini': martiniImage,
  'margarita': margaritaImage,
  'hurricane': hurricaneImage,
  'tumbler': tumblerImage,
  'snifter': snifterImage,
  'champagne-flute': champagneFlute,
  'beer-mug': beerMugImage,
  'red-wine': redWineImage,
  'white-wine': whiteWineImage,
  'sour': sourImage,
  'champagne-saucer': champagneSaucer,
};

// Function to translate categories to Russian
function translateCategory(category: string): string {
  const translations: Record<string, string> = {
    'classic': 'Классический',
    'crazy': 'Сумасшедший',
    'summer': 'Летний',
    'nonalcoholic': 'Безалкогольный',
    'shot': 'Шот'
  };
  return translations[category] || category;
}
import { Link } from "wouter";

interface GeneratedRecipe {
  name: string;
  description: string;
  glass: {
    name: string;
    capacity: number;
    shape: string;
  };
  ingredients: {
    ingredient: {
      id: number;
      name: string;
      color: string;
      abv: number;
      pricePerLiter: number;
    };
    amount: number;
    unit: string;
    order: number;
  }[];
  totalVolume: number;
  category: string;
}

const GENERATION_MODES = [
  { 
    id: 'classic', 
    label: 'Классический', 
    icon: Crown, 
    color: 'bg-neon-purple',
    description: 'Проверенные временем рецепты'
  },
  { 
    id: 'crazy', 
    label: 'Сумасшедший', 
    icon: Bolt, 
    color: 'bg-neon-pink',
    description: 'Экспериментальные сочетания'
  },
  { 
    id: 'summer', 
    label: 'Летний', 
    icon: Sun, 
    color: 'bg-neon-amber',
    description: 'Освежающие напитки'
  },
  { 
    id: 'nonalcoholic', 
    label: 'Безалкогольный', 
    icon: Leaf, 
    color: 'bg-green-500',
    description: 'Для всех возрастов'
  },
  { 
    id: 'shot', 
    label: 'Шот', 
    icon: Flame, 
    color: 'bg-red-500',
    description: 'Крепкие и быстрые'
  }
];

export default function Generator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMode, setSelectedMode] = useState('classic');
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecipeMutation = useMutation({
    mutationFn: async (mode: string) => {
      const response = await apiRequest("POST", "/api/recipes/generate", { mode });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedRecipe(data);
      setIsGenerating(false);
      toast({
        title: "Рецепт создан!",
        description: `Попробуйте ${data.name}`,
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось создать рецепт. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const saveRecipeMutation = useMutation({
    mutationFn: async (recipeData: any) => {
      return await apiRequest("POST", "/api/recipes", recipeData);
    },
    onSuccess: () => {
      toast({
        title: "Рецепт сохранен",
        description: "Созданный коктейль добавлен в ваш профиль",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      // queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "recipes"] });
    },
    onError: (error) => {
      // if (isUnauthorizedError(error)) {
      //   toast({
      //     title: "Ошибка авторизации",
      //     description: "Выполняется перенаправление на страницу входа...",
      //     variant: "destructive",
      //   });
      //   setTimeout(() => {
      //     window.location.href = "/api/login";
      //   }, 500);
      //   return;
      // }
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить рецепт. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    generateRecipeMutation.mutate(selectedMode);
  };

  const handleSaveGenerated = () => {
    if (!generatedRecipe) return;

    // Calculate stats
    const totalVolume = generatedRecipe.ingredients.reduce((sum, item) => sum + item.amount, 0);
    const totalAlcohol = generatedRecipe.ingredients.reduce((sum, item) => {
      return sum + (item.amount * (item.ingredient.abv / 100));
    }, 0);
    const totalAbv = totalVolume > 0 ? (totalAlcohol / totalVolume) * 100 : 0;
    const totalCost = generatedRecipe.ingredients.reduce((sum, item) => {
      return sum + (item.amount / 1000) * item.ingredient.pricePerLiter;
    }, 0);

    const recipeData = {
      name: generatedRecipe.name,
      description: generatedRecipe.description,
      glassTypeId: 1, // Default glass type
      totalVolume,
      totalAbv,
      totalCost,
      tasteBalance: { sweet: 5, sour: 5, bitter: 5, alcohol: Math.min(10, totalAbv / 5) },
      category: generatedRecipe.category,
      difficulty: "easy",
      isPublic: true,
      ingredients: generatedRecipe.ingredients.map((item) => ({
        ingredientId: item.ingredient.id,
        amount: item.amount,
        unit: item.unit,
        order: item.order
      }))
    };

    saveRecipeMutation.mutate(recipeData);
  };

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-b from-graphite to-night-blue">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-4 text-neon-purple"
                style={{ 
                  textShadow: '0 0 20px rgba(139, 69, 255, 0.8), 0 0 40px rgba(139, 69, 255, 0.6)',
                  color: '#8b45ff'
                }}>
              <Dice2 className="hidden sm:inline mr-3 h-10 w-10 text-neon-purple" />
              Генератор Рецептов
            </h2>
            <p className="text-xl text-cream max-w-2xl mx-auto">
              Позвольте искусственному интеллекту создать для вас уникальный коктейль
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Generation Modes */}
            <Card className="glass-effect border-none mb-8">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-neon-turquoise to-electric bg-clip-text text-transparent"
                    style={{ textShadow: '0 0 15px rgba(0, 247, 239, 0.7)' }}>
                  Режим генерации
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {GENERATION_MODES.map((mode) => {
                    const IconComponent = mode.icon;
                    return (
                      <Button
                        key={mode.id}
                        variant={selectedMode === mode.id ? "default" : "outline"}
                        className={`h-auto flex flex-col items-center space-y-2 p-4 w-full ${
                          selectedMode === mode.id 
                            ? `${mode.color} text-night-blue` 
                            : 'border-gray-600 hover:border-neon-turquoise'
                        }`}
                        onClick={() => setSelectedMode(mode.id)}
                      >
                        <IconComponent className="h-6 w-6" />
                        <div className="text-center">
                          <p className="font-semibold">{mode.label}</p>
                          <p className="text-xs opacity-80">{mode.description}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center mb-8">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || generateRecipeMutation.isPending}
                className="bg-gradient-to-r from-neon-purple to-neon-pink text-night-blue px-12 py-4 text-xl transition-all duration-200 shadow-lg"
                style={{
                  boxShadow: '0 0 20px rgba(139, 69, 255, 0.6), 0 0 40px rgba(255, 20, 147, 0.4), 0 8px 30px rgba(0, 0, 0, 0.3)'
                }}
              >
                <Sparkles className="mr-3 h-6 w-6" />
                {isGenerating ? "Создание..." : "Создать напиток"}
              </Button>
            </div>

            {/* Generated Recipe */}
            {generatedRecipe && (
              <Card className="glass-effect border-none">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-neon-amber mb-2">
                      {generatedRecipe.name}
                    </h3>
                    <p className="text-cream">Летний коктейль с освежающим вкусом тропических фруктов</p>
                    <div className="mt-4">
                      <Badge className="bg-neon-turquoise text-night-blue">
                        {translateCategory(generatedRecipe.category)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8">
                    {/* Recipe Visual */}
                    <div className="text-center">
                      <div className="flex justify-center items-center gap-6 mb-4">
                        {/* Glass Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-32 h-48">
                            <img
                              src={glassImageMap[generatedRecipe.glass?.shape] || glassImageMap['old-fashioned']}
                              alt={generatedRecipe.glass?.name || 'Glass'}
                              className="w-full h-full object-contain transition-all duration-1000"
                            />
                          </div>
                        </div>
                        
                        {/* Pyramid Visualization */}
                        <div className="flex-shrink-0">
                          <div 
                            className="relative w-32 h-48 bg-gradient-to-b from-gray-700/20 to-gray-900/40 border-2 border-gray-500 overflow-hidden shadow-2xl transition-all duration-1000 ease-out"
                            style={{ 
                              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                              borderRadius: '0 0 8px 8px',
                              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
                              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                            }}
                          >
                            {generatedRecipe.ingredients.map((item, index) => {
                              const totalVolume = generatedRecipe.ingredients.reduce((sum, i) => sum + i.amount, 0);
                              const layerHeight = (item.amount / totalVolume) * 180; // 180px max height for pyramid
                              const bottom = generatedRecipe.ingredients.slice(0, index).reduce((sum, i) => {
                                return sum + (i.amount / totalVolume) * 180;
                              }, 0);
                              
                              return (
                                <div
                                  key={index}
                                  className="absolute left-0 right-0 liquid-layer opacity-90"
                                  style={{
                                    height: `${layerHeight}px`,
                                    bottom: `${bottom}px`,
                                    background: `linear-gradient(to top, ${item.ingredient.color}, ${item.ingredient.color}dd)`,
                                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}
                                />
                              );
                            })}
                            {/* Subtle inner highlight */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 w-2"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold" style={{ color: '#3b82f6' }}>
                            {generatedRecipe.totalVolume}ml
                          </div>
                          <div className="text-sm text-cream">Объем</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold" style={{ color: '#eab308' }}>
                            {generatedRecipe.ingredients.reduce((sum, item) => {
                              const totalVolume = generatedRecipe.ingredients.reduce((s, i) => s + i.amount, 0);
                              const totalAlcohol = generatedRecipe.ingredients.reduce((s, i) => s + (i.amount * (i.ingredient.abv / 100)), 0);
                              return totalVolume > 0 ? (totalAlcohol / totalVolume) * 100 : 0;
                            }, 0).toFixed(1)}%
                          </div>
                          <div className="text-sm text-cream">Крепость</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold" style={{ color: '#22c55e' }}>
                            {generatedRecipe.ingredients.reduce((sum, item) => {
                              return sum + (item.amount / 1000) * item.ingredient.pricePerLiter;
                            }, 0).toFixed(0)}₽
                          </div>
                          <div className="text-sm text-cream">Стоимость</div>
                        </div>
                      </div>
                    </div>

                    {/* Recipe Details */}
                    <div>
                      <h4 className="text-xl font-semibold mb-4 text-center text-white">Ингредиенты:</h4>
                      <div className="space-y-3 mb-6">
                        {generatedRecipe.ingredients.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.ingredient.color }}
                              />
                              <span className="text-cream">{item.ingredient.name}</span>
                            </div>
                            <span className="text-neon-amber font-semibold">
                              {item.amount}{item.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <Button
                          onClick={handleSaveGenerated}
                          disabled={saveRecipeMutation.isPending}
                          className="glow-button bg-neon-turquoise text-night-blue px-8 py-2 w-full sm:w-[45%] hover:bg-neon-turquoise/90"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {saveRecipeMutation.isPending ? "Сохранение..." : "Сохранить"}
                        </Button>
                        <Link href="/constructor" className="w-full sm:w-[45%]">
                          <Button
                            variant="outline"
                            className="neon-border bg-transparent text-neon-purple px-8 py-2 w-full hover:bg-neon-purple hover:text-night-blue"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Редактировать
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
