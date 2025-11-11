import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Star,
  Users,
  GraduationCap,
  Sparkles,
  FileCheck,
  Shield,
  CheckCircle2
} from "lucide-react";

interface Module {
  number: number;
  title: string;
  topics: string[];
}

interface Week {
  number: number;
  modules: Module[];
  image?: string;
}

export default function CourseMixologyBasics() {
  const { toast } = useToast();
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Проверяем статус записи при загрузке
  useEffect(() => {
    const enrolled = localStorage.getItem('course_mixology_basics_enrolled');
    if (enrolled === 'true') {
      setIsEnrolled(true);
    }
  }, []);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev =>
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const handleEnroll = async () => {
    // Если уже записан, показываем уведомление
    if (isEnrolled) {
      toast({
        title: "Вы уже записаны на этот курс",
        description: "Вы успешно зарегистрированы на курс 'Основы миксологии'. Доступ к материалам откроется в вашем личном кабинете.",
        duration: 4000,
      });
      return;
    }

    setIsEnrolling(true);
    
    // Симуляция процесса записи на сервере
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Сохраняем статус записи
    localStorage.setItem('course_mixology_basics_enrolled', 'true');
    setIsEnrolled(true);
    setIsEnrolling(false);
    
    // Показываем успешное уведомление
    toast({
      title: "✨ Поздравляем!",
      description: "Вы успешно записались на курс 'Основы миксологии'. Доступ к материалам откроется в вашем личном кабинете.",
      duration: 5000,
    });
  };

  const learningOutcomes = [
    "Готовить более 30 классических и 10 авторских коктейлей по профессиональным стандартам",
    "Владеть техниками: шейк, стрейр (перемешивание), бленд (смешивание в блендере)",
    "Правильно сочетать алкогольные и безалкогольные компоненты по вкусовому балансу",
    "Проводить дегустацию и описывать аромат, текстуру и структуру напитка",
    "Безопасно и законно обслуживать гостей, зная принципы ответственной подачи алкоголя",
    "Создавать визуально эффектную подачу и атмосферу бара. Научитесь работать с гарнирами, ароматами и подачей напитков, формировать визуальный стиль коктейля и поддерживать имидж профессионального бармена"
  ];

  const weeks: Week[] = [
    {
      number: 1,
      modules: [
        {
          number: 1,
          title: "Введение в миксологию и барную культуру",
          topics: [
            "Что такое коктейль, типы и история развития",
            "Роль бармена, этикет и философия сервиса",
            "Классификация коктейлей и структура барного меню"
          ]
        },
        {
          number: 2,
          title: "Инструменты, стекло и базовое оборудование",
          topics: [
            "Назначение шейкера, стрейнера, джиггера, барной ложки, мадлера",
            "Виды бокалов и подбор посуды под тип напитка",
            "Основы подготовки рабочего места"
          ]
        }
      ],
      image: "/courses/mixology-basics/bar-setup.jpg"
    },
    {
      number: 2,
      modules: [
        {
          number: 3,
          title: "Основные техники приготовления",
          topics: [
            "Техники: shaking, stirring, muddling, building, layering, blending",
            "Разбор ошибок и тонкости исполнения"
          ]
        },
        {
          number: 4,
          title: "Основы дозирования и точности",
          topics: [
            "Работа с джиггером и весами",
            "Формула «1:2:1» — баланс базового коктейля",
            "Практическая отработка дозировки"
          ]
        }
      ],
      image: "/courses/mixology-basics/shaking-action.jpg"
    },
    {
      number: 3,
      modules: [
        {
          number: 5,
          title: "Ингредиенты: спирты, ликёры, биттеры",
          topics: [
            "Категории спиртных напитков, особенности взаимодействия вкусов",
            "Советы по выбору брендов, хранению и качеству"
          ]
        },
        {
          number: 6,
          title: "Соки, сиропы, настойки и фреши",
          topics: [
            "Приготовление сиропов, настоек и фрешей",
            "Секреты баланса сладости и кислотности"
          ]
        }
      ],
      image: "/courses/mixology-basics/ingredients-collage.jpg"
    },
    {
      number: 4,
      modules: [
        {
          number: 7,
          title: "Гарниры и эстетика подачи",
          topics: [
            "Техники нарезки, украшения и ароматизации",
            "Принципы подачи и визуального баланса бокала"
          ]
        },
        {
          number: 8,
          title: "Классические коктейли (практика)",
          topics: [
            "Old Fashioned, Martini, Negroni, Daiquiri, Margarita",
            "Разбор вариаций и типичных ошибок"
          ]
        }
      ]
    },
    {
      number: 5,
      modules: [
        {
          number: 9,
          title: "Современные техники и авторская креативность",
          topics: [
            "Введение в молекулярную миксологию",
            "Создание авторских напитков, работа с биттерами и инфузиями"
          ]
        },
        {
          number: 10,
          title: "Алкоголь, здоровье и законы",
          topics: [
            "Влияние алкоголя на организм",
            "Законодательные аспекты и этика обслуживания",
            "Ответственная подача (RSA/TIPS)"
          ]
        }
      ],
      image: "/courses/mixology-basics/responsible-service.jpg"
    },
    {
      number: 6,
      modules: [
        {
          number: 11,
          title: "Работа с меню и калькуляция себестоимости",
          topics: [
            "Принципы построения меню, формирование цены и себестоимости",
            "Сезонность и управление запасами"
          ]
        },
        {
          number: 12,
          title: "Финальная практика и оценка",
          topics: [
            "Подготовка и демонстрация трёх коктейлей: классический, авторский, безалкогольный",
            "Финальное тестирование и вручение сертификата"
          ]
        }
      ],
      image: "/courses/mixology-basics/graduation.jpg"
    }
  ];

  const classicCocktails = [
    { name: "Old Fashioned", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_deep_amber_Manhattan_in_a_short_0_1753377591759.jpg" },
    { name: "Martini", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_vibrant_orange_Martini_Fiero__T_1_1753377591758.jpg" },
    { name: "Negroni", image: "/attached_assets/Flux_Dev_A_classic_Negroni_in_a_short_glass_with_a_large_ice_c_3_1753377591753.jpg" },
    { name: "Daiquiri", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Daiquiri_in_a_sleek_cocktail_gl_0_1753377591759.jpg" },
    { name: "Margarita", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_classic_Margarita_cocktail_in_a_0_1753377591761.jpg" }
  ];

  const requirements = [
    "Возраст 18+ (в зависимости от законодательства)",
    "Базовый доступ к барной зоне или кухне",
    "Готовность практиковаться 3–5 часов в неделю"
  ];

  const toolsList = [
    "Шейкер (Boston или Cobbler)",
    "Джиггер (25/50 мл)",
    "Барная ложка, стрейнер, нож, терка для цедры",
    "Смесительный стакан, мадлер, лёд (кубы или камни)",
    "Бокалы: коктейльный, олд-фешн, хайбол, мартини"
  ];

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-night-blue via-graphite to-charcoal"></div>
        
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-blue-900/30"></div>
        </div>
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-neon-purple rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-turquoise rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-neon-turquoise/20 text-neon-turquoise border-neon-turquoise text-sm px-4 py-1">
              Начальный уровень
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-neon-turquoise to-neon-purple bg-clip-text text-transparent leading-tight">
              Основы миксологии — курс для начинающих
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-4 text-cream mb-8 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-neon-turquoise" />
                <span>Уровень: Начальный</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>Рейтинг: 4.8/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-neon-purple" />
                <span>6 недель (12 модулей)</span>
              </div>
            </div>
            
            <p className="text-base sm:text-lg text-cream mb-8 max-w-3xl mx-auto leading-relaxed">
              Научитесь готовить классические и авторские коктейли, освоите базовые техники, безопасность обслуживания и умение сочетать ингредиенты. Практика, домашние задания и финальная демонстрация навыков.
            </p>
            
            <Button 
              onClick={handleEnroll}
              disabled={isEnrolling}
              className={`px-10 py-6 text-lg font-semibold hover:scale-105 transition-all shadow-lg disabled:opacity-50 ${
                isEnrolled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30' 
                  : 'bg-gradient-to-r from-neon-turquoise to-electric text-night-blue shadow-neon-turquoise/30'
              }`}
            >
              {isEnrolling ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-night-blue mr-2"></div>
                  Обработка...
                </>
              ) : isEnrolled ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Вы записаны
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Записаться сейчас
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* About Course */}
      <section className="py-16 bg-gradient-to-b from-charcoal to-graphite">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neon-turquoise">
                Почему этот курс важен
              </h2>
              <div className="space-y-4 text-cream leading-relaxed">
                <p>
                  Курс создаёт прочную базу для будущих барменов. Вы освоите техники смешивания, правильное обращение с инструментами, базовую химию вкусов и правила безопасного обслуживания гостей.
                </p>
                <p>
                  Программа сочетает теоретическую базу с практикой и даёт основу для дальнейшего профессионального роста в сфере барной культуры.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-neon-purple/20 to-neon-turquoise/20 rounded-2xl overflow-hidden border border-white/10">
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-neon-turquoise opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-16 bg-gradient-to-b from-graphite to-night-blue">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-neon-purple">
            После прохождения курса вы сможете:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {learningOutcomes.map((outcome, index) => (
              <Card key={index} className="glass-effect border-neon-turquoise/30 hover:border-neon-turquoise/60 transition-all">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-neon-turquoise/20 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-5 h-5 text-neon-turquoise" />
                  </div>
                  <p className="text-cream leading-relaxed">{outcome}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Program */}
      <section className="py-16 bg-gradient-to-b from-night-blue to-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neon-amber">
              Программа курса — 12 модулей за 6 недель
            </h2>
            <p className="text-cream max-w-3xl mx-auto">
              Каждый модуль включает видеоурок, практическое задание и тест.<br />
              Продолжительность: 30–45 минут теории и 60–90 минут практики.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-4">
            {weeks.map((week) => (
              <Card key={week.number} className="glass-effect border-white/10 overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleWeek(week.number)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-neon-turquoise to-neon-purple rounded-lg flex items-center justify-center font-bold text-white">
                        {week.number}
                      </div>
                      <CardTitle className="text-xl text-white">
                        Неделя {week.number}
                      </CardTitle>
                    </div>
                    {expandedWeeks.includes(week.number) ? (
                      <ChevronUp className="w-6 h-6 text-neon-turquoise" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-cream" />
                    )}
                  </div>
                </CardHeader>
                
                {expandedWeeks.includes(week.number) && (
                  <CardContent className="space-y-6 pt-6">
                    {week.modules.map((module) => (
                      <div key={module.number} className="border-l-4 border-neon-turquoise pl-6 py-2">
                        <h4 className="text-lg font-semibold text-neon-turquoise mb-3">
                          Модуль {module.number} — {module.title}
                        </h4>
                        <ul className="space-y-2">
                          {module.topics.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-cream">
                              <div className="w-1.5 h-1.5 bg-neon-purple rounded-full mt-2 flex-shrink-0"></div>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Classic Cocktails Gallery */}
      <section className="py-16 bg-gradient-to-b from-charcoal to-graphite">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-neon-pink">
            Классические коктейли
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {classicCocktails.map((cocktail, index) => (
              <div key={index} className="group">
                <div className="aspect-square bg-gradient-to-br from-neon-purple/20 to-neon-turquoise/20 rounded-xl overflow-hidden border border-white/10 group-hover:border-neon-pink/50 transition-all">
                  <img 
                    src={cocktail.image} 
                    alt={cocktail.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <p className="text-center mt-2 text-sm font-medium text-cream">{cocktail.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="py-16 bg-gradient-to-b from-graphite to-night-blue">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-stretch max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neon-amber">
                Как проходит оценка и получение сертификата
              </h2>
              <div className="space-y-4 text-cream leading-relaxed">
                <p>
                  Каждый модуль завершается коротким тестом и практической задачей. Финальная демонстрация включает приготовление трёх напитков.
                </p>
                <p>
                  Проходной балл — 70% по теории и успешное выполнение практики.
                </p>
                <p>
                  После завершения курса вы получаете именной цифровой сертификат и, при необходимости, рекомендательное письмо для трудоустройства.
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-6 p-4 bg-neon-amber/10 border border-neon-amber/30 rounded-lg">
                <GraduationCap className="w-8 h-8 text-neon-amber flex-shrink-0" />
                <p className="text-sm text-cream">
                  <strong className="text-neon-amber">Сертификат включает:</strong> ваше имя, дату завершения, список освоенных навыков и уникальный номер для проверки
                </p>
              </div>
            </div>
            
            <div className="relative h-full">
              <div className="h-full bg-gradient-to-br from-neon-amber/20 to-neon-turquoise/20 rounded-2xl overflow-hidden border-2 border-neon-amber/30 shadow-2xl shadow-neon-amber/20">
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <FileCheck className="w-24 h-24 text-neon-amber mb-4" />
                  <p className="text-xl font-bold text-white mb-2">Сертификат о прохождении курса</p>
                  <p className="text-sm text-cream">Официальный документ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gradient-to-b from-night-blue to-charcoal">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-neon-purple">
            Что понадобится для обучения
          </h2>
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Requirements */}
            <Card className="glass-effect border-neon-purple/30">
              <CardHeader>
                <CardTitle className="text-xl text-neon-purple flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Требования
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-cream">
                      <Check className="w-5 h-5 text-neon-turquoise flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Tools */}
            <Card className="glass-effect border-neon-turquoise/30">
              <CardHeader>
                <CardTitle className="text-xl text-neon-turquoise flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Минимальный набор инструментов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {toolsList.map((tool, index) => (
                    <li key={index} className="flex items-start gap-3 text-cream">
                      <Check className="w-5 h-5 text-neon-purple flex-shrink-0 mt-0.5" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-96 h-96 bg-neon-turquoise rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-neon-purple rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Начните свой путь в миксологии прямо сейчас!
            </h2>
            <p className="text-lg text-cream mb-8">
              Присоединяйтесь к сообществу будущих барменов и профессионалов
            </p>
            
            {/* Square Image */}
            <div className="w-64 h-64 mx-auto mb-8 rounded-2xl overflow-hidden border-2 border-neon-turquoise/30 shadow-2xl shadow-neon-turquoise/20">
              <img 
                src="/attached_assets/Flux_Dev_a_lush_3d_render_of_A_stylized_artistic_illustration__3-Photoroom_1752879813613.png"
                alt="Стилизованный коктейль"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <Button 
              onClick={handleEnroll}
              disabled={isEnrolling}
              className={`px-12 py-6 text-lg font-semibold hover:scale-105 transition-all shadow-lg disabled:opacity-50 ${
                isEnrolled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30' 
                  : 'bg-gradient-to-r from-neon-turquoise to-electric text-night-blue shadow-neon-turquoise/30'
              }`}
            >
              {isEnrolling ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-night-blue mr-2"></div>
                  Обработка записи...
                </>
              ) : isEnrolled ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Вы записаны на курс
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Записаться на курс
                </>
              )}
            </Button>
            
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-cream">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neon-turquoise" />
                <span>1847+ учеников</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>Рейтинг 4.8/5</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-neon-purple" />
                <span>Сертификат по окончании</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
