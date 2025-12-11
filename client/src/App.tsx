import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

// Lazy load страницы для code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Landing = lazy(() => import("@/pages/landing"));
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

// Loading компонент
const PageLoader = () => (
  <div className="min-h-screen bg-night-blue flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-turquoise"></div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Landing} />
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
