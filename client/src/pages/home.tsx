import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Martini, WandSparkles, Dice2, BookOpen, TrendingUp, Star, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Необходима авторизация",
        description: "Выполняется перенаправление на страницу входа...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-turquoise"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-night-blue via-graphite to-charcoal"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple rounded-full blur-3xl animate-pulse-slow" style={{willChange: 'transform, opacity'}}></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-turquoise rounded-full blur-3xl animate-pulse-slow" style={{willChange: 'transform, opacity'}}></div>
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
              <Link href="/constructor">
                <Button className="glow-button bg-neon-turquoise text-night-blue px-8 py-4 text-lg hover:bg-neon-turquoise/90">
                  <WandSparkles className="mr-2 h-5 w-5" />
                  Начать создание
                </Button>
              </Link>
              <Link href="/generator">
                <Button 
                  variant="outline"
                  className="neon-border bg-transparent text-neon-turquoise px-8 py-4 text-lg hover:bg-neon-turquoise hover:text-night-blue"
                >
                  <Dice2 className="mr-2 h-5 w-5" />
                  Случайный рецепт
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gradient-to-b from-charcoal to-graphite">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-neon-amber">Быстрые действия</h2>
            <p className="text-xl text-cream max-w-2xl mx-auto">
              Выберите, что вы хотите сделать прямо сейчас
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Link href="/constructor">
              <Card className="glass-effect border-none hover:scale-105 transition-all duration-300 cursor-pointer" style={{willChange: 'transform'}}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-neon-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                    <Martini className="text-night-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-neon-turquoise mb-2">Конструктор</h3>
                  <p className="text-cream text-sm">
                    Создайте коктейль с нуля
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/generator">
              <Card className="glass-effect border-none hover:scale-105 transition-all duration-300 cursor-pointer" style={{willChange: 'transform'}}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Dice2 className="text-night-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-neon-purple mb-2">Генератор</h3>
                  <p className="text-cream text-sm">
                    Случайный рецепт
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/catalog">
              <Card className="glass-effect border-none hover:scale-105 transition-all duration-300 cursor-pointer" style={{willChange: 'transform'}}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-neon-amber rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-night-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-neon-amber mb-2">Каталог</h3>
                  <p className="text-cream text-sm">
                    Просмотреть рецепты
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/profile">
              <Card className="glass-effect border-none hover:scale-105 transition-all duration-300 cursor-pointer" style={{willChange: 'transform'}}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-neon-pink rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-night-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-neon-pink mb-2">Профиль</h3>
                  <p className="text-cream text-sm">
                    Мои рецепты
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-graphite to-night-blue">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect border-none">
              <CardContent className="p-6 text-center">
                <TrendingUp className="text-neon-turquoise text-4xl mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-neon-turquoise mb-2">1000+</h3>
                <p className="text-cream">Рецептов в каталоге</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-none">
              <CardContent className="p-6 text-center">
                <Star className="text-neon-amber text-4xl mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-neon-amber mb-2">5000+</h3>
                <p className="text-cream">Созданных коктейлей</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-none">
              <CardContent className="p-6 text-center">
                <Clock className="text-neon-pink text-4xl mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-neon-pink mb-2">24/7</h3>
                <p className="text-cream">Доступность платформы</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
