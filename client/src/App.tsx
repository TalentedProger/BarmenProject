import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { lazy, Suspense } from "react";

// Landing загружается СИНХРОННО - это главная страница, должна открываться мгновенно
import Landing from "@/pages/landing";

// Остальные страницы lazy loaded
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

// Минимальный fallback для lazy страниц (не для Landing!)
const PageLoader = () => null; // Просто ничего не показываем, страница загрузится быстро

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: unknown; hasError: boolean }
> {
  state = { error: null as unknown, hasError: false };

  static getDerivedStateFromError(error: unknown) {
    console.error("[APP] ErrorBoundary caught:", error);
    return { error, hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: any) {
    console.error("[APP] ErrorBoundary details:", error, errorInfo);
  }

  render() {
    // Only show error UI if we actually have an error
    if (!this.state.hasError || !this.state.error) {
      return this.props.children;
    }

    const message =
      this.state.error instanceof Error
        ? this.state.error.message
        : typeof this.state.error === "string"
          ? this.state.error
          : "Неизвестная ошибка";

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0A0A0D",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: 20,
          zIndex: 9999,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍸</div>
        <div style={{ color: "#00D9FF", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Ошибка загрузки
        </div>
        <div style={{ color: "#888", fontSize: 14, maxWidth: 520, textAlign: "center", marginBottom: 16 }}>
          {message}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 24px",
            background: "#00D9FF",
            border: "none",
            borderRadius: 8,
            color: "#000",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Перезагрузить
        </button>
      </div>
    );
  }
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Landing синхронный - мгновенная загрузка */}
        <Route path="/" component={Landing} />
        {/* Остальные страницы lazy */}
        <Route path="/auth" component={Auth} />
        <Route path="/home" component={Home} />
        <Route path="/constructor" component={Constructor} />
        <Route path="/generator" component={Generator} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/profile" component={Profile} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/recipe/:id" component={RecipePage} />
        <Route path="/user-recipe/:id" component={UserRecipePage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/courses" component={Courses} />
        <Route path="/course/mixology-basics" component={CourseMixologyBasics} />
        <Route path="/course/mixology-basics/module/:moduleId" component={CourseModule1} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
