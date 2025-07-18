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
    flavor: { sweet: 4, sour: 3, bitter: 1, spicy: 0 }
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
    flavor: { sweet: 1, sour: 2, bitter: 4, spicy: 2 }
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
    flavor: { sweet: 5, sour: 2, bitter: 0, spicy: 1 }
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
    flavor: { sweet: 2, sour: 4, bitter: 1, spicy: 0 }
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
    flavor: { sweet: 2, sour: 3, bitter: 2, spicy: 4 }
  }
];

const FlavorBar = ({ level, max = 5 }: { level: number; max?: number }) => (
  <div className="flex space-x-1">
    {Array.from({ length: max }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < level ? 'bg-neon-turquoise' : 'bg-gray-600'
        }`}
      />
    ))}
  </div>
);

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="recipe-card bg-[#1A1A1E] rounded-2xl shadow-lg shadow-pink-500/20 hover:shadow-cyan-500/30 transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-white text-2xl font-semibold">{recipe.name}</h3>
        
        {/* Description */}
        <p className="text-zinc-300 text-base italic">{recipe.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-zinc-200 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Flavor Profile */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-200">🍬 Сладкий</span>
            <FlavorBar level={recipe.flavor.sweet} />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-200">🍋 Кислый</span>
            <FlavorBar level={recipe.flavor.sour} />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-200">🫖 Горький</span>
            <FlavorBar level={recipe.flavor.bitter} />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-200">🌶️ Острый</span>
            <FlavorBar level={recipe.flavor.spicy} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-base text-zinc-200 font-medium">
          <span>🍹 ABV: {recipe.abv}%</span>
          <span>💧 {recipe.volume} мл</span>
        </div>

        {/* Rating */}
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

        {/* Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-black font-medium rounded-full px-4 py-2 hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
          >
            Открыть рецепт
          </Button>
          <Button
            variant="outline"
            className="px-3 py-2 border-neon-turquoise text-neon-turquoise hover:bg-neon-turquoise hover:text-night-blue rounded-full transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function PopularRecipesSection() {
  const [swiperRef, setSwiperRef] = useState<any>(null);

  return (
    <section className="py-16 bg-[#0C0C0F] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 blur-sm" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 blur-sm" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F1F1F1] mb-4" 
              style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
            Популярные рецепты коктейлей
          </h2>
          <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 blur-sm" />
        </div>

        {/* Swiper Carousel */}
        <Swiper
          onSwiper={setSwiperRef}
          modules={[Navigation, Autoplay]}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={1}
          spaceBetween={30}
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