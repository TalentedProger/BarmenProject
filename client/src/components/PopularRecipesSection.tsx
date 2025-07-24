import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ArrowLeft, ArrowRight, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

interface Recipe {
  id: number;
  name: string;
  image: string;
  description: string;
  tags: string[];
  abv: number;
  volume: number;
  rating: number;
  reviewCount: number;
  difficulty: string;
  flavor: {
    sweet: number;
    sour: number;
    bitter: number;
    spicy: number;
  };
  price?: number;
}

const popularRecipes: Recipe[] = [
  {
    id: 1,
    name: "Маргарита",
    image: "/attached_assets/Leonardo_Phoenix_10_A_modern_elegant_cocktail_in_a_coupe_glass_3_1752844466369.jpg",
    description: "Классика текилы с лаймом и солью",
    tags: ["❄️ Освежающий", "🍋 Кислый", "⚡ Крепкий"],
    abv: 13,
    volume: 150,
    rating: 4.8,
    reviewCount: 315,
    difficulty: "Легко",
    flavor: { sweet: 1, sour: 4, bitter: 1, spicy: 0 },
    price: 230
  },
  {
    id: 2,
    name: "Мохито",
    image: "/attached_assets/Leonardo_Phoenix_10_A_closeup_of_a_crystalclear_Old_Fashioned_1_1752844466371.jpg",
    description: "Мята, лайм и ром — вечная классика",
    tags: ["🌿 Лёгкий", "🌿 Мятный", "❄️ Освежающий"],
    abv: 10,
    volume: 200,
    rating: 4.9,
    reviewCount: 408,
    difficulty: "Легко",
    flavor: { sweet: 2, sour: 3, bitter: 1, spicy: 0 },
    price: 240
  },
  {
    id: 3,
    name: "Сангрия",
    image: "/attached_assets/Leonardo_Phoenix_10_A_vibrant_colorful_cocktail_in_a_tall_hurr_1_1752844466371.jpg",
    description: "Фруктово-винный коктейль из Испании",
    tags: ["🍓 Фруктовый", "🌿 Лёгкий", "🌈 Яркий"],
    abv: 9,
    volume: 250,
    rating: 4.7,
    reviewCount: 289,
    difficulty: "Легко",
    flavor: { sweet: 4, sour: 2, bitter: 0, spicy: 0 },
    price: 260
  },
  {
    id: 4,
    name: "Апероль шприц",
    image: "/attached_assets/Leonardo_Phoenix_10_A_modern_elegant_cocktail_in_a_coupe_glass_3_1752844509292.jpg",
    description: "Итальянская классика с апельсиновыми нотами",
    tags: ["🍸 Горьковатый", "🍊 Цитрус", "❄️ Освежающий"],
    abv: 11,
    volume: 180,
    rating: 4.6,
    reviewCount: 198,
    difficulty: "Легко",
    flavor: { sweet: 2, sour: 2, bitter: 3, spicy: 0 },
    price: 220
  },
  {
    id: 5,
    name: "Пина Колада",
    image: "/attached_assets/b2ced5a6-3173-4934-b60f-e27b59441390_1752844476725.jpg",
    description: "Тропический рай из ананаса и кокоса",
    tags: ["🍬 Сладкий", "🥥 Кремовый", "🌴 Экзотический"],
    abv: 10,
    volume: 200,
    rating: 4.9,
    reviewCount: 376,
    difficulty: "Средне",
    flavor: { sweet: 5, sour: 1, bitter: 0, spicy: 0 },
    price: 250
  },
  {
    id: 6,
    name: "Дайкири",
    image: "/attached_assets/7b2e9f21-5799-4ec1-94a8-77404805e855_1752844481467.jpg",
    description: "Минимализм с лаймом и ромом",
    tags: ["🍋 Кислый", "⚡ Крепкий", "🍊 Цитрус"],
    abv: 14,
    volume: 120,
    rating: 4.8,
    reviewCount: 220,
    difficulty: "Средне",
    flavor: { sweet: 1, sour: 4, bitter: 1, spicy: 0 },
    price: 210
  },
  {
    id: 7,
    name: "Манхэттен",
    image: "/attached_assets/4a3bc8c8-d8eb-45e6-89a3-f706db11a5d3_1752844471093.jpg",
    description: "Горький и сильный коктейль с вермутом",
    tags: ["⚡ Крепкий", "🍸 Горький", "🔥 Пряный"],
    abv: 18,
    volume: 90,
    rating: 4.7,
    reviewCount: 185,
    difficulty: "Сложно",
    flavor: { sweet: 1, sour: 1, bitter: 4, spicy: 2 },
    price: 240
  },
  {
    id: 8,
    name: "Мартини Фиеро Тоник",
    image: "/attached_assets/6d059335-5b16-412d-b1e0-9d4fdec2fabd_1752844498127.jpg",
    description: "Лёгкий коктейль на базе апельсинового мартини",
    tags: ["🌿 Лёгкий", "🍊 Цитрус", "💫 Пузырьки"],
    abv: 8,
    volume: 180,
    rating: 4.5,
    reviewCount: 130,
    difficulty: "Легко",
    flavor: { sweet: 2, sour: 2, bitter: 2, spicy: 0 },
    price: 200
  },
  {
    id: 9,
    name: "Б-52",
    image: "/attached_assets/7b0cd4c3-110f-469e-8f73-624886a09247_1752844490867.jpg",
    description: "Слоистый шот с ликёрами",
    tags: ["🍬 Сладкий", "🥃 Шот", "🥛 Густой"],
    abv: 22,
    volume: 50,
    rating: 4.6,
    reviewCount: 165,
    difficulty: "Сложно",
    flavor: { sweet: 4, sour: 0, bitter: 1, spicy: 0 },
    price: 180
  },
  {
    id: 10,
    name: "Космополитен",
    image: "/attached_assets/Leonardo_Phoenix_10_A_modern_elegant_cocktail_in_a_coupe_glass_3_1752844466369.jpg",
    description: "Яркий коктейль с клюквой и лаймом",
    tags: ["🌈 Яркий", "🍓 Фруктовый", "💃 Женственный"],
    abv: 13,
    volume: 130,
    rating: 4.8,
    reviewCount: 203,
    difficulty: "Средне",
    flavor: { sweet: 3, sour: 3, bitter: 1, spicy: 0 },
    price: 210
  },
  {
    id: 11,
    name: "Белый русский",
    image: "/attached_assets/Leonardo_Phoenix_10_A_closeup_of_a_crystalclear_Old_Fashioned_1_1752844466371.jpg",
    description: "Кофейно-сливочный коктейль на водке",
    tags: ["🥛 Сливочный", "⚡ Крепкий", "🍮 Десертный"],
    abv: 20,
    volume: 120,
    rating: 4.7,
    reviewCount: 157,
    difficulty: "Легко",
    flavor: { sweet: 4, sour: 0, bitter: 1, spicy: 0 },
    price: 230
  },
  {
    id: 12,
    name: "Лонг Айленд Айс Ти",
    image: "/attached_assets/Leonardo_Phoenix_10_A_vibrant_colorful_cocktail_in_a_tall_hurr_1_1752844466371.jpg",
    description: "Мощный коктейль из 5 спиртов",
    tags: ["⚡ Крепкий", "🍊 Цитрус", "🧊 Лёд"],
    abv: 22,
    volume: 250,
    rating: 4.9,
    reviewCount: 432,
    difficulty: "Сложно",
    flavor: { sweet: 2, sour: 3, bitter: 1, spicy: 1 },
    price: 270
  },
  {
    id: 13,
    name: "Куба либре",
    image: "/attached_assets/Leonardo_Phoenix_10_A_modern_elegant_cocktail_in_a_coupe_glass_3_1752844509292.jpg",
    description: "Кола + ром + лайм — просто и эффектно",
    tags: ["🥂 Классика", "💫 Газированный", "⚡ Крепкий"],
    abv: 12,
    volume: 200,
    rating: 4.6,
    reviewCount: 188,
    difficulty: "Легко",
    flavor: { sweet: 3, sour: 2, bitter: 1, spicy: 0 },
    price: 220
  },
  {
    id: 14,
    name: "Текила Санрайз",
    image: "/attached_assets/b2ced5a6-3173-4934-b60f-e27b59441390_1752844476725.jpg",
    description: "Солнечный градиент апельсина и гренадина",
    tags: ["🌈 Яркий", "🍊 Цитрус", "🌴 Экзотика"],
    abv: 13,
    volume: 160,
    rating: 4.8,
    reviewCount: 294,
    difficulty: "Средне",
    flavor: { sweet: 4, sour: 2, bitter: 0, spicy: 0 },
    price: 230
  },
  {
    id: 15,
    name: "Негрони",
    image: "/attached_assets/7b2e9f21-5799-4ec1-94a8-77404805e855_1752844481467.jpg",
    description: "Горький и стильный коктейль с джином",
    tags: ["⚡ Крепкий", "🍸 Горький", "🍷 Аперитив"],
    abv: 20,
    volume: 100,
    rating: 4.5,
    reviewCount: 162,
    difficulty: "Средне",
    flavor: { sweet: 1, sour: 1, bitter: 5, spicy: 1 },
    price: 250
  }
];

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="recipe-card relative">
      <div 
        className="bg-[#1A1A1E] rounded-2xl transition-all duration-200 ease-out overflow-hidden group h-[520px] flex flex-col relative z-10 will-change-auto max-[480px]:h-[480px] max-[480px]:w-[85%] max-[480px]:mx-auto"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.15)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.25))',
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden', // Prevent flickering
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'drop-shadow(0 0 16px rgba(6, 182, 212, 0.2)) drop-shadow(0 6px 24px rgba(0, 0, 0, 0.3))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.15)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.25))';
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden will-change-transform">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-56 object-cover rounded-t-2xl transition-transform duration-200 ease-out group-hover:scale-105 will-change-transform max-[480px]:h-44"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            style={{
              transform: 'translateZ(0)', // Force hardware acceleration
              contentVisibility: 'auto', // Optimize rendering
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex-1 flex flex-col max-[480px]:p-3 max-[480px]:space-y-2">
          {/* Title */}
          <h3 className="text-white text-2xl font-semibold max-[480px]:text-xl">{recipe.name}</h3>
          
          {/* Description - Fixed height for consistency */}
          <div className="h-12 flex items-center max-[480px]:h-10">
            <p className="text-zinc-300 text-base italic leading-tight max-[480px]:text-sm line-clamp-2">{recipe.description}</p>
          </div>

          {/* Tags - Fixed height to prevent layout shift */}
          <div className="flex flex-wrap gap-2 min-h-[60px] items-start content-start pt-[6px] pb-[6px] max-[480px]:min-h-[50px] max-[480px]:gap-1">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-zinc-200 font-medium whitespace-nowrap max-[480px]:text-xs max-[480px]:px-2"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats in column */}
          <div className="space-y-2 text-base text-zinc-200 font-medium max-[480px]:space-y-1 max-[480px]:text-sm">
            <div className="flex items-center">
              <span>🍹 ABV: {recipe.abv}%</span>
            </div>
            <div className="flex items-center">
              <span>💧 Объем: {recipe.volume} мл</span>
            </div>
            <div className="flex items-center">
              <span>💰 Цена: {recipe.price || '150'} ₽</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(recipe.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-500'
                    }`}
                  />
                ))}
              </div>
              <span className="text-base text-zinc-300 font-medium">({recipe.reviewCount})</span>
            </div>
          </div>

          {/* Single centered button - Push to bottom */}
          <div className="flex justify-center pt-4 mt-auto">
            <Button
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-lg px-8 py-3 hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 ease-out shadow-lg hover:shadow-xl will-change-transform"
              style={{
                transform: 'translateZ(0)', // Force hardware acceleration
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateZ(0) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateZ(0) scale(1)';
              }}
            >
              Открыть рецепт
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PopularRecipesSection() {
  const [swiperRef, setSwiperRef] = useState<any>(null);

  return (
    <section className="py-24 bg-[#0C0C0F] relative overflow-hidden max-[480px]:py-16">
      {/* Background gradient effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 blur-sm" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 blur-sm" />
      </div>
      <div className="container mx-auto px-6 relative z-10 max-w-7xl max-[480px]:px-3">
        {/* Section Title */}
        <div className="text-center mb-10 max-[480px]:mb-6">
          <h2 className="md:text-5xl font-bold text-[#F1F1F1] mb-4 text-[40px] max-[480px]:text-2xl" 
              style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
            Популярные рецепты коктейлей
          </h2>
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400" />
        </div>

        {/* Swiper Carousel */}
        <Swiper
          onSwiper={setSwiperRef}
          modules={[Navigation, Autoplay]}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={1}
          spaceBetween={30}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          className="popular-recipes-swiper mb-8 max-[480px]:mb-6"
        >
          {popularRecipes.map((recipe) => (
            <SwiperSlide key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-6 mt-5 max-[480px]:gap-4 max-[480px]:mt-1">
          <button
            onClick={() => swiperRef?.slidePrev()}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 max-[480px]:p-3"
          >
            <ArrowLeft className="w-6 h-6 text-white max-[480px]:w-5 max-[480px]:h-5" />
          </button>
          
          <button
            onClick={() => swiperRef?.slideNext()}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 max-[480px]:p-3"
          >
            <ArrowRight className="w-6 h-6 text-white max-[480px]:w-5 max-[480px]:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}