import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ArrowLeft, ArrowRight, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import OptimizedImage from '@/components/ui/optimized-image';

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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_classic_Margarita_cocktail_in_a_0_1753377591761.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_vibrant_red_Sangria_in_a_large__1_1753377591760.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_An_Aperol_Spritz_in_a_large_ballo_0_1753377591760.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Pia_Colada_in_a_tall_hurricane__0_1753377591760.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Daiquiri_in_a_sleek_cocktail_gl_0_1753377591759.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_deep_amber_Manhattan_in_a_short_0_1753377591759.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_vibrant_orange_Martini_Fiero__T_1_1753377591758.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_layered_B52_shot_in_a_small_sho_3_1753377591758.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_bright_pink_Cosmopolitan_in_a_m_0_1753377591757.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_White_Russian_in_a_short_glass__2_1753377591757.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Long_Island_Iced_Tea_in_a_tall__1_1753377591756.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Cuba_Libre_in_a_tall_glass_dark_2_1753377591756.jpg",
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
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Tequila_Sunrise_in_a_tall_glass_2_1753377591754.jpg",
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
    image: "/attached_assets/Flux_Dev_A_classic_Negroni_in_a_short_glass_with_a_large_ice_c_3_1753377591753.jpg",
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
      <Link href={`/recipe/${recipe.id}`}>
        <div 
          className="bg-[#1A1A1E] rounded-2xl transition-all duration-200 ease-out overflow-hidden group h-[460px] flex flex-col relative z-10 will-change-auto max-[480px]:h-[420px] max-[480px]:w-[85%] max-[480px]:mx-auto cursor-pointer"
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
          {/* Background Image covering entire card */}
          <div className="absolute inset-0 overflow-hidden will-change-transform rounded-2xl">
            <OptimizedImage
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-105 will-change-transform"
              loading="lazy"
              quality="medium"
              placeholder="skeleton"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
              style={{
                transform: 'translateZ(0)', // Force hardware acceleration
                contentVisibility: 'auto', // Optimize rendering
              }}
            />
            {/* Enhanced gradient overlay for better text readability - always visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 pointer-events-none" />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Tags - переносим в верхнюю часть, ограничиваем двумя тегами, выровнены по ширине */}
            <div className="flex justify-between px-4 py-4 max-[480px]:px-3 max-[480px]:py-3">
              {recipe.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-sm bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium whitespace-nowrap max-[480px]:text-xs max-[480px]:px-2 border border-white/20 flex-1 text-center mx-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Main spacer - takes up remaining space */}
            <div className="flex-1"></div>

            {/* Stats container - уменьшенный размер текста */}
            <div className="space-y-1.5 text-base text-white font-semibold max-[480px]:text-sm px-4 py-3 max-[480px]:px-3 max-[480px]:py-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              {/* Row 1: Объем */}
              <div className="flex items-center text-left">
                <span>💧 {recipe.volume} мл</span>
              </div>
              
              {/* Row 2: ABV */}
              <div className="flex items-center text-left">
                <span>🍹 {recipe.abv}%</span>
              </div>
              
              {/* Row 3: Цена */}
              <div className="flex items-center text-left">
                <span>💰 {recipe.price || '150'} ₽</span>
              </div>
              
              {/* Row 4: Рейтинг */}
              <div className="flex items-center space-x-2 text-left">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 max-[480px]:w-3.5 max-[480px]:h-3.5 ${
                        i < Math.floor(recipe.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-white/40'
                      }`}
                      style={{ filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))' }}
                    />
                  ))}
                </div>
                <span className="text-sm text-white font-medium max-[480px]:text-xs" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>({recipe.reviewCount})</span>
              </div>
            </div>

            {/* Title and Description container - перенесен в нижнюю часть */}
            <div className="bg-black/40 backdrop-blur-sm rounded-b-2xl p-3 max-[480px]:p-2.5 border-t border-white/10 text-center">
              {/* Title */}
              <h3 className="text-white text-xl font-bold max-[480px]:text-lg drop-shadow-lg mb-0.5">{recipe.name}</h3>
              
              {/* Description - Compact height */}
              <div className="h-8 flex items-center justify-center max-[480px]:h-6">
                <p className="text-white/90 text-sm italic leading-tight max-[480px]:text-xs line-clamp-2 drop-shadow-md mb-0">{recipe.description}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function PopularRecipesSection() {
  const [swiperRef, setSwiperRef] = useState<any>(null);

  return (
    <section className="py-12 bg-[#0C0C0F] relative overflow-hidden max-[480px]:py-8">
      {/* Background gradient effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 blur-sm" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 blur-sm" />
      </div>
      <div className="container mx-auto px-6 relative z-10 max-w-7xl max-[480px]:px-4">
        {/* Section Title */}
        <div className="text-center mb-10 max-[480px]:mb-4">
          <h2 className="md:text-5xl font-bold text-[#F1F1F1] mb-4 text-[40px] max-[480px]:text-2xl max-[480px]:mb-2" 
              style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
            Популярные рецепты коктейлей
          </h2>
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400 max-[480px]:w-12" />
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
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="popular-recipes-swiper mb-8 max-[480px]:mb-4"
        >
          {popularRecipes.map((recipe) => (
            <SwiperSlide key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-6 mt-5 max-[480px]:gap-3 max-[480px]:mt-2">
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