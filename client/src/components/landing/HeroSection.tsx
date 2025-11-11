import { memo } from "react";
import { Button } from "@/components/ui/button";
import { WandSparkles, BookOpen } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = memo(({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="pt-20 pb-8 relative overflow-hidden min-h-[75vh] max-[480px]:min-h-[auto] max-[480px]:pb-4">
      <div className="absolute inset-0 bg-gradient-to-br from-night-blue via-graphite to-charcoal"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple rounded-full blur-3xl animate-pulse-slow" style={{willChange: 'transform, opacity'}}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-turquoise rounded-full blur-3xl animate-pulse-slow" style={{willChange: 'transform, opacity'}}></div>
      </div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center py-24 max-[480px]:py-12 max-[480px]:gap-6">
          <div className="space-y-4 md:pl-8 flex flex-col justify-center animate-fade-in max-[480px]:text-center max-[480px]:space-y-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-platinum leading-tight max-[480px]:text-2xl md:max-w-[450px] lg:max-w-[500px]">
              Создай свой идеальный коктейль
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-zinc max-w-2xl leading-relaxed max-[480px]:text-xs max-[480px]:px-2">
              Интерактивный конструктор напитков с реалистичной визуализацией, расчетом крепости и стоимости
            </p>
          </div>
          
          <div className="flex justify-center md:justify-end items-center animate-slide-up max-[480px]:mt-2">
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
              <img 
                src="/attached_assets/Leonardo_Phoenix_10_A_futuristic_interactive_cocktail_creation_0 (1)_1752851226590.png"
                alt="Interactive cocktail creation"
                className="hero-image relative z-10"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable="false"
                width="500"
                height="500"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-2xl transform scale-75"></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 justify-center items-center mt-12 max-[480px]:mt-6 max-[480px]:gap-3 w-full">
          <Button 
            onClick={onGetStarted}
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
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
