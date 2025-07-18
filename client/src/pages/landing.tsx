import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Martini, WandSparkles, Dice2, BookOpen, GraduationCap, ShoppingCart } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/constructor";
  };

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Martini className="text-neon-turquoise text-2xl" />
              <h1 className="text-xl font-bold text-neon-turquoise">Конструктор Коктейлей</h1>
            </div>
            <Button 
              onClick={handleGetStarted}
              className="glow-button bg-neon-turquoise text-night-blue hover:bg-neon-turquoise/90"
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
            <div className="space-y-6 pl-8 flex flex-col justify-center h-64">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neon-turquoise via-neon-purple to-neon-pink bg-clip-text text-transparent animate-float">
                Создай свой идеальный коктейль
              </h1>
              <p className="text-lg md:text-xl text-neon-turquoise max-w-2xl font-medium">
                Интерактивный конструктор напитков с реалистичной визуализацией, расчетом крепости и стоимости
              </p>
            </div>
            
            {/* Right side - Cocktail glass image */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-b from-transparent via-neon-turquoise/20 to-neon-turquoise/40 rounded-full blur-2xl absolute inset-0 animate-pulse"></div>
                <svg className="w-64 h-64 relative z-10" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Martini glass */}
                  <path d="M50 50 L150 50 L100 150 L100 250 L80 250 L80 270 L120 270 L120 250 L100 250 L100 150 Z" 
                        fill="url(#glassGradient)" 
                        stroke="#00F5FF" 
                        strokeWidth="2"/>
                  
                  {/* Cocktail liquid */}
                  <path d="M55 55 L145 55 L100 145 Z" 
                        fill="url(#liquidGradient)" 
                        opacity="0.8"/>
                  
                  {/* Glass shine effect */}
                  <path d="M60 60 L70 60 L65 90 Z" 
                        fill="rgba(255,255,255,0.3)"/>
                  
                  <defs>
                    <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0,245,255,0.1)" />
                      <stop offset="100%" stopColor="rgba(0,245,255,0.3)" />
                    </linearGradient>
                    <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B9D" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#00F5FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Buttons at the bottom */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={handleGetStarted}
              className="glow-button bg-neon-turquoise text-night-blue px-8 py-4 text-lg hover:bg-neon-turquoise/90"
            >
              <WandSparkles className="mr-2 h-5 w-5" />
              Начать создание
            </Button>
            <Button 
              variant="outline"
              className="neon-border bg-transparent text-neon-turquoise px-8 py-4 text-lg hover:bg-neon-turquoise hover:text-night-blue"
              onClick={() => window.location.href = "/catalog"}
            >
              <BookOpen className="mr-2 h-5 w-5" />
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
            <h2 className="text-4xl font-bold mb-4 text-neon-amber">Возможности платформы</h2>
            <p className="text-xl text-cream max-w-2xl mx-auto">
              Все инструменты для создания идеальных коктейлей в одном месте
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-neon-turquoise/20 hover:shadow-neon-turquoise/40 hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-turquoise rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-neon-turquoise/30">
                  <Martini className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neon-turquoise mb-2">Конструктор</h3>
                <p className="text-cream">
                  Создавайте коктейли слой за слоем с визуализацией в реальном времени
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-purple rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-neon-purple/30">
                  <Dice2 className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neon-purple mb-2">Генератор</h3>
                <p className="text-cream">
                  Автоматическое создание уникальных рецептов на основе ваших предпочтений
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-neon-amber/20 hover:shadow-neon-amber/40 hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-amber rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-neon-amber/30">
                  <BookOpen className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neon-amber mb-2">Каталог</h3>
                <p className="text-cream">
                  Тысячи проверенных рецептов от профессиональных барменов
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-graphite to-night-blue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-neon-purple">
            Готовы начать миксологию?
          </h2>
          <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к сообществу барменов и любителей коктейлей
          </p>
          <Button 
            onClick={handleGetStarted}
            className="glow-button bg-neon-turquoise text-night-blue px-12 py-4 text-xl hover:bg-neon-turquoise/90"
          >
            Начать бесплатно
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-graphite border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Martini className="text-neon-turquoise text-2xl" />
            <h3 className="text-xl font-bold text-neon-turquoise">Конструктор Коктейлей</h3>
          </div>
          <p className="text-cream text-sm">
            &copy; 2024 Конструктор Коктейлей. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
