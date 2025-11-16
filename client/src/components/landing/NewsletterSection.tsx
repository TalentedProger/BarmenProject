import { memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const NewsletterSection = memo(() => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailSubmit = useCallback((e: React.FormEvent) => {
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
    
    console.log("Подписка на email:", email);
    alert("Спасибо за подписку!");
    setEmail("");
  }, [email]);

  return (
    <section className="py-16 bg-[#101013] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-cyan-400/20 blur-xl"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{willChange: 'transform, opacity'}}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" style={{willChange: 'transform, opacity'}}></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="md:hidden flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#F1F1F1] mb-2" style={{ textShadow: '0 0 5px #00f7ef33' }}>
              Будь в курсе новых рецептов и фишек
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Мы не спамим. Только крафтовые новости.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="/attached_assets/Flux_Dev_a_lush_3d_render_of_A_stylized_artistic_illustration__3-Photoroom_1752879813613.png"
                alt="Стилизованный коктейль"
                className="w-60 h-auto object-contain relative z-10"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(138, 43, 226, 0.3))' }}
                loading="lazy"
                width="240"
                height="240"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 rounded-full blur-xl -z-10"></div>
            </div>
          </div>
          
          <div className="w-full max-w-sm">
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введи свой email"
                    className={`rounded-full px-6 text-sm bg-[#1A1A1E] text-white border focus:outline-none transition-all duration-300 w-full h-[44px] ${
                      emailError 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-zinc-700 focus:border-cyan-500'
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1 pl-4">{emailError}</p>
                  )}
                </div>
                <Button 
                  type="submit"
                  className="rounded-full px-6 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-semibold hover:scale-105 transition-all duration-300 shadow-md shadow-cyan-500/30 w-full h-[44px]"
                >
                  Подписаться
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mb-2" style={{ textShadow: '0 0 5px #00f7ef33' }}>
              Будь в курсе новых рецептов и фишек
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mt-2 mb-16">
              Мы не спамим. Только крафтовые новости.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 md:items-start">
                <div className="flex flex-col w-full md:w-auto md:min-w-[320px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введи свой email"
                    className={`rounded-full px-6 text-sm bg-[#1A1A1E] text-white border focus:outline-none transition-all duration-300 w-full h-[44px] ${
                      emailError 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-zinc-700 focus:border-cyan-500'
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1 pl-4">{emailError}</p>
                  )}
                </div>
                <Button 
                  type="submit"
                  className="rounded-full px-8 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-semibold hover:scale-105 transition-all duration-300 shadow-md shadow-cyan-500/30 h-[44px] whitespace-nowrap"
                >
                  Подписаться
                </Button>
              </div>
            </form>
          </div>
          
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <img 
                src="/attached_assets/Flux_Dev_a_lush_3d_render_of_A_stylized_artistic_illustration__3-Photoroom_1752879813613.png"
                alt="Стилизованный коктейль"
                className="w-80 h-auto object-contain relative z-10"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(138, 43, 226, 0.3))' }}
                loading="lazy"
                width="320"
                height="320"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

NewsletterSection.displayName = "NewsletterSection";

export default NewsletterSection;
