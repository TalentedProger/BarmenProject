import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Martini, Menu } from "lucide-react";

export default function Header() {

  const NavItems = () => (
    <>
      <Link href="/constructor">
        <Button variant="ghost" className="hover:text-electric text-zinc">
          Конструктор
        </Button>
      </Link>
      <Link href="/generator">
        <Button variant="ghost" className="hover:text-electric text-zinc">
          Генератор
        </Button>
      </Link>
      <Link href="/catalog">
        <Button variant="ghost" className="hover:text-electric text-zinc">
          Каталог
        </Button>
      </Link>
      <Link href="/profile">
        <Button variant="ghost" className="hover:text-electric text-zinc">
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
            <div className="flex items-center space-x-3 cursor-pointer">
              <Martini className="text-electric text-2xl" />
              <h1 className="text-xl font-bold text-platinum">Cocktailo Maker</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>
          
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-electric">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-effect border-none">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
