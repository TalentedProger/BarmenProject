import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";

console.log('[LOAD] App.tsx module loaded');

// Landing загружаем сразу - это главная страница
import Landing from "@/pages/landing";

console.log('[LOAD] Landing imported');

// Lazy load остальные страницы для code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
const Constructor = lazy(() => import("@/pages/constructor"));
const Generator = lazy(() => import("@/pages/generator"));
const Catalog = lazy(() => import("@/pages/catalog"));
const Profile = lazy(() => import("@/pages/profile"));
const Auth = lazy(() => import("@/pages/auth"));
const RecipePage = lazy(() => import("@/pages/RecipePage"));
const UserRecipePage = lazy(() => import("@/pages/UserRecipePage"));
const Favorites = lazy(() => import("@/pages/favorites"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const Courses = lazy(() => import("@/pages/courses"));
const CourseMixologyBasics = lazy(() => import("@/pages/course-mixology-basics"));
const CourseModule1 = lazy(() => import("@/pages/courses/module1"));

// Простой загрузчик без анимаций для мобильных
const PageLoader = () => (
  <div className="min-h-screen bg-night-blue flex items-center justify-center">
    <div className="text-neon-turquoise text-lg">Загрузка...</div>
  </div>
);

// Обёртка для lazy компонентов
const LazyRoute = ({ component: Component, ...props }: { component: React.LazyExoticComponent<any>; path?: string }) => (
  <Route {...props}>
    {() => (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    )}
  </Route>
);

function Router() {
  return (
    <Switch>
      {/* Landing грузится сразу без Suspense */}
      <Route path="/" component={Landing} />
      {/* Остальные страницы lazy loaded с Suspense */}
      <LazyRoute path="/auth" component={Auth} />
      <LazyRoute path="/home" component={Home} />
      <LazyRoute path="/constructor" component={Constructor} />
      <LazyRoute path="/generator" component={Generator} />
      <LazyRoute path="/catalog" component={Catalog} />
      <LazyRoute path="/profile" component={Profile} />
      <LazyRoute path="/favorites" component={Favorites} />
      <LazyRoute path="/recipe/:id" component={RecipePage} />
      <LazyRoute path="/user-recipe/:id" component={UserRecipePage} />
      <LazyRoute path="/admin" component={AdminDashboard} />
      <LazyRoute path="/courses" component={Courses} />
      <LazyRoute path="/course/mixology-basics" component={CourseMixologyBasics} />
      <LazyRoute path="/course/mixology-basics/module/:moduleId" component={CourseModule1} />
      {/* 404 - отдельно в конце */}
      <LazyRoute component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    console.log('[LOAD] App component mounted');
  }, []);

  console.log('[LOAD] App rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
