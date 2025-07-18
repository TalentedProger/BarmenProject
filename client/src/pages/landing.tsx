import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Martini, WandSparkles, Dice2, BookOpen, GraduationCap, ShoppingCart } from "lucide-react";

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
        <div className="absolute inset-0 bg-gradient-to-br from-background via-graphite to-charcoal"></div>
        
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
            
            {/* Right side - Cocktail glass image */}
            <div className="flex justify-center items-center animate-slide-up">
              <div className="relative">
                <svg className="w-64 h-64 relative z-10" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Martini glass */}
                  <path d="M50 50 L150 50 L100 150 L100 250 L80 250 L80 270 L120 270 L120 250 L100 250 L100 150 Z" 
                        fill="url(#glassGradient)" 
                        stroke="hsl(210, 100%, 65%)" 
                        strokeWidth="1.5"/>
                  
                  {/* Cocktail liquid */}
                  <path d="M55 55 L145 55 L100 145 Z" 
                        fill="url(#liquidGradient)" 
                        opacity="0.9"/>
                  
                  {/* Glass shine effect */}
                  <path d="M60 60 L70 60 L65 90 Z" 
                        fill="rgba(255,255,255,0.2)"/>
                  
                  <defs>
                    <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(66, 165, 245, 0.1)" />
                      <stop offset="100%" stopColor="rgba(66, 165, 245, 0.2)" />
                    </linearGradient>
                    <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(210, 100%, 65%)" />
                      <stop offset="50%" stopColor="hsl(210, 40%, 45%)" />
                      <stop offset="100%" stopColor="hsl(210, 30%, 25%)" />
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
              className="minimalist-button bg-primary text-primary-foreground px-8 py-4 text-lg hover:bg-primary/90"
            >
              <WandSparkles className="mr-2 h-5 w-5" />
              Начать создание
            </Button>
            <Button 
              variant="outline"
              className="subtle-border bg-transparent text-zinc px-8 py-4 text-lg hover:bg-accent hover:text-accent-foreground"
              onClick={() => window.location.href = "/catalog"}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Каталог рецептов
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-steel relative">
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
