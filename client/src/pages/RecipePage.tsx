import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Heart, Share2 } from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const recipe = mojitorecipeData;

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
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/attached_assets/IMG_4960_1760139603930.MP4" type="video/mp4" />
          </video>
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

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        <section className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              🧪 Что внутри?
            </h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
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
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">📊 Расчёты</h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-3 border border-white/10 h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full h-full">
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20 flex flex-col items-center justify-center h-full">
                  <div className="text-2xl font-bold text-purple-300" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}>{recipe.abv}%</div>
                  <div className="text-white/80">ABV</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-500/20 flex flex-col items-center justify-center h-full">
                  <div className="text-2xl font-bold text-cyan-300" style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}>{recipe.volume} мл</div>
                  <div className="text-white/80">Объём</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl border border-pink-400/30 shadow-lg shadow-pink-500/20 flex flex-col items-center justify-center h-full">
                  <div className="text-2xl font-bold text-pink-300" style={{ textShadow: '0 0 10px rgba(236, 72, 153, 0.8)' }}>{recipe.calories} ккал</div>
                  <div className="text-white/80">Калории</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-400/30 shadow-lg shadow-green-500/20 flex flex-col items-center justify-center h-full">
                  <div className="text-2xl font-bold text-green-300" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}>{recipe.price} ₽</div>
                  <div className="text-white/80">Стоимость</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Что потребуется ?</h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full flex flex-col">
              <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mb-6 flex-1 items-center">
                {recipe.equipment.map((item, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/20 hover:border-white/40 hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center h-full">
                    <div className="text-4xl mb-3 transform hover:scale-110 transition-transform duration-200">{item.icon}</div>
                    <div className="text-white font-semibold text-base">{item.name}</div>
                  </div>
                ))}
                <div className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/20 hover:border-white/40 hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105 md:flex lg:hidden xl:flex hidden flex-col items-center justify-center h-full">
                  <div className="text-4xl mb-3 transform hover:scale-110 transition-transform duration-200">😊</div>
                  <div className="text-white font-semibold text-base">Хорошее настроение</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Пошаговый рецепт</h2>
            <div className="rounded-2xl p-6 h-full">
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
                
                return (
                  <div
                    key={index}
                    className={`${
                      currentStep === step.step ? 'block' : 'hidden'
                    } transition-all duration-500`}
                  >
                    <div
                      className="cursor-pointer transform hover:scale-[1.01] transition-all duration-300 group h-full"
                      onClick={() => {
                        if (currentStep < recipe.steps.length) {
                          setCurrentStep(currentStep + 1);
                        } else {
                          setCurrentStep(1);
                        }
                      }}
                    >
                      <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25 rounded-2xl p-6 group-hover:border-cyan-300/70 group-hover:shadow-xl group-hover:shadow-cyan-500/40 transition-all duration-300 flex flex-col items-center justify-center h-full">
                        <div className="text-cyan-300 text-lg font-medium mb-2">Шаг {step.step}</div>
                        <div className="text-white text-xl font-semibold mb-4">{step.text}</div>
                        
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full border border-white/20 mb-4">
                          <div className="text-4xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                            {step.icon}
                          </div>
                        </div>
                        
                        <p className="text-zinc-300 text-sm leading-relaxed text-center mb-4">
                          {getStepDescription(step.step)}
                        </p>
                        
                        <p className="text-cyan-400/60 text-xs font-medium group-hover:text-cyan-300/80 transition-colors duration-300">
                          Нажмите для перехода к следующему шагу
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">🧠 Анализ вкуса</h2>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <TasteSemicircles taste={recipe.taste} />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Ваша оценка</h2>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          
          <div className="flex flex-col max-[800px]:space-y-0 min-[800px]:flex-row min-[800px]:items-center min-[800px]:justify-between min-[800px]:space-y-0">
            
            <div className="min-[800px]:order-1 max-[800px]:order-2 max-[800px]:w-[60%] max-[500px]:w-[80%] max-[800px]:mx-auto max-[800px]:mb-4 max-[800px]:mt-4">
              <Button
                onClick={() => setIsFavorite(!isFavorite)}
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

        <section>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">🧬 Если понравилось — попробуй ещё</h2>
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
          </div>
        </section>
      </div>
    </div>
  );
}
