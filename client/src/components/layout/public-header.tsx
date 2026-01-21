import { Link } from "wouter";
import { Martini, Menu } from "lucide-react";

export default function PublicHeader() {
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
              <h1 className="text-xl font-bold text-platinum whitespace-nowrap">Cocktailo Maker</h1>
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
            <details className="relative">
              <summary className="list-none cursor-pointer rounded-lg p-2 hover:bg-white/5 text-white/80">
                <Menu className="h-6 w-6" />
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-graphite/95 backdrop-blur p-2 shadow-xl">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                      {item.label}
                    </a>
                  </Link>
                ))}
                <div className="my-2 h-px bg-white/10" />
                <Link href="/auth">
                  <a className="block px-3 py-2 rounded-lg text-neon-purple hover:text-white hover:bg-neon-purple/10 transition-colors">
                    Вход
                  </a>
                </Link>
              </div>
            </details>
          </div>
        </div>
      </nav>
    </header>
  );
}
