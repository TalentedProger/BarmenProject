import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Martini, WandSparkles, Dice2, BookOpen, GraduationCap, ShoppingCart, Users, LogIn, UserPlus, User } from "lucide-react";
import CoursesSection from "@/components/landing/courses-section";
import PopularRecipesSection from "@/components/PopularRecipesSection";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [heroEmail, setHeroEmail] = useState("");
  const [heroEmailError, setHeroEmailError] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const handleGetStarted = () => {
    window.location.href = "/constructor";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    
    if (!email.trim()) {
      setEmailError("Введите email адрес");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Введите корректный email адрес");
      return;
    }
    
    // Здесь будет логика отправки email
    console.log("Подписка на email:", email);
    alert("Спасибо за подписку!");
    setEmail("");
  };

  const handleHeroEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroEmailError("");
    
    if (!heroEmail.trim()) {
      setHeroEmailError("Введите email адрес");
      return;
    }
    
    if (!validateEmail(heroEmail)) {
      setHeroEmailError("Введите корректный email адрес");
      return;
    }
    
    // Здесь будет логика отправки email
    console.log("Подписка на email из hero:", heroEmail);
    alert("Спасибо за подписку!");
    setHeroEmail("");
  };



  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Martini className="text-electric text-2xl max-[480px]:text-xl" />
              <h1 className="text-xl font-bold text-platinum max-[480px]:text-lg">Cocktailo Maker</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-neon-turquoise to-electric text-night-blue px-5 py-1.5 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-neon-turquoise/30 max-[560px]:hidden"
              >
                <WandSparkles className="mr-2 h-3 w-3" />
                Начать
              </Button>
              
              {/* Auth Section - показывает либо кнопку входа, либо профиль пользователя */}
              {!isLoading && !isAuthenticated ? (
                <Button 
                  variant="outline"
                  className="bg-transparent border border-neon-purple text-neon-purple px-6 py-2 rounded-lg font-semibold hover:bg-neon-purple hover:text-night-blue transition-all duration-300 shadow-md shadow-neon-purple/20 max-[480px]:px-4 max-[480px]:py-1.5 max-[480px]:text-sm"
                  onClick={() => window.location.href = "/auth"}
                >
                  <LogIn className="mr-2 h-4 w-4 max-[480px]:h-3 max-[480px]:w-3" />
                  Вход
                </Button>
              ) : isAuthenticated && user ? (
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 hover:bg-white/10 p-2 rounded-lg transition-all duration-300 hover:scale-105 md:justify-start justify-end"
                  onClick={() => window.location.href = "/profile"}
                >
                  <Avatar className="h-8 w-8 shadow-sm shadow-black/30 ring-1 ring-white/10">
                    <AvatarImage 
                      src={(user as any)?.profileImageUrl} 
                      alt={(user as any)?.nickname || "User"} 
                    />
                    <AvatarFallback className="bg-gradient-to-r from-neon-turquoise to-neon-purple text-black font-semibold text-sm">
                      {(user as any)?.nickname?.charAt(0)?.toUpperCase() || (user as any)?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium hidden md:inline">
                    {(user as any)?.nickname || 'Пользователь'}
                  </span>
                </Button>
              ) : null}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-8 relative overflow-hidden min-h-[75vh] max-[480px]:min-h-[auto] max-[480px]:pb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-night-blue via-graphite to-charcoal"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-turquoise rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center py-24 max-[480px]:py-12 max-[480px]:gap-6">
            {/* Left side - Text content */}
            <div className="space-y-4 md:pl-8 flex flex-col justify-center animate-fade-in max-[480px]:text-center max-[480px]:space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-platinum leading-tight max-[480px]:text-2xl">
                Создай свой идеальный коктейль
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-zinc max-w-2xl leading-relaxed max-[480px]:text-xs max-[480px]:px-2">
                Интерактивный конструктор напитков с реалистичной визуализацией, расчетом крепости и стоимости
              </p>
            </div>
            
            {/* Right side - Interactive cocktail creation image */}
            <div className="flex justify-center md:justify-end items-center animate-slide-up max-[480px]:mt-2">
              <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
                <img 
                  src="/attached_assets/Leonardo_Phoenix_10_A_futuristic_interactive_cocktail_creation_0 (1)_1752851226590.png"
                  alt="Interactive cocktail creation with layered colors"
                  className="hero-image relative z-10"
                  loading="eager"
                  decoding="async"
                  draggable="false"
                />
                {/* Subtle glow effect behind the image */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-2xl transform scale-75"></div>
              </div>
            </div>
          </div>
          
          {/* Buttons at the bottom */}
          <div className="flex flex-col gap-4 justify-center items-center mt-12 max-[480px]:mt-6 max-[480px]:gap-3 w-full">
            <Button 
              onClick={handleGetStarted}
              className="hero-primary-button bg-gradient-to-r from-neon-purple to-electric text-white py-5 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden w-4/5 max-w-md max-[480px]:py-3 max-[480px]:text-base"
              style={{
                boxShadow: '0 0 15px rgba(179, 136, 235, 0.25), 0 0 30px rgba(179, 136, 235, 0.15), 0 8px 20px rgba(0, 0, 0, 0.2)'
              }}
            >
              <WandSparkles className="mr-2 h-6 w-6 max-[480px]:h-4 max-[480px]:w-4" />
              Начать создание
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000"></div>
            </Button>
            <Button 
              variant="outline"
              className="hero-secondary-button bg-transparent border-2 border-neon-turquoise text-neon-turquoise py-5 text-lg font-semibold rounded-xl hover:bg-neon-turquoise hover:text-night-blue transform hover:scale-105 transition-all duration-300 shadow-lg shadow-neon-turquoise/20 hover:shadow-xl hover:shadow-neon-turquoise/40 w-4/5 max-w-md max-[480px]:py-3 max-[480px]:text-base"
              onClick={() => window.location.href = "/catalog"}
            >
              <BookOpen className="mr-2 h-6 w-6 max-[480px]:h-4 max-[480px]:w-4" />
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
            <h2 className="text-3xl font-bold mb-4 text-platinum max-[480px]:text-2xl">Возможности платформы</h2>
            <p className="text-lg text-zinc max-w-2xl mx-auto">
              Все инструменты для создания идеальных коктейлей в одном месте
            </p>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {[
              {
                icon: Martini,
                title: "Конструктор",
                description: "Создавайте коктейли слой за слоем с визуализацией в реальном времени",
                bgColor: "bg-neon-turquoise"
              },
              {
                icon: Dice2,
                title: "Генератор",
                description: "Автоматическое создание уникальных рецептов на основе ваших предпочтений",
                bgColor: "bg-neon-purple"
              },
              {
                icon: BookOpen,
                title: "Каталог",
                description: "Тысячи проверенных рецептов от профессиональных барменов",
                bgColor: "bg-neon-amber"
              },
              {
                icon: Users,
                title: "Сообщество",
                description: "Присоединяйтесь к сообществу барменов, делитесь опытом и находите единомышленников",
                bgColor: "bg-red-500"
              },
              {
                icon: ShoppingCart,
                title: "Магазин барного инвентаря",
                description: "Профессиональное барное оборудование и ингредиенты для создания идеальных коктейлей",
                bgColor: "bg-orange-500"
              },
              {
                icon: GraduationCap,
                title: "Специальные курсы",
                description: "Обучение от профессиональных барменов: от основ миксологии до авторских техник",
                bgColor: "bg-green-500"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 50,
                      filter: "blur(10px)"
                    },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        opacity: { duration: 0.6 },
                        y: { duration: 0.8 },
                        filter: { duration: 0.6 }
                      }
                    }
                  }}

                >
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <IconComponent className="text-night-blue text-2xl" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-platinum mb-2">{feature.title}</h3>
                      <p className="text-zinc">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
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
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left side - Newsletter content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mb-2" style={{ textShadow: '0 0 5px #00f7ef33' }}>
                Будь в курсе новых рецептов и фишек
              </h2>
              <p className="text-sm md:text-base text-zinc-400 mt-2 mb-8">
                Мы не спамим. Только крафтовые новости.
              </p>
              
              <form onSubmit={handleHeroEmailSubmit} className="flex flex-col gap-4 justify-center md:justify-start max-[480px]:items-center max-[480px]:w-full">
                <div className="flex flex-col md:flex-row gap-4 max-[767px]:w-full max-[767px]:items-center">
                  <div className="flex flex-col w-full md:w-auto min-w-[280px] max-[767px]:w-full">
                    <input
                      type="email"
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      placeholder="Введи свой email"
                      className={`rounded-full px-6 py-3 text-sm bg-[#1A1A1E] text-white border focus:outline-none transition-all duration-300 w-full ${
                        heroEmailError 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-zinc-700 focus:border-cyan-500'
                      }`}
                    />
                    {heroEmailError && (
                      <p className="text-red-400 text-xs mt-1 pl-4">{heroEmailError}</p>
                    )}
                  </div>
                  <Button 
                    type="submit"
                    className="rounded-full px-6 py-3 ml-0 md:ml-2 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-semibold hover:scale-105 transition-all duration-300 shadow-md shadow-cyan-500/30 max-[767px]:w-1/2 max-[767px]:ml-0 max-[767px]:mt-2"
                  >
                    Подписаться
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Right side - Cocktail image with elegant shadows */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative hover:scale-105 transition-all duration-300">
                <img 
                  src="/attached_assets/Flux_Dev_a_lush_3d_render_of_A_stylized_artistic_illustration__3-Photoroom_1752879813613.png"
                  alt="Стилизованный коктейль с градиентными эффектами"
                  className="w-80 h-auto object-contain relative z-10"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(138, 43, 226, 0.3)) drop-shadow(0 15px 30px rgba(0, 255, 255, 0.2))',
                  }}
                  loading="lazy"
                />
                
                {/* Elegant glow effects behind the cocktail */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-blue-400/15 rounded-full blur-2xl -z-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-t from-violet-400/25 to-cyan-300/25 rounded-full blur-xl -z-30"></div>
                
                {/* Soft base shadow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black/20 rounded-full blur-lg -z-40"></div>
              </div>
            </div>
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
            {/* Mobile layout: Title first */}
            <div className="w-full text-center md:hidden mb-4">
              <h2 className="text-3xl font-bold text-white mb-4" style={{ textShadow: '0 0 4px #8F00FF88' }}>
                Cocktailo — теперь в твоём кармане
              </h2>
              <p className="text-zinc-400 text-base">
                Создавай, сохраняй, делись на ходу
              </p>
            </div>

            {/* Mobile layout: Phone image second */}
            <div className="w-full flex justify-center md:hidden mb-4">
              <div className="relative">
                <img 
                  src="/attached_assets/ChatGPT Image 18 июл. 2025 г., 23_50_01-Photoroom_1752872369395.png"
                  alt="Cocktailo mobile app with pineapple daiquiri"
                  className="w-96 h-auto object-contain hover:scale-105 transition-all duration-300 relative z-10"
                  loading="lazy"
                />
                {/* Soft glow effects behind the image */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-purple-500/15 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/8 to-cyan-400/8 rounded-full blur-[100px] -z-20"></div>
              </div>
            </div>

            {/* Mobile layout: Buttons third */}
            <div className="w-full flex justify-center md:hidden">
              <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-all duration-300">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </Button>
                <Button className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-all duration-300">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>

            {/* Desktop layout: Left side - Content */}
            <div className="hidden md:flex flex-1 text-left">
              <div>
                <h2 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 4px #8F00FF88' }}>
                  Cocktailo — теперь в твоём кармане
                </h2>
                <p className="text-zinc-400 text-base mt-2 mb-8">
                  Создавай, сохраняй, делись на ходу
                </p>
                
                {/* Download buttons */}
                <div className="flex flex-row gap-4">
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
            </div>
            
            {/* Desktop layout: Right side - Phone image */}
            <div className="hidden md:flex flex-1 justify-end mr-16">
              <div className="relative">
                <img 
                  src="/attached_assets/ChatGPT Image 18 июл. 2025 г., 23_50_01-Photoroom_1752872369395.png"
                  alt="Cocktailo mobile app with pineapple daiquiri"
                  className="w-96 h-auto object-contain hover:scale-105 transition-all duration-300 relative z-10"
                  loading="lazy"
                />
                {/* Soft glow effects behind the image */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-purple-500/15 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/8 to-cyan-400/8 rounded-full blur-[100px] -z-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with liquid wave effect */}
      <footer className="relative bg-gradient-to-b from-slate-950 to-black overflow-hidden">
        {/* Static neon wave at top - full width */}
        <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
          <svg 
            className="absolute w-full h-full" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
            style={{ width: '100%' }}
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8">
                  <animate attributeName="stop-color" values="#00ffff;#8f00ff;#ff00ff;#00ffff" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#8f00ff" stopOpacity="0.9">
                  <animate attributeName="stop-color" values="#8f00ff;#ff00ff;#00ffff;#8f00ff" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.8">
                  <animate attributeName="stop-color" values="#ff00ff;#00ffff;#8f00ff;#ff00ff" dur="4s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M0,50 C100,30 200,70 300,50 C400,30 500,70 600,50 C700,30 800,70 900,50 C1000,30 1100,70 1200,50 L1200,0 L0,0 Z" 
              fill="url(#waveGradient)" 
              filter="url(#glow)"
            />
          </svg>
        </div>

        {/* Glass texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>

        <div className="relative z-10 pt-24 pb-12">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Block 1 - Logo and Quote */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg">
                    <Martini className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white" style={{ textShadow: '0 0 8px #00ffff88' }}>
                    Cocktailo
                  </h3>
                </div>
                
                <blockquote className="text-zinc-300 italic text-lg leading-relaxed">
                  «Коктейли — это искусство, а ты — художник.»
                </blockquote>
                
                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <span>Cocktailo создан с любовью барменами для барменов</span>
                </div>
              </div>

              {/* Block 2 - Quick Links */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white mb-4">Быстрые ссылки</h4>
                <nav className="space-y-3">
                  {[
                    { label: 'О проекте', href: '/about' },
                    { label: 'Курсы', href: '/courses' },
                    { label: 'Мобильное приложение', href: '/mobile' },
                    { label: 'Контакты', href: '/contact' }
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-zinc-400 hover:text-cyan-300 transition-all duration-300 hover:translate-x-2 hover:shadow-lg"
                      style={{ 
                        textShadow: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.textShadow = '0 0 8px #00ffff88';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.textShadow = 'none';
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Block 3 - Newsletter Subscription */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white mb-4">Будь в курсе новых рецептов и фишек</h4>
                
                <form className="space-y-4" onSubmit={handleEmailSubmit}>
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Введи свой email"
                      className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-zinc-500 focus:ring-1 focus:outline-none transition-all duration-300 ${
                        emailError 
                          ? 'border-red-500 focus:border-red-400 focus:ring-red-400' 
                          : 'border-slate-700 focus:border-cyan-400 focus:ring-cyan-400'
                      }`}
                      style={{
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                    {emailError && (
                      <p className="text-red-400 text-xs pl-1">{emailError}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                    style={{
                      boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(0, 255, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.3)';
                    }}
                  >
                    Подписаться
                  </button>
                </form>
                
                <p className="text-xs text-zinc-500">
                  Мы не спамим. Только крафтовые новости.
                </p>
              </div>
            </div>

            {/* Bottom section */}
            <div className="mt-12 pt-8 border-t border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-zinc-500 text-sm">
                  &copy; 2025 Cocktailo. Все права защищены.
                </p>
                
                {/* Social icons */}
                <div className="flex space-x-6">
                  <a
                    href="https://t.me/cocktailo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 hover:scale-110"
                    style={{
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24">
                      <path d="M19.2,4.4L2.9,10.7c-1.1,0.4-1.1,1.1-0.2,1.3l4.1,1.3l1.6,4.8c0.2,0.5,0.1,0.7,0.6,0.7c0.4,0,0.6-0.2,0.8-0.4 c0.1-0.1,1-1,2-2l4.2,3.1c0.8,0.4,1.3,0.2,1.5-0.7l2.8-13.1C20.6,4.6,19.9,4,19.2,4.4z M17.1,7.4l-7.8,7.1L9,17.8L7.4,13l9.2-5.8 C17,6.9,17.4,7.1,17.1,7.4z"/>
                    </svg>
                  </a>
                  
                  <a
                    href="https://vk.com/cocktailo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 hover:scale-110"
                    style={{
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <svg fill="none" stroke="currentColor" width="16" height="16" viewBox="0 0 48 48">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M27.55,35.19V28.55c4.46.68,5.87,4.19,8.71,6.64H43.5a29.36,29.36,0,0,0-7.9-10.47c2.6-3.58,5.36-6.95,6.71-12.06H35.73c-2.58,3.91-3.94,8.49-8.18,11.51V12.66H18l2.28,2.82,0,10.05c-3.7-.43-6.2-7.2-8.91-12.87H4.5C7,20.32,12.26,37.13,27.55,35.19Z"/>
                    </svg>
                  </a>
                  
                  <a
                    href="https://instagram.com/cocktailo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 hover:scale-110"
                    style={{
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"/>
                      <path d="M18 5C18.5523 5 19 5.44772 19 6C19 6.55228 18.5523 7 18 7C17.4477 7 17 6.55228 17 6C17 5.44772 17.4477 5 18 5Z"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
