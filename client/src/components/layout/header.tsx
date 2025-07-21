import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Martini, Menu, WandSparkles, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { handleLogout } from "@/lib/authUtils";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      toast({
        title: "До свидания!",
        description: "Вы успешно вышли из системы.",
      });
      window.location.href = '/';
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из системы.",
        variant: "destructive",
      });
    },
  });

  const handleLogoutClick = () => {
    logoutMutation.mutate();
  };

  const NavItems = () => (
    <>
      <Link href="/constructor">
        <Button variant="ghost" className="hover:text-white text-zinc">
          Конструктор
        </Button>
      </Link>
      <Link href="/generator">
        <Button variant="ghost" className="hover:text-white text-zinc">
          Генератор
        </Button>
      </Link>
      <Link href="/catalog">
        <Button variant="ghost" className="hover:text-white text-zinc">
          Каталог
        </Button>
      </Link>
      <Link href="/profile">
        <Button variant="ghost" className="hover:text-white text-zinc">
          Профиль
        </Button>
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-graphite border-b border-border">
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
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {!isLoading && !isAuthenticated ? (
                <>
                  <Link href="/constructor">
                    <Button 
                      className="bg-gradient-to-r from-neon-turquoise to-electric text-black font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-neon-turquoise/30"
                    >
                      <WandSparkles className="mr-2 h-4 w-4" />
                      Начать
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button 
                      variant="outline"
                      className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:text-white transition-all duration-300 hover:scale-105"
                    >
                      Вход
                    </Button>
                  </Link>
                </>
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImageUrl || undefined} alt={user.nickname || "User"} />
                        <AvatarFallback className="bg-gradient-to-r from-neon-turquoise to-neon-purple text-black font-semibold">
                          {user.nickname?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium">
                        {user.nickname || 'Пользователь'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-lg border-white/20">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Профиль
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogoutClick}
                      disabled={logoutMutation.isPending}
                      className="flex items-center cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-electric">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-effect border-none">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavItems />
                  {/* Mobile Auth Buttons */}
                  <div className="pt-4 border-t border-white/20">
                    {!isLoading && !isAuthenticated ? (
                      <>
                        <Link href="/constructor">
                          <Button className="w-full mb-2 bg-gradient-to-r from-neon-turquoise to-electric text-black font-semibold">
                            <WandSparkles className="mr-2 h-4 w-4" />
                            Начать
                          </Button>
                        </Link>
                        <Link href="/auth">
                          <Button variant="outline" className="w-full border-neon-purple text-neon-purple">
                            Вход
                          </Button>
                        </Link>
                      </>
                    ) : isAuthenticated && user ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                            <AvatarFallback className="bg-gradient-to-r from-neon-turquoise to-neon-purple text-black font-semibold">
                              {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">
                              {user.firstName || user.email?.split('@')[0] || 'Пользователь'}
                            </p>
                            <p className="text-white/70 text-sm">{user.email}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={handleLogoutClick}
                          disabled={logoutMutation.isPending}
                          variant="outline" 
                          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Выйти
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
