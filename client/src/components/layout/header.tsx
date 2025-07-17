import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Martini, Menu, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const NavItems = () => (
    <>
      <Link href="/constructor">
        <Button variant="ghost" className="hover:text-neon-turquoise">
          Конструктор
        </Button>
      </Link>
      <Link href="/generator">
        <Button variant="ghost" className="hover:text-neon-turquoise">
          Генератор
        </Button>
      </Link>
      <Link href="/catalog">
        <Button variant="ghost" className="hover:text-neon-turquoise">
          Каталог
        </Button>
      </Link>
      <Link href="/profile">
        <Button variant="ghost" className="hover:text-neon-turquoise">
          Профиль
        </Button>
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Martini className="text-neon-turquoise text-2xl" />
              <h1 className="text-xl font-bold text-neon-turquoise">Конструктор Коктейлей</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-cream text-sm">
                  {user.firstName || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-neon-turquoise hover:text-neon-pink"
                >
                  Выход
                </Button>
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-neon-turquoise">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-effect border-none">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavItems />
                  {user && (
                    <div className="border-t border-gray-700 pt-4">
                      <p className="text-cream text-sm mb-2">
                        {user.firstName || user.email}
                      </p>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-neon-turquoise hover:text-neon-pink w-full justify-start"
                      >
                        Выход
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
