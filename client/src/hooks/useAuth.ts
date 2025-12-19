import { useQuery } from "@tanstack/react-query";

console.log('[LOAD] useAuth.ts module loaded');

export function useAuth() {
  console.log('[LOAD] useAuth hook called');
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      console.log('[AUTH] Starting auth check...');
      const startTime = Date.now();
      try {
        const res = await fetch("/api/auth/user", { 
          credentials: "include",
          // Добавляем таймаут для мобильных
          signal: AbortSignal.timeout(5000)
        });
        console.log('[AUTH] Response received in', Date.now() - startTime, 'ms, status:', res.status);
        if (res.status === 401) {
          console.log('[AUTH] Not authenticated (401)');
          return null; // Not authenticated - это нормально
        }
        if (!res.ok) {
          console.log('[AUTH] Response not ok:', res.status);
          return null; // Любая другая ошибка - тоже не блокируем
        }
        const data = await res.json();
        console.log('[AUTH] User data received');
        return data;
      } catch (e: any) {
        // Сетевая ошибка - не блокируем загрузку страницы
        console.warn("[AUTH] Auth check failed in", Date.now() - startTime, "ms:", e?.message || e);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Не блокируем рендеринг при ошибке
    throwOnError: false,
    // Добавляем networkMode для offline-first
    networkMode: 'offlineFirst',
  });

  const isAuthenticated = !!user && !error;

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  };
}