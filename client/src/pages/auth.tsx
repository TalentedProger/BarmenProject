import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Martini, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Введите email адрес";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email адрес";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Введите пароль";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }
    
    if (!isLogin && !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // В будущем здесь будет логика аутентификации
    console.log(isLogin ? "Вход:" : "Регистрация:", formData);
    alert(isLogin ? "Добро пожаловать в Cocktailo!" : "Регистрация успешна!");
    
    // Переход на конструктор после успешной аутентификации
    window.location.href = "/constructor";
  };

  const handleGuestLogin = () => {
    // Переход в гостевой режим
    window.location.href = "/constructor";
  };

  const handleGoogleLogin = () => {
    // В будущем здесь будет интеграция с Google OAuth
    alert("Функция входа через Google будет добавлена позже");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0D] to-[#121212] relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/attached_assets/Flux_Dev_a_lush_3d_render_of_A_dark_ambient_bar_interior_at_ni_3_1752955194546.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]"></div>
      </div>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-neon-turquoise rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-neon-purple rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-400 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      {/* Back Button */}
      <Link href="/">
        <Button 
          variant="ghost" 
          className="absolute top-6 left-6 z-50 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          На главную
        </Button>
      </Link>
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Visual (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
          <div className="text-center max-w-md">
            {/* Futuristic Cocktail Glass Image with Title Inside */}
            <div className="mx-auto relative py-8">
              <div className="relative group">
                {/* Title positioned inside container at top */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center w-full px-4">
                  <h1 
                    className="font-bold text-center text-[38px] leading-tight bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: 'Rubik, system-ui, sans-serif',
                      fontWeight: '800',
                      letterSpacing: '-0.02em',
                      textShadow: '0 0 30px rgba(96, 165, 250, 0.6), 0 0 60px rgba(168, 85, 247, 0.4), 0 0 90px rgba(236, 72, 153, 0.3)',
                      filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.5)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))'
                    }}
                  >
                    Добро пожаловать<br />
                    <span className="text-[34px] bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                      в Cocktailo
                    </span>
                  </h1>
                </div>
                
                <img 
                  src="/attached_assets/Flux_Dev_a_lush_3d_render_of_Stylized_futuristic_cocktail_glas_3 (1)-Photoroom_1752957568046.png"
                  alt="Футуристический коктейльный бокал с неоновыми оттенками"
                  className="w-80 h-auto object-contain mx-auto relative z-10 transition-all duration-700 group-hover:scale-105 pt-16 pb-8"
                  loading="eager"
                />
                
                {/* Спокойные динамические тени */}
                <div className="absolute inset-0 -z-10">
                  {/* Основная мягкая тень */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-30"
                    style={{
                      background: 'radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, rgba(0, 255, 247, 0.3) 50%, rgba(255, 110, 199, 0.2) 100%)',
                      animationDuration: '4s'
                    }}
                  ></div>
                  
                  {/* Вторичная тень */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-2xl animate-pulse opacity-20"
                    style={{
                      background: 'radial-gradient(circle, rgba(0, 255, 247, 0.5) 0%, rgba(192, 132, 252, 0.4) 70%, transparent 100%)',
                      animationDuration: '6s',
                      animationDelay: '1s'
                    }}
                  ></div>
                  
                  {/* Третья мягкая тень */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-xl animate-pulse opacity-25"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 110, 199, 0.4) 0%, rgba(179, 136, 235, 0.3) 60%, transparent 100%)',
                      animationDuration: '8s',
                      animationDelay: '2s'
                    }}
                  ></div>
                  
                  {/* Базовая тень под бокалом */}
                  <div 
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 rounded-full blur-lg opacity-40"
                    style={{
                      background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.6) 0%, transparent 70%)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Quote */}
            <blockquote className="text-xl italic text-white/80 leading-relaxed -mt-4" style={{ textShadow: '0 0 5px rgba(192, 132, 252, 0.3)' }}>
              "Каждый коктейль начинается с твоей идеи."
            </blockquote>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border border-white/10 shadow-2xl">
            <CardContent className="p-8">
              {/* Toggle Tabs */}
              <div className="flex mb-8 bg-white/5 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-300 ${
                    isLogin
                      ? 'bg-cyan-500/70 text-white shadow-lg shadow-cyan-500/20 border border-cyan-500/70'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Вход
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-300 ${
                    !isLogin
                      ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-black shadow-lg shadow-neon-purple/30 border border-neon-purple/50'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Регистрация
                </button>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className={`pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-neon-turquoise focus:ring-1 focus:ring-neon-turquoise transition-all duration-300 ${
                        errors.email ? 'border-red-500 focus:border-red-400 focus:ring-red-400' : ''
                      }`}
                      style={{
                        boxShadow: formData.email ? '0 0 5px rgba(0, 255, 247, 0.3)' : 'none'
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90 font-medium">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      className={`pl-12 pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-neon-turquoise focus:ring-1 focus:ring-neon-turquoise transition-all duration-300 font-mono ${
                        errors.password ? 'border-red-500 focus:border-red-400 focus:ring-red-400' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field (Registration Only) */}
                {!isLogin && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="confirmPassword" className="text-white/90 font-medium">Подтвердите пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className={`pl-12 pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-neon-turquoise focus:ring-1 focus:ring-neon-turquoise transition-all duration-300 font-mono ${
                          errors.confirmPassword ? 'border-red-500 focus:border-red-400 focus:ring-red-400' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-neon-turquoise to-electric text-black font-semibold py-3 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-neon-turquoise/30 hover:shadow-neon-turquoise/50"
                >
                  <Martini className="mr-2 h-5 w-5" />
                  {isLogin ? 'Войти в Cocktailo' : 'Создать аккаунт'}
                </Button>

                {/* Forgot Password (Login Only) */}
                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="group relative text-sm font-medium text-cyan-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                      style={{ 
                        textShadow: '0 0 8px rgba(34, 211, 238, 0.4)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textShadow = '0 0 15px rgba(34, 211, 238, 0.8), 0 0 25px rgba(34, 211, 238, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textShadow = '0 0 8px rgba(34, 211, 238, 0.4)';
                      }}
                    >
                      <span className="relative z-10">Забыли пароль?</span>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                    </button>
                  </div>
                )}

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-white/70">или</span>
                  </div>
                </div>

                {/* Alternative Login */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="w-full bg-transparent border border-white/30 text-white hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Войти через Google
                </Button>

                {/* Guest Login */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGuestLogin}
                  className="w-full group relative bg-transparent border border-purple-400/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/60 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  style={{ 
                    textShadow: '0 0 10px rgba(196, 181, 253, 0.4)',
                    boxShadow: '0 0 15px rgba(196, 181, 253, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.textShadow = '0 0 15px rgba(196, 181, 253, 0.8), 0 0 25px rgba(196, 181, 253, 0.5)';
                    e.target.style.boxShadow = '0 0 25px rgba(196, 181, 253, 0.4), 0 0 40px rgba(196, 181, 253, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textShadow = '0 0 10px rgba(196, 181, 253, 0.4)';
                    e.target.style.boxShadow = '0 0 15px rgba(196, 181, 253, 0.2)';
                  }}
                >
                  <svg className="mr-2 h-4 w-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Войти как гость
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/5 to-cyan-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}