import { lazy, Suspense, Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

// Синхронные компоненты - критически важные для первого рендера
import Header from "@/components/layout/header";
import HeroSection from "@/components/landing/HeroSection";

// Остальные секции загружаем лениво с обработкой ошибок
const FeaturesSection = lazy(() => 
  import("@/components/landing/FeaturesSection")
    .catch(() => ({ default: () => <ErrorFallback sectionName="Функции" /> }))
);

const PopularRecipesSection = lazy(() => 
  import("@/components/PopularRecipesSection")
    .catch(() => ({ default: () => <ErrorFallback sectionName="Популярные рецепты" /> }))
);

const CoursesSection = lazy(() => 
  import("@/components/landing/courses-section")
    .catch(() => ({ default: () => <ErrorFallback sectionName="Курсы" /> }))
);

const NewsletterSection = lazy(() => 
  import("@/components/landing/NewsletterSection")
    .catch(() => ({ default: () => <ErrorFallback sectionName="Новости" /> }))
);

const MobileAppSection = lazy(() => 
  import("@/components/landing/MobileAppSection")
    .catch(() => ({ default: () => <ErrorFallback sectionName="Мобильное приложение" /> }))
);

const FooterSection = lazy(() => 
  import("@/components/landing/FooterSection")
    .catch(() => ({ default: () => <ErrorFallback sectionName="Подвал" /> }))
);

// Простой Loading компонент
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-neon-turquoise/60 text-sm">Загрузка...</div>
    </div>
  );
}

// Error Fallback компонент для graceful degradation
function ErrorFallback({ sectionName }: { sectionName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-4xl mb-4">🍸</div>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        Не удалось загрузить раздел "{sectionName}"
      </p>
      <Button 
        onClick={() => window.location.reload()}
        variant="outline"
        size="sm"
      >
        Перезагрузить страницу
      </Button>
    </div>
  );
}

// Error Boundary для обработки ошибок рендеринга
class SectionErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[SectionErrorBoundary]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero загружается сразу - критически важен для первого экрана */}
      <HeroSection onGetStarted={() => { window.location.href = "/constructor"; }} />

      {/* Остальные секции загружаем лениво с обработкой ошибок */}
      <SectionErrorBoundary fallback={<ErrorFallback sectionName="Функции" />}>
        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>
      </SectionErrorBoundary>

      <SectionErrorBoundary fallback={<ErrorFallback sectionName="Популярные рецепты" />}>
        <Suspense fallback={<SectionLoader />}>
          <PopularRecipesSection />
        </Suspense>
      </SectionErrorBoundary>

      <SectionErrorBoundary fallback={<ErrorFallback sectionName="Курсы" />}>
        <Suspense fallback={<SectionLoader />}>
          <CoursesSection />
        </Suspense>
      </SectionErrorBoundary>

      <SectionErrorBoundary fallback={<ErrorFallback sectionName="Новости" />}>
        <Suspense fallback={<SectionLoader />}>
          <NewsletterSection />
        </Suspense>
      </SectionErrorBoundary>

      <SectionErrorBoundary fallback={<ErrorFallback sectionName="Мобильное приложение" />}>
        <Suspense fallback={<SectionLoader />}>
          <MobileAppSection />
        </Suspense>
      </SectionErrorBoundary>

      <SectionErrorBoundary fallback={<ErrorFallback sectionName="Подвал" />}>
        <Suspense fallback={<SectionLoader />}>
          <FooterSection />
        </Suspense>
      </SectionErrorBoundary>
    </div>
  );
}
