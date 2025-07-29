import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Heart, Share2, Play, ShoppingCart } from "lucide-react";
import { useState } from "react";

// Данные для коктейля Мохито
const mojitorecipeData = {
  id: 2,
  name: "Мохито",
  image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg",
  description: "Освежающий кубинский коктейль с мятой и лаймом",
  tags: ["🌿 Лёгкий", "🌱 Мятный", "❄️ Освежающий"],
  abv: 10,
  volume: 200,
  calories: 160,
  price: 240,
  rating: 4.8,
  reviewCount: 342,
  videoUrl: "https://www.youtube.com/watch?v=Zc_TZ0UWP3I",
  ingredients: [
    { name: "Ром", amount: "50 мл", icon: "🥃" },
    { name: "Мята", amount: "10 г", icon: "🌿" },
    { name: "Лайм", amount: "½ штуки", icon: "🍋" },
    { name: "Сахар", amount: "2 ч. ложки", icon: "🍬" },
    { name: "Содовая", amount: "до 200 мл", icon: "💧" }
  ],
  steps: [
    { icon: "🍋", text: "Разомни мяту и сахар с лаймом", step: 1 },
    { icon: "🧊", text: "Добавь ром и лёд", step: 2 },
    { icon: "🥤", text: "Долей содовую", step: 3 },
    { icon: "🍹", text: "Перемешай ложкой", step: 4 }
  ],
  equipment: [
    { name: "Джулеп ложка", icon: "🥄" },
    { name: "Барный стакан", icon: "🥃" },
    { name: "Джиггер", icon: "🧴" }
  ],
  taste: {
    sweetness: 3,
    sourness: 3,
    bitterness: 1,
    strength: 2,
    refreshing: 5
  },
  recommendations: [
    { name: "Cuba Libre", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Cuba_Libre_in_a_tall_glass_dark_2_1753377591756.jpg" },
    { name: "Margarita", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_classic_Margarita_cocktail_in_a_0_1753377591761.jpg" }
  ]
};

const TasteRadar = ({ taste }: { taste: any }) => {
  const radius = 80;
  const centerX = 120;
  const centerY = 120;
  
  const points = [
    { label: "Сладость", value: taste.sweetness, angle: 0 },
    { label: "Кислотность", value: taste.sourness, angle: 72 },
    { label: "Горечь", value: taste.bitterness, angle: 144 },
    { label: "Крепость", value: taste.strength, angle: 216 },
    { label: "Освежающая сила", value: taste.refreshing, angle: 288 }
  ];

  const getCoordinates = (angle: number, distance: number) => {
    const radian = (angle - 90) * Math.PI / 180;
    return {
      x: centerX + distance * Math.cos(radian),
      y: centerY + distance * Math.sin(radian)
    };
  };

  const pathData = points.map((point, index) => {
    const coords = getCoordinates(point.angle, (point.value / 5) * radius);
    return `${index === 0 ? 'M' : 'L'} ${coords.x} ${coords.y}`;
  }).join(' ') + ' Z';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="240" height="240" className="mx-auto">
        {/* Background circles */}
        {[1, 2, 3, 4, 5].map((level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(level / 5) * radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Axis lines */}
        {points.map((point) => {
          const coords = getCoordinates(point.angle, radius);
          return (
            <line
              key={point.label}
              x1={centerX}
              y1={centerY}
              x2={coords.x}
              y2={coords.y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <path
          d={pathData}
          fill="rgba(6, 182, 212, 0.2)"
          stroke="rgba(6, 182, 212, 0.8)"
          strokeWidth="3"
          filter="drop-shadow(0 0 12px rgba(6, 182, 212, 0.6))"
        />
        
        {/* Data points */}
        {points.map((point) => {
          const coords = getCoordinates(point.angle, (point.value / 5) * radius);
          return (
            <circle
              key={point.label}
              cx={coords.x}
              cy={coords.y}
              r="6"
              fill="#06B6D4"
              filter="drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))"
            />
          );
        })}
      </svg>
      
      {/* Labels positioned around the circle */}
      {points.map((point) => {
        const labelDistance = radius + 30;
        const coords = getCoordinates(point.angle, labelDistance);
        return (
          <div
            key={point.label}
            className="absolute text-center"
            style={{
              left: coords.x - 40,
              top: coords.y - 12,
              width: 80
            }}
          >
            <div className="text-white font-semibold text-xs mb-1">{point.label}</div>
            <div className="text-cyan-400 text-sm font-bold" style={{ textShadow: '0 0 6px rgba(6, 182, 212, 0.6)' }}>
              {point.value}/5
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function RecipePage() {
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const recipe = mojitorecipeData; // В будущем здесь будет загрузка по ID

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#1B1B1F] to-[#0A0A0D]">
      {/* Back Button - исправлена позиция для мобильных */}
      <div className="absolute top-6 left-6 z-20 md:top-6 md:left-6">
        <Button
          onClick={() => window.history.back()}
          className="bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Cocktail Glass - круглое изображение с неоновым свечением */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-80 h-80 mx-auto object-cover rounded-full shadow-2xl transition-transform duration-500 hover:scale-105 border-4 border-cyan-400/30"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(6, 182, 212, 0.6))'
                }}
              />
              {/* Дополнительные неоновые кольца */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-pulse"></div>
              <div className="absolute -inset-2 rounded-full border border-cyan-300/30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Title */}
          <h1 
            className="text-6xl font-bold text-white mb-6 max-[480px]:text-4xl"
            style={{ textShadow: '0 0 20px rgba(0, 255, 240, 0.5)' }}
          >
            {recipe.name}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-zinc-800/80 backdrop-blur-sm text-cyan-400 rounded-full text-sm font-medium border border-cyan-400/30 hover:scale-105 transition-transform duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* Ingredients & Calculations */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              🧪 Что внутри?
            </h2>
            <div className="space-y-4">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{ingredient.icon}</span>
                    <span className="text-lg">{ingredient.name}</span>
                  </div>
                  <span className="text-cyan-400 font-semibold">{ingredient.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations - тёмный фон как у ингредиентов */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">📊 Расчёты</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20">
                <div className="text-2xl font-bold text-purple-300" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}>{recipe.abv}%</div>
                <div className="text-white/80">ABV</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                <div className="text-2xl font-bold text-cyan-300" style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}>{recipe.volume} мл</div>
                <div className="text-white/80">Объём</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl border border-pink-400/30 shadow-lg shadow-pink-500/20">
                <div className="text-2xl font-bold text-pink-300" style={{ textShadow: '0 0 10px rgba(236, 72, 153, 0.8)' }}>{recipe.calories} ккал</div>
                <div className="text-white/80">Калории</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-400/30 shadow-lg shadow-green-500/20">
                <div className="text-2xl font-bold text-green-300" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}>{recipe.price} ₽</div>
                <div className="text-white/80">Стоимость</div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - убрал темный фон */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">📽 Видео приготовления</h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-2xl flex items-center justify-center border-2 border-white/20 backdrop-blur-md overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
              </div>
              
              <Button
                onClick={() => window.open(recipe.videoUrl, '_blank')}
                className="relative z-10 bg-gradient-to-r from-purple-600/90 to-cyan-600/90 hover:from-purple-500/90 hover:to-cyan-500/90 px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/30 backdrop-blur-sm"
                style={{
                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)'
                }}
              >
                <Play className="w-8 h-8 mr-3" />
                Смотреть видео
              </Button>
            </div>
          </div>
        </section>

        {/* Recipe Steps - убрал фон, добавил свайп-навигацию */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Пошаговый рецепт</h2>
          <p className="text-zinc-400 text-center mb-8 text-sm">
            Свайпните снизу вверх для перехода к следующему шагу
          </p>
          <div className="max-w-2xl mx-auto">
            {recipe.steps.map((step, index) => (
              <div
                key={index}
                className={`${
                  currentStep === step.step ? 'block' : 'hidden'
                } transition-all duration-500`}
              >
                <div
                  className="flex items-center space-x-6 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25 cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => {
                    if (currentStep < recipe.steps.length) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      setCurrentStep(1);
                    }
                  }}
                >
                  <div className="text-5xl transform transition-all duration-300 hover:scale-125 hover:rotate-12">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-cyan-300 text-base font-medium mb-1">Шаг {step.step}</div>
                    <div className="text-white text-xl font-semibold">{step.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Equipment - убрал кнопки Купить, добавил одну общую */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Что потребуется ?</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {recipe.equipment.map((item, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/20 hover:border-white/40 hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-200">{item.icon}</div>
                <div className="text-white font-semibold text-lg">{item.name}</div>
              </div>
            ))}
          </div>
          
          {/* Единая кнопка Посетить магазин */}
          <div className="text-center">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border border-orange-400/30"
              style={{
                boxShadow: '0 0 20px rgba(234, 88, 12, 0.4)'
              }}
            >
              <ShoppingCart className="w-6 h-6 mr-3" />
              Посетить магазин
            </Button>
          </div>
        </section>

        {/* Taste Analysis */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">🧠 Анализ вкуса</h2>
          <TasteRadar taste={recipe.taste} />
        </section>

        {/* Social Functions - переработанная компоновка */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          {/* Rating Section - вверху */}
          <div className="text-center mb-8">
            <div className="text-white mb-4 text-xl font-medium">Ваша оценка</div>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                    userRating >= star
                      ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                      : 'text-white/40 hover:text-yellow-300'
                  }`}
                  onClick={() => setUserRating(star)}
                  style={{ 
                    filter: userRating >= star ? 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))' : 'none'
                  }}
                />
              ))}
            </div>
            <div className="text-white/60 text-sm">
              {recipe.rating} ({recipe.reviewCount} отзывов)
            </div>
          </div>

          {/* Buttons - внизу в одну строку */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`${
                isFavorite
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                  : 'bg-white/10 hover:bg-white/20'
              } backdrop-blur-sm border border-white/20 px-5 py-2 text-base font-medium rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex-1 max-w-[140px]`}
              style={{
                boxShadow: isFavorite ? '0 0 15px rgba(236, 72, 153, 0.4)' : 'none'
              }}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'В избранном' : 'В избранное'}
            </Button>

            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-5 py-2 text-base font-medium rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex-1 max-w-[140px]">
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться
            </Button>
          </div>
        </section>

        {/* Recommendations */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">🧬 Если понравилось — попробуй ещё</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recipe.recommendations.map((rec, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}