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
  const centerX = 100;
  const centerY = 100;
  
  const points = [
    { label: "Сладость", value: taste.sweetness, angle: 0 },
    { label: "Кислотность", value: taste.sourness, angle: 72 },
    { label: "Горечь", value: taste.bitterness, angle: 144 },
    { label: "Крепость", value: taste.strength, angle: 216 },
    { label: "Освежающая сила", value: taste.refreshing, angle: 288 }
  ];

  const getCoordinates = (angle: number, value: number) => {
    const radian = (angle - 90) * Math.PI / 180;
    const distance = (value / 5) * radius;
    return {
      x: centerX + distance * Math.cos(radian),
      y: centerY + distance * Math.sin(radian)
    };
  };

  const pathData = points.map((point, index) => {
    const coords = getCoordinates(point.angle, point.value);
    return `${index === 0 ? 'M' : 'L'} ${coords.x} ${coords.y}`;
  }).join(' ') + ' Z';

  return (
    <div className="relative">
      <svg width="200" height="200" className="mx-auto">
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
          const coords = getCoordinates(point.angle, 5);
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
          strokeWidth="2"
          filter="drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))"
        />
        
        {/* Data points */}
        {points.map((point) => {
          const coords = getCoordinates(point.angle, point.value);
          return (
            <circle
              key={point.label}
              cx={coords.x}
              cy={coords.y}
              r="4"
              fill="#06B6D4"
              filter="drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))"
            />
          );
        })}
      </svg>
      
      {/* Labels */}
      <div className="absolute inset-0 flex items-center justify-center">
        {points.map((point) => {
          const coords = getCoordinates(point.angle, 6);
          return (
            <div
              key={point.label}
              className="absolute text-xs text-white font-medium text-center"
              style={{
                left: coords.x - 30,
                top: coords.y - 10,
                width: 60
              }}
            >
              {point.label}
              <div className="text-cyan-400 text-sm font-bold">{point.value}/5</div>
            </div>
          );
        })}
      </div>
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
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
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
          {/* Cocktail Glass */}
          <div className="mb-8">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-64 h-80 mx-auto object-cover rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(6, 182, 212, 0.3))'
              }}
            />
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

          {/* Calculations */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6">📊 Расчёты</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-cyan-400">{recipe.abv}%</div>
                <div className="text-white/80">ABV</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-cyan-400">{recipe.volume} мл</div>
                <div className="text-white/80">Объём</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-cyan-400">{recipe.calories} ккал</div>
                <div className="text-white/80">Калории</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-cyan-400">{recipe.price} ₽</div>
                <div className="text-white/80">Стоимость</div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">📽 Видео приготовления</h2>
          <div className="relative max-w-md mx-auto">
            <div className="aspect-video bg-black/60 rounded-xl flex items-center justify-center border border-white/20">
              <Button
                onClick={() => window.open(recipe.videoUrl, '_blank')}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 text-lg font-semibold shadow-xl"
              >
                <Play className="w-6 h-6 mr-2" />
                Смотреть видео
              </Button>
            </div>
          </div>
        </section>

        {/* Recipe Steps */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">🧑‍🍳 Пошаговый рецепт</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {recipe.steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  currentStep >= step.step
                    ? 'bg-cyan-500/20 border border-cyan-500/40'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setCurrentStep(step.step)}
              >
                <div className="text-4xl transform transition-transform duration-200 hover:scale-110">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white/60 text-sm">Шаг {step.step}</div>
                  <div className="text-white text-lg font-medium">{step.text}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  currentStep >= step.step
                    ? 'bg-cyan-500 border-cyan-500'
                    : 'border-white/40'
                }`} />
              </div>
            ))}
          </div>
        </section>

        {/* Equipment */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-6">🧰 Что потребуется</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {recipe.equipment.map((item, index) => (
              <div key={index} className="text-center p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-white font-medium mb-3">{item.name}</div>
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Купить
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Taste Analysis */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">🧠 Анализ вкуса</h2>
          <TasteRadar taste={recipe.taste} />
        </section>

        {/* Social Functions */}
        <section className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="flex flex-wrap justify-center gap-6">
            {/* Rating */}
            <div className="text-center">
              <div className="text-white mb-2">Ваша оценка</div>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                      userRating >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/40 hover:text-yellow-300'
                    }`}
                    onClick={() => setUserRating(star)}
                  />
                ))}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {recipe.rating} ({recipe.reviewCount} отзывов)
              </div>
            </div>

            {/* Save to favorites */}
            <Button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`${
                isFavorite
                  ? 'bg-gradient-to-r from-pink-500 to-red-500'
                  : 'bg-white/10 hover:bg-white/20'
              } backdrop-blur-sm border border-white/20`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'В избранном' : 'В избранное'}
            </Button>

            {/* Share */}
            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20">
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