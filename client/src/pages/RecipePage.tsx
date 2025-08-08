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

const TasteSemicircles = ({ taste }: { taste: any }) => {
  const characteristics = [
    { label: "Сладость", value: taste.sweetness, color: "#FF006E", shadowColor: "rgba(255, 0, 110, 0.6)" }, // Неоново-розовый
    { label: "Кислотность", value: taste.sourness, color: "#FFBE0B", shadowColor: "rgba(255, 190, 11, 0.6)" }, // Неоново-желтый
    { label: "Горечь", value: taste.bitterness, color: "#FB5607", shadowColor: "rgba(251, 86, 7, 0.6)" }, // Неоново-оранжевый
    { label: "Крепость", value: taste.strength, color: "#8338EC", shadowColor: "rgba(131, 56, 236, 0.6)" }, // Неоново-фиолетовый
    { label: "Освежающая сила", value: taste.refreshing, color: "#06FFA5", shadowColor: "rgba(6, 255, 165, 0.6)" } // Неоново-зеленый
  ];

  const SemicircleChart = ({ value, color, shadowColor, label }: { value: number, color: string, shadowColor: string, label: string }) => {
    const radius = 80;
    const strokeWidth = 16;
    const segments = 5;
    const gapAngle = 3; // Угол зазора между сегментами
    const segmentAngle = (180 - (segments - 1) * gapAngle) / segments; // Угол каждого сегмента с учетом зазоров
    const centerX = 100;
    const centerY = 100;

    return (
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <svg width="200" height="120" className="overflow-visible">
            {/* Сегменты полукруга */}
            {Array.from({ length: segments }, (_, i) => {
              const startAngle = i * (segmentAngle + gapAngle);
              const endAngle = startAngle + segmentAngle;
              
              // Преобразование в радианы для правильного полукруга
              const startRadian = (startAngle) * Math.PI / 180;
              const endRadian = (endAngle) * Math.PI / 180;
              
              const startX = centerX - radius * Math.cos(startRadian);
              const startY = centerY - radius * Math.sin(startRadian);
              const endX = centerX - radius * Math.cos(endRadian);
              const endY = centerY - radius * Math.sin(endRadian);
              
              const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
              
              // Создаем толстую дугу вместо сектора
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
            
            {/* Базовая линия полукруга */}
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
        
        {/* Название характеристики */}
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
          <div className="mt-8 mb-16 flex justify-center">
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-64 h-64 max-[500px]:w-56 max-[500px]:h-56 sm:w-80 sm:h-80 lg:w-[28rem] lg:h-[28rem] mx-auto object-cover rounded-full shadow-2xl transition-transform duration-500 hover:scale-105 border-4 border-cyan-400/30"
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
            className="text-6xl font-bold text-white mb-8 max-[480px]:text-4xl mt-12"
            style={{ textShadow: '0 0 20px rgba(0, 255, 240, 0.5)' }}
          >
            {recipe.name}
          </h1>

          {/* Tags */}
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* Ingredients & Calculations */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              🧪 Что внутри?
            </h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
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

          {/* Calculations - тёмный фон как у ингредиентов */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">📊 Расчёты</h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
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
          </div>
        </section>

        {/* Main Content Grid - Equipment and Video */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Equipment Section - Left side */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Что потребуется ?</h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
                {recipe.equipment.map((item, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/20 hover:border-white/40 hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl mb-3 transform hover:scale-110 transition-transform duration-200">{item.icon}</div>
                    <div className="text-white font-semibold text-base">{item.name}</div>
                  </div>
                ))}
                {/* Дополнительная карточка только для симметрии в 2-колоночной компоновке */}
                <div className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/20 hover:border-white/40 hover:from-white/10 hover:to-white/15 transition-all duration-300 transform hover:scale-105 md:block lg:hidden xl:block hidden">
                  <div className="text-4xl mb-3 transform hover:scale-110 transition-transform duration-200">😊</div>
                  <div className="text-white font-semibold text-base">Хорошее настроение</div>
                </div>
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
            </div>
          </div>

          {/* Video Section - Right side */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">📽 Видео приготовления</h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col">
              
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-2xl flex items-center justify-center border-2 border-white/20 backdrop-blur-md overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <Button
                  onClick={() => window.open(recipe.videoUrl, '_blank')}
                  className="bg-gradient-to-r from-purple-600/90 to-cyan-600/90 hover:from-purple-500/90 hover:to-cyan-500/90 px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/30 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)'
                  }}
                >
                  <Play className="w-8 h-8 mr-3" />
                  Смотреть видео
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Steps - квадратные карточки с описанием */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Пошаговый рецепт</h2>
          <p className="text-zinc-400 text-center mb-8 text-sm">
            Нажмите на карточку для перехода к следующему шагу
          </p>
          <div className="w-full">
            {recipe.steps.map((step, index) => {
              // Подробные описания для каждого шага
              const getStepDescription = (stepNumber: number) => {
                switch(stepNumber) {
                  case 1: return "Возьмите свежие листья мяты и аккуратно разомните их в барном стакане вместе с сахаром и кусочками лайма. Этот процесс называется мадлинг - он поможет извлечь эфирные масла из мяты, которые придадут коктейлю неповторимый аромат. Не переусердствуйте, чтобы не сделать напиток горьким.";
                  case 2: return "Добавьте светлый ром в стакан с размятой мятой. Следом аккуратно насыпьте колотый лёд до верха стакана. Лёд должен быть достаточно мелким, чтобы хорошо охладить напиток, но не слишком мелким, чтобы не разбавить его слишком быстро. Идеально подойдёт лёд размером с орех.";
                  case 3: return "Медленно долейте содовую воду до верха стакана. Наливайте её тонкой струйкой по барной ложке, чтобы не разрушить слоистость напитка. Содовая придаст мохито лёгкую игристость и освежающий эффект. Важно не переборщить - содовая должна дополнять, а не доминировать во вкусе.";
                  case 4: return "Осторожно перемешайте коктейль барной ложкой движениями снизу вверх. Цель - объединить все ингредиенты, не повредив листья мяты. Перемешивайте 3-4 раза, этого достаточно. Украсьте веточкой свежей мяты и долькой лайма на краю стакана. Ваш идеальный мохито готов!";
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
                    className="cursor-pointer transform hover:scale-[1.01] transition-all duration-300 group"
                    onClick={() => {
                      if (currentStep < recipe.steps.length) {
                        setCurrentStep(currentStep + 1);
                      } else {
                        setCurrentStep(1);
                      }
                    }}
                  >
                    {/* Полноширинная карточка с неоновым эффектом */}
                    <div className="w-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25 rounded-2xl p-8 group-hover:border-cyan-300/70 group-hover:shadow-xl group-hover:shadow-cyan-500/40 group-active:border-cyan-200 group-active:shadow-2xl group-active:shadow-cyan-500/60 transition-all duration-300">
                      {/* Заголовок */}
                      <div className="text-center mb-6">
                        <div className="text-cyan-300 text-lg font-medium mb-3">Шаг {step.step}</div>
                        <div className="text-white text-2xl font-semibold mb-4">{step.text}</div>
                        
                        {/* Иконка сразу после заголовка */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full border border-white/20 mb-6">
                          <div className="text-5xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                            {step.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Подробное описание */}
                      <div className="text-center">
                        <p className="text-zinc-300 text-base leading-relaxed max-w-3xl mx-auto">
                          {getStepDescription(step.step)}
                        </p>
                      </div>
                      
                      {/* Индикатор клика */}
                      <div className="text-center mt-8">
                        <p className="text-cyan-400/60 text-sm font-medium group-hover:text-cyan-300/80 transition-colors duration-300">
                          Нажмите для перехода к следующему шагу
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Taste Analysis */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">🧠 Анализ вкуса</h2>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <TasteSemicircles taste={recipe.taste} />
          </div>
        </section>

        {/* Social Functions - адаптивная компоновка */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Ваша оценка</h2>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          
          {/* Адаптивная компоновка для рейтинга и кнопок */}
          <div className="flex flex-col max-[800px]:space-y-0 min-[800px]:flex-row min-[800px]:items-center min-[800px]:justify-between min-[800px]:space-y-0">
            
            {/* Кнопка "В избранное" - слева на больших экранах */}
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
                <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'В избранном' : 'В избранное'}
              </Button>
            </div>

            {/* Рейтинг звездочками - по центру */}
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

            {/* Кнопка "Поделиться" - справа на больших экранах */}
            <div className="min-[800px]:order-3 max-[800px]:order-3 max-[800px]:w-[60%] max-[500px]:w-[80%] max-[800px]:mx-auto">
              <Button 
                className="bg-gradient-to-r from-neon-turquoise/20 to-electric/20 hover:from-neon-turquoise/30 hover:to-electric/30 backdrop-blur-sm border-2 border-cyan-400/50 px-6 py-3 text-base font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 w-full min-[800px]:w-auto min-[800px]:min-w-[160px]"
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(54, 152, 255, 0.2)'
                }}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Поделиться
              </Button>
            </div>
          </div>
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">🧬 Если понравилось — попробуй ещё</h2>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
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