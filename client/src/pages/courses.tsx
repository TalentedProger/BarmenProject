import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BookOpen, Clock, Users, Award, TrendingUp, Youtube, Star, ExternalLink, WandSparkles } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";

export default function Courses() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const courses = [
    {
      id: 1,
      title: "Основы миксологии",
      description: "Изучите базовые техники приготовления коктейлей, историю напитков и правила сочетания ингредиентов",
      duration: "6 недель",
      level: "Начальный",
      modules: 12,
      students: 1847,
      rating: 4.8,
      image: "/attached_assets/7b2e9f21-5799-4ec1-94a8-77404805e855_1752844481467.jpg",
      color: "from-neon-turquoise to-cyan-500"
    },
    {
      id: 2,
      title: "Креативный декор",
      description: "Освойте искусство украшения коктейлей, создание гарниров и подачу напитков",
      duration: "4 недели",
      level: "Средний",
      modules: 8,
      students: 923,
      rating: 4.7,
      image: "/attached_assets/6d059335-5b16-412d-b1e0-9d4fdec2fabd_1752844498127.jpg",
      color: "from-neon-pink to-purple-500"
    },
    {
      id: 3,
      title: "Продвинутые техники",
      description: "Мастер-класс по сложным техникам: молекулярная миксология, флейринг и создание авторских рецептов",
      duration: "8 недель",
      level: "Продвинутый",
      modules: 16,
      students: 542,
      rating: 4.9,
      image: "/attached_assets/Leonardo_Phoenix_10_A_modern_elegant_cocktail_in_a_coupe_glass_3_1752844509292.jpg",
      color: "from-neon-amber to-orange-500"
    }
  ];

  const equipment = [
    {
      name: "Шейкер",
      subtitle: "Boston или Cobbler",
      image: "/equipment/Shaker.png"
    },
    {
      name: "Барная ложка",
      subtitle: "Для перемешивания",
      image: "/equipment/Spoon.png"
    },
    {
      name: "Стрейнер",
      subtitle: "Ситечко",
      image: "/equipment/strainer.png"
    },
    {
      name: "Джиггер",
      subtitle: "Мерный стаканчик",
      image: "/equipment/jigger.png"
    },
    {
      name: "Мадлер",
      subtitle: "Пестик",
      image: "/equipment/Muddler.png"
    },
    {
      name: "Стаканы",
      subtitle: "Различных типов",
      image: "/equipment/Set_of_glasses.png"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % equipment.length);
    }, 4000); // Increased to 4 seconds for smoother experience

    return () => clearInterval(interval);
  }, [equipment.length]);

  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const slideWidth = container.offsetWidth / 3; // Show 3 items at a time
      const scrollPosition = currentSlide * slideWidth;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  const bloggers = [
    {
      name: "Алексей Лебедев",
      channel: "@cocktailpro",
      subscribers: "250K",
      specialty: "Классические коктейли",
      url: "https://youtube.com/@cocktailpro"
    },
    {
      name: "Мария Соколова",
      channel: "@mixology_maria",
      subscribers: "180K",
      specialty: "Авторские рецепты",
      url: "https://youtube.com/@mixology_maria"
    },
    {
      name: "Дмитрий Волков",
      channel: "@barman_dmitry",
      subscribers: "320K",
      specialty: "Барная культура",
      url: "https://youtube.com/@barman_dmitry"
    }
  ];

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-night-blue via-graphite to-charcoal"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple rounded-full blur-3xl animate-pulse-slow" style={{willChange: 'transform, opacity'}}></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-amber rounded-full blur-3xl animate-pulse-slow" style={{willChange: 'transform, opacity'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-neon-purple/20 text-neon-purple border-neon-purple">
              Обучение
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-neon-turquoise to-neon-purple bg-clip-text text-transparent leading-tight px-4">
              Стань мастером коктейлей
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-cream mb-12 sm:mb-16 md:mb-24 max-w-2xl mx-auto px-4">
              Профессиональные курсы по миксологии от ведущих барменов России. 
              Теория, практика и сертификат после окончания.
            </p>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <Card className="glass-effect border-none">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Clock className="text-neon-turquoise text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
                  <h3 className="text-xl sm:text-2xl font-bold text-neon-turquoise mb-1 sm:mb-2">4-8 недель</h3>
                  <p className="text-cream text-xs sm:text-sm">Продолжительность</p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-none">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Users className="text-neon-purple text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
                  <h3 className="text-xl sm:text-2xl font-bold text-neon-purple mb-1 sm:mb-2">2600+</h3>
                  <p className="text-cream text-xs sm:text-sm">Выпускников</p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-none">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Award className="text-neon-amber text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
                  <h3 className="text-xl sm:text-2xl font-bold text-neon-amber mb-1 sm:mb-2">Сертификат</h3>
                  <p className="text-cream text-xs sm:text-sm">После завершения</p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-none">
                <CardContent className="p-4 sm:p-6 text-center">
                  <TrendingUp className="text-neon-pink text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
                  <h3 className="text-xl sm:text-2xl font-bold text-neon-pink mb-1 sm:mb-2">95%</h3>
                  <p className="text-cream text-xs sm:text-sm">Успешность</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* General Info Section */}
      <section className="py-16 bg-gradient-to-b from-graphite to-charcoal">
        <div className="container mx-auto px-4">
          {/* Study Plan */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-neon-turquoise px-4">План изучения</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="glass-effect border-2 border-neon-turquoise shadow-lg shadow-neon-turquoise/20 hover:shadow-neon-turquoise/40 transition-shadow duration-300 w-full h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-12 h-12 bg-neon-turquoise/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-neon-turquoise">1</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">Теория</h3>
                  <p className="text-cream text-sm">Изучение теоретического материала через видеолекции и интерактивные уроки</p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-2 border-neon-purple shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-shadow duration-300 w-full h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-neon-purple">2</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">Практика</h3>
                  <p className="text-cream text-sm">Отработка навыков на практических заданиях с обратной связью от экспертов</p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-2 border-neon-amber shadow-lg shadow-neon-amber/20 hover:shadow-neon-amber/40 transition-shadow duration-300 w-full h-full sm:col-span-2 md:col-span-1">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-12 h-12 bg-neon-amber/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-neon-amber">3</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">Сертификация</h3>
                  <p className="text-cream text-sm">Финальный проект и получение сертификата о прохождении курса</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Equipment Carousel */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-neon-purple px-4">Рекомендованное оборудование</h2>
            <div className="relative max-w-7xl mx-auto">
              <div className="overflow-hidden">
                <div 
                  ref={carouselRef}
                  className="flex overflow-x-hidden scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {equipment.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex-shrink-0 px-3"
                      style={{ width: 'calc(100% / 3)' }}
                    >
                      <Card className="glass-effect border-none overflow-hidden hover:brightness-125 hover:saturate-150 transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="w-full aspect-square bg-gradient-to-br from-neon-purple/10 to-neon-turquoise/10 flex items-center justify-center overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-contain p-4"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-6 text-center">
                            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                            <p className="text-sm text-cream/70">{item.subtitle}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center mt-8 gap-3">
                {equipment.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-neon-turquoise shadow-lg shadow-neon-turquoise/50 scale-125' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Перейти к слайду ${index + 1}`}
                  />
                ))}
              </div>
              
              <p className="text-sm text-cream/70 mt-6 text-center">
                * Базовый набор для начала обучения. Дополнительное оборудование понадобится на продвинутых курсах
              </p>
            </div>
          </div>

          {/* Bloggers */}
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-neon-amber px-4">Интересные блогеры</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {bloggers.map((blogger, index) => (
                <a
                  key={index}
                  href={blogger.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="glass-effect bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-neon-amber/30 transition-all duration-300 h-full relative overflow-hidden">
                    {/* External link icon in top right - appears on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <ExternalLink className="w-5 h-5 text-neon-amber" />
                    </div>
                    
                    <CardContent className="p-6 text-center">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-turquoise mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                        {blogger.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{blogger.name}</h3>
                      {/* YouTube Icon + Channel Name */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-neon-turquoise font-semibold text-sm">{blogger.channel}</p>
                      </div>
                      <p className="text-cream text-sm mb-3">{blogger.subscribers} подписчиков</p>
                      <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple">
                        {blogger.specialty}
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gradient-to-b from-charcoal to-night-blue">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center text-neon-turquoise px-4">Наши курсы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="glass-effect hover:scale-105 transition-all duration-300 group flex flex-col h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className={`h-48 bg-gradient-to-br ${course.color} flex items-center justify-center relative overflow-hidden`}>
                    <img 
                      src={course.image}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover blur-sm"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <h3 className="text-2xl font-bold text-white relative z-10 text-center px-4 drop-shadow-lg">
                      {course.title}
                    </h3>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple">
                        {course.level}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Award className="text-neon-amber w-4 h-4" />
                        <span className="text-neon-amber font-semibold">{course.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-cream mb-4 text-sm leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="space-y-3 mb-4 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cream/70">Продолжительность:</span>
                        <span className="text-white font-semibold">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cream/70">Модулей:</span>
                        <span className="text-white font-semibold">{course.modules}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cream/70">Учеников:</span>
                        <span className="text-white font-semibold">{course.students}</span>
                      </div>
                    </div>
                    
                    {course.id === 1 ? (
                      <Link href="/course/mixology-basics">
                        <Button className={`w-full bg-gradient-to-r ${course.color} text-night-blue font-semibold hover:scale-105 transition-all`}>
                          Записаться на курс
                        </Button>
                      </Link>
                    ) : (
                      <Button className={`w-full bg-gradient-to-r ${course.color} text-night-blue font-semibold hover:scale-105 transition-all`}>
                        Скоро откроется
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-96 h-96 bg-neon-turquoise rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-neon-purple rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Left side - Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white px-4">Готовы начать обучение?</h2>
              <p className="text-base sm:text-lg md:text-xl text-cream mb-6 sm:mb-8 px-4">
                Присоединяйтесь к сообществу профессиональных барменов и миксологов
              </p>
              <div className="mt-16 sm:mt-20 md:mt-24">
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-neon-turquoise to-electric text-night-blue px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold hover:scale-105 transition-all shadow-lg shadow-neon-turquoise/30">
                    <WandSparkles className="mr-2 h-5 w-5" />
                    Начать обучение
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right side - Cocktail Image */}
            <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
              <div className="relative">
                <img 
                  src="/attached_assets/Flux_Dev_a_lush_3d_render_of_A_stylized_artistic_illustration__3-Photoroom_1752879813613.png"
                  alt="Стилизованный коктейль"
                  className="w-64 sm:w-80 h-auto object-contain relative z-10"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(138, 43, 226, 0.3)) drop-shadow(0 15px 30px rgba(0, 255, 255, 0.2))',
                  }}
                  loading="lazy"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 rounded-full blur-3xl -z-10 animate-pulse" style={{willChange: 'transform, opacity'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
