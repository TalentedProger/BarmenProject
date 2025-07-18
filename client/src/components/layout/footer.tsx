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
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-zinc text-sm">&copy; 2025 Cocktailo Maker. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
