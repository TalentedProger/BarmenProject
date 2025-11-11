import { memo, useState, useCallback } from "react";
import { Martini } from "lucide-react";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const FooterSection = memo(() => {
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

  const links = [
    { label: 'О проекте', href: '/about' },
    { label: 'Курсы', href: '/courses' },
    { label: 'Мобильное приложение', href: '/mobile' },
    { label: 'Контакты', href: '/contact' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 to-black overflow-hidden">
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
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

            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white mb-4">Быстрые ссылки</h4>
              <nav className="space-y-3">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-zinc-400 hover:text-cyan-300 transition-all duration-300 hover:translate-x-2"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

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
                >
                  Подписаться
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-zinc-500 text-sm">
                © 2025 Cocktailo. Все права защищены.
              </p>
              <div className="flex space-x-6 text-zinc-500 text-sm">
                <a href="/privacy" className="hover:text-cyan-300 transition-colors">Конфиденциальность</a>
                <a href="/terms" className="hover:text-cyan-300 transition-colors">Условия использования</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

FooterSection.displayName = "FooterSection";

export default FooterSection;
