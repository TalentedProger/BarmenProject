import { Martini, Instagram, Send, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-graphite border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Martini className="text-neon-turquoise text-2xl" />
              <h3 className="text-xl font-bold text-neon-turquoise">Конструктор Коктейлей</h3>
            </div>
            <p className="text-cream text-sm">
              Современная платформа для создания и изучения коктейлей с реалистичной визуализацией
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-neon-amber mb-4">Продукт</h4>
            <ul className="space-y-2 text-cream text-sm">
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Конструктор</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Генератор</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Каталог</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Профиль</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-neon-amber mb-4">Поддержка</h4>
            <ul className="space-y-2 text-cream text-sm">
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Помощь</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Контакты</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-neon-turquoise transition-colors">Обратная связь</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-neon-amber mb-4">Социальные сети</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-neon-turquoise hover:text-neon-pink transition-colors text-xl">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neon-turquoise hover:text-neon-pink transition-colors text-xl">
                <Send className="h-6 w-6" />
              </a>
              <a href="#" className="text-neon-turquoise hover:text-neon-pink transition-colors text-xl">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-cream text-sm">&copy; 2024 Конструктор Коктейлей. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
