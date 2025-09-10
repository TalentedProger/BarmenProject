import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Star, Clock, Users, DollarSign } from "lucide-react";
import { useCocktailStore } from "@/store/cocktail-store";
import type { Recipe, Ingredient, GlassType } from "@shared/schema";

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

interface RecipeWithIngredients extends Recipe {
  ingredients: Array<{
    id: number;
    amount: string;
    unit: string;
    order: number;
    ingredient: Ingredient;
  }>;
  glassType?: GlassType;
}

function translateCategory(category: string): string {
  const translations: Record<string, string> = {
    'classic': 'Классический',
    'crazy': 'Сумасшедший',
    'summer': 'Летний',
    'nonalcoholic': 'Безалкогольный',
    'shot': 'Шот',
    'custom': 'Авторский'
  };
  return translations[category] || category;
}

export default function RecipeDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { loadRecipe } = useCocktailStore();

  const { data: recipe, isLoading, error } = useQuery<RecipeWithIngredients>({
    queryKey: [`/api/recipes/${id}`],
    enabled: !!id,
  });

  const handleBackToProfile = () => {
    setLocation('/profile');
  };

  const handleEditRecipe = () => {
    if (!recipe) return;
    
    // Convert recipe to proper format for constructor
    const glassType = recipe.glassType || {
      id: recipe.glassTypeId || 1,
      name: 'Default Glass',
      shape: 'old-fashioned',
      capacity: 300,
      createdAt: new Date()
    };

    const ingredients = recipe.ingredients.map(item => ({
      ingredient: item.ingredient,
      amount: parseFloat(item.amount),
      unit: item.unit
    }));
    
    // Load recipe into constructor
    loadRecipe(glassType, ingredients);
    
    // Navigate to constructor
    setLocation('/constructor');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-blue text-ice-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Загрузка рецепта...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-night-blue text-ice-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Рецепт не найден</h2>
            <Button onClick={handleBackToProfile} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к профилю
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-b from-graphite to-night-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button 
              onClick={handleBackToProfile}
              variant="ghost" 
              className="mb-6 text-neon-turquoise hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к профилю
            </Button>

            <Card className="glass-effect border-none">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h1 className="text-4xl font-bold text-neon-amber mb-2">
                    {recipe.name}
                  </h1>
                  {recipe.description && (
                    <p className="text-cream text-lg">{recipe.description}</p>
                  )}
                  <div className="mt-4 flex justify-center gap-3">
                    <Badge className="bg-neon-turquoise text-night-blue">
                      {translateCategory(recipe.category)}
                    </Badge>
                    <Badge variant="outline" className="border-neon-purple text-neon-purple">
                      {recipe.difficulty === 'easy' ? 'Легкий' : 
                       recipe.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                    </Badge>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Visual Representation */}
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-6 mb-6">
                      {/* Glass Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-48">
                          <img
                            src={glassImageMap[recipe.glassType?.shape || 'old-fashioned'] || glassImageMap['old-fashioned']}
                            alt={recipe.glassType?.name || 'Glass'}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Pyramid Visualization */}
                      <div className="flex-shrink-0">
                        <div 
                          className="relative w-32 h-48 bg-gradient-to-b from-gray-700/20 to-gray-900/40 border-2 border-gray-500 overflow-hidden shadow-2xl"
                          style={{ 
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            borderRadius: '0 0 8px 8px',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {recipe.ingredients.map((item, index) => {
                            const totalVolume = recipe.ingredients.reduce((sum, i) => sum + parseFloat(i.amount), 0);
                            const layerHeight = (parseFloat(item.amount) / totalVolume) * 180;
                            const bottom = recipe.ingredients.slice(0, index).reduce((sum, i) => {
                              return sum + (parseFloat(i.amount) / totalVolume) * 180;
                            }, 0);
                            
                            return (
                              <div
                                key={index}
                                className="absolute left-0 right-0 liquid-layer opacity-90"
                                style={{
                                  height: `${layerHeight}px`,
                                  bottom: `${bottom}px`,
                                  background: `linear-gradient(to top, ${item.ingredient.color}, ${item.ingredient.color}dd)`,
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Recipe Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-400">
                          {recipe.totalVolume}ml
                        </div>
                        <div className="text-sm text-cream">Объем</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-400">
                          {parseFloat(recipe.totalAbv).toFixed(1)}%
                        </div>
                        <div className="text-sm text-cream">Крепость</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-400">
                          {parseFloat(recipe.totalCost).toFixed(0)}₽
                        </div>
                        <div className="text-sm text-cream">Стоимость</div>
                      </div>
                    </div>
                  </div>

                  {/* Recipe Details */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white">Ингредиенты:</h3>
                    <div className="space-y-3 mb-6">
                      {recipe.ingredients
                        .sort((a, b) => a.order - b.order)
                        .map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full border"
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
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={handleEditRecipe}
                        className="bg-gradient-to-r from-neon-purple to-neon-pink text-night-blue px-8 py-3 text-lg w-full"
                        style={{
                          boxShadow: '0 0 20px rgba(139, 69, 255, 0.6), 0 0 40px rgba(255, 20, 147, 0.4)'
                        }}
                      >
                        <Edit className="mr-2 h-5 w-5" />
                        Открыть в конструкторе
                      </Button>
                      
                      {recipe.instructions && (
                        <div className="mt-6">
                          <h4 className="text-xl font-semibold mb-3 text-white">Инструкции:</h4>
                          <p className="text-cream leading-relaxed">
                            {recipe.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}