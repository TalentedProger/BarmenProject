import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Droplet, Percent, Coins, Star, Heart, Share2,
  Beaker, BarChart3, Wine, GlassWater, Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Импортируем изображения стаканов для визуализации
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

interface RecipeIngredient {
  id: string;
  ingredientId: number;
  amount: string;
  unit: string;
  order: number;
  ingredient?: {
    id: number;
    name: string;
    category: string;
    color: string;
    abv: string;
    pricePerLiter: string;
  };
}

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  glassTypeId: number;
  totalVolume: string;
  totalAbv: string;
  totalCost: string;
  tasteBalance: any;
  category: string | null;
  difficulty: string | null;
  isPublic: boolean;
  createdBy: string | null;
  createdAt: string;
  rating: string | null;
  ratingCount: number;
  glassType?: {
    id: number;
    name: string;
    shape: string;
    capacity: number;
  };
  ingredients?: RecipeIngredient[];
}

export default function UserRecipePage() {
  const params = useParams();
  const recipeId = params.id || "";
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Прокрутка страницы вверх при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [recipeId]);

  // Загрузка рецепта из API
  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: [`/api/recipes/${recipeId}`],
    queryFn: async () => {
      const res = await fetch(`/api/recipes/${recipeId}`);
      if (!res.ok) {
        throw new Error('Recipe not found');
      }
      return res.json();
    },
    enabled: !!recipeId
  });

  // Загрузка избранного
  useEffect(() => {
    const favoriteKey = `recipe_${recipeId}_favorite`;
    const isFav = localStorage.getItem(favoriteKey) === 'true';
    setIsFavorite(isFav);
  }, [recipeId]);

  const handleFavoriteToggle = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    const favoriteKey = `recipe_${recipeId}_favorite`;
    localStorage.setItem(favoriteKey, newStatus.toString());
  };

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
    // Можно добавить сохранение рейтинга через API
  };

  // Получаем изображение стакана
  const getGlassImage = (glassShape?: string) => {
    if (!glassShape) return highballImage;
    return glassImageMap[glassShape.toLowerCase()] || highballImage;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-blue text-ice-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-turquoise"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-night-blue text-ice-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Рецепт не найден</h1>
            <p className="text-white/60 mb-6">Такого рецепта нет в базе данных</p>
            <Button onClick={() => window.history.back()} className="bg-neon-turquoise text-night-blue">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalAbv = parseFloat(recipe.totalAbv || '0');
  const totalVolume = parseFloat(recipe.totalVolume || '0');
  const totalCost = parseFloat(recipe.totalCost || '0');
  const glassShape = recipe.glassType?.shape || 'highball';

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Кнопка назад */}
          <div className="mb-8">
            <Button
              onClick={() => window.history.back()}
              className="bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Заголовок */}
            <div className="text-center mb-12">
              <h1 
                className="text-5xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 20px rgba(0, 255, 240, 0.5)' }}
              >
                {recipe.name}
              </h1>
              {recipe.description && (
                <p className="text-white/70 text-lg max-w-2xl mx-auto">{recipe.description}</p>
              )}
              {recipe.category && (
                <span className="inline-block mt-4 px-4 py-1 bg-neon-purple/30 rounded-full text-neon-purple text-sm">
                  {recipe.category}
                </span>
              )}
            </div>

            {/* Карточка с визуализацией стакана */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Изображение стакана */}
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-64 flex items-end justify-center">
                    <img
                      src={getGlassImage(glassShape)}
                      alt={recipe.glassType?.name || 'Стакан'}
                      className="max-h-full max-w-full object-contain"
                      style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 240, 0.3))' }}
                    />
                  </div>
                  <p className="text-center text-white/60 mt-2">{recipe.glassType?.name || 'Стакан'}</p>
                </div>

                {/* Статистика */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-5 h-5 text-purple-400" />
                      <span className="text-white/70">ABV</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-300">{totalAbv.toFixed(1)}%</div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl p-4 border border-cyan-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="w-5 h-5 text-cyan-400" />
                      <span className="text-white/70">Объём</span>
                    </div>
                    <div className="text-2xl font-bold text-cyan-300">{totalVolume.toFixed(0)} мл</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-green-400" />
                      <span className="text-white/70">Стоимость</span>
                    </div>
                    <div className="text-2xl font-bold text-green-300">{totalCost.toFixed(0)} ₽</div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl p-4 border border-amber-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-amber-400" />
                      <span className="text-white/70">Сложность</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-300">{recipe.difficulty || 'Средне'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ингредиенты */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Beaker className="w-6 h-6 text-cyan-400" />
                Ингредиенты
              </h2>
              
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <div className="space-y-3">
                  {recipe.ingredients
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <div 
                        key={item.id || index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.ingredient?.color || '#666' }}
                          />
                          <span className="text-white font-medium">
                            {item.ingredient?.name || `Ингредиент #${item.ingredientId}`}
                          </span>
                          {item.ingredient?.category && (
                            <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">
                              {item.ingredient.category}
                            </span>
                          )}
                        </div>
                        <span className="text-cyan-400 font-semibold">
                          {item.amount} {item.unit}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-white/50">Нет информации об ингредиентах</p>
              )}
            </div>

            {/* Действия */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Рейтинг */}
                <div className="text-center">
                  <p className="text-white/60 mb-2">Ваша оценка</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoverRating || userRating) >= star;
                      return (
                        <Star
                          key={star}
                          className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                            isActive
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-white/40'
                          }`}
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleFavoriteToggle}
                    className={`${
                      isFavorite
                        ? 'bg-neon-pink text-white'
                        : 'bg-white/10 border border-neon-pink text-neon-pink hover:bg-neon-pink/20'
                    } px-6`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'В избранном' : 'В избранное'}
                  </Button>

                  <Button className="bg-white/10 border border-neon-turquoise text-neon-turquoise hover:bg-neon-turquoise/20 px-6">
                    <Share2 className="w-5 h-5 mr-2" />
                    Поделиться
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
