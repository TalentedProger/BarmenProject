import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Martini, WandSparkles, Dice2, BookOpen, GraduationCap, ShoppingCart } from "lucide-react";
import CoursesSection from "@/components/landing/courses-section";
import PopularRecipesSection from "@/components/PopularRecipesSection";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/constructor";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Martini className="text-electric text-2xl" />
              <h1 className="text-xl font-bold text-platinum">Cocktailo Maker</h1>
            </div>
            <Button 
              onClick={handleGetStarted}
              className="minimalist-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Начать
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 relative overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-night-blue via-graphite to-charcoal"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-turquoise rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 h-full">
          <div className="grid md:grid-cols-2 gap-8 items-center py-20 h-full">
            {/* Left side - Text content */}
            <div className="space-y-6 pl-8 flex flex-col justify-center h-64 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold text-platinum leading-tight">
                Создай свой идеальный коктейль
              </h1>
              <p className="text-base md:text-lg text-zinc max-w-2xl leading-relaxed">
                Интерактивный конструктор напитков с реалистичной визуализацией, расчетом крепости и стоимости
              </p>
            </div>
            
            {/* Right side - Interactive cocktail creation image */}
            <div className="flex justify-end items-start animate-slide-up h-full pt-8">
              <div className="relative">
                <img 
                  src="/attached_assets/Leonardo_Phoenix_10_A_futuristic_interactive_cocktail_creation_0 (1)_1752851226590.png"
                  alt="Interactive cocktail creation with layered colors"
                  className="h-full w-auto object-contain relative z-10"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
                {/* Subtle glow effect behind the image */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-2xl transform scale-75"></div>
              </div>
            </div>
          </div>
          
          {/* Buttons at the bottom */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Button 
              onClick={handleGetStarted}
              className="hero-primary-button bg-gradient-to-r from-neon-purple to-electric text-white px-10 py-5 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              style={{
                boxShadow: '0 0 20px rgba(179, 136, 235, 0.4), 0 0 40px rgba(179, 136, 235, 0.2), 0 8px 25px rgba(0, 0, 0, 0.3)'
              }}
            >
              <WandSparkles className="mr-2 h-6 w-6" />
              Начать создание
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000"></div>
            </Button>
            <Button 
              variant="outline"
              className="hero-secondary-button bg-transparent border-2 border-neon-turquoise text-neon-turquoise px-10 py-5 text-lg font-semibold rounded-xl hover:bg-neon-turquoise hover:text-night-blue transform hover:scale-105 transition-all duration-300 shadow-lg shadow-neon-turquoise/20 hover:shadow-xl hover:shadow-neon-turquoise/40"
              onClick={() => window.location.href = "/catalog"}
            >
              <BookOpen className="mr-2 h-6 w-6" />
              Каталог рецептов
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-night-blue relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-96 h-96 bg-neon-purple rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-turquoise rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-platinum">Возможности платформы</h2>
            <p className="text-lg text-zinc max-w-2xl mx-auto">
              Все инструменты для создания идеальных коктейлей в одном месте
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                  <Martini className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-platinum mb-2">Конструктор</h3>
                <p className="text-zinc">
                  Создавайте коктейли слой за слоем с визуализацией в реальном времени
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dice2 className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-platinum mb-2">Генератор</h3>
                <p className="text-zinc">
                  Автоматическое создание уникальных рецептов на основе ваших предпочтений
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-amber rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-platinum mb-2">Каталог</h3>
                <p className="text-zinc">
                  Тысячи проверенных рецептов от профессиональных барменов
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <PopularRecipesSection />

      {/* Courses Section */}
      <CoursesSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-graphite to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-platinum">
            Готовы начать миксологию?
          </h2>
          <p className="text-lg text-zinc mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к сообществу барменов и любителей коктейлей
          </p>
          <Button 
            onClick={handleGetStarted}
            className="minimalist-button bg-primary text-primary-foreground px-12 py-4 text-xl hover:bg-primary/90"
          >
            Начать бесплатно
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-graphite border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Martini className="text-electric text-2xl" />
            <h3 className="text-xl font-bold text-platinum">Cocktailo Maker</h3>
          </div>
          <p className="text-zinc text-sm">
            &copy; 2024 Cocktailo Maker. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
