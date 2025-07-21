export default function Footer() {
  return (
    <footer 
      className="relative py-24 text-white"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      }}
    >
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="container mx-auto px-6 relative">
        {/* Top section with links */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-neon-pink to-neon-turquoise bg-clip-text text-transparent">
              Cocktailo
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Современная платформа для создания уникальных коктейлей с AI-ассистентом и реалистичной 3D визуализацией
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-neon-turquoise">Продукт</h4>
            <ul className="space-y-3 text-zinc-400">
              <li><a href="/constructor" className="hover:text-neon-turquoise transition-colors">Конструктор</a></li>
              <li><a href="/generator" className="hover:text-neon-turquoise transition-colors">Генератор</a></li>
              <li><a href="/catalog" className="hover:text-neon-turquoise transition-colors">Каталог</a></li>
              <li><a href="/profile" className="hover:text-neon-turquoise transition-colors">Профиль</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-neon-turquoise">Поддержка</h4>
            <ul className="space-y-3 text-zinc-400">
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Помощь</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Контакты</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Обратная связь</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-neon-turquoise">Компания</h4>
            <ul className="space-y-3 text-zinc-400">
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">О нас</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Блог</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Карьера</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Пресс-кит</a></li>
            </ul>
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
              {[
                { icon: '📱', label: 'Telegram', url: 'https://t.me/cocktailo' },
                { icon: '🟣', label: 'VK', url: 'https://vk.com/cocktailo' },
                { icon: '📸', label: 'Instagram', url: 'https://instagram.com/cocktailo' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 hover:scale-110"
                  style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.boxShadow = 'none';
                  }}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
