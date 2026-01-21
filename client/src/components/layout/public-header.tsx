import { Link } from "wouter";
import { Martini, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { href: "/constructor", label: "Конструктор" },
    { href: "/generator", label: "Генератор" },
    { href: "/catalog", label: "Каталог" },
    { href: "/courses", label: "Курсы" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-graphite border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Martini className="text-electric text-2xl" />
              <h1 className="text-xl font-bold text-platinum whitespace-nowrap" translate="no">Cocktailo Maker</h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 hover:bg-white/5 text-white/80"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 z-40" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-graphite backdrop-blur-md p-2 shadow-xl z-50">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a 
                        className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ))}
                  <div className="my-2 h-px bg-white/10" />
                  <Link href="/auth">
                    <a 
                      className="block px-3 py-2 rounded-lg text-neon-purple hover:text-white hover:bg-neon-purple/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Вход
                    </a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
