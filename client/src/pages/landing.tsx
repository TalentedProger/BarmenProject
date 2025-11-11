import { lazy, Suspense, useCallback, memo } from "react";
import Header from "@/components/layout/header";

// Lazy load компонентов для оптимизации
const HeroSection = lazy(() => import("@/components/landing/HeroSection"));
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection"));
const PopularRecipesSection = lazy(() => import("@/components/PopularRecipesSection"));
const CoursesSection = lazy(() => import("@/components/landing/courses-section"));
const NewsletterSection = lazy(() => import("@/components/landing/NewsletterSection"));
const MobileAppSection = lazy(() => import("@/components/landing/MobileAppSection"));
const FooterSection = lazy(() => import("@/components/landing/FooterSection"));

// Loading компонент
const SectionLoader = memo(() => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-turquoise"></div>
  </div>
));
SectionLoader.displayName = "SectionLoader";

function Landing() {
  const handleGetStarted = useCallback(() => {
    window.location.href = "/constructor";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header useProfileDropdown={false} />

      <Suspense fallback={<SectionLoader />}>
        <HeroSection onGetStarted={handleGetStarted} />
      </Suspense>

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
