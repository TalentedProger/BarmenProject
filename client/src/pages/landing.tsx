import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Martini, WandSparkles, Dice2, BookOpen, GraduationCap, ShoppingCart, Users } from "lucide-react";
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
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-platinum mb-2">Сообщество</h3>
                <p className="text-zinc">
                  Присоединяйтесь к сообществу барменов, делитесь опытом и находите единомышленников
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-platinum mb-2">Магазин барного инвентаря</h3>
                <p className="text-zinc">
                  Профессиональное барное оборудование и ингредиенты для создания идеальных коктейлей
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-platinum mb-2">Специальные курсы</h3>
                <p className="text-zinc">
                  Обучение от профессиональных барменов: от основ миксологии до авторских техник
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

      {/* Newsletter Section */}
      <section className="py-16 bg-[#101013] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-cyan-400/20 blur-xl"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center max-w-xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mb-2" style={{ textShadow: '0 0 5px #00f7ef33' }}>
            Будь в курсе новых рецептов и фишек
          </h2>
          <p className="text-sm md:text-base text-zinc-400 mt-2 mb-8">
            Мы не спамим. Только крафтовые новости.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Введи свой email"
              className="rounded-full px-6 py-3 text-sm bg-[#1A1A1E] text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none w-full sm:w-auto min-w-[280px]"
            />
            <Button className="rounded-full px-6 py-3 ml-0 sm:ml-2 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-semibold hover:scale-105 transition-all duration-300 shadow-md shadow-cyan-500/30">
              Подписаться
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 bg-[#0C0C0F] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left side - Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 4px #8F00FF88' }}>
                Cocktailo — теперь в твоём кармане
              </h2>
              <p className="text-zinc-400 text-base mt-2 mb-8">
                Создавай, сохраняй, делись на ходу
              </p>
              
              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-all duration-300">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </Button>
                <Button className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-all duration-300">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
            
            {/* Right side - Phone mockup */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative">
                {/* Phone mockup */}
                <div className="w-64 h-96 bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-2 shadow-2xl relative overflow-hidden hover:scale-101 transition-all duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-cyan-900 rounded-[2.5rem] p-8 flex flex-col items-center justify-center">
                    <div className="text-white text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-turquoise rounded-full flex items-center justify-center mx-auto">
                        <Martini className="text-white text-2xl" />
                      </div>
                      <h3 className="text-lg font-bold">Cocktailo</h3>
                      <div className="space-y-2">
                        <div className="w-32 h-20 bg-white/10 rounded-lg flex items-center justify-center">
                          <span className="text-xs">🍹 Коктейль</span>
                        </div>
                        <Button className="w-32 bg-gradient-to-r from-purple-500 to-cyan-400 text-black text-xs py-2 rounded-lg">
                          Создать
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-[3rem] blur-lg -z-10"></div>
                </div>
                
                {/* Floating icons */}
                <div className="absolute -top-4 -right-4 text-2xl animate-bounce">🍹</div>
                <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🧪</div>
                <div className="absolute top-1/2 -right-8 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🍊</div>
              </div>
            </div>
          </div>
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
