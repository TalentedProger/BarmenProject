import { BookOpen, Video, Beaker, Award } from "lucide-react";

const CoursesSection = () => {
  const courses = [
    {
      title: "Основы миксологии",
      level: "Новичок",
      image: "/attached_assets/7b2e9f21-5799-4ec1-94a8-77404805e855_1752844481467.jpg",
      levelColor: "text-emerald-400",
      bgGradient: "from-emerald-500/20 to-cyan-500/20"
    },
    {
      title: "Креативный декор", 
      level: "Средний",
      image: "/attached_assets/6d059335-5b16-412d-b1e0-9d4fdec2fabd_1752844498127.jpg",
      levelColor: "text-amber-400",
      bgGradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      title: "Продвинутые техники",
      level: "Профи", 
      image: "/attached_assets/Leonardo_Phoenix_10_A_modern_elegant_cocktail_in_a_coupe_glass_3_1752844509292.jpg",
      levelColor: "text-purple-400",
      bgGradient: "from-purple-500/20 to-pink-500/20"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      text: "10+ курсов",
      accent: "text-pink-400",
      description: "от базовых до авторских техник"
    },
    {
      icon: Video,
      text: "Видео и инфографика", 
      accent: "text-cyan-400",
      description: "учись в любое время"
    },
    {
      icon: Beaker,
      text: "Практика и рецепты",
      accent: "text-amber-300", 
      description: "собирай напитки в конструкторе"
    },
    {
      icon: Award,
      text: "Сертификат",
      accent: "text-violet-300",
      description: "подтверждай свои навыки"
    }
  ];

  return (
    <section className="py-16 bg-[#0C0C1C] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content Block */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-[#00FFF0] mb-4 leading-tight">
                Стань мастером коктейлей
              </h2>
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Интерактивные мини-курсы по миксологии, техникам и креативу для барменов и ценителей напитков.
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3 text-base text-gray-300">
                  <feature.icon className={`w-5 h-5 mt-1 ${feature.accent}`} />
                  <span>
                    <span className={`${feature.accent} font-medium`}>{feature.text}</span>
                    {" — "}
                    <span>{feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="inline-block px-8 py-4 rounded-xl text-white bg-gradient-to-r from-[#FF4D9D] to-[#B388EB] hover:from-[#FF4D9D]/90 hover:to-[#B388EB]/90 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 font-medium text-lg">
                Изучить курсы
              </button>
            </div>
          </div>

          {/* Right Visual Block */}
          <div className="relative flex flex-col items-center space-y-8">
            {/* Main Illustration Area */}
            <div className="relative">
              {/* Bartender Image */}
              <div className="relative w-80 h-96 rounded-2xl overflow-hidden border border-slate-700/50 animate-shimmer-shadow">
                <img 
                  src="/attached_assets/Leonardo_Phoenix_10_A_stylish_male_bartender_with_rolledup_sle_2 (1)_1752845021301.jpg"
                  alt="Professional bartender creating cocktails"
                  className="w-full h-full object-cover"
                />
                {/* Dynamic glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-pink-400/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Популярные курсы</h3>
          
          <div className="grid md:grid-cols-3 gap-6 w-[90%] mx-auto">
            {courses.map((course, index) => (
              <div key={index} className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-slate-900/20 flex flex-col">
                {/* Course Image */}
                <div className="w-full h-64 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Course Content */}
                <div className="flex flex-col flex-1">
                  <h4 className="text-white text-xl font-semibold group-hover:text-cyan-300 transition-colors whitespace-nowrap overflow-hidden text-ellipsis mb-2">
                    {course.title}
                  </h4>
                  <span className={`text-sm font-medium ${course.levelColor} mb-4`}>
                    {course.level}
                  </span>
                  
                  <button className="w-full mt-auto px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white rounded-lg transition-all duration-300 font-medium hover:shadow-lg hover:shadow-pink-500/25">
                    Записаться
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;