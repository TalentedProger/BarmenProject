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
              <a
                href="https://t.me/cocktailo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 hover:scale-110"
                style={{
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24">
                  <path d="M19.2,4.4L2.9,10.7c-1.1,0.4-1.1,1.1-0.2,1.3l4.1,1.3l1.6,4.8c0.2,0.5,0.1,0.7,0.6,0.7c0.4,0,0.6-0.2,0.8-0.4 c0.1-0.1,1-1,2-2l4.2,3.1c0.8,0.4,1.3,0.2,1.5-0.7l2.8-13.1C20.6,4.6,19.9,4,19.2,4.4z M17.1,7.4l-7.8,7.1L9,17.8L7.4,13l9.2-5.8 C17,6.9,17.4,7.1,17.1,7.4z"/>
                </svg>
              </a>
              
              <a
                href="https://vk.com/cocktailo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 hover:scale-110"
                style={{
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <svg fill="none" stroke="currentColor" width="16" height="16" viewBox="0 0 48 48">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M27.55,35.19V28.55c4.46.68,5.87,4.19,8.71,6.64H43.5a29.36,29.36,0,0,0-7.9-10.47c2.6-3.58,5.36-6.95,6.71-12.06H35.73c-2.58,3.91-3.94,8.49-8.18,11.51V12.66H18l2.28,2.82,0,10.05c-3.7-.43-6.2-7.2-8.91-12.87H4.5C7,20.32,12.26,37.13,27.55,35.19Z"/>
                </svg>
              </a>
              
              <a
                href="https://instagram.com/cocktailo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 hover:scale-110"
                style={{
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"/>
                  <path d="M18 5C18.5523 5 19 5.44772 19 6C19 6.55228 18.5523 7 18 7C17.4477 7 17 6.55228 17 6C17 5.44772 17.4477 5 18 5Z"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
