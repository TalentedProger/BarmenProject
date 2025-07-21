import { Martini, Instagram, Send, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-graphite border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Martini className="text-electric text-2xl" />
              <h3 className="text-xl font-bold text-platinum">Cocktailo Maker</h3>
            </div>
            <p className="text-zinc text-sm">
              Современная платформа для создания и изучения коктейлей с реалистичной визуализацией
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-electric mb-4">Продукт</h4>
            <ul className="space-y-2 text-zinc text-sm">
              <li><a href="#" className="hover:text-electric transition-colors">Конструктор</a></li>
              <li><a href="#" className="hover:text-electric transition-colors">Генератор</a></li>
              <li><a href="#" className="hover:text-electric transition-colors">Каталог</a></li>
              <li><a href="#" className="hover:text-electric transition-colors">Профиль</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-electric mb-4">Поддержка</h4>
            <ul className="space-y-2 text-zinc text-sm">
              <li><a href="#" className="hover:text-electric transition-colors">Помощь</a></li>
              <li><a href="#" className="hover:text-electric transition-colors">Контакты</a></li>
              <li><a href="#" className="hover:text-electric transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-electric transition-colors">Обратная связь</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-electric mb-4">Социальные сети</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-electric hover:text-platinum transition-colors text-xl">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-electric hover:text-platinum transition-colors text-xl">
                <Send className="h-6 w-6" />
              </a>
              <a href="#" className="text-electric hover:text-platinum transition-colors text-xl">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm">
              &copy; 2025 Cocktailo. Все права защищены.
            </p>
            
            {/* Social icons */}
            <div className="flex space-x-6 mt-4 md:mt-0">
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
                    (e.target as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.boxShadow = 'none';
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
