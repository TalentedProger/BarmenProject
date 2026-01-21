import { useState, useEffect, memo, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ArrowLeft, ArrowRight, Star, RefreshCw, Droplet, Percent, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

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

// Reduced to first 6 recipes for better performance
const popularRecipes: Recipe[] = [
  {
    id: 3,
    name: "Маргарита",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_classic_Margarita_cocktail_in_a_0_1753377591761.jpg",
    description: "Классика текилы с лаймом и солью",
    tags: ["Освежающий", "Кислый"],
    abv: 13,
    volume: 150,
    rating: 4.8,
    reviewCount: 315,
    difficulty: "Легко",
    flavor: { sweet: 1, sour: 4, bitter: 1, spicy: 0 },
    price: 230
  },
  {
    id: 1,
    name: "Мохито",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg",
    description: "Мята, лайм и ром — вечная классика",
    tags: ["Лёгкий", "Мятный"],
    abv: 10,
    volume: 200,
    rating: 4.9,
    reviewCount: 408,
    difficulty: "Легко",
    flavor: { sweet: 2, sour: 3, bitter: 1, spicy: 0 },
    price: 240
  },
  {
    id: 11,
    name: "Сангрия",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_vibrant_red_Sangria_in_a_large__1_1753377591760.jpg",
    description: "Фруктово-винный коктейль из Испании",
    tags: ["Фруктовый", "Яркий"],
    abv: 9,
    volume: 250,
    rating: 4.7,
    reviewCount: 289,
    difficulty: "Легко",
    flavor: { sweet: 4, sour: 2, bitter: 0, spicy: 0 },
    price: 260
  },
  {
    id: 12,
    name: "Апероль шприц",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_An_Aperol_Spritz_in_a_large_ballo_0_1753377591760.jpg",
    description: "Итальянская классика с апельсиновыми нотами",
    tags: ["Горьковатый", "Цитрус"],
    abv: 11,
    volume: 180,
    rating: 4.6,
    reviewCount: 198,
    difficulty: "Легко",
    flavor: { sweet: 2, sour: 2, bitter: 3, spicy: 0 },
    price: 220
  },
  {
    id: 6,
    name: "Пина Колада",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Pia_Colada_in_a_tall_hurricane__0_1753377591760.jpg",
    description: "Тропический рай из ананаса и кокоса",
    tags: ["Сладкий", "Кремовый"],
    abv: 10,
    volume: 200,
    rating: 4.9,
    reviewCount: 376,
    difficulty: "Средне",
    flavor: { sweet: 5, sour: 1, bitter: 0, spicy: 0 },
    price: 250
  },
  {
    id: 5,
    name: "Дайкири",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Daiquiri_in_a_sleek_cocktail_gl_0_1753377591759.jpg",
    description: "Минимализм с лаймом и ромом",
    tags: ["Кислый", "Крепкий"],
    abv: 14,
    volume: 120,
    rating: 4.8,
    reviewCount: 220,
    difficulty: "Средне",
    flavor: { sweet: 1, sour: 4, bitter: 1, spicy: 0 },
    price: 210
  }
  ,
  {
    id: 4,
    name: "Космополитен",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_bright_pink_Cosmopolitan_in_a_m_0_1753377591757.jpg",
    description: "Яркий кислo-сладкий коктейль с клюквой и лаймом",
    tags: ["Ягодный", "Кисло-сладкий"],
    abv: 12,
    volume: 150,
    rating: 4.7,
    reviewCount: 264,
    difficulty: "Средне",
    flavor: { sweet: 3, sour: 3, bitter: 0, spicy: 0 },
    price: 240
  },
  {
    id: 2,
    name: "Негрони",
    image: "/attached_assets/Flux_Dev_A_classic_Negroni_in_a_short_glass_with_a_large_ice_c_3_1753377591753.jpg",
    description: "Сбалансированная горчинка кампари, джина и вермута",
    tags: ["Горьковатый", "Аперитив"],
    abv: 16,
    volume: 120,
    rating: 4.6,
    reviewCount: 198,
    difficulty: "Средне",
    flavor: { sweet: 2, sour: 1, bitter: 4, spicy: 0 },
    price: 260
  }
];

const RecipeCard = memo(({ recipe, priority = false }: { recipe: Recipe; priority?: boolean }) => {
  return (
    <div className="recipe-card relative popular-card-wrapper group py-4" style={{ minHeight: '460px' }}>
      <Link href={`/recipe/${recipe.id}`}>
        <div 
          className="bg-[#1A1A1E] rounded-2xl overflow-hidden flex flex-col relative z-10 cursor-pointer"
          style={{ height: '460px' }}
        >
          {/* Background Image covering entire card */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "low"}
              decoding="async"
              width="400"
              height="460"
              style={{ transform: 'translateZ(0)' }}
            />
            {/* Enhanced gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 pointer-events-none" />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Tags - Apple-style stickers */}
            <div className="flex justify-between gap-2 px-4 py-4 max-[480px]:px-3 max-[480px]:py-3">
              {recipe.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className={`text-sm px-4 py-1.5 rounded-full text-white font-semibold whitespace-nowrap max-[480px]:text-xs max-[480px]:px-3 max-[480px]:py-1 flex-1 text-center ${
                    index === 0 ? 'bg-cyan-600/60' : 'bg-purple-600/60'
                  }`}
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
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-600/40">
                    <Droplet className="w-3.5 h-3.5 text-white" />
                  </span>
                  {recipe.volume} мл
                </span>
              </div>
              
              {/* Row 2: ABV */}
              <div className="flex items-center text-left">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/40">
                    <Percent className="w-3.5 h-3.5 text-white" />
                  </span>
                  {recipe.abv}%
                </span>
              </div>
              
              {/* Row 3: Цена */}
              <div className="flex items-center text-left">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600/40">
                    <Coins className="w-3.5 h-3.5 text-white" />
                  </span>
                  {recipe.price || '150'} ₽
                </span>
              </div>
              
              {/* Row 4: Рейтинг */}
              <div className="flex items-center space-x-2 text-left">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600/40">
                  <Star className="w-3.5 h-3.5 text-yellow-300" />
                </span>
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
}, (prev, next) => {
  return prev.recipe.id === next.recipe.id && prev.priority === next.priority;
});

RecipeCard.displayName = 'RecipeCard';

const PopularRecipesSection = memo(() => {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Display all recipes for swiper
  const displayedRecipes = useMemo(() => popularRecipes, []);

  // Compute initial centered slide index based on current viewport slidesPerView
  const initialSlideIndex = useMemo(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const spv = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
    return Math.floor(spv / 2); // 3->1 (2-я), 2->1 (2-я), 1->0
  }, []);

  // Keep the centered slide correct on resize
  useEffect(() => {
    if (!swiperRef) return;
    const recenter = () => {
      const w = window.innerWidth;
      const spv = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
      const target = Math.floor(spv / 2);
      if (typeof swiperRef.slideTo === 'function') {
        swiperRef.slideTo(target, 0);
      }
    };
    // initial micro delay to let Swiper compute sizes
    const id = window.setTimeout(recenter, 50);
    window.addEventListener('resize', recenter, { passive: true } as any);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', recenter as any);
    };
  }, [swiperRef]);

  // Pause autoplay when section is offscreen or tab is hidden (performance)
  useEffect(() => {
    if (!swiperRef) return;
    const autoplay = swiperRef.autoplay;
    if (!autoplay) return;

    const handleVisibility = () => {
      if (!swiperRef?.autoplay) return;
      if (document.hidden) swiperRef.autoplay.stop();
      else swiperRef.autoplay.start();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (sectionRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!swiperRef?.autoplay) return;
          if (entry.isIntersecting) swiperRef.autoplay.start();
          else swiperRef.autoplay.stop();
        },
        { root: null, threshold: 0.2 }
      );
      observer.observe(sectionRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
    };
  }, [swiperRef]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section ref={sectionRef as any} className="py-12 bg-[#0C0C0F] relative overflow-visible max-[480px]:py-8">
      {/* Background gradient effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 blur-sm" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 blur-sm" />
      </div>
      <div className="container mx-auto px-6 relative z-10 max-w-7xl max-[480px]:px-4">
        {/* Section Title */}
        <div className="text-center mb-10 max-[480px]:mb-4">
          <h2 className="text-4xl font-bold text-[#00FFF0] mb-4 max-[480px]:text-2xl max-[480px]:mb-2">
            Популярные рецепты коктейлей
          </h2>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          onSwiper={setSwiperRef}
          modules={[Navigation, Autoplay]}
          grabCursor={!isMobile}
          centeredSlides={true}
          centeredSlidesBounds={true}
          loop={false}
          speed={isMobile ? 200 : 300}
          preventInteractionOnTransition={false}
          touchRatio={isMobile ? 1.2 : 0.8}
          threshold={isMobile ? 5 : 10}
          resistance={true}
          resistanceRatio={0.85}
          allowTouchMove={true}
          slidesPerView={1}
          spaceBetween={20}
          initialSlide={initialSlideIndex}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          rewind={true}
          cssMode={isMobile}
          touchStartPreventDefault={false}
          touchMoveStopPropagation={false}
          followFinger={true}
          freeMode={false}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 30,
              cssMode: false,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
              cssMode: false,
            },
          }}
          watchSlidesProgress={false}
          observer={false}
          observeParents={false}
          updateOnWindowResize={true}
          resizeObserver={false}
          passiveListeners={true}
          className="popular-recipes-swiper mb-8 max-[480px]:mb-4"
        >
          {displayedRecipes.map((recipe, index) => (
            <SwiperSlide key={recipe.id}>
              <RecipeCard recipe={recipe} priority={index === initialSlideIndex} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile Swipe Hint */}
        <div className="hidden max-[480px]:flex justify-center mt-4">
          <p className="text-sm font-medium text-center text-white">
            Свайпните для перехода к другому коктейлю
          </p>
        </div>

        {/* Navigation Arrows + Catalog CTA */}
        <div className="flex justify-center items-center gap-10 mt-5 max-[480px]:hidden">
          <button
            onClick={() => swiperRef?.slidePrev()}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 max-[480px]:p-3"
          >
            <ArrowLeft className="w-6 h-6 text-white max-[480px]:w-5 max-[480px]:h-5" />
          </button>
          {/* Catalog CTA in between arrows */}
          <Button asChild variant="ghost" className="neon-outline-amber rounded-full px-8 py-3.5 text-base font-semibold tracking-wide">
            <Link href="/catalog">Перейти в каталог</Link>
          </Button>

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
});

PopularRecipesSection.displayName = 'PopularRecipesSection';

export default PopularRecipesSection;