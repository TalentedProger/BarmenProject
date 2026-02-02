import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

// ВСЕ страницы lazy loaded для минимального критического пути
const Landing = lazy(() => import("@/pages/landing"));
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

// Минимальный inline загрузчик - ничего не импортирует
const MinimalLoader = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: '#0A0A0D',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍸</div>
    <div style={{ color: '#00D9FF', fontSize: '20px', fontWeight: 500 }}>Cocktailo Maker</div>
    <div style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>Загрузка...</div>
  </div>
);

// Обёртка для lazy компонентов
const LazyRoute = ({ component: Component, ...props }: { component: React.LazyExoticComponent<any>; path?: string }) => (
  <Route {...props}>
    {() => (
      <Suspense fallback={<MinimalLoader />}>
        <Component />
      </Suspense>
    )}
  </Route>
);

function Router() {
  return (
    <Switch>
      {/* ВСЕ страницы lazy loaded */}
      <LazyRoute path="/" component={Landing} />
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
      <LazyRoute component={NotFound} />
    </Switch>
  );
}

function App() {
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
