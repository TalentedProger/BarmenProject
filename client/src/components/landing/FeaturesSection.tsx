import { memo, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Martini, Dice2, BookOpen, GraduationCap, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
}

const features: Feature[] = [
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
    icon: GraduationCap,
    title: "Специальные курсы",
    description: "Обучение от профессиональных барменов: от основ миксологии до авторских техник",
    bgColor: "bg-green-500"
  }
];

const FeatureCard = memo(({ feature, index }: { feature: Feature; index: number }) => {
  const IconComponent = feature.icon;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`p-2 h-full ${visible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: 'both',
        willChange: 'opacity, transform'
      }}
    >
      <Card 
        className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-transform duration-300 rounded-2xl overflow-hidden hover:-translate-y-1 w-full h-full"
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform'
        }}
      >
        <CardContent className="p-8 text-center h-full flex flex-col items-center justify-center">
          <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-200 shadow-lg`}>
            <IconComponent className="text-night-blue text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-platinum mb-3">{feature.title}</h3>
          <p className="text-zinc text-base leading-relaxed">{feature.description}</p>
        </CardContent>
      </Card>
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

const FeaturesSection = memo(() => {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-900 to-night-blue relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-20 w-96 h-96 bg-neon-purple rounded-full blur-3xl" style={{willChange: 'transform, opacity'}}></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-turquoise rounded-full blur-3xl" style={{willChange: 'transform, opacity'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-platinum max-[480px]:text-2xl">Возможности платформы</h2>
          <p className="text-lg text-zinc max-w-2xl mx-auto">
            Все инструменты для создания идеальных коктейлей в одном месте
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="h-[280px]">
              <FeatureCard feature={feature} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
