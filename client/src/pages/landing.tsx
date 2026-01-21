import { lazy, Suspense, useCallback, memo, useEffect, useRef, useState } from "react";
import PublicHeader from "@/components/layout/public-header";

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

function LazyOnVisible({
  children,
  minHeight = 240,
  rootMargin = "200px",
}: {
  children: React.ReactNode;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsVisible(true);
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight }}>
      {isVisible ? <Suspense fallback={<SectionLoader />}>{children}</Suspense> : null}
    </div>
  );
}

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
      <PublicHeader />

      {/* Hero загружается сразу - критически важен для первого экрана */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Остальные секции: реально грузим только когда пользователь докрутил */}
      <LazyOnVisible minHeight={260}>
        <FeaturesSection />
      </LazyOnVisible>

      <LazyOnVisible minHeight={340}>
        <PopularRecipesSection />
      </LazyOnVisible>

      <LazyOnVisible minHeight={300}>
        <CoursesSection />
      </LazyOnVisible>

      <LazyOnVisible minHeight={260}>
        <NewsletterSection />
      </LazyOnVisible>

      <LazyOnVisible minHeight={260}>
        <MobileAppSection />
      </LazyOnVisible>

      <LazyOnVisible minHeight={240} rootMargin="600px">
        <FooterSection />
      </LazyOnVisible>
    </div>
  );
}

export default memo(Landing);
