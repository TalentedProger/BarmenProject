import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Martini, WandSparkles, Dice2, BookOpen, GraduationCap, ShoppingCart } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
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
              onClick={handleLogin}
              className="glow-button bg-neon-turquoise text-night-blue hover:bg-neon-turquoise/90"
            >
              Войти
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-night-blue via-graphite to-charcoal"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-turquoise rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center py-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-turquoise to-neon-purple bg-clip-text text-transparent animate-float">
              Создай свой идеальный коктейль
            </h1>
            <p className="text-xl md:text-2xl text-cream mb-8 max-w-3xl mx-auto">
              Интерактивный конструктор напитков с реалистичной визуализацией, расчетом крепости и стоимости
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleLogin}
                className="glow-button bg-neon-turquoise text-night-blue px-8 py-4 text-lg hover:bg-neon-turquoise/90"
              >
                <WandSparkles className="mr-2 h-5 w-5" />
                Начать создание
              </Button>
              <Button 
                variant="outline"
                className="neon-border bg-transparent text-neon-turquoise px-8 py-4 text-lg hover:bg-neon-turquoise hover:text-night-blue"
              >
                <Dice2 className="mr-2 h-5 w-5" />
                Случайный рецепт
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-charcoal to-graphite">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-neon-amber">Возможности платформы</h2>
            <p className="text-xl text-cream max-w-2xl mx-auto">
              Все инструменты для создания идеальных коктейлей в одном месте
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect border-none">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                  <Martini className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neon-turquoise mb-2">Конструктор</h3>
                <p className="text-cream">
                  Создавайте коктейли слой за слоем с визуализацией в реальном времени
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-none">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dice2 className="text-night-blue text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neon-purple mb-2">Генератор</h3>
                <p className="text-cream">
                  Автоматическое создание уникальных рецептов на основе ваших предпочтений
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-none">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-neon-amber rounded-full flex items-center justify-center mx-auto mb-4">
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
            onClick={handleLogin}
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
