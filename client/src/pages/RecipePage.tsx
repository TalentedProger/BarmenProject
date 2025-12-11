import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Star, ArrowLeft, Heart, Share2, Droplet, Percent, Flame, Coins,
  Beaker, BarChart3, Wine, Leaf, Citrus, Candy, Droplets,
  Utensils, Pipette, Smile, Brain, Dna, IceCream, GlassWater, Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { getFullCocktailById, FullCocktailData } from "@/data/cocktails-full";

const TasteSemicircles = ({ taste }: { taste: any }) => {
  const characteristics = [
    { label: "Сладость", value: taste.sweetness, color: "#FF006E", shadowColor: "rgba(255, 0, 110, 0.6)" },
    { label: "Кислотность", value: taste.sourness, color: "#FFBE0B", shadowColor: "rgba(255, 190, 11, 0.6)" },
    { label: "Горечь", value: taste.bitterness, color: "#FB5607", shadowColor: "rgba(251, 86, 7, 0.6)" },
    { label: "Крепость", value: taste.strength, color: "#8338EC", shadowColor: "rgba(131, 56, 236, 0.6)" },
    { label: "Освежающая сила", value: taste.refreshing, color: "#06FFA5", shadowColor: "rgba(6, 255, 165, 0.6)" }
  ];

  const SemicircleChart = ({ value, color, shadowColor, label }: { value: number, color: string, shadowColor: string, label: string }) => {
    const radius = 80;
    const strokeWidth = 16;
    const segments = 5;
    const gapAngle = 3;
    const segmentAngle = (180 - (segments - 1) * gapAngle) / segments;
    const centerX = 100;
    const centerY = 100;

    return (
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <svg width="200" height="120" className="overflow-visible">
            {Array.from({ length: segments }, (_, i) => {
              const startAngle = i * (segmentAngle + gapAngle);
              const endAngle = startAngle + segmentAngle;
              
              const startRadian = (startAngle) * Math.PI / 180;
              const endRadian = (endAngle) * Math.PI / 180;
              
              const startX = centerX - radius * Math.cos(startRadian);
              const startY = centerY - radius * Math.sin(startRadian);
              const endX = centerX - radius * Math.cos(endRadian);
              const endY = centerY - radius * Math.sin(endRadian);
              
              const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
              
              const outerRadius = radius;
              const innerRadius = radius - strokeWidth;
              
              const outerStartX = centerX - outerRadius * Math.cos(startRadian);
              const outerStartY = centerY - outerRadius * Math.sin(startRadian);
              const outerEndX = centerX - outerRadius * Math.cos(endRadian);
              const outerEndY = centerY - outerRadius * Math.sin(endRadian);
              
              const innerStartX = centerX - innerRadius * Math.cos(startRadian);
              const innerStartY = centerY - innerRadius * Math.sin(startRadian);
              const innerEndX = centerX - innerRadius * Math.cos(endRadian);
              const innerEndY = centerY - innerRadius * Math.sin(endRadian);
              
              const pathData = [
                `M ${outerStartX} ${outerStartY}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
                `L ${innerEndX} ${innerEndY}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
                `Z`
              ].join(' ');
              
              const isActive = i < value;
              
              return (
                <path
                  key={i}
                  d={pathData}
                  fill={isActive ? color : "rgba(128, 128, 128, 0.15)"}
                  stroke={isActive ? color : "rgba(128, 128, 128, 0.3)"}
                  strokeWidth="2"
                  filter={isActive ? `drop-shadow(0 0 12px ${shadowColor})` : "none"}
                  className="transition-all duration-300"
                />
              );
            })}
            
            <line
              x1={centerX - radius}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2"
            />
          </svg>
        </div>
        
        <div className="text-center">
          <div className="text-white font-semibold text-base mb-2">{label}</div>
          <div 
            className="text-xl font-bold"
            style={{ 
              color: color,
              textShadow: `0 0 12px ${shadowColor}`
            }}
          >
            {value}/5
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
      {characteristics.map((char, index) => (
        <SemicircleChart
          key={index}
          value={char.value}
          color={char.color}
          shadowColor={char.shadowColor}
          label={char.label}
        />
      ))}
    </div>
  );
};

export default function RecipePage() {
  const params = useParams();
  const recipeId = params.id || "1";
  const [currentStep, setCurrentStep] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Прокрутка страницы вверх при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [recipeId]);

  // Загрузка данных коктейля по ID
  const recipe = getFullCocktailById(recipeId);
  
  // Если коктейль не найден
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#1B1B1F] to-[#0A0A0D] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Коктейль не найден</h1>
          <p className="text-white/60 mb-6">Такого рецепта пока нет в нашей базе</p>
          <Button onClick={() => window.history.back()} className="bg-neon-turquoise text-night-blue">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    );
  }

  // Загрузка оценок при монтировании компонента
  useEffect(() => {
    loadRatings();
    loadFavoriteStatus();
  }, [recipeId]);

  const loadRatings = () => {
    // Загружаем все оценки для этого рецепта
    const ratingsKey = `recipe_${recipeId}_ratings`;
    const savedRatings = localStorage.getItem(ratingsKey);
    const ratings = savedRatings ? JSON.parse(savedRatings) : [];
    
    // Загружаем оценку текущего пользователя
    const userRatingKey = `recipe_${recipeId}_user_rating`;
    const savedUserRating = localStorage.getItem(userRatingKey);
    if (savedUserRating) {
      setUserRating(parseInt(savedUserRating));
    }
    
    // Рассчитываем средний рейтинг
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc: number, val: number) => acc + val, 0);
      setAverageRating(sum / ratings.length);
      setReviewCount(ratings.length);
    }
  };

  const loadFavoriteStatus = () => {
    const favoriteKey = `recipe_${recipeId}_favorite`;
    const isFav = localStorage.getItem(favoriteKey) === 'true';
    setIsFavorite(isFav);
  };

  const handleRatingClick = (rating: number) => {
    // Проверяем, ставил ли пользователь уже оценку
    const userRatingKey = `recipe_${recipeId}_user_rating`;
    const existingRating = localStorage.getItem(userRatingKey);
    
    if (existingRating) {
      // Обновляем существующую оценку
      const ratingsKey = `recipe_${recipeId}_ratings`;
      const savedRatings = localStorage.getItem(ratingsKey);
      const ratings = savedRatings ? JSON.parse(savedRatings) : [];
      
      // Находим индекс старой оценки и заменяем её
      const oldRating = parseInt(existingRating);
      const index = ratings.indexOf(oldRating);
      if (index > -1) {
        ratings[index] = rating;
      }
      
      localStorage.setItem(ratingsKey, JSON.stringify(ratings));
    } else {
      // Добавляем новую оценку
      const ratingsKey = `recipe_${recipeId}_ratings`;
      const savedRatings = localStorage.getItem(ratingsKey);
      const ratings = savedRatings ? JSON.parse(savedRatings) : [];
      ratings.push(rating);
      localStorage.setItem(ratingsKey, JSON.stringify(ratings));
    }
    
    // Сохраняем оценку пользователя
    localStorage.setItem(userRatingKey, rating.toString());
    setUserRating(rating);
    
    // Обновляем средний рейтинг
    loadRatings();
  };

  const handleFavoriteToggle = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    const favoriteKey = `recipe_${recipeId}_favorite`;
    localStorage.setItem(favoriteKey, newStatus.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#1B1B1F] to-[#0A0A0D]">
      <div className="absolute top-6 left-6 z-20 md:top-6 md:left-6">
        <Button
          onClick={() => window.history.back()}
          className="bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
      </div>

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 
            className="text-6xl font-bold text-white mb-8 max-[480px]:text-4xl mt-12"
            style={{ textShadow: '0 0 20px rgba(0, 255, 240, 0.5)' }}
          >
            {recipe.name}
          </h1>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {recipe.tags.map((tag, index) => {
              const gradients = [
                'linear-gradient(135deg, rgba(6, 182, 212, 0.6) 0%, rgba(59, 130, 246, 0.6) 100%)',
                'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(236, 72, 153, 0.6) 100%)',
                'linear-gradient(135deg, rgba(16, 185, 129, 0.6) 0%, rgba(5, 150, 105, 0.6) 100%)'
              ];
              return (
                <span
                  key={index}
                  className="px-5 py-2 rounded-full text-white text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                  style={{
                    background: gradients[index % gradients.length],
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(255, 255, 255, 0.1) inset',
                    letterSpacing: '0.3px'
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <section className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <Beaker className="w-8 h-8 text-cyan-400" />
              Что внутри?
            </h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
              <div className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => {
                  const IconComponent = ingredient.icon;
                  return (
                    <div key={index} className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30">
                          <IconComponent className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-lg">{ingredient.name}</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">{ingredient.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              Расчёты
            </h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-3 border border-white/10 h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full h-full">
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20 flex flex-col items-center justify-center h-full">
                  <div className="text-2xl font-bold text-purple-300" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}>{recipe.abv}%</div>
                  <div className="text-white/80 inline-flex items-center gap-2 mt-1">
                    ABV
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.35) 100%)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.18)'
                      }}>
                      <Percent className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-500/20 flex flex-col items-center justify-center h-full">
                  <div className="text-2xl font-bold text-cyan-300" style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}>{recipe.volume} мл</div>
                  <div className="text-white/80 inline-flex items-center gap-2 mt-1">
                    Объём
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.35) 100%)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.18)'
                      }}>
                      <Droplet className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl border border-pink-400/30 shadow-lg shadow-pink-500/20 flex flex-col items-center justify-center h-full">
                  <div className="text-2xl font-bold text-pink-300" style={{ textShadow: '0 0 10px rgba(236, 72, 153, 0.8)' }}>{recipe.calories} ккал</div>
                  <div className="text-white/80 inline-flex items-center gap-2 mt-1">
                    Калории
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.35) 0%, rgba(251, 113, 133, 0.35) 100%)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.18)'
                      }}>
                      <Flame className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-400/30 shadow-lg shadow-green-500/20 flex flex-col items-center justify-center h-full">
                  <div className="text-2xl font-bold text-green-300" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}>{recipe.price} ₽</div>
                  <div className="text-white/80 inline-flex items-center gap-2 mt-1">
                    Стоимость
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.35) 100%)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.18)'
                      }}>
                      <Coins className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white my-6 text-center flex items-center justify-center gap-3">
              <Utensils className="w-8 h-8 text-green-400" />
              Что потребуется ?
            </h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full flex flex-col">
              <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 flex-1">
                {recipe.equipment.map((item, index) => {
                  const IconComponent = item.icon;
                  const colors = [
                    { text: 'text-cyan-400', shadow: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))' },
                    { text: 'text-amber-400', shadow: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' },
                    { text: 'text-emerald-400', shadow: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))' }
                  ];
                  const colorScheme = colors[index % colors.length];
                  return (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/20 hover:border-white/40 hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center">
                      <div className="mb-3 transform hover:scale-110 transition-transform duration-200">
                        <IconComponent className={`w-10 h-10 ${colorScheme.text}`} style={{ filter: colorScheme.shadow }} />
                      </div>
                      <div className="text-white font-semibold text-base">{item.name}</div>
                    </div>
                  );
                })}
                {/* Показываем "Хорошее настроение" только если количество оборудования нечётное - для симметрии */}
                {recipe.equipment.length % 2 !== 0 && (
                  <div className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/20 hover:border-white/40 hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center">
                    <div className="mb-3 transform hover:scale-110 transition-transform duration-200">
                      <Smile className="w-10 h-10 text-pink-400" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.6))' }} />
                    </div>
                    <div className="text-white font-semibold text-base">Хорошее настроение</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white my-6 text-center flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-pink-400" />
              Пошаговый рецепт
            </h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full flex items-stretch">
              <div className="w-full flex items-stretch">
                {recipe.steps.map((step, index) => {
                  const getStepDescription = (stepNumber: number) => {
                    switch(stepNumber) {
                      case 1: return "Возьмите свежие листья мяты и аккуратно разомните их в барном стакане вместе с сахаром и кусочками лайма.";
                      case 2: return "Добавьте светлый ром в стакан с размятой мятой. Следом аккуратно насыпьте колотый лёд до верха стакана.";
                      case 3: return "Медленно долейте содовую воду до верха стакана. Наливайте её тонкой струйкой по барной ложке.";
                      case 4: return "Осторожно перемешайте коктейль барной ложкой движениями снизу вверх. Украсьте веточкой мяты и долькой лайма.";
                      default: return "Следуйте инструкции для выполнения данного шага приготовления коктейля.";
                    }
                  };
                  
                  const IconComponent = step.icon;
                  
                  return (
                    <div
                      key={index}
                      className={`${
                        currentStep === step.step ? 'flex' : 'hidden'
                      } transition-all duration-500 w-full`}
                    >
                      <div
                        className="cursor-pointer transform hover:scale-[1.01] transition-all duration-300 group w-full flex items-stretch"
                        onClick={() => {
                          if (currentStep < recipe.steps.length) {
                            setCurrentStep(currentStep + 1);
                          } else {
                            setCurrentStep(1);
                          }
                        }}
                      >
                        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25 rounded-2xl p-6 group-hover:border-cyan-300/70 group-hover:shadow-xl group-hover:shadow-cyan-500/40 transition-all duration-300">
                          <div className="text-cyan-300 text-lg font-medium mb-2">Шаг {step.step}</div>
                          <div className="text-white text-xl font-semibold mb-4">{step.text}</div>
                          
                          <div className="flex justify-center mb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full border border-white/20">
                              <IconComponent className="w-8 h-8 text-white transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                            </div>
                          </div>
                          
                          <p className="text-zinc-300 text-sm leading-relaxed text-center mb-4">
                            {getStepDescription(step.step)}
                          </p>
                          
                          <p className="text-cyan-400/60 text-xs font-medium text-center group-hover:text-cyan-300/80 transition-colors duration-300">
                            Нажмите для перехода к следующему шагу
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 mt-32">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            Анализ вкуса
          </h2>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <TasteSemicircles taste={recipe.taste} />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Ваша оценка</h2>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          
          <div className="flex flex-col max-[800px]:space-y-0 min-[800px]:flex-row min-[800px]:items-center min-[800px]:justify-between min-[800px]:space-y-0">
            
            <div className="min-[800px]:order-1 max-[800px]:order-2 max-[800px]:w-[60%] max-[500px]:w-[80%] max-[800px]:mx-auto max-[800px]:mb-4 max-[800px]:mt-4">
              <Button
                onClick={handleFavoriteToggle}
                className={`${
                  isFavorite
                    ? 'bg-gradient-to-r from-neon-purple to-purple-500 hover:from-purple-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-neon-purple/20 to-purple-500/20 hover:from-neon-purple/30 hover:to-purple-500/30 border-2 border-purple-400/50'
                } backdrop-blur-sm px-6 py-3 text-base font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 w-full min-[800px]:w-auto min-[800px]:min-w-[160px]`}
                style={{
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(139, 69, 193, 0.2)'
                }}
              >
                <Heart className={`w-5 h-5 mr-2 flex-shrink-0 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'В избранном' : 'В избранное'}
              </Button>
            </div>

            <div className="min-[800px]:order-2 max-[800px]:order-1 text-center max-[800px]:mb-10">
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || userRating) >= star;
                  return (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                        isActive
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-white/40'
                      }`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ 
                        filter: isActive ? 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))' : 'none'
                      }}
                    />
                  );
                })}
              </div>
              <div className="text-white/60 text-sm">
                {reviewCount > 0 ? (
                  <>
                    {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'отзыв' : reviewCount < 5 ? 'отзыва' : 'отзывов'})
                  </>
                ) : (
                  <span>Будьте первым, кто оценит!</span>
                )}
              </div>
            </div>

            <div className="min-[800px]:order-3 max-[800px]:order-3 max-[800px]:w-[60%] max-[500px]:w-[80%] max-[800px]:mx-auto">
              <Button 
                className="bg-gradient-to-r from-neon-turquoise/20 to-electric/20 hover:from-neon-turquoise/30 hover:to-electric/30 backdrop-blur-sm border-2 border-cyan-400/50 px-6 py-3 text-base font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 w-full min-[800px]:w-auto min-[800px]:min-w-[160px]"
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(54, 152, 255, 0.2)'
                }}
              >
                <Share2 className="w-5 h-5 mr-2 flex-shrink-0" />
                Поделиться
              </Button>
            </div>
          </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <Dna className="w-8 h-8 text-green-400" />
              Если понравилось — попробуй ещё
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recipe.recommendations.map((rec, index) => (
                <Link 
                  key={index} 
                  href={`/recipe/${rec.id}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-white text-xl font-semibold mb-2">{rec.name}</h3>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                      Открыть рецепт
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
