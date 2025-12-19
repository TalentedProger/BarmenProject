import { lazy, Suspense, useCallback, memo, useEffect } from "react";
import Header from "@/components/layout/header";

console.log('[LOAD] landing.tsx module loading...');

// Критически важные компоненты загружаем сразу
import HeroSection from "@/components/landing/HeroSection";

console.log('[LOAD] HeroSection imported');

// Остальные секции загружаем лениво
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection"));
const PopularRecipesSection = lazy(() => import("@/components/PopularRecipesSection"));
const CoursesSection = lazy(() => import("@/components/landing/courses-section"));
const NewsletterSection = lazy(() => import("@/components/landing/NewsletterSection"));
const MobileAppSection = lazy(() => import("@/components/landing/MobileAppSection"));
const FooterSection = lazy(() => import("@/components/landing/FooterSection"));

// Простой Loading компонент без анимаций для мобильных
const SectionLoader = memo(() => (
  <div className="flex items-center justify-center py-16">
    <div className="text-neon-turquoise/60 text-sm">Загрузка...</div>
  </div>
));
SectionLoader.displayName = "SectionLoader";

function Landing() {
  useEffect(() => {
    console.log('[LOAD] Landing component mounted');
  }, []);

  console.log('[LOAD] Landing rendering...');

  const handleGetStarted = useCallback(() => {
    window.location.href = "/constructor";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header useProfileDropdown={false} />

      {/* Hero загружается сразу - критически важен для первого экрана */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Остальные секции загружаются по мере прокрутки */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PopularRecipesSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <CoursesSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <NewsletterSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <MobileAppSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FooterSection />
      </Suspense>
    </div>
  );
}

export default memo(Landing);
