import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Constructor from "@/pages/constructor";
import Generator from "@/pages/generator";
import Catalog from "@/pages/catalog";
import Profile from "@/pages/profile";
import Auth from "@/pages/auth";
import RecipePage from "@/pages/RecipePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      <Route path="/home" component={Home} />
      <Route path="/constructor" component={Constructor} />
      <Route path="/generator" component={Generator} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/profile" component={Profile} />
      <Route path="/recipe/:id" component={RecipePage} />
      <Route component={NotFound} />
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
