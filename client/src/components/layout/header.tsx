import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Martini, Menu, WandSparkles, LogOut, User, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { handleLogout } from "@/lib/authUtils";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCallback, useMemo, useEffect, memo } from "react";
import { useLocation } from "wouter";

// Логирование этапа загрузки
const logStep = (step: string) => {
  if (typeof window !== 'undefined' && (window as any).logLoadStep) {
    (window as any).logLoadStep(step);
  }
};

logStep('header.tsx module loaded');

interface HeaderProps {
  useProfileDropdown?: boolean;
}

// Мемоизированные навигационные ссылки - вынесены наружу для стабильности
const navItems = [
  { href: '/', label: 'Главная', hideBelowLg: true },
  { href: '/constructor', label: 'Конструктор', hideBelowLg: false },
  { href: '/generator', label: 'Генератор', hideBelowLg: false },
  { href: '/catalog', label: 'Каталог', hideBelowLg: false }
] as const;

// Мемоизированный компонент навигации
const NavItems = memo(({ currentPath }: { currentPath: string }) => (
  <>
    {navItems.map((item) => (
      <Link key={item.href} href={item.href}>
        <Button variant="ghost" className={`text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-150 rounded-lg ${
          currentPath === item.href ? 'bg-white/10 text-white' : ''
        } ${item.hideBelowLg ? 'hidden lg:inline-flex' : ''}`}>
          {item.label}
        </Button>
      </Link>
    ))}
  </>
));
NavItems.displayName = 'NavItems';

// Skeleton для кнопки авторизации с фиксированными размерами для предотвращения CLS
const AuthButtonSkeleton = memo(() => (
  <div className="h-10 w-[72px] bg-white/10 rounded-md animate-pulse" style={{ minWidth: '72px' }} />
));
AuthButtonSkeleton.displayName = 'AuthButtonSkeleton';

function Header({ useProfileDropdown = true }: HeaderProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();

  const userDisplayData = useMemo(() => {
    if (!user) return null;
    return {
      nickname: (user as any)?.nickname || 'Пользователь',
      email: (user as any)?.email || '',
      profileImageUrl: (user as any)?.profileImageUrl,
      avatar: (user as any)?.nickname?.charAt(0) || (user as any)?.email?.charAt(0) || 'U'
    };
  }, [user]);

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

  const handleLogoutClick = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-graphite border-b border-border" style={{ height: '72px' }}>
      <nav className="container mx-auto px-4 py-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Martini className="text-electric text-2xl" style={{ width: '24px', height: '24px' }} />
              <h1 className="text-xl font-bold text-platinum whitespace-nowrap" translate="no">Cocktailo Maker</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavItems currentPath={location} />
          </div>
          
          <div className="flex items-center space-x-4" style={{ minHeight: '40px' }}>
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3" style={{ minWidth: '72px' }}>
              {isLoading ? (
                <AuthButtonSkeleton />
              ) : !isAuthenticated ? (
                <Link href="/auth">
                  <Button 
                    variant="outline"
                    className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:text-white transition-colors duration-150"
                    style={{ minWidth: '72px' }}
                  >
                    Вход
                  </Button>
                </Link>
              ) : isAuthenticated && user ? (
                useProfileDropdown ? (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10 md:justify-start justify-end focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-turquoise focus-visible:ring-offset-0">
                        <Avatar className="h-8 w-8 shadow-sm shadow-black/30 ring-1 ring-white/10">
                          <AvatarImage src={userDisplayData?.profileImageUrl || undefined} alt={userDisplayData?.nickname || "User"} />
                          <AvatarFallback className="bg-gradient-to-r from-neon-turquoise to-neon-purple text-black font-semibold">
                            {userDisplayData?.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium hidden xl:inline">
                          {userDisplayData?.nickname}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      side="bottom"
                      align="end" 
                      sideOffset={8} 
                      className="bg-black/90 backdrop-blur-lg border-white/20 w-48"
                    >
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Профиль
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites" className="flex items-center cursor-pointer">
                          <Heart className="mr-2 h-4 w-4" />
                          Избранное
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
                ) : (
                  <Link href="/profile">
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10 p-2 rounded-lg transition-all duration-300 hover:scale-105">
                      <Avatar className="h-8 w-8 shadow-sm shadow-black/30 ring-1 ring-white/10">
                        <AvatarImage src={userDisplayData?.profileImageUrl || undefined} alt={userDisplayData?.nickname || "User"} />
                        <AvatarFallback className="bg-gradient-to-r from-neon-turquoise to-neon-purple text-black font-semibold">
                          {userDisplayData?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium hidden xl:inline">
                        {userDisplayData?.nickname}
                      </span>
                    </Button>
                  </Link>
                )
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
                  {/* User Profile Section - At top when logged in */}
                  {isAuthenticated && user && (
                    <div className="pb-4 border-b border-white/20">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left p-3 hover:bg-white/10 transition-colors mb-2"
                        onClick={() => window.location.href = "/profile"}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 shadow-sm shadow-black/30 ring-1 ring-white/10">
                            <AvatarImage src={userDisplayData?.profileImageUrl || undefined} alt={userDisplayData?.nickname || "User"} />
                            <AvatarFallback className="bg-gradient-to-r from-neon-turquoise to-neon-purple text-black font-semibold">
                              {userDisplayData?.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {userDisplayData?.nickname}
                            </p>
                            <p className="text-white/70 text-xs">{userDisplayData?.email}</p>
                          </div>
                        </div>
                      </Button>
                      <Link href="/favorites">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left p-3 hover:bg-white/10 transition-colors"
                        >
                          <Heart className="mr-3 h-4 w-4 text-pink-400" />
                          <span className="text-white">Избранное</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  <NavItems currentPath={location} />
                  {/* Mobile Auth Buttons */}
                  <div className="pt-4 border-t border-white/20">
                    {isLoading ? (
                      /* Show skeleton button during loading */
                      <div className="h-10 w-full bg-white/10 rounded-md animate-pulse" />
                    ) : !isAuthenticated ? (
                      <>
                        <Link href="/auth">
                          <Button variant="outline" className="w-full border-neon-purple text-neon-purple">
                            Вход
                          </Button>
                        </Link>
                      </>
                    ) : isAuthenticated && user ? (
                      <>
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

export default memo(Header);