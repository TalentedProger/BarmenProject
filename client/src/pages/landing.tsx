import { lazy, Suspense, useCallback, memo, useEffect, useRef, useState } from "react";

// Header lazy loaded для быстрого первого рендера
const Header = lazy(() => import("@/components/layout/header"));

// Критически важные компоненты загружаем сразу
import HeroSection from "@/components/landing/HeroSection";

// Остальные секции загружаем лениво
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection"));
const PopularRecipesSection = lazy(() => import("@/components/PopularRecipesSection"));
const CoursesSection = lazy(() => import("@/components/landing/courses-section"));
const NewsletterSection = lazy(() => import("@/components/landing/NewsletterSection"));
const MobileAppSection = lazy(() => import("@/components/landing/MobileAppSection"));
const FooterSection = lazy(() => import("@/components/landing/FooterSection"));

// Placeholder для header пока грузится
const HeaderPlaceholder = memo(() => (
  <header style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '72px',
    background: '#121215',
    borderBottom: '1px solid #2a2a2e',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px'
  }}>
    <div style={{ color: '#00D9FF', fontSize: '20px', fontWeight: 500 }}>🍸 Cocktailo Maker</div>
  </header>
));
HeaderPlaceholder.displayName = 'HeaderPlaceholder';

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
  const handleGetStarted = useCallback(() => {
    window.location.href = "/constructor";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<HeaderPlaceholder />}>
        <Header />
      </Suspense>

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
