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
    name: "Ананасовый дайкири",
    image: "/attached_assets/Leonardo_Phoenix_10_A_modern_elegant_cocktail_in_a_coupe_glass_3_1752844466369.jpg",
    description: "Тропический микс с ромом и ананасом",
    tags: ["🌴 Лёгкий", "🍋 Кислый", "🍬 Сладкий"],
    abv: 12,
    volume: 160,
    rating: 4.2,
    reviewCount: 145,
    difficulty: "Легко",
    flavor: { sweet: 4, sour: 3, bitter: 1, spicy: 0 },
    price: 180
  },
  {
    id: 2,
    name: "Неоновый мартини",
    image: "/attached_assets/Leonardo_Phoenix_10_A_closeup_of_a_crystalclear_Old_Fashioned_1_1752844466371.jpg",
    description: "Классический мартини с неоновым твистом",
    tags: ["⚡ Крепкий", "🍸 Горький", "🔥 Пряный"],
    abv: 18,
    volume: 120,
    rating: 4.7,
    reviewCount: 89,
    difficulty: "Средне",
    flavor: { sweet: 1, sour: 2, bitter: 4, spicy: 2 },
    price: 220
  },
  {
    id: 3,
    name: "Космический пунш",
    image: "/attached_assets/Leonardo_Phoenix_10_A_vibrant_colorful_cocktail_in_a_tall_hurr_1_1752844466371.jpg",
    description: "Многослойный коктейль с градиентом",
    tags: ["🌈 Яркий", "🍬 Сладкий", "🍓 Фруктовый"],
    abv: 8,
    volume: 200,
    rating: 4.5,
    reviewCount: 203,
    difficulty: "Сложно",
    flavor: { sweet: 5, sour: 2, bitter: 0, spicy: 1 },
    price: 250
  },
  {
    id: 4,
    name: "Электрик блю",
    image: "/attached_assets/Leonardo_Phoenix_10_A_modern_elegant_cocktail_in_a_coupe_glass_3_1752844509292.jpg",
    description: "Синий коктейль с электрическим эффектом",
    tags: ["⚡ Энергичный", "🍋 Цитрус", "❄️ Освежающий"],
    abv: 15,
    volume: 180,
    rating: 4.3,
    reviewCount: 167,
    difficulty: "Средне",
    flavor: { sweet: 2, sour: 4, bitter: 1, spicy: 0 },
    price: 200
  },
  {
    id: 5,
    name: "Огненный закат",
    image: "/attached_assets/b2ced5a6-3173-4934-b60f-e27b59441390_1752844476725.jpg",
    description: "Теплый коктейль с градиентом заката",
    tags: ["🔥 Острый", "🍊 Цитрус", "🌶️ Пряный"],
    abv: 16,
    volume: 150,
    rating: 4.6,
    reviewCount: 124,
    difficulty: "Средне",
    flavor: { sweet: 2, sour: 3, bitter: 2, spicy: 4 },
    price: 190
  }
];

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="recipe-card relative">
      <div 
        className="bg-[#1A1A1E] rounded-2xl transition-all duration-200 ease-out overflow-hidden group h-[520px] flex flex-col relative z-10 will-change-auto"
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
            className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-200 ease-out group-hover:scale-105 will-change-transform"
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
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-white text-2xl font-semibold">{recipe.name}</h3>
          
          {/* Description */}
          <p className="text-zinc-300 text-base italic">{recipe.description}</p>

          {/* Tags - Fixed height to prevent layout shift */}
          <div className="flex flex-wrap gap-2 min-h-[60px] items-start content-start pt-[6px] pb-[6px]">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-zinc-200 font-medium whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats in column */}
          <div className="space-y-2 text-base text-zinc-200 font-medium">
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
    <section className="py-24 bg-[#0C0C0F] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 blur-sm" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 blur-sm" />
      </div>
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="md:text-5xl font-bold text-[#F1F1F1] mb-4 text-[40px]" 
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
          className="popular-recipes-swiper mb-8"
        >
          {popularRecipes.map((recipe) => (
            <SwiperSlide key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={() => swiperRef?.slidePrev()}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={() => swiperRef?.slideNext()}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}